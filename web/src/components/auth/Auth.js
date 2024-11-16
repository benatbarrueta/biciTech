import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { useToken } from './tokenContext';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuthToken } = useToken();

    const login = async () => {
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            console.log('Datos de autenticación enviados:', username, password);
            const response = await axios.post('/api/auth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log('response.status:', response.status);
            console.log('TOKEN:', response.data.access_token);
            if (response.status === 200) {
                setAuthToken(response.data.access_token);
                localStorage.setItem('token', response.data.access_token);
                onLogin();
                navigate('/home');
                console.log('INICIO DE SESIÓN EXITOSO', response.data);
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
        }
    };

    const register = async () => {
        navigate('/register');
    }

    const loginWithGoogle = async () => {
        try {
            // Realiza una solicitud al backend para obtener la URL de autorización de Google
            const response = await axios.get('/api/auth/google');
            console.log(response.data)
            if (response.status === 200 && response.data.authorization_url) {
                // Redirige al usuario a la URL de autorización de Google
                window.location.href = response.data.authorization_url;
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
        }
    };

    return (
        <div className="auth-container">
            <img src={require('../../styles/images/logo.png')} alt="Bici Tech" />
            <h1 className="auth-title">Bici Tech</h1>
            <div className="auth-input-container">
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
                <button className="auth-button" onClick={login}>Iniciar Sesión</button>
                <button className="auth-button" onClick={register}>Registrarse</button>
            </div>
            <button className="google-button" onClick={loginWithGoogle}>
            <img
                    className="google-icon"
                    src={require('../../styles/images/google.png')}
                    alt="Google"
                />
                Iniciar Sesión con Google
            </button>
        </div>
    );
}

export default Auth;