const http = require('http');
const httpProxy = require('http-proxy');
const port = 4000;

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
    if (req.url.startsWith('/roads')) {
        proxy.web(req, res, { target: 'http://localhost:9000' });
        console.log('Request to roads');
    } else if (req.url.startsWith('/weather')) {
        proxy.web(req, res, { target: 'http://localhost:2000' });
        console.log('Request to weather');
    } else if (req.url.startsWith('/auth')) {
        proxy.web(req, res, { target: 'http://localhost:8000' });
        console.log('Request to auth');
    } else {
        res.statusCode = 404;
        res.end('Route not found');
    }
});

server.listen(port, () => {
    console.log(`Gateway running on port ${port}`);
});
