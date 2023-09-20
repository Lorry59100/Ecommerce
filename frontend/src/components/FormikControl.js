import React from 'react'
import Input from './form_components/Input'
import Textarea from './form_components/Textarea'
import Select from './form_components/Select'
import RadioButtons from './form_components/RadioButtons'
import Checkboxes from './form_components/Checkboxes'
import DatePicker from './form_components/DatePicker'

function FormikControl(props) {
    const {control, ...rest} = props
    switch(control) {
        case'input': 
            return <Input {...rest} />
        case'textarea':
            return <Textarea {...rest} />
        case'select':
            return <Select {...rest} />
        case'radio':
            return <RadioButtons {...rest} />
        case'checkbox': 
            return <Checkboxes {...rest} />
        case'date':
            return <DatePicker {...rest} /> 
        default: 
            return null
    }
}

export default FormikControl