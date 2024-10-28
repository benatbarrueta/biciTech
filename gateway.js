const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
    // Reescribe la URL quitando /api


    if (req.url.startsWith('/roads')) {

        console.log('Redirecting request to /roads to port 3000');
        proxy.web(req, res, { target: 'http://localhost:3000' });

    } else if (req.url.startsWith('/weather')) {
        // Redirige las solicitudes que comienzan con /travel al microservicio de viajes (puerto 2000)
        console.log('Redirecting request to /weather to port 2000');
        proxy.web(req, res, { target: 'http://localhost:2000' });
    } else if (req.url.startsWith('/auth')) {
        // Redirige las solicitudes que comienzan con /travel al microservicio de viajes (puerto 2000)
        console.log('Redirigiendo solicitud a /auth al puerto 4000');
        proxy.web(req, res, { target: 'http://localhost:4000'});
    } else {
        // Aquí puedes manejar otras rutas o simplemente registrar las rutas no manejadas
        console.log('Ruta no manejada:', req.url);
        res.statusCode = 404;
        res.end('Ruta no encontrada');
    }
});

server.listen(5000, () => {
    console.log('Gateway running on port 5000');
});
