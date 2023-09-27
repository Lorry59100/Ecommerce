import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SingleProduct() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem('authToken');
  const decodedToken = token ? jwt_decode(token) : null; // Vérifiez si le token existe
  const userId = decodedToken ? decodedToken.id : null; // Utilisez le userId uniquement si le token existe
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const notify = () => toast.success("Produit ajouté au panier");

  useEffect(() => {
    // Utilisez directement 'id' extrait de useParams pour obtenir les détails du produit
    axios.get(`https://127.0.0.1:8000/api/single_product/${id}`)
      .then(response => {
        setProduct(response.data); // Mettez à jour l'état avec les détails du produit
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails du produit :', error);
      });
  }, [id]);

  useEffect(() => {
    // Mettez à jour le prix calculé lorsque la quantité change
    if (product) {
      const newPrice = product.price * quantity;
      setCalculatedPrice(newPrice);
    }
  }, [quantity, product]);

  // Si le produit est en cours de chargement, affichez un message de chargement
  if (!product) {
    return <div>Chargement en cours...</div>;
  }

  // Fonction pour gérer l'ajout au panier
  const addToCart = () => {
    // Envoie une requête pour ajouter le produit au panier
    const quantityToAdd = quantity; // Utilisez la quantité choisie

    if (quantityToAdd > 0) {
      axios.post(`https://127.0.0.1:8000/api/addcart/${userId}/${product.id}/${quantityToAdd}`)
        .then(response => {
          // Traitez la réponse si nécessaire (par exemple, affichez un message de succès)
          console.log('Produit ajouté au panier avec succès', response.data);

          // Mettez à jour le stock du produit sur la page
          const updatedProduct = { ...product, stock: product.stock - quantityToAdd };
          setProduct(updatedProduct);
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du produit au panier :', error);
        });
    } else {
      // Gérez le cas où la quantité est négative ou nulle
      console.error('La quantité doit être supérieure à zéro');
    }
  };

  // Fonction pour incrémenter la quantité
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Fonction pour décrémenter la quantité
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="single-product">
      <ToastContainer />
      <h1>{product.name}</h1>
      <img src={product.img} alt={product.name} />
      <div className="info-single-product">
        <p className="price">Prix : {calculatedPrice} €</p>
        <p className={product.stock > 0 ? "stock" : "out-of-stock"}>
          Stock : {product.stock > 0 ? product.stock : "Épuisé"}
        </p>
      </div>
      <p className="description">Description : {product.description}</p>
      <div className="quantity-selector">
        <button onClick={decrementQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={incrementQuantity}>+</button>
      </div>
      <button className="add-to-cart-button" onClick={() => { addToCart(product); notify(); }}>
        Ajouter au panier
      </button>
    </div>
  );
}

export default SingleProduct;
