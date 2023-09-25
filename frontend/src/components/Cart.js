import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export function Cart(props) {
  const token = localStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;
  console.log(userId);
  const cartApiUrl = `https://127.0.0.1:8000/api/cart/${userId}`;
  const orderHistoryApiUrl = `https://127.0.0.1:8000/api/shipping/${userId}`;
  const deliveredApiUrl = `https://127.0.0.1:8000/api/delivered/${userId}`;
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOrdering, setIsOrdering] = useState();
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [deliveredProducts, setDeliveredProducts] = useState([]);

  useEffect(() => {
    // Récupérez à la fois le contenu du panier et l'historique des commandes
    axios.get(cartApiUrl)
      .then(response => {
        setProducts(response.data);
        // Vérifiez si le panier est vide
        if (response.data.length > 0) {
          setIsCartEmpty(false);
        }
        // Calculez le prix total en parcourant les produits
        const totalPrice = response.data.reduce((total, product) => {
          return total + product.price * product.quantity;
        }, 0);
        setTotalPrice(totalPrice);

        axios.get(deliveredApiUrl)
    .then(response => {
      setDeliveredProducts(response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des produits livrés :', error);
    });

        // Récupérez l'historique des commandes
        axios.get(orderHistoryApiUrl)
          .then(response => {
            setOrderHistory(response.data);
            response.data.forEach(order => {
                console.log('Date de livraison (string):', order.deliveryDate);
                // Utilisez ici la conversion de date en objet Date si nécessaire
              });
          })
          .catch(error => {
            console.error('Erreur lors de la récupération de l\'historique des commandes :', error);
          });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });
  }, [cartApiUrl, orderHistoryApiUrl], [deliveredApiUrl]);

  const handleOrderClick = () => {
    // Mettez à jour isOrdering à true
    setIsOrdering(true);

    // Utilisez le composant Navigate pour rediriger vers la page de commande
    // Cette ligne ne sera rendue que lorsque isOrdering sera à true
    return <Navigate to={`/order/${userId}`} />;
  };
  

  return (
    <div>
      <h1>Mon panier</h1>
      <ul>
        {products.map(product => (
          <li key={product.name}>
            <strong>Nom:</strong> {product.name}<br />
            <strong>Prix:</strong> {product.price} €<br />
            <strong>Quantité:</strong> {product.quantity}<br />
            {/* Ajoutez d'autres détails du produit si nécessaire */}
          </li>
        ))}
      </ul>

      <div>
        <strong>Prix Total:</strong> {totalPrice} €
      </div>

      {!isCartEmpty && <button onClick={handleOrderClick}>Valider le panier</button>}
      {isOrdering && <Navigate to={`/order/${userId}`} />}

      {orderHistory.length > 0 && (
        <div>
          <h1>En cours de livraison</h1>
          <ul>
            {orderHistory.map(order => (
              <li key={order.id}>
                <strong>Nom:</strong> {order.name}<br />
                <strong>Quantité:</strong> {order.quantity}<br />
                <strong>Numéro de commande:</strong> {order.orderNumber}<br />
                <strong>Date de livraison:</strong> {new Date(order.deliveryDate.date).toLocaleDateString()}<br />
              </li>
            ))}
          </ul>
        </div>
      )}

{deliveredProducts.length > 0 && (
  <div>
    <h1>Historique des commandes</h1>
    <ul>
      {deliveredProducts.map(product => (
        <li key={product.id}>
          <strong>Nom:</strong> {product.name}<br />
          <strong>Quantité:</strong> {product.quantity}<br />
          <strong>Catégorie:</strong> {product.category}<br />
          <strong>Description:</strong> {product.description}<br />
          <strong>Prix:</strong> {product.price} €<br />
          <strong>Numéro de commande:</strong> {product.orderNumber}<br />
          <strong>Date de livraison:</strong> {new Date(product.deliveryDate.date).toLocaleDateString()}<br />
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}
