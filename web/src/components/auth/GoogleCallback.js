import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from './tokenContext';

const GoogleCallback = ({ onLogin }) => {
    const navigate = useNavigate();
    const { setAuthToken } = useToken();

    useEffect(() => {
        const fetchToken = async () => {
            // Obtén el código de autorización de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            console.log("Código de autorización recibido:", code);

            if (!code) {
                console.error("No se encontró el código de autorización en la URL.");
                return;
            }

            try {
                // Realiza una solicitud al backend para obtener el token de acceso
                console.log("Obteniendo token de acceso...");
                const response = await axios.get(`/api/auth/google/callback?code=${code}`);
                console.log("Respuesta del servidor:", response);

                if (response.status === 200) {
                    // Guarda el token y redirige al usuario
                    console.log("Token de acceso obtenido:", response.data.access_token);
                    console.log("AUTHENTICATED:", onLogin);
                    setAuthToken(response.data.access_token);
                    localStorage.setItem('token', response.data.access_token);
                    console.log("TOKEN:", response.data.access_token);
                    onLogin();
                    navigate('/home');
                    console.log("GOOGLE LOGIN SUCCESFULL.");
                } else {
                    console.error("Error al obtener el token de acceso:", response);
                }
            } catch (error) {
                console.error("Error al hacer la solicitud al backend:", error);
            }
        };

        fetchToken();
    }, [setAuthToken]);

    return <div>Cargando...</div>;
};

export default GoogleCallback;
