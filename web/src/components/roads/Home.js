import React from 'react';
import '../../styles/Home.css';
import logo from '../../styles/logo.png';

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
          La plataforma que te ayuda a descubrir los mejores lugares para andar en bicicleta.
          <br /><br />
          Descrube todos los carriles disponibles en tu ciudad y disfruta de un paseo en bicicleta. Así que, ¿qué esperas para comenzar?
        </h2>
      </article>
    </section>
  </main>
);

export default Home;