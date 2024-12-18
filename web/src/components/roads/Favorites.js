import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Favorites.css";
import { Link } from "react-router-dom";

const Favorites = () => {
    const [favoriteRoads, setFavoriteRoads] = useState([]);

    useEffect(() => {
        console.log('Getting favorite roads');
        axios.get('/api/auth/favorite-roads/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                console.log('Favorite roads:', response.data);
                const roadPromises = [];

                for (const favorite of response.data) {
                    const promise = axios.get(`/api/roads/id/${favorite[0]}`)
                        .then(res => res.data);
                        console.log('Road id:', favorite);
                    roadPromises.push(promise);
                }
                console.log('Road promises:', response);
                Promise.all(roadPromises)
                    .then(roads => {
                        setFavoriteRoads(roads);
                    })
                    .catch(error => {
                        console.error('Error getting favorite road:', error);
                    });
            })
            .catch(error => {
                console.error('Error getting favorite road:', error);
            });
    }, []);

    return (
        <div className="favorites">
            <div className="favorites-header">
                <h1>Carriles favoritos</h1>
            </div>

            <div className="favorites-elements">
                {favoriteRoads.length === 0 ? (
                    <p>No hay viajes favoritos.</p>
                ) : (
                    favoriteRoads.map((road) => (
                        <div className="road-card">
                            <h3>{road.nombre}</h3>
                            <p><strong>Tipo:</strong> {road.tipo}</p>
                            <p><strong>Distancia:</strong> {road.distancia} km</p>
                            <p><strong>Superficie:</strong> {road.suelo}</p>
                            <p><strong>Provincia:</strong> {road.provincia}</p>
                            <p><strong>Ciudad:</strong> {road.ciudad}</p>
                            <p><strong>Velocidad máxima:</strong> {road.velocidad_max} km/h</p>
                            <Link to={`/roads/${road.id}`} className="details-button">
                                Ver detalles
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Favorites;
