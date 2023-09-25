import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../FormikControl';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function LoginForm(props) {
  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Format invalide').required('Champ obligatoire'),
    password: Yup.string().required('Champ obligatoire')
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const onSubmit = (values) => {
    console.log('Values', values);
    axios
      .post('https://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password
      })
      .then((response) => {
        console.log('Response data', response.data);
        const { token } = response.data;
        // Stocker le jeton dans le localStorage
        localStorage.setItem('authToken', response.data.token);

        // Décoder le token JWT pour obtenir les informations de l'utilisateur
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.sub; // Obtenez l'ID de l'utilisateur depuis le token

        // Afficher les informations de l'utilisateur dans la console
        console.log('Informations de l\'utilisateur :', decodedToken);

        // Mettre à jour l'état de connexion de l'utilisateur
        setIsUserLoggedIn(true);
        props.handleLoginSuccess(decodedToken.firstname);

      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => (
        <Form>
          <FormikControl control='input' type='email' label='email' name='email' />
          <FormikControl control='input' type='password' label='password' name='password' />
          <button type='submit' disabled={!formik.isValid}>
            Valider
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
