import React from "react";
import "../../styles/RoadCard.css";
import { Link } from "react-router-dom";

const RoadCard = ({ road, id }) => {
    return (
        <div className="road-card">
            <h3>{road.name}</h3>
            <p><strong>Tipo:</strong> {road.type}</p>
            <p><strong>Distancia:</strong> {road.distance}</p>
            <p><strong>Superficie:</strong> {road.surface}</p>
            <p><strong>Provincia:</strong> {road.province}</p>
            <p><strong>Ciudad:</strong> {road.city}</p>
            <p><strong>Velocidad máxima:</strong> {road.velocidadMax}</p>
            <Link to={`/roads/${road.roadID}`} className="details-button">
                Ver detalles
            </Link>
        </div>
    );
};

export default RoadCard;