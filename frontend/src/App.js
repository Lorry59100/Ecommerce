import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import LoginForm from './components/forms/LoginForm';
import { Navbar } from './components/main_components/Navbar';
import { RegistrationForm } from './components/forms/RegistrationForm';
import SingleProduct from './components/SingleProduct';
import { Cart } from './components/Cart';
import { Order } from './components/Order';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

function App() {
  const [isProductListVisible, setIsProductListVisible] = useState(true);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(true);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  // Vérifier la présence du token JWT lors du chargement de la page
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // L'utilisateur est authentifié
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (firstname) => {
    setIsAuthenticated(true);
    setIsUserLoggedIn(true);
    setFirstname(firstname);
    setIsRegistrationFormVisible(false);
    setIsLoginFormVisible(false);
    setIsProductListVisible(true); // Afficher la liste des produits lorsque l'utilisateur est connecté
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setFirstname("");
    setIsUserLoggedIn(false);
    setIsCartVisible(false);
  };

  const handleRegistrationSuccess = (firstname) => {
    setIsProductListVisible(true);
    setFirstname(firstname); // Assurez-vous de passer le prénom de l'utilisateur depuis le formulaire d'inscription
    setIsRegistrationFormVisible(false);
    setIsLoginFormVisible(false);
    setIsCartVisible(false);
    setIsUserRegistered(true);
  };

  const showLoginForm = () => {
    setIsLoginFormVisible(true);
    setIsRegistrationFormVisible(false);
    setIsProductListVisible(false);
    setIsCartVisible(false);
  };

  const showRegistrationForm = () => {
    setIsRegistrationFormVisible(true);
    setIsLoginFormVisible(false);
    setIsProductListVisible(false);
    setIsCartVisible(false);
  };

  const showCart = () => {
    setIsRegistrationFormVisible(false);
    setIsLoginFormVisible(false);
    setIsProductListVisible(false);
    setIsCartVisible(true);
  }

  const handleOrderClick = () => {
    // Ajoutez ici la logique pour activer la commande
    setIsOrdering(true);
  };

  const hideProductList = () => {
    setIsProductListVisible(false); // Masquer la liste des produits
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated}
          firstname={firstname}
          showRegistrationForm={showRegistrationForm}
          showLoginForm={showLoginForm}
          handleLogout={handleLogout}
          hideProductList={hideProductList}
          showCart={showCart}
        />
        {isLoginFormVisible && <LoginForm handleLoginSuccess={handleLoginSuccess} />}
        {isRegistrationFormVisible && <RegistrationForm handleRegistrationSuccess={handleRegistrationSuccess} />}
        <Routes>
          {isLoginFormVisible && (
            <Route path="#" element={<LoginForm handleLoginSuccess={handleLoginSuccess} />} />
          )}
          {isRegistrationFormVisible && (
            <Route path="#" element={<RegistrationForm handleRegistrationSuccess={handleRegistrationSuccess} />} />
          )}
          <Route path="/" element={isProductListVisible && <ProductList />} />
          <Route path="/single_product/:id" element={<SingleProduct />} />
          <Route path="/cart/:id" element={<Cart redirectToOrder={() => setIsOrdering(true)} />} />
          <Route path="/order/:userId" element={<Order />} />// Ajoutez la route pour le composant Order
          {redirectTo && <Navigate to={redirectTo} />}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
