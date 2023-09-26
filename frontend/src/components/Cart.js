import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export function Cart(props) {
  const token = localStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;
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

              });
          })
          .catch(error => {
            console.error('Erreur lors de la récupération de l\'historique des commandes :', error);
          });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });
  }, [cartApiUrl, orderHistoryApiUrl, deliveredApiUrl]);

  
  const handleOrderClick = () => {
    // Mettez à jour isOrdering à true
    setIsOrdering(true);

    // Utilisez le composant Navigate pour rediriger vers la page de commande
    // Cette ligne ne sera rendue que lorsque isOrdering sera à true
    return <Navigate to={`/order/${userId}`} />;
  };
  

  const handleRemoveProduct = (productId) => {
    // Envoie une requête pour supprimer le produit du panier
    axios.post(`https://127.0.0.1:8000/api/remove/${userId}/${productId}`)
      .then(response => {
        // Mettez à jour la liste des produits après la suppression
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
  
        // Recalculer le prix total en parcourant les produits restants
        const updatedTotalPrice = updatedProducts.reduce((total, product) => {
          return total + product.price * product.quantity;
        }, 0);
        setTotalPrice(updatedTotalPrice);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du produit du panier :', error);
      });
  };

  // Fonction pour tronquer une description à une longueur maximale
const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...'; // Ajoute des points de suspension
  }
  return description;
};

  return (
    <div>
      <h1>Mon panier</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
              <th>Quantité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>
                <button className="btn btn-danger" onClick={() => {handleRemoveProduct(product.id)}}>Supprimer</button>
                </td>
                <td>{product.quantity}</td>
                <td>{product.price * product.quantity} €</td>
              </tr>
              
            ))}
            <tr>
               <td colSpan="3"></td>
               <td className="total-price">
               <strong>Prix Total:</strong> {totalPrice} €
               </td>
               </tr>
          </tbody>
        </table>
      </div>
      
      {!isCartEmpty && <button onClick={handleOrderClick}>Valider le panier</button>}
      {isOrdering && <Navigate to={`/order/${userId}`} />}
   
      
      {/* Le reste de votre code pour le panier... */}
      
      {orderHistory.length > 0 && (
        <div>
          <h1>En cours de livraison</h1>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Numéro de commande</th>
                  <th>Date de livraison</th>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map(order => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.deliveryDate.date).toLocaleDateString()}</td>
                    <td>{order.name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.price * order.quantity} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
  
      {deliveredProducts.length > 0 && (
        <div>
          <h1>Historique des commandes</h1>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Numéro de commande</th>
                  <th>Date de livraison</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {deliveredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.orderNumber}</td>
                    <td>{new Date(product.deliveryDate.date).toLocaleDateString()}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{truncateDescription(product.description, 100)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price * product.quantity} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
