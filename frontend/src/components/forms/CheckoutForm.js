import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const CheckoutForm = ({ userId, totalPrice, onClientSecretReceived }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const getClientSecret = async () => {
    const dateParam = selectedDate ? selectedDate.toISOString() : null;
    try {
      const response = await axios.post(`https://127.0.0.1:8000/api/orderPayment/${userId}/${dateParam}`, {
        amountToPay: totalPrice,
        selectedDate: dateParam,
      });
      return response.data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la récupération du clientSecret :', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !isFormValid) {
      console.log('Le formulaire n\'est pas valide.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const paymentData = {
      payment_method: {
        card: cardElement,
      },
    };

    const clientSecret = await getClientSecret(); // Obtenir le clientSecret ici

    if (clientSecret) {
      try {
        const result = await stripe.confirmCardPayment(clientSecret, paymentData);

        if (result.error) {
          console.error(result.error.message);
        } else {
          console.log('Paiement confirmé avec succès !');
          // Redirigez l'utilisateur vers votre URL de réussite ou effectuez d'autres actions nécessaires
        }
      } catch (error) {
        console.error('Erreur lors du paiement :', error);
      }
    } else {
      console.error('Impossible d\'obtenir le clientSecret.');
    }
  };

  const handleFormValidation = (isValid) => {
    setIsFormValid(isValid);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Détails de la carte
        <CardElement className="CardElement" onChange={(e) => handleFormValidation(e.complete)} />
      </label>

      <div>
        <label>Date de livraison</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <p>Montant à payer : {(totalPrice / 100).toFixed(2)} EUR</p>
      <button type="submit" disabled={!stripe || !isFormValid}>
        Payer
      </button>
    </form>
  );
};

export default CheckoutForm;
