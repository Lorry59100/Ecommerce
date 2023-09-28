import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker'; // Importez le composant DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Importez les styles par défaut de DatePicker

const CheckoutForm = ({ clientSecret, amountToPay, selectedDate, onChange }) => {
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const paymentData = {
      payment_method: {
        card: cardElement,
      },
    };

    const result = await stripe.confirmCardPayment(clientSecret, paymentData);


    if (result.error) {
      console.error(result.error.message);
    } else {
      // Le paiement a été confirmé avec succès
      // Redirigez l'utilisateur vers votre URL de réussite ou effectuez d'autres actions nécessaires
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={{
            style: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          }}
        />
      </label>

      <div>
        <label>Date de livraison</label>
          <DatePicker
          selected={selectedDate}
          onChange={(date) => onChange(date)} // Utilisez la fonction de rappel onChange pour mettre à jour la date sélectionnée
          dateFormat="dd/MM/yyyy"
          />
      </div>

      <p>Montant à payer : {amountToPay} EUR</p>
      <button type="submit" disabled={!stripe}>
        Payer
      </button>
    </form>
  );
};

export default CheckoutForm;
