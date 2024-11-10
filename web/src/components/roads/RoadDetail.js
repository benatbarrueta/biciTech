import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from "axios";
import '../../styles/RoadDetail.css';
import { useParams } from 'react-router-dom';

const RoadDetail = () => {
    const { roadID } = useParams();
    const [road, setRoad] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Activar el estado de carga
        setLoading(true);

        // Solicitud a la API
        axios.get(`/api/roads/id/${roadID}`)
            .then(response => {
                console.log(response.data);
                setRoad(response.data);
                setLoading(false);

                axios.get(`/api/weather/${response.data.ciudad}`)
                    .then(weatherResponse => {
                        console.log(weatherResponse.data);
                        setWeather(weatherResponse.data);
                        setLoading(false);
                    })
                    .catch(error => {
                        setError('Error getting road details');
                        console.error('Error getting road details:', error);
                        setLoading(false);
                    });

                axios.post('http://localhost:8000/auth/favorite-roads/check', {
                    roadID: String(roadID)
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Incluye el token en el encabezado
                    }
                })
                    .then(favorite => {
                        setIsFavorite(favorite.data.isFavorite);
                    })
                    .catch(error => {
                        setError('Error getting favorite state');
                        console.error('Error checking favorite state:', error);
                    });
            })
            .catch(error => {
                setError('Error getting road details');
                console.error('Error getting road details:', error);
                setLoading(false);
            });
    }, [roadID]); // Ejecutar solo cuando `roadID` cambie

    // Función para alternar el estado de favorito
    const toggleFavorite = async () => {
        try {
            setIsFavorite(!isFavorite);
            if (isFavorite) {
                try {
                    console.log(road.id);
                    const response = await axios.delete(
                        `http://localhost:8000/auth/favorite-roads/delete`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }, data: { road: road.id }
                        }
                    );

                    console.log(response.data.message);
                } catch (error) {
                    console.error('Error deletting favorite road:', error);
                }
            } else {
                try {
                    const response = await axios.post(
                        'http://localhost:8000/auth/favorite-roads/add',
                        { road: road.id },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );

                    console.log(response.data.message);
                } catch (error) {
                    console.error('Error adding favorite road:', error);
                }
            }
        } catch (error) {
            console.error('Error changing favorite state:', error);
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="road-detail">
            <div className="container-head">
                {road && (
                    <div class="container-img">
                        {(() => {
                            if (road.suelo === 'grava') {
                                return <img src={require('../../styles/images/viaGrava.jpg')} alt="Carril de grava" />;
                            } else if (road.suelo === 'tierra') {
                                return <img src={require('../../styles/images/viaTierra.jpg')} alt="Carril de tierra" />;
                            } else if (road.suelo === 'mixto') {
                                return <img src={require('../../styles/images/viaMixta.jpg')} alt="Carril mixto" />;
                            } else if (road.suelo === 'asfalto') {
                                return <img src={require('../../styles/images/viaAsfalto.jpg')} alt="Carril de asfalto" />;
                            } else if (road.suelo === 'hormigón') {
                                return <img src={require('../../styles/images/viaHormigon.jpg')} alt="Carril de hormigón" />;
                            } else {
                                return <p>Tipo de carril desconocido.</p>;
                            }
                        })()}
                    </div>
                )}
            </div>
            <div className="container-head">
                <h2>Detalles del carril</h2>
                {road ? (
                    <div class='container'>
                        <h3>{road.name}</h3>
                        <p><strong>Tipo:</strong> {road.tipo}</p>
                        <p><strong>Distancia:</strong> {road.distancia} km</p>
                        <p><strong>Superficie:</strong> {road.suelo}</p>
                        <p><strong>Provincia:</strong> {road.provincia}</p>
                        <p><strong>Ciudad:</strong> {road.ciudad}</p>
                        <p><strong>Velocidad máxima:</strong> {road.velocidad_max} km/h</p>
                    </div>

                ) : (
                    <p>No se encontraron detalles del carril.</p>
                )}
            </div>

            <div className="container-head">
                <div class='container-right'>
                    <h2>Detalles del tiempo</h2>
                    {weather ? (
                        <div class='container'>
                            <p><strong>Temperatura:</strong> {weather.temperature}°C</p>
                            <p><strong>Descripción:</strong> {weather.description}</p>
                            <p><strong>Humedad:</strong> {weather.humidity}%</p>
                            <p><strong>Viento:</strong> {weather.wind} m/s</p>
                        </div>
                    ) : (
                        <p>No se encontraron detalles del tiempo.</p>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={toggleFavorite}>
                {isFavorite ? (
                    <FaHeart color="red" size={24} /> // Corazón lleno en rojo
                ) : (
                    <FaRegHeart color="red" size={24} /> // Corazón contorno en rojo
                )}
            </div>
        </div>
    );
};

export default RoadDetail;
