import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import jwt_decode from 'jwt-decode';
import config from '../../config.json'; 

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);
const token = localStorage.getItem('authToken');
const decodedToken = token ? jwt_decode(token) : null;
const userId = decodedToken ? decodedToken.id : null;

function PaymentForm({ totalPrice, onClientSecretReceived }) {
  
  return (
    <div>
      <Elements stripe={stripePromise}>
        <CheckoutForm userId={userId} totalPrice={totalPrice} onClientSecretReceived={onClientSecretReceived} />
      </Elements>
    </div>
  );
}

export default PaymentForm;
