const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = process.cwd();
const types = {
    '.css': 'text/css; charset=utf-8',
    '.flac': 'audio/flac',
    '.html': 'text/html; charset=utf-8',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png'
};

http.createServer((request, response) => {
    let url = decodeURIComponent(request.url.split('?')[0]);
    if (url === '/') url = '/index.html';
    const file = path.resolve(root, `.${url}`);
    if (!file.startsWith(root)) {
        response.writeHead(403);
        response.end();
        return;
    }
    fs.readFile(file, (error, data) => {
        if (error) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }
        response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
        response.end(data);
    });
}).listen(5173, '127.0.0.1');
