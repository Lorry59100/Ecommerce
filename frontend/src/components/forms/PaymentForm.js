import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import config from '../../config.json'; 

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);
const token = localStorage.getItem('authToken');
const decodedToken = token ? jwt_decode(token) : null;
const userId = decodedToken ? decodedToken.id : null;

function PaymentForm({ totalPrice }) { // Recevoir le montant total en tant que prop
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const dateParam = selectedDate ? selectedDate.toISOString() : null;
  
    axios
      .post(`https://127.0.0.1:8000/api/orderPayment/${userId}/${dateParam}`, { amountToPay: totalPrice, selectedDate: dateParam })
      .then(response => {
        setClientSecret(response.data.clientSecret);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du clientSecret :', error);
      });
  }, [userId, totalPrice, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Mettez à jour la date sélectionnée lorsque l'utilisateur la change
    console.log('Date sélectionnée:', selectedDate);
  };


  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} amountToPay={totalPrice} selectedDate={selectedDate} onChange={handleDateChange} />
        </Elements>
      ) : (
        <div>Chargement en cours...</div>
      )}
    </div>
  );
}

export default PaymentForm;