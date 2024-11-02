import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/RoadDetail.css';
//import { useToken } from '../auth/tokenContext.js';

const RoadDetail = () => {
    const { RoadID } = useParams();
    //const [roadDetails, setRoadDetails] = useState(null);
    //const [isFavorite, setIsFavorite] = useState(false);
    //const { token } = useToken(); // Get the token from the context

    useEffect(() => {
        axios.get(`/api/roads/${RoadID}`, {
            /*headers: {
                Authorization: `Bearer ${token}`, // Add the token as a header
            },*/
        })
            .then(response => {
                //setRoadDetails(response.data);
                console.log(response.data);
            })
    },[RoadID]);

    return (
        <div className="centered-content">
            <h2>DETALLES DEL CARRIL</h2>
        </div>
    );
}

export default RoadDetail;