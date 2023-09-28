import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import PaymentForm from './forms/PaymentForm';

export function Order(props) {
  const [orderData, setOrderData] = useState([]);
  const token = localStorage.getItem('authToken');
  const decodedToken = token ? jwt_decode(token) : null; // Vérifiez si le token existe
  const userId = decodedToken ? decodedToken.id : null; // Utilisez le userId uniquement si le token existe

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

  // Fonction pour calculer le prix total
  const calculateTotalPrice = () => {
    return orderData.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };
  

  return (
    <div className="table-container">
      <h1>Détails de la commande</h1>
      <table className="table product-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.price * product.quantity} €</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4"></td>
            <td className="total-price">
              <strong>Prix Total:</strong> {calculateTotalPrice()} €
            </td>
          </tr>
        </tbody>
      </table>
      {/* <OrderForm /> */}
      <PaymentForm totalPrice={calculateTotalPrice()} />
    </div>
  );
}

export default Order;
