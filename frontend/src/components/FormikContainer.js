import React from 'react'
import {Formik, Form} from 'formik'
import * as Yup from 'yup'
import FormikControl from './FormikControl'

function FormikContainer() {
    const dropdownOptions = [
        {key: 'Select an option', value:''},
        {key: 'option 1', value:'option1'},
        {key: 'option 2', value:'option2'},
        {key: 'option 3', value:'option3'}
    ]
    const radioOptions = [
        {key: 'option 1', value:'rOption1'},
        {key: 'option 2', value:'rOption2'},
        {key: 'option 3', value:'rOption3'}
    ]
    const checkboxOptions = [
        {key: 'option 1', value:'cOption1'},
        {key: 'option 2', value:'cOption2'},
        {key: 'option 3', value:'cOption3'}
    ]
    const initialValues = {
        email: '',
        description: '',
        selectOption: '',
        radioOption: '',
        checkboxOption: [],
        deliveryDate: null
    }
    const validationSchema = Yup.object({
        email: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        selectOption: Yup.string().required('Required'),
        radioOption: Yup.string().required('Required'),
        checkboxOption: Yup.array().test('at-least-one', 'Required', (value) => {
            return value && value.length > 0;
          }),
        deliveryDate: Yup.date().required('Required')
    })
    const onSubmit = values => {
        console.log('Form data', values)
        console.log('saved data', JSON.parse(JSON.stringify(values)))
    }
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {
            formik => <Form>
                <FormikControl control='input' type='email' label='Email' name='email' />
                <FormikControl control='textarea' label='description' name='description' />
                <FormikControl control='select' label='select a topic' name='selectOption' options={dropdownOptions} />
                <FormikControl control='radio' label='select a radio topic' name='radioOption' options={radioOptions} />
                <FormikControl control='checkbox' label='select a checkbox topic' name='checkboxOption' options={checkboxOptions} />
                <FormikControl control='date' label='Date de livraison' name='deliveryDate' />
                <button type='submit'>Valider</button>
            </Form>
        }
    </Formik>
  )
}

export default FormikContainer