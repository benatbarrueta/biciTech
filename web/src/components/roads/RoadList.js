import React, { useState, useEffect } from "react";
import axios from 'axios';
import RoadCard from "./RoadCard";

const RoadList = () => {
    const [roads, setRoads] = useState([]);
    
    useEffect(() => {
        axios.get('/api/roads/getAll')
        .then(response => {
            const roadsData = response.data.map((road) => ({
            roadID: road.id, 
            name: road.nombre,
            type: road.tipo,
            distance: road.distancia,
            surface: road.suelo,
            province: road.provincia,
            city: road.ciudad,
            velocidadMax: road.velocidad_max
            }));
            setRoads(roadsData);
        })
        .catch(error => {
            console.error('Error al obtener los carriles:', error);
        });
    }, []);
    
    return (
        <div>
        {roads.map((road) => (
            <RoadCard key={road.id} id={road.id}  />
        ))}
        </div>
    );
};

export default RoadList;