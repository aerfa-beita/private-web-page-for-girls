const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = process.cwd();
const port = Number.parseInt(process.argv[2] || process.env.PORT || '5173', 10);
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

const server = http.createServer((request, response) => {
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
        response.writeHead(200, {
            'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        response.end(data);
    });
});

server.on('error', (error) => {
    console.error(`[local] ${error.message}`);
    process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
    console.log(`[local] http://127.0.0.1:${port}`);
});
