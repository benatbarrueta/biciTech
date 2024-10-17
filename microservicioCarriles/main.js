const express = require('express');
const app = express();
const fs = require('fs');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const port = 3000;

// Connect to MongoDB
connectDB();

// Define schema
const CarrilSchema = new mongoose.Schema({
    id: Number,
    velocidad_max: Number,
    tipo: String,
    nombre: String,
    suelo: String,
    distancia: Number
});

// Create mongoose model
const Carril = mongoose.model('Carril', CarrilSchema);

// Upload all the data into the database
app.get('/uploadData', async (req, res) => {
    try {
        // Read the data from the file
        const data = fs.readFileSync('./data/viasCiclistasEspana.json', 'utf8');
        const jsonData = JSON.parse(data);

        const tripsArray = jsonData["Cicling road details dataset"];

        // Verify that there is an array of trips
        if (!Array.isArray(tripsArray)) {
            throw new TypeError('Los datos cargados no son un arreglo');
        }

        // Delete all the data in database
        await Carril.deleteMany({});

        const carrilesToInsert = tripsArray.map(carril => ({
            id: carril["id"],
            velocidad_max: carril["velocidad_max"],
            tipo: carril["tipo"],
            nombre: carril["nombre"],
            suelo: carril["suelo"],
            distancia: carril["distancia"],
        }));

        // Insert all the data into the database
        await Carril.insertMany(carrilesToInsert);

        console.log('Data uploaded successfully');
        res.send('Data uploaded successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all the data from the database
app.get('/getData', async (req, res) => {
    try {
        const carriles = await Carril.find();
        
        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by type
app.get('/getDataType/:type', async (req, res) => {
    try {
        const carriles = await Carril.find({tipo: req.params.type});

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by surface
app.get('/getDataSurface/:surface', async (req, res) => {
    try {
        const carriles = await Carril.find({suelo: req.params.surface});

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by distance
app.get('/getDataDistance/:distance', async (req, res) => {
    try {
        const carriles = await Carril.find({distancia: {$lt: req.params.distance}});

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by maximum speed
app.get('/getDataSpeed/:speed', async (req, res) => {
    try {
        const carriles = await Carril.find({velocidad_max: {$lt: req.params.speed}});

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by name
app.get('/getDataName/:name', async (req, res) => {
    try {
        const carriles = await Carril.find({nombre: req.params.name});

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configure Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Viajes',
      version: '1.0.0',
      description: 'Cicling road api description',
    },
  },
  apis: [__filename], // Ruta al archivo actual (main.js)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Add Swagger to Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});