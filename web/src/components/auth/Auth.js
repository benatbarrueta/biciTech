import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Auth.css';
import { useNavigate, Link } from 'react-router-dom';
import { useToken } from './tokenContext';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
                setError('');
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            if (error.response && error.response.status === 401) {
                setError('Usuario o contraseña incorrectos. Intentelo de nuevo.');
            } else {
                setError('Ocurrió un problema con el inicio de sesión. Intentelo de nuevo.');
            }
        }
    };

    const register = async () => {
        navigate('/register');
    }

    const loginWithGoogle = async () => {
        try {
            // Realiza una solicitud al backend para obtener la URL de autorización de Google
            console.log('Iniciando sesión con Google...');
            const response = await axios.get('/api/auth/google');
            console.log(response.data)
            if (response.status === 200 && response.data.authorization_url) {
                // Redirige al usuario a la URL de autorización de Google
                console.log('Redirigiendo a la URL de autorización de Google:', response.data.authorization_url);
                window.location.href = response.data.authorization_url;
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            login();
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
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="auth-button-container">
                <button className="auth-button" onClick={login}>Iniciar Sesión</button>
                <button className="auth-button" onClick={register}>Registrarse</button>
                <hr />
            </div>
            <button className="google-button" onClick={loginWithGoogle}>
                <img
                    className="google-icon"
                    src={require('../../styles/images/google.png')}
                    alt="Google"
                />
                Iniciar Sesión con Google
            </button>
            <div className="auth-register">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                        <b>Regístrate</b>
                    </Link>
            </div>
        </div>
    );
}

export default Auth;