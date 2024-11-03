import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/RoadDetail.css';
import { useParams } from 'react-router-dom';

const RoadDetail = () => {
    const { roadID } = useParams();
    const [road, setRoad] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    })/*
                    .catch(error => {
                        setError('Error al obtener los detalles del tiempo');
                        console.error('Error al obtener los detalles del carril:', error);
                        setLoading(false);
                    });*/
            })
            .catch(error => {
                setError('Error al obtener los detalles del carril');
                console.error('Error al obtener los detalles del carril:', error);
                setLoading(false);
            });
    }, [roadID]); // Ejecutar solo cuando `roadID` cambie

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
        </div>
    );
};

export default RoadDetail;
