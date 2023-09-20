import React from 'react'
import {Field, ErrorMessage} from 'formik'
import TextError from '../TextError'

function RadioButtons(props) {
    const {label, name, options, ...rest} = props
  return (
    <div className='form-control'>
        <label>{label}</label>
        <Field name={name} {...rest}>
            {
                ({ field }) => {
                    return options.map(options => {
                        return (
                            <React.Fragment key={options.key}>
                                <input type="radio" 
                                id={options.value} 
                                {...field} value={options.value} 
                                checked={field.value === options.value} 
                                />
                                <label htmlFor={options.value}> {options.key} </label>
                            </React.Fragment>
                        )
                    })
                }
            }
        </Field>
        <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default RadioButtons