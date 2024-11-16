import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from './tokenContext';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { setAuthToken } = useToken();

    useEffect(() => {
        const fetchToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            try {
                // Realiza la solicitud al backend para obtener el token
                const response = await axios.get(`/api/auth/google/callback?code=${code}`);
                if (response.status === 200) {
                    // Guarda el token de autenticación
                    setAuthToken(response.data.access_token);
                    localStorage.setItem('token', response.data.access_token);

                    // Redirige a la página de inicio
                    navigate('/home');
                }
            } catch (error) {
                console.error('Error al obtener el token de Google:', error);
                // Redirige a la página de autenticación en caso de error
                navigate('/auth');
            }
        };

        fetchToken();
    }, [navigate, setAuthToken]);

    return <div>Cargando...</div>;
};

export default GoogleCallback;
