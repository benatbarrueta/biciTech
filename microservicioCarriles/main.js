const express = require('express');
const app = express();
const fs = require('fs');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const port = 6000;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Connect to MongoDB
connectDB();

// Define schema
const CarrilSchema = new mongoose.Schema({
    id: String,
    velocidad_max: Number,
    tipo: String,
    nombre: String,
    suelo: String,
    distancia: Number,
    provincia: String,
    ciudad: String
});

// Create mongoose model
const Carril = mongoose.model('Carril', CarrilSchema);

/**
 * @swagger
 * /roads/uploadData:
 *   get:
 *     description: Uploads the data from the file viasCiclistas.json into the database
 *     responses:
 *       200:
 *         description: Data uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error uploading the data
 */
app.get('/roads/uploadData', async (req, res) => {
    try {
        // Read the data from the file
        const data = fs.readFileSync('./data/viasCiclistas.json', 'utf8');
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
            provincia: carril["provincia"],
            ciudad: carril["ciudad"]
        }));

        // Insert all the data into the database
        await Carril.insertMany(carrilesToInsert);

        console.log('Data uploaded successfully');
        res.send('Data uploaded successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /roads/getAll:
 *   get:
 *     description: Get all the data from the database
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Carril'
 *       500:
 *         description: Error retrieving the data
 */
app.get('/roads/getAll', async (req, res) => {
    try {
        const carriles = await Carril.find();

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /roads/id/{roadID}:
 *   get:
 *     description: Get the data from the database by ID
 *     parameters:
 *       - in: path
 *         name: roadID
 *         schema:
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carril'
 *       404:
 *         description: Carril not found
 *       500:
 *         description: Error retrieving the data
 */
app.get('/roads/id/:roadID', async (req, res) => {
    try {
        console.log(req.params);
        const carril = await Carril.findOne({ id: req.params.roadID });


        if (!carril) {
            console.log("No element found");
            return res.status(404).json({ error: "Carril no encontrado" });
        }

        res.json(carril);
        console.log('Element retrieved successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by type
app.get('/roads/type/:type', async (req, res) => {
    try {
        const carriles = await Carril.find({ tipo: req.params.type });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by surface
app.get('/roads/surface/:surface', async (req, res) => {
    try {
        const carriles = await Carril.find({ suelo: req.params.surface });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by distance
app.get('/roads/distance/:distance', async (req, res) => {
    try {
        const carriles = await Carril.find({ distancia: { $lt: req.params.distance } });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by maximum speed
app.get('/roads/speed/:speed', async (req, res) => {
    try {
        const carriles = await Carril.find({ velocidad_max: { $lt: req.params.speed } });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by name
app.get('/roads/name/:name', async (req, res) => {
    try {
        const carriles = await Carril.find({ nombre: req.params.name });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by province
app.get('/roads/province/:province', async (req, res) => {
    try {
        const carriles = await Carril.find({ provincia: req.params.province });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get the data from the database by city
app.get('/roads/city/:city', async (req, res) => {
    try {
        const carriles = await Carril.find({ ciudad: req.params.city });

        console.log(carriles.length + ' elements retrieved successfully');
        res.json(carriles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Roads API',
            version: '1.0.0',
            description: 'Roads API documentation',
        },
    },
    apis: [__filename], // Path to the current file (main.js)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Add Swagger to Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});