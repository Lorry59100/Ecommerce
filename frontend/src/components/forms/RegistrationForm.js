import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../FormikControl'

export function RegistrationForm() {

    const initialValues = {
        firstname: '',
        lastname: '',
        address: '',
        cp: '',
        town: '',
        country: '',
        email: '',
        password: '',
        confirmPassword: '',
    }
    const validationSchema = Yup.object({
        firstname: Yup.string().required('Requis'),
        lastname: Yup.string().required('Requis'),
        address: Yup.string().required('Requis'),
        cp: Yup.string().required('Requis'),
        town: Yup.string().required('Requis'),
        country: Yup.string().required('Requis'),
        email: Yup.string().email('Format email invalide').required('Requis'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Les mots de passe ne correspondent pas').required('Requis'),
    })

    const onSubmit = values => {
        console.log('Form data', values)
    }

    return <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}> 
        {
            formik => {
                return <Form>
                    <FormikControl control='input' type='text' label='Firstname' name='firstname' />
                    <FormikControl control='input' type='text' label='Lastname' name='lastname' />
                    <FormikControl control='input' type='text' label='Address' name='address' />
                    <FormikControl control='input' type='text' label='Cp' name='cp' />
                    <FormikControl control='input' type='text' label='Town' name='town' />
                    <FormikControl control='input' type='text' label='Country' name='country' />
                    <FormikControl control='input' type='email' label='Email' name='email' />
                    <FormikControl control='input' type='password' label='Password' name='password' />
                    <FormikControl control='input' type='password' label='Confirm Password' name='confirmPassword' />
                    <button type="submit" disabled={!formik.isValid}>Valider</button>
                </Form>
            }
        }
    </Formik>
}
