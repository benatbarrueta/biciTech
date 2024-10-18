# BICITECH 🚴🏼‍♀️
Bicitech es un proyecto que reune la red de carriles bici de España para mostrarselo a sus usuarios. El usuario podrá iniciar sesión y guardarse distintos carriles. Dentro de cada carril bici se muestra el tiempo que hace en el lugar en el momento instantaneo.

## MICROSERVICIOS ⚙️

### 1. MICROSERVICIO CARRILES BICI 🛣️
Este microservicio está desarollado con Node.js y utiliza una base de datos mongoDB. Es el encargado de gestionar todas las acciones que se realizan con los carriles bici.

#### INSTALACIÓN ⚙️
Para poder ejecutarlo se deberá descargar o clonar el repositorio y tener instalado mongo y node.

Hay que descargar las siguientes dependencias: 

**config, express, fs, mongodb, mongoose, nodemon, swagger-jsdoc y swagger-ui-express** 

Para ello ejecutaremos el siguiente comando

    npm install config express fs mongodb mongoose nodemon swagger-jsdoc swagger-ui-express 

#### EJECUCIÓN ▶️
Para ejecutar el proyecto bastará con ejecutar el siguiente comando:
    
    npm start

### 2. MICROSERVICIO METEOROLOGÍA 🌤️
Este microservicio esta desarrollado en node.js y sirve para poder obtener los datos del tiempo que hace en cada carril bici. Para ello se comunica con la API de https://openweathermap.org/current.

#### INSTALACIÓN ⚙️
Para poder ejecutarlo se deberá descargar o clonar el repositorio y tener instalado node.

Hay que descargar las siguientes dependencias:

**axios, config, dotenv, express, mongo, mongoose, nodemon y openweather**

Para ello ejecutaremos el siguiente comando

    npm install axios config dotenv express mongo mongoose nodemon openweather 

#### EJECUCIÓN ▶️
Para ejecutar el proyecto bastará con ejecutar el siguiente comando:
    
    npm start

### 3. MICROSERVICIO AUTENTIFICACIÓN 🪪

#### INSTALACION ⚙️

#### EJECUCIÓN ▶️

## FRONTEND 🖥️ 