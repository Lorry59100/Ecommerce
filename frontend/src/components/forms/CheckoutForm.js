import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const CheckoutForm = ({ userId, totalPrice }) => {
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

    const handleBlur = (element, errorId, errorMessage) => {
      element.on('blur', (event) => {
        const displayError = document.getElementById(errorId);
        if (element._parent.classList.contains('StripeElement--empty') || element._parent.classList.contains('StripeElement--invalid')) {
          displayError.textContent = errorMessage;
        } else {
          displayError.textContent = ''; // Efface le message d'erreur si le champ est valide
        }
      });
    };

    useEffect(() => {
      if (elements) {
        const elementsToCheck = [
          { element: elements.getElement(CardNumberElement), errorId: 'card-errors-number', errorMessage: 'Numéro de carte incomplet ou invalide.' },
          { element: elements.getElement(CardExpiryElement), errorId: 'card-errors-expiry', errorMessage: 'Date d\'expiration incomplète ou invalide' },
          { element: elements.getElement(CardCvcElement), errorId: 'card-errors-cvc', errorMessage: 'CVC incomplet ou invalide' }
        ];
    
        elementsToCheck.forEach(({ element, errorId, errorMessage }) => {
          if (element) {
            handleBlur(element, errorId, errorMessage);
          }
        });
      }
    }, [elements]);
    

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !isFormValid) {
      console.log('Le formulaire n\'est pas valide.');
      return;
    }

    const cardnumberElement = elements.getElement(CardNumberElement);
    console.log(cardnumberElement);
    const cardexpiryElement = elements.getElement(CardExpiryElement);
    const cardcvcElement = elements.getElement(CardCvcElement);

    const paymentData = {
      payment_method: {
        card: cardnumberElement,
        card: cardexpiryElement,
        card: cardcvcElement,
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
        <div className="card-element-container">
          <span className='card-info'>Numéro de carte</span>
        <CardNumberElement className="CardNumberElement" onChange={(e) => handleFormValidation(e.complete)} />
        <div id="card-errors-number" className='error'></div>
        </div>

        <div className="card-element-container">
        <span className='card-info'>Date d'expiration</span>
        <CardExpiryElement className="CardExpiryElement" onChange={(e) => handleFormValidation(e.complete)} />
        <div id="card-errors-expiry" className='error'></div>
        </div>

        <div className="card-element-container">
        <span className='card-info'>CVC</span>
        <CardCvcElement className="CardCvcElement" onChange={(e) => handleFormValidation(e.complete)} />
        <div id="card-errors-cvc" className='error'></div>
        </div>
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
