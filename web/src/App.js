import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Auth from './components/auth/Auth.js';
import Register from './components/auth/Register.js';
import Header from './components/header/Header.js';
import Home from './components/roads/Home.js';
import Roads from './components/roads/Roads.js';
import RoadDetail from './components/roads/RoadDetail.js';

function App() {
  const [isAuthenticated, setIsAuthentificated] = useState(false);

  // Función para manejar la autenticación exitosa
  const handleLogin = () => {
    setIsAuthentificated(true);
   
    console.log("AUTHENTIFICATED:",isAuthenticated);
  };
  return (
    <Router>
      <div className="App">
        {/* Usar el componente Header */}
        {isAuthenticated && <Header />}

        {/* Usar el componente Routes */}
        <Routes>
          <Route path="/" element={<Auth onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
          <Route path="/roads" element={<Roads />} />
          <Route path="/roads/:roadID" element={<RoadDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
