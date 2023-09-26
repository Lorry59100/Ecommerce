import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { BsCartFill } from 'react-icons/bs';
import jwt_decode from 'jwt-decode';
import { Link } from "react-router-dom";

export function Navbar(props) {
  let token;
  let userId;

  const handleLogout = () => {
    props.handleLogout();
  };

  // Récupérer le token du localStorage
  token = localStorage.getItem('authToken');

  // Si le token existe, le décoder
  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error('Erreur lors du décodage du jeton JWT :', error);
    }
  }
  
  const handleLoginLinkClick = (event) => {
    event.preventDefault();
    props.showLoginForm();
    props.hideProductList(); // Masquer la liste des produits
  };

  const handleRegistrationLinkClick = (event) => {
    event.preventDefault();
    props.showRegistrationForm();
    props.hideProductList(); // Masquer la liste des produits
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className="link">Accueil</a>
        <div className="right-links">
          {props.isAuthenticated ? (
            <>
              <a href="/" className="link" onClick={handleLogout}>Déconnexion</a>
              <span><FaUserAlt /> {props.firstname}</span>
              <Link to={`/cart/${userId}`} className="link"> <BsCartFill/> Panier </Link>
            </>
          ) : (
            <>
              <a href="#" className="link" onClick={handleLoginLinkClick}>Connexion</a>
              <a href="#" className="link" onClick={handleRegistrationLinkClick}>Inscription</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
