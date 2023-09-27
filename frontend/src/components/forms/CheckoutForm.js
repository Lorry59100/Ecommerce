import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, amountToPay }) => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

    // Utilisez elements.getElement pour obtenir la référence à l'élément de carte
    const cardElement = elements.getElement(CardElement);

    // Confirmez le paiement avec l'élément de carte et le clientSecret
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      // Gérez les erreurs, par exemple, affichez-les à l'utilisateur
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
            // Vous pouvez personnaliser l'apparence de l'élément de carte ici
            // Par exemple, vous pouvez définir la couleur du texte et de l'icône
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </label>
          <p>Montant à payer : {amountToPay} EUR</p>
      <button type="submit" disabled={!stripe}>
        Payer
      </button>
    </form>
  );
};

export default CheckoutForm;
