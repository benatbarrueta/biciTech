
-- Comprobar si existe la base de datos y eliminarla si es necesario
DROP DATABASE IF EXISTS bicitech;

-- Crear la base de datos bicitech
CREATE DATABASE bicitech;

-- Usar la base de datos bicitech
USE bicitech;

-- Comprobar si existe la tabla user y eliminarla si es necesario
DROP TABLE IF EXISTS user;

-- Crear la tabla user
CREATE TABLE user (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    username VARCHAR(45) NOT NULL,
    password VARCHAR(45) NOT NULL
);

-- Comprobar si existe la tabla favoriteRoads y eliminarla si es necesario
DROP TABLE IF EXISTS favoriteRoads;

-- Crear la tabla favoriteRoads
CREATE TABLE favoriteRoads (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL,
    roadID VARCHAR(45) NOT NULL
);
