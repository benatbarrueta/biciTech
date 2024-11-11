const http = require('http');
const httpProxy = require('http-proxy');
const port = 4000

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
    // Reescribe la URL quitando /api


    if (req.url.startsWith('/roads')) {

        console.log('Redirecting request to /roads to port 9000');
        console.log('Request URL:', req.url);
        proxy.web(req, res, { target: 'http://localhost:9000' });

    } else if (req.url.startsWith('/weather')) {
        // Redirige las solicitudes que comienzan con /travel al microservicio de viajes (puerto 2000)
        console.log('Redirecting request to /weather to port 2000');
        proxy.web(req, res, { target: 'http://localhost:2000' });
    } else if (req.url.startsWith('/auth')) {
        // Redirige las solicitudes que comienzan con /travel al microservicio de viajes (puerto 2000)
        console.log('Redirigiendo solicitud a /auth al puerto 8000');
        proxy.web(req, res, { target: 'http://localhost:8000'});
    } else {
        // Aquí puedes manejar otras rutas o simplemente registrar las rutas no manejadas
        console.log('Ruta no manejada:', req.url);
        res.statusCode = 404;
        res.end('Ruta no encontrada');
    }
});

server.listen(port, () => {
    console.log('Gateway running on port ' + port);
});
