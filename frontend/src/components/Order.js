import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import OrderForm from './forms/OrderForm';

export function Order(props) {
  const [orderData, setOrderData] = useState([]);
  const token = localStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id; // Déclarez userId dans la portée supérieure

  useEffect(() => {
    // Effectuer la requête HTTP pour récupérer les données de commande
    axios.get(`https://127.0.0.1:8000/api/order/${userId}`)
      .then(response => {
        setOrderData(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de commande :', error);
      });
  }, [userId]);

  return (
    <div>
      <h1>Détails de la commande</h1>
      <ul>
        {orderData.map((product, index) => (
          <li key={index}>
            <strong>Catégorie:</strong> {product.category}<br />
            <strong>Nom:</strong> {product.name}<br />
            <strong>Prix:</strong> {product.price} €<br />
            <strong>Quantité:</strong> {product.quantity}<br />
            <strong>Description:</strong> {product.description}<br />
          </li>
        ))}
      </ul>
      <OrderForm />
    </div>
  );
}

export default Order;
