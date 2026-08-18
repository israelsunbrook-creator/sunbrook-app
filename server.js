const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);

  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, app: 'sunbrook' }));
  }

  let archivo = path.join(__dirname, url === '/' ? 'index.html' : url.replace(/^\/+/, ''));
  if (!archivo.startsWith(__dirname)) archivo = path.join(__dirname, 'index.html');

  fs.readFile(archivo, (err, data) => {
    if (err) {
      return fs.readFile(path.join(__dirname, 'index.html'), (e2, home) => {
        res.writeHead(e2 ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(e2 ? 'No encontrado' : home);
      });
    }
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('Sunbrook escuchando en el puerto ' + PORT));
