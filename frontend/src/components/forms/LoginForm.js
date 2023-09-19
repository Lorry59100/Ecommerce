import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../FormikControl';
import axios from 'axios';

function LoginForm() {
  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Format invalide').required('Champ obligatoire'),
    password: Yup.string().required('Champ obligatoire')
  });

  const onSubmit = (values) => {
    console.log('Values', values);
    axios
      .post('https://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password
      }) // Send values along with the request
      .then((response) => {
        console.log('Response data', response.data);
        // Handle the response data as needed
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
