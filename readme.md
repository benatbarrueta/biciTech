# BICITECH 🚴🏼‍♀️
Bicitech is a project that brings together the network of bike lanes in Spain to show it to its users. The user can log in and save different lanes. Within each bike lane, the current weather at the location is displayed.

## MICROSERVICES ⚙️

### 1. BIKE LANES MICROSERVICE 🛣️
This microservice is developed with Node.js and uses a MongoDB database. It is responsible for managing all actions performed with the bike lanes.

#### INSTALLATION ⚙️
To run it, you need to download or clone the repository and have MongoDB and Node.js installed.

You need to download the following dependencies:

**config, express, fs, mongodb, mongoose, nodemon, swagger-jsdoc, and swagger-ui-express**

To do this, run the following command:

    npm install config express fs mongodb mongoose nodemon swagger-jsdoc swagger-ui-express

#### EXECUTION ▶️
To run the project, simply execute the following command:

    npm start

### 2. WEATHER MICROSERVICE 🌤️
This microservice is developed in Node.js and is used to obtain the weather data for each bike lane. It communicates with the app with the OpenWeather API.

#### INSTALLATION ⚙️
To run it, you need to download or clone the repository and have Node.js installed.

You need to download the following dependencies:

**axios, config, dotenv, express, mongo, mongoose, nodemon, and openweather**

To do this, run the following command:

    npm install axios config dotenv express mongo mongoose nodemon openweather 

#### EXECUTION ▶️
To run the project, simply execute the following command:
    
    npm start

### 3. AUTHENTICATION MICROSERVICE 🪪
This microservice is developed in Flask(Python) and is used to log in, register, get the data related with the user. All the dat ais saved in a mysql database.

#### INSTALLATION ⚙️
To run it, you need to download or clone the repository and have Python installed.

You need to download the following dependecies:

**fastapi, pydantic, uvicorn, mysql-connector-python, SQLAlchemy, pymysq, PyJWT, cryptography, python-dotenv, python-multipart**

To do this run the following command:

    pip install -r requirements.txt

#### EXECUTION ▶️
To run the project, simply execute the following command:
    
    uvicorn main:app --reload

## GATEWAY

The gateway is the part of the app that redirects calls received from the frontend to the backend.

#### INSTALLATION ⚙️

To run it, you need to download or clone the repository and have Node.js installed.

You need to download the following dependencies:

**axios, config, dotenv, express, mongo, mongoose, nodemon, and openweather**

To do this, run the following command:

    npm install http-proxy

#### EXECUTION ▶

To run the project, simply execute the following command:
    
    node gateway.js

## FRONTEND 🖥️ 
The frontend of this project is a web application developed using React, a widely recognized JavaScript library for building interactive user interfaces and reusable components.

#### EXECUTION ▶
To run the project, simply execute the following command:

    npm start