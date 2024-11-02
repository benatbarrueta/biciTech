import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/RoadDetail.css';
//import { useToken } from '../auth/tokenContext.js';

const RoadDetail = () => {
    const { RoadID } = useParams();
    const [roadDetails, setRoadDetails] = useState(null);
    //const [isFavorite, setIsFavorite] = useState(false);
    //const { token } = useToken(); // Get the token from the context

    useEffect(() => {
        axios.get(`/api/roads/id/${RoadID}`, {
            /*headers: {
                Authorization: `Bearer ${token}`, // Add the token as a header
            },*/
        })
            .then(response => {
                setRoadDetails(response.data);

            })
    },[RoadID]);

    return (
        <div className="centered-content">
            <h2>DETALLES DEL CARRIL {RoadID}</h2>
            {roadDetails ? (
                <div className="road-details">
                    <p><strong>Nombre:</strong> {roadDetails.nombre}</p>
                    <p><strong>Superficie:</strong> {roadDetails.suelo}</p>
                    <p><strong>Tipo:</strong> {roadDetails.tipo}</p>
                    <p><strong>Distancia:</strong> {roadDetails.distancia}</p>
                    <p><strong>Velocidad máxima:</strong> {roadDetails.velocidad_max}</p>
                    <p><strong>Ciudad:</strong> {roadDetails.ciudad}</p>
                    <p><strong>Provincia:</strong> {roadDetails.provincia}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}

export default RoadDetail;