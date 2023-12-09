"use client";
import React from "react";

const Card = ({ title, description }) => {
    return (
      <div className="card">
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-description">{description}</p>
          <a href={`buckets/${title}`}><button type="button" className="btn btn-secondary">Expand</button></a>
        </div>
      </div>
    );
  };

export default Card;
