require('dotenv').config();  // Cargar variables de entorno
const express = require('express');
const app = express();
const port = 2000;
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     description: Get the weather of a city
 *       parameters:
 *         - name: city
 *         in: path
 *         description: City name
 *         required: true
 *         schema:
 *           type: string
 *         responses:
 *           200:
 *             description: Weather obtained successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                       temperature:
 *                         type: number
 *                       description:
 *                         type: string
 *                       humidity:
 *                         type: number
 *                       wind:
 *                         type: number
 *           404:
 *             description: City not found
 *           500:
 *             description: Error obtaining the weather
 */
app.get('/weather/:city', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const city = req.params.city;  // You can change the city as desired
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;  // 'units=metric' for Celsius

        const response = await axios.get(url);
        const data = response.data;

        res.json({
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });
        console.log('Weather of city ' + data.name + ' obtained successfully');
    } catch (error) {
        console.error('Error obtaining weather:', error.message);
    }
});

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Weather API',
            version: '1.0.0',
            description: 'Weather API documentation',
        },
    },
    apis: [__filename], // Path to the current file (main.js)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Add Swagger to Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});