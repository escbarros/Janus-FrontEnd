export {
    isValidEmail,
    isValidPassword,
    validateLoginForm,
    validateSignupForm,
} from './validation';

export const formatDateTime = (datetime: string | Date): string => {
    const date = new Date(datetime);

    if (isNaN(date.getTime())) {
        return 'Invalid';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};
