import * as Yup from 'yup';
export const ValidationRegister = Yup.object({
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