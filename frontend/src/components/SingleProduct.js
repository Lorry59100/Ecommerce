import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SingleProduct() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

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

  // Si le produit est en cours de chargement, affichez un message de chargement
  if (!product) {
    return <div>Chargement en cours...</div>;
  }

  // Sinon, affichez les détails du produit
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Prix : {product.price} €</p>
      <p>Stock : {product.stock}</p>
      <p>Description : {product.description}</p>
      {/* ... autres détails du produit */}
    </div>
  );
}

export default SingleProduct;
