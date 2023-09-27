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
  const decodedToken = token ? jwt_decode(token) : null; // Vérifiez si le token existe
  const userId = decodedToken ? decodedToken.id : null; // Utilisez le userId uniquement si le token existe
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

  // Fonction pour filtrer les produits par catégorie
  const filterProductsByCategory = () => {
    if (selectedCategory === '') {
      return products; // Retournez tous les produits si aucune catégorie n'est sélectionnée
    } else {
      return products.filter(product => product.category === selectedCategory);
    }
  };

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

    {/* Sélecteur de catégorie */}
    <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        <option value="Console">Consoles</option>
        <option value="Jeux Vidéos">Jeux Vidéos</option>
        <option value="Manettes">Manettes</option>
      </select>

      <div className="product-cards">
        {filterProductsByCategory().map(product => (
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
