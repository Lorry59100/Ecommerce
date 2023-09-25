import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function OrderForm() {
    const token = localStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id; // Déclarez userId dans la portée supérieure
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    // Assurez-vous que selectedDate n'est pas nul avant d'envoyer la requête
    if (selectedDate) {
      // Préparez les données du formulaire à envoyer au serveur
      const formData = {
        selectedDate: selectedDate.toISOString(), // Convertissez la date en format ISO
      };

      console.log(formData.selectedDate);
  
      // Effectuez la requête HTTP POST vers votre API Symfony
      axios.post(`https://127.0.0.1:8000/api/confirm/${userId}/${formData.selectedDate}`)
        .then(response => {
          // Traitement de la réponse du serveur en cas de succès
          console.log('Réponse du serveur :', response.data);
        })
        .catch(error => {
          // Gestion des erreurs en cas d'échec de la requête
          console.error('Erreur lors de la requête POST :', error);
        });
    } else {
      console.error('La date n\'est pas sélectionnée.');
    }
  };

  return (
    <div>
      <h2>Date de livraison</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy" // Format de date souhaité
      />
      <button onClick={handleSubmit}>Valider la livraison</button>
    </div>
  );
}

export default OrderForm;
