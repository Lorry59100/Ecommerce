import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMsg, errorMsg } from './ToastNotifications';
import { incrementQuantity, decrementQuantity } from './QuantityOperations';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const token = localStorage.getItem('authToken');
  const decodedToken = token ? jwt_decode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;

  useEffect(() => {
    axios.get('https://127.0.0.1:8000/api/products')
      .then(response => {
        const productsWithQuantity = response.data.map(product => ({
          ...product,
          quantity: 1,
        }));
        setProducts(response.data);
        setProducts(productsWithQuantity);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });
  }, []);

  const getUniqueCategories = () => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories;
  };

  const handleIncrement = (product) => {
    const updatedProducts = incrementQuantity(products, product.id);
    setProducts(updatedProducts);
  };
  
  const handleDecrement = (product) => {
    const updatedProducts = decrementQuantity(products, product.id);
    setProducts(updatedProducts);
  };

  const addToCart = (product) => {
    const quantity = product.quantity;

    axios.post(`https://127.0.0.1:8000/api/addcart/${userId}/${product.id}/${quantity}`)
      .then(response => {
        console.log('Produit ajouté au panier avec succès', response.data);
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, stock: p.stock - quantity };
        }
        return p;
      });
      setProducts(updatedProducts);
        successMsg("Produit ajouté au panier avec succès !");
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du produit au panier :', error);
        errorMsg("Erreur lors de l'ajout du produit au panier. Veuillez vous connecter !");
      });
  };

  return (
    <div>
      <ToastContainer />
      <h1>Liste des produits</h1>

      {/* Sélecteur de catégorie avec les options générées à partir des catégories uniques */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {getUniqueCategories().map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>

      <div className="product-cards">
        {products
          .filter(product => selectedCategory === '' || product.category === selectedCategory)
          .map(product => (
            <div key={product.id} className="product-card">
              <div className="title_card">
                <h2>{product.name}</h2>
                <h5>{product.category}</h5>
              </div>
              <img src={product.img} alt={product.name} />
              <div className="stock-price">
                <p> Stock : {product.stock} </p>
                <p>Prix : {(product.price * product.quantity / 100).toFixed(2)} €</p>
              </div>
              <div className="card-buttons">
                <div className="increment-buttons">
                  <button onClick={() => handleDecrement(product)}>-</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => handleIncrement(product)}>+</button>
                </div>
                <button onClick={() => {addToCart(product)}}>Ajouter au panier</button>
              </div>
              <Link to={`/single_product/${product.id}`}><button className='detail-btn'>Détail</button></Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductList;
