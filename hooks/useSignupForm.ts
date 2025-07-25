import { validateSignupForm } from '@/utils/validation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useSignupForm = (authFieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
}) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const clearErrors = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
    };

    const validateForm = () => {
        clearErrors();
        const { errors, isValid } = validateSignupForm(
            name,
            email,
            password,
            t,
        );

        if (errors.name) setNameError(errors.name);
        if (errors.email) setEmailError(errors.email);
        if (errors.password) setPasswordError(errors.password);

        return isValid;
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        clearErrors();
    };

    const finalNameError = authFieldErrors?.name || nameError;
    const finalEmailError = authFieldErrors?.email || emailError;
    const finalPasswordError = authFieldErrors?.password || passwordError;

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        nameError: finalNameError,
        emailError: finalEmailError,
        passwordError: finalPasswordError,
        validateForm,
        resetForm,
        clearErrors,
    };
};
