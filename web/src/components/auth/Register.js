import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const register = async () => {
        try {
            const userData = {
                name: name,
                username: username,
                password: password,
            };
            console.log('Datos de registro enviados:', username, password);
            const response = await axios.post('/api/auth/register', userData);

            if (response.status === 200) {
                onRegister();
                navigate('/');
            }
        } catch (error) {
            console.error('Error de registro:', error);
        }
    }

    return (
        <div className="auth-container">
            <img src={require('../../styles/logo.png')} alt="Bici Tech" />
            <h1 className="auth-title"> </h1>
            <div className="auth-input-container">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="auth-button-container">
                <button className="auth-button" onClick={register}>Registrarse</button>
                <br/>
                <br/>
                <a href="/" className="auth-button">Ya tienes una cuenta?</a>
            </div>
        </div>
    );
}

export default Register;