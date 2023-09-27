import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';


function OrderForm({ setDeliveryDate }) {
  const token = localStorage.getItem('authToken');
  const decodedToken = token ? jwt_decode(token) : null; // Vérifiez si le token existe
  const userId = decodedToken ? decodedToken.id : null; // Utilisez le userId uniquement si le token existe
  const [selectedDate, setSelectedDate] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  const validationSchema = Yup.object().shape({
    selectedDate: Yup.date()
      .required('La date est requise')
      .min(new Date(), 'La date ne peut pas être antérieure à aujourd\'hui'),
  });

  const submitForm = (values, { setSubmitting }) => {
    // Effectuez la requête HTTP POST vers votre API Symfony avec les valeurs du formulaire
    axios
      .post(`https://127.0.0.1:8000/api/confirm/${userId}/${values.selectedDate.toISOString()}`)
      .then(response => {
        // Traitement de la réponse du serveur en cas de succès
        console.log('La requête a été soumise avec succès.');
        setSubmitting(false); // Marquez le formulaire comme soumis avec succès
        setDeliveryDate(selectedDate);
  
        // Définissez la valeur de redirectTo pour déclencher la redirection
        setRedirectTo('/'); // Remplacez '/nouvelle-page' par l'URL de la page de destination
      })
      .catch(error => {
        // Gestion des erreurs en cas d'échec de la requête
        console.error('Erreur lors de la soumission du formulaire :', error);
        setSubmitting(false); // Marquez le formulaire comme soumis avec échec
      });
  };
  
  return (
    <Formik
      initialValues={{ selectedDate: null }}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="form-order">
          <h2>Date de livraison</h2>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={selectedDate}
            onChange={(date) => {
              setFieldValue('selectedDate', date); // Met à jour la valeur du champ
              setSelectedDate(date); // Met à jour l'état local
            }}
            minDate={new Date()}
          />
          <ErrorMessage name="selectedDate" component="div" className="error" />

          {redirectTo && <Navigate to={redirectTo} />}
        </Form>
      )}
    </Formik>
  );
}

export default OrderForm;
