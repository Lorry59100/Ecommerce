import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const token = localStorage.getItem('authToken');
  const decodedToken = token ? jwt_decode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;
  const notify = () => toast.success("Produit ajouté au panier");

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

  const incrementQuantity = (product) => {
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, quantity: p.quantity + 1 };
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const decrementQuantity = (product) => {
    if (product.quantity > 1) {
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      });
      setProducts(updatedProducts);
    }
  };

  const addToCart = (product) => {
    const quantity = product.quantity;

    axios.post(`https://127.0.0.1:8000/api/addcart/${userId}/${product.id}/${quantity}`)
      .then(response => {
        console.log('Produit ajouté au panier avec succès', response.data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du produit au panier :', error);
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
                <p>Prix : {product.price * product.quantity} €</p>
              </div>
              <div className="card-buttons">
                <div className="increment-buttons">
                  <button onClick={() => decrementQuantity(product)}>-</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => incrementQuantity(product)}>+</button>
                </div>
                <button onClick={() => { addToCart(product); notify(); }}>Ajouter au panier</button>
              </div>
              <Link to={`/single_product/${product.id}`}><button className='detail-btn'>Détail</button></Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductList;
