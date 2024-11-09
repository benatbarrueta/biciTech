import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "../../styles/RoadCard.css";
import { Link } from "react-router-dom";

const RoadCard = ({ road, id, token }) => { // Recibe el token como prop
    const [isFavorite, setIsFavorite] = useState(false);

    // Llama a la API para verificar si la carretera es favorita al montar el componente
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8000/auth/favorite-roads/check',
                    { roadID: String(road.roadID) },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}` // Incluye el token en el encabezado
                        }
                    }
                );
                setIsFavorite(response.data.isFavorite);
            } catch (error) {
                console.error('Error al comprobar el estado de favorito:', error);
            }
        };

        fetchFavoriteStatus();
    }, [id, token]);

    // Función para alternar el estado de favorito
    const toggleFavorite = async () => {
        try {
            setIsFavorite(!isFavorite);
            if (isFavorite) {
                try {
                    console.log(road.roadID);
                    const response = await axios.delete(
                        `http://localhost:8000/auth/favorite-roads/delete`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }, data: { road: road.roadID }
                        }
                    );
            
                    console.log(response.data.message);
                } catch (error) {
                    console.error('Error al eliminar la carretera de favoritos:', error);
                }
            } else {
                try {
                    const response = await axios.post(
                        'http://localhost:8000/auth/favorite-roads/add',
                        { road: road.roadID },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
            
                    console.log(response.data.message);
                } catch (error) {
                    console.error('Error al agregar la carretera a favoritos:', error);
                }
            }
        } catch (error) {
            console.error('Error al alternar el estado de favorito:', error);
        }
    };

    return (
        <div className="road-card">
            <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={toggleFavorite}>
                {isFavorite ? (
                    <FaHeart color="red" size={24} /> // Corazón lleno en rojo
                ) : (
                    <FaRegHeart color="red" size={24} /> // Corazón contorno en rojo
                )}
            </div>
            <h3>{road.name}</h3>
            <p><strong>Tipo:</strong> {road.type}</p>
            <p><strong>Distancia:</strong> {road.distance}</p>
            <p><strong>Superficie:</strong> {road.surface}</p>
            <p><strong>Provincia:</strong> {road.province}</p>
            <p><strong>Ciudad:</strong> {road.city}</p>
            <p><strong>Velocidad máxima:</strong> {road.velocidadMax} km/h</p>
            <Link to={`/roads/${road.roadID}`} className="details-button">
                Ver detalles
            </Link>
        </div>
    );
};

export default RoadCard;
