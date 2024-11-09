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
    
    const [showAll, setShowAll] = useState(false);

    const handleShowAll = () => {
        setShowAll(true);
    };

    return (
        <div>
            {roads.slice(0, showAll ? roads.length : 12).map((road) => (
                <RoadCard key={road.roadID} road={road} id={road.roadID} token={localStorage.getItem('token')} />
            ))}
            {!showAll && roads.length > 20 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        onClick={handleShowAll} 
                        style={{ fontSize: '1.2em', cursor: 'pointer', backgroundColor:'#5fa64b' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'lightseagreen'}
                        onMouseOut={(e) => e.target.style.backgroundColor = ''}
                    >
                        Ver más
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoadList;