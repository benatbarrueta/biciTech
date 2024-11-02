import React from "react";
import { Link } from "react-router-dom";
import "../../styles/RoadCard.css";

const RoadCard = ({ road, id }) => (
    <Link to={`/roads/${id}`}>
        <div className="road-card">
        <h3>{road}</h3>
        </div>
    </Link>
);

export default RoadCard;