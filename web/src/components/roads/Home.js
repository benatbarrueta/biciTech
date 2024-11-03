import React from 'react';
import '../../styles/Home.css';
import logo from '../../styles/images/logo.png';

const Home = () => (
  <main className="home-container" role="main">
    <header>
      <h1 className="home-title">BIENVENIDO</h1>
    </header>
    <section className="content-container">
      <figure>
        <img className="home-logo" src={logo} alt="Logo de la plataforma" />
      </figure>
      <article className="text-container">
        <h2 className="home-subtitle">
          La plataforma que te ayuda a descubrir y explorar los mejores lugares para andar en bicicleta, ya sea en rutas naturales tranquilas o recorridos urbanos desafiantes. Encuentra destinos increíbles, adaptados a tu nivel y preferencias, para disfrutar al máximo cada aventura en dos ruedas.
          <br /><br />
          Descubre todos los carriles disponibles en tu ciudad y explora una red de rutas ideales para disfrutar de un paseo en bicicleta. Ya sea que prefieras un recorrido tranquilo o un trayecto más largo, estos carriles ofrecen opciones seguras y cómodas para ciclistas de todos los niveles. Así que, ¿qué esperas para comenzar a pedalear y descubrir nuevos destinos?
        </h2>
      </article>
    </section>
  </main>
);

export default Home;