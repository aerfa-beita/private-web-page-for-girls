#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = 'assets/Photograph/IMG_20260228';
const DEFAULT_PROJECT = 'new-univese';
const DEFAULT_BUCKET = 'new-univese.firebasestorage.app';
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function readArguments(argv) {
    const options = {
        source: DEFAULT_SOURCE,
        project: DEFAULT_PROJECT,
        bucket: DEFAULT_BUCKET,
        dryRun: true,
        execute: false,
        serviceAccount: '',
        limit: Infinity
    };

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--execute') {
            options.execute = true;
            options.dryRun = false;
        } else if (argument === '--dry-run') {
            options.dryRun = true;
            options.execute = false;
        } else if (argument === '--source' || argument === '--project' || argument === '--bucket' || argument === '--service-account' || argument === '--limit') {
            const value = argv[index + 1];
            if (!value || value.startsWith('--')) throw new Error('Missing value for ' + argument);
            index += 1;
            if (argument === '--source') options.source = value;
            if (argument === '--project') options.project = value;
            if (argument === '--bucket') options.bucket = value;
            if (argument === '--service-account') options.serviceAccount = value;
            if (argument === '--limit') {
                options.limit = Number(value);
                if (!Number.isInteger(options.limit) || options.limit < 1) throw new Error('--limit must be a positive integer');
            }
        } else if (argument === '--help' || argument === '-h') {
            printUsage();
            process.exit(0);
        } else {
            throw new Error('Unknown argument: ' + argument);
        }
    }

    return options;
}

function printUsage() {
    console.log([
        'Usage:',
        '  node scripts/media/migrate-archive-to-firebase.js --dry-run',
        '  node scripts/media/migrate-archive-to-firebase.js --execute --service-account C:\\private\\service-account.json',
        '',
        'Options:',
        '  --source <path>            Source folder (default: ' + DEFAULT_SOURCE + ')',
        '  --project <id>              Firebase project (default: ' + DEFAULT_PROJECT + ')',
        '  --bucket <name>             Storage bucket (default: ' + DEFAULT_BUCKET + ')',
        '  --service-account <path>    Service-account JSON, required with --execute',
        '  --limit <count>             Process only the first count files',
        '  --dry-run                   List files only; no network writes (default)',
        '  --execute                   Upload objects and write archivePhotos documents'
    ].join('\n'));
}

function mimeTypeFor(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    if (extension === '.png') return 'image/png';
    if (extension === '.webp') return 'image/webp';
    return 'image/jpeg';
}

function listArchiveFiles(sourceFolder) {
    if (!fs.existsSync(sourceFolder)) throw new Error('Source folder does not exist: ' + sourceFolder);
    return fs.readdirSync(sourceFolder, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .filter((entry) => ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
        .filter((entry) => !/_tmp\.[^.]+$/i.test(entry.name))
        .map((entry) => ({
            name: entry.name,
            absolutePath: path.join(sourceFolder, entry.name),
            size: fs.statSync(path.join(sourceFolder, entry.name)).size
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
}

function base64Url(value) {
    return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function requestJson(url, options) {
    return fetch(url, options).then(async (response) => {
        const text = await response.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (error) {
            data = { raw: text };
        }
        if (!response.ok) {
            const message = data && data.error && data.error.message ? data.error.message : text;
            throw new Error(response.status + ' ' + response.statusText + ': ' + message);
        }
        return data;
    });
}

async function createAccessToken(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64Url(JSON.stringify({
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    }));
    const unsignedToken = header + '.' + payload;
    const signature = crypto.createSign('RSA-SHA256').update(unsignedToken).sign(serviceAccount.private_key, 'base64url');
    const response = await requestJson('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: unsignedToken + '.' + signature
        })
    });
    if (!response || typeof response.access_token !== 'string') throw new Error('OAuth response did not include an access token');
    return response.access_token;
}

function createDownloadToken(serviceAccount, storagePath) {
    const hash = crypto.createHmac('sha256', serviceAccount.private_key).update(storagePath).digest('hex');
    return hash.slice(0, 8) + '-' + hash.slice(8, 12) + '-4' + hash.slice(13, 16) + '-a' + hash.slice(17, 20) + '-' + hash.slice(20, 32);
}

function createDocumentId(fileName) {
    const stem = path.basename(fileName, path.extname(fileName)).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80) || 'photo';
    const suffix = crypto.createHash('sha256').update(fileName).digest('hex').slice(0, 10);
    return stem + '-' + suffix;
}

function createDownloadUrl(bucket, storagePath, downloadToken) {
    return 'https://firebasestorage.googleapis.com/v0/b/' + encodeURIComponent(bucket) + '/o/' + encodeURIComponent(storagePath) + '?alt=media&token=' + encodeURIComponent(downloadToken);
}

async function uploadObject(accessToken, bucket, storagePath, file, contentType, downloadToken) {
    const boundary = 'archive-' + crypto.randomUUID();
    const metadata = {
        name: storagePath,
        contentType,
        cacheControl: IMMUTABLE_CACHE_CONTROL,
        metadata: { firebaseStorageDownloadTokens: downloadToken }
    };
    const body = Buffer.concat([
        Buffer.from('--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + '\r\n--' + boundary + '\r\nContent-Type: ' + contentType + '\r\n\r\n'),
        fs.readFileSync(file.absolutePath),
        Buffer.from('\r\n--' + boundary + '--\r\n')
    ]);
    return requestJson('https://storage.googleapis.com/upload/storage/v1/b/' + encodeURIComponent(bucket) + '/o?uploadType=multipart', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'multipart/related; boundary=' + boundary
        },
        body
    });
}

function firestoreFields(file, storagePath, imageUrl, sortOrder) {
    return {
        fields: {
            fileName: { stringValue: file.name },
            imageUrl: { stringValue: imageUrl },
            source: { stringValue: 'owner-archive' },
            sortOrder: { integerValue: String(sortOrder) },
            storagePath: { stringValue: storagePath }
        }
    };
}

async function writeArchiveDocument(accessToken, project, documentId, fields) {
    const url = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(project) + '/databases/(default)/documents/archivePhotos/' + encodeURIComponent(documentId);
    return requestJson(url, {
        method: 'PATCH',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    });
}

function formatMegabytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function run() {
    const options = readArguments(process.argv.slice(2));
    const sourceFolder = path.resolve(process.cwd(), options.source);
    const files = listArchiveFiles(sourceFolder).slice(0, options.limit);
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

    console.log('Mode: ' + (options.execute ? 'EXECUTE' : 'DRY RUN'));
    console.log('Source: ' + sourceFolder);
    console.log('Files: ' + files.length + ' (' + formatMegabytes(totalBytes) + ')');
    files.forEach((file, index) => console.log(String(index + 1).padStart(3, ' ') + '. ' + file.name + ' (' + formatMegabytes(file.size) + ')'));

    if (!options.execute) return;
    if (!options.serviceAccount) throw new Error('--service-account is required with --execute');
    const serviceAccountPath = path.resolve(process.cwd(), options.serviceAccount);
    if (!fs.existsSync(serviceAccountPath)) throw new Error('Service-account JSON does not exist: ' + serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (!serviceAccount.client_email || !serviceAccount.private_key || !serviceAccount.project_id) throw new Error('Service-account JSON is missing required credentials');
    if (serviceAccount.project_id !== options.project) throw new Error('Service-account project does not match --project');

    const accessToken = await createAccessToken(serviceAccount);
    for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const storagePath = 'archive/' + file.name;
        const downloadToken = createDownloadToken(serviceAccount, storagePath);
        const imageUrl = createDownloadUrl(options.bucket, storagePath, downloadToken);
        process.stdout.write('Migrating ' + (index + 1) + '/' + files.length + ': ' + file.name + '... ');
        await uploadObject(accessToken, options.bucket, storagePath, file, mimeTypeFor(file.name), downloadToken);
        await writeArchiveDocument(accessToken, options.project, createDocumentId(file.name), firestoreFields(file, storagePath, imageUrl, index));
        console.log('done');
    }

    console.log('Migration complete. Verify archivePhotos in Firestore before removing the old Vercel archive files.');
}

run().catch((error) => {
    console.error('Migration failed: ' + error.message);
    process.exitCode = 1;
});
