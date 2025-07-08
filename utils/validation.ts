export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateLoginForm = (email: string, password: string, t: any) => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
        errors.email = t('login.emailRequired');
    } else if (!isValidEmail(email)) {
        errors.email = t('login.emailInvalid');
    }

    if (!password) {
        errors.password = t('login.passwordRequired');
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateSignupForm = (
    name: string,
    email: string,
    password: string,
    t: any,
) => {
    const errors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
        errors.name = t('signup.nameRequired');
    }

    if (!email) {
        errors.email = t('signup.emailRequired');
    } else if (!isValidEmail(email)) {
        errors.email = t('signup.emailInvalid');
    }

    if (!password) {
        errors.password = t('signup.passwordRequired');
    } else if (!isValidPassword(password)) {
        errors.password = t('signup.passwordTooShort');
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};
