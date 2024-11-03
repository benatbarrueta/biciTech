// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';
const Header = () => {
  return (
    <header className="header">
      <h1>Bici Tech</h1>
      <div className="menu-container">
        <nav className="menu">
          <Link to="/favorites">Favoritos</Link>
          <Link to="/roads">Carriles</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
