import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;
  const notify = () => toast.success("Produit ajouté au panier");
  useEffect(() => {
    axios.get('https://127.0.0.1:8000/api/products')
      .then(response => {
        const productsWithQuantity = response.data.map(product => ({
          ...product,
          quantity: 1, // Initialisez la quantité à zéro
        }));
        setProducts(response.data);
        setProducts(productsWithQuantity);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });
  }, []);

  const incrementQuantity = (product) => {
    // Créez une copie des produits avec la quantité mise à jour
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, quantity: p.quantity + 1 };
      }
      return p;
    });
  
    // Mettez à jour l'état avec les produits mis à jour
    setProducts(updatedProducts);
  };
  
  const decrementQuantity = (product) => {
    // Vérifiez que la quantité ne devient pas négative
    if (product.quantity > 1) {
      // Créez une copie des produits avec la quantité mise à jour
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      });
  
      // Mettez à jour l'état avec les produits mis à jour
      setProducts(updatedProducts);
    }
  };

  const addToCart = (product) => {
    // Envoie une requête pour ajouter le produit au panier
    const quantity = product.quantity;

    axios.post(`https://127.0.0.1:8000/api/addcart/${userId}/${product.id}/${quantity}`)
      .then(response => {
        // Traitez la réponse si nécessaire (par exemple, affichez un message de succès)
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
      <div className="product-cards">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="title_card">
              <h2>{product.name}</h2>
            
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
              <Link to={`/single_product/${product.id}`}><button className='detail-btn'>Détails</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
