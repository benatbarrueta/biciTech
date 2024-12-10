import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Auth from './components/auth/Auth.js';
import GoogleCallback from './components/auth/GoogleCallback.js'; 
import Register from './components/auth/Register.js';
import Header from './components/header/Header.js';
import Home from './components/roads/Home.js';
import Roads from './components/roads/Roads.js';
import RoadDetail from './components/roads/RoadDetail.js';
import Favorites from './components/roads/Favorites.js';

function App() {
  const [isAuthenticated, setIsAuthentificated] = useState(false);

  // Función para manejar la autenticación exitosa
  const handleLogin = () => {
    setIsAuthentificated(true);
    console.log("AUTHENTIFICATED:",isAuthenticated);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
        // Llamar al backend para invalidar el token
        await fetch("http://localhost:8000/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Eliminar el token del almacenamiento local
        localStorage.removeItem("token");

        // Redirigir al usuario a la página de login
        window.location.href = "/";
    }
};

  return (
    <Router>
      <div className="App">
        {/* Usar el componente Header */}
        {isAuthenticated && <Header onLogout={handleLogout} />}

        {/* Usar el componente Routes */}
        <Routes>
          <Route path="/" element={<Auth onLogin={handleLogin} />} />
          <Route path="/auth/google/callback" element={<GoogleCallback onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
          <Route path="/roads" element={isAuthenticated ? <Roads /> : <Navigate to="/"/>} />
          <Route path="/roads/:roadID" element={isAuthenticated ? <RoadDetail /> : <Navigate to="/"/>} />
          <Route path="/favorites" element={isAuthenticated ? <Favorites /> : <Navigate to="/"/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
