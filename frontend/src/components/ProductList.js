import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://127.0.0.1:8000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });
  }, []);

  return (
    <div>
      <h1>Liste des produits</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - {product.price} €</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
