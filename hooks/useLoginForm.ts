import { validateLoginForm } from '@/utils/validation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLoginForm = (authFieldErrors?: {
    email?: string;
    password?: string;
}) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    };

    const validateForm = () => {
        clearErrors();
        const { errors, isValid } = validateLoginForm(email, password, t);

        if (errors.email) setEmailError(errors.email);
        if (errors.password) setPasswordError(errors.password);

        return isValid;
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        clearErrors();
    };

    const finalEmailError = authFieldErrors?.email || emailError;
    const finalPasswordError = authFieldErrors?.password || passwordError;

    return {
        email,
        setEmail,
        password,
        setPassword,
        emailError: finalEmailError,
        passwordError: finalPasswordError,
        validateForm,
        resetForm,
        clearErrors,
    };
};
