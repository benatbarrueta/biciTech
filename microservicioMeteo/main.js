require('dotenv').config();  // Cargar variables de entorno
const express = require('express');
const app = express();
const port = 2000;
const axios = require('axios');

// Get the weather of a city
app.get('/weather/city/:city', async (req, res) => {
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
            humidity: data.main.humidity
        });
        console.log('Weather obtained successfully');
    } catch (error) {
        console.error('Error obtaining weather:', error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});