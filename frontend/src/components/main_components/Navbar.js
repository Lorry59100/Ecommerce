import React from 'react'

export function Navbar(props) {
    return (
      <nav className="navbar">
        <div className="container">
          <a href="#" className="link">Accueil</a>
          <a href="#" className="link">Produits</a>
          <a href="#" className="link">À propos</a>
          <div className="right-links">
            <a href="#" className="link">Connexion</a>
            <a href="#" className="link">Inscription</a>
          </div>
        </div>
      </nav>
    );
  }