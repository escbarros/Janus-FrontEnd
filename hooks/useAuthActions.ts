import { log } from '@/constants';
import { useAuth, useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { useUserData } from './useUserData';

export const useAuthActions = () => {
    const { isSignedIn } = useAuth();
    const { startSSOFlow } = useSSO();
    const { fetchUserData } = useUserData();
    const { signUp, setActive: setActiveSignUp } = useSignUp();
    const { signIn, setActive: setActiveSignIn } = useSignIn();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});

    useEffect(() => {
        WebBrowser.maybeCompleteAuthSession();
        WebBrowser.warmUpAsync();

        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            if (isSignedIn) {
                log.debug('User already signed in, fetching user data');
                await fetchUserData();
                log.debug('Redirecting to main app -- 1');
                router.replace('/(root)/(tabs)/(home)');
                return;
            }
            log.debug('Starting Google SSO flow');
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: AuthSession.makeRedirectUri({
                    path: '/(root)/(tabs)/(home)',
                }),
            });

            log.debug('createdSessionId', createdSessionId);

            if (createdSessionId && setActive) {
                log.debug('Setting active session');
                await fetchUserData();
                await setActive({ session: createdSessionId });
                log.debug('Redirecting to main app -- 2');
            }
        } catch (err) {
            log.error('OAuth error', err);
        }
    };

    const handleEmailLogin = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setMessage(null);
            setFieldErrors({});
            log.debug('Email login attempt:', { email, password });

            if (!signIn || !setActiveSignIn) {
                log.error('SignIn not available');
                setMessage('Serviço de login indisponível');
                return;
            }

            const result = await signIn.create({
                identifier: email,
                password: password,
            });

            log.debug('SignIn result:', result);

            if (result.status === 'complete') {
                await setActiveSignIn({ session: result.createdSessionId });
                await fetchUserData();
                setMessage('Login realizado com sucesso!');
                router.replace('/(root)/(tabs)');
            } else {
                log.error('Login incomplete:', result.status);
                setMessage('Login incompleto. Tente novamente.');
            }
        } catch (err: any) {
            log.error('Email login error:', err);

            if (err?.errors) {
                const errors: { email?: string; password?: string } = {};
                let hasFieldErrors = false;

                err.errors.forEach((error: any) => {
                    log.error('Clerk login error:', error.message, error.code);

                    if (
                        error.code === 'form_identifier_not_found' ||
                        error.code === 'form_identifier_exists' ||
                        error.message?.toLowerCase().includes('email') ||
                        error.message?.toLowerCase().includes('identifier')
                    ) {
                        errors.email = error.code;
                        hasFieldErrors = true;
                    } else if (
                        error.code === 'form_password_incorrect' ||
                        error.code === 'form_password_pwned' ||
                        error.message?.toLowerCase().includes('password') ||
                        error.message?.toLowerCase().includes('senha')
                    ) {
                        errors.password = error.code;
                        hasFieldErrors = true;
                    }
                });

                if (hasFieldErrors) {
                    setFieldErrors(errors);
                } else {
                    const errorMessage =
                        err.errors[0]?.message || 'Erro ao fazer login';
                    setMessage(errorMessage);
                }
            } else {
                setMessage('Erro ao fazer login. Verifique suas credenciais.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignup = async (
        name: string,
        email: string,
        password: string,
    ): Promise<boolean> => {
        try {
            setIsLoading(true);
            setMessage(null);
            setFieldErrors({});
            log.debug('Email signup attempt:', { name, email, password });

            if (!signUp || !setActiveSignUp) {
                log.error('SignUp not available');
                setMessage('Serviço de cadastro indisponível');
                return false;
            }

            const result = await signUp.create({
                firstName: name,
                emailAddress: email,
                password: password,
            });

            log.debug('SignUp result:', result.status);
            log.debug('SignUp missing fields:', result.missingFields);
            log.debug('SignUp unverified fields:', result.unverifiedFields);

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setMessage(
                'Conta criada com sucesso! Verifique seu email para confirmar.',
            );

            return true;
        } catch (err: any) {
            log.error('Email signup error:', err);

            if (err?.errors) {
                const errors: {
                    name?: string;
                    email?: string;
                    password?: string;
                } = {};
                let hasFieldErrors = false;

                err.errors.forEach((error: any) => {
                    log.error('Clerk signup error:', error.message, error.code);

                    if (
                        error.code === 'form_first_name_invalid' ||
                        error.message?.toLowerCase().includes('first') ||
                        error.message?.toLowerCase().includes('name') ||
                        error.message?.toLowerCase().includes('nome')
                    ) {
                        errors.name = error.code;
                        hasFieldErrors = true;
                    } else if (
                        error.code === 'form_identifier_exists' ||
                        error.code === 'form_identifier_invalid' ||
                        error.message?.toLowerCase().includes('email') ||
                        error.message?.toLowerCase().includes('identifier')
                    ) {
                        errors.email = error.code;
                        hasFieldErrors = true;
                    } else if (
                        error.code === 'form_password_pwned' ||
                        error.code === 'form_password_invalid' ||
                        error.code === 'form_password_length_too_short' ||
                        error.message?.toLowerCase().includes('password') ||
                        error.message?.toLowerCase().includes('senha')
                    ) {
                        errors.password = error.code;
                        hasFieldErrors = true;
                    }
                });

                if (hasFieldErrors) {
                    setFieldErrors(errors);
                } else {
                    const errorMessage =
                        err.errors[0]?.message || 'Erro ao criar conta';
                    setMessage(errorMessage);
                }
            } else {
                setMessage('Erro ao criar conta. Tente novamente.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyEmailCode = async (code: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setMessage(null);
            log.debug('Email verification attempt:', { code });

            if (!signUp || !setActiveSignUp) {
                log.error('SignUp not available');
                setMessage('Serviço de verificação indisponível');
                return false;
            }

            const result = await signUp.attemptEmailAddressVerification({
                code: code,
            });

            log.debug('Email verification result:', result.status);
            if (result.status === 'complete') {
                await setActiveSignUp({ session: result.createdSessionId });
                setMessage('Email verificado com sucesso!');
                router.replace('/(root)/(tabs)');
                return true;
            } else {
                setMessage('Verificação incompleta. Tente novamente.');
                return false;
            }
        } catch (err: any) {
            log.error('Email verification error:', err);

            if (err?.errors) {
                const errorMessage =
                    err.errors[0]?.message || 'Código inválido';
                setMessage(errorMessage);
                err.errors.forEach((error: any) => {
                    log.error('Clerk verification error:', error.message);
                });
            } else {
                setMessage('Código inválido. Tente novamente.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setMessage(null);
            log.debug('Resending verification email');

            if (!signUp) {
                log.error('SignUp not available');
                setMessage('Serviço indisponível');
                return false;
            }

            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            log.debug('Verification email resent');
            setMessage('Email de verificação reenviado!');
            return true;
        } catch (err: any) {
            log.error('Error resending verification email:', err);
            setMessage('Erro ao reenviar email. Tente novamente.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleGoogleSignIn,
        handleEmailLogin,
        handleEmailSignup,
        verifyEmailCode,
        resendVerificationEmail,
        isSignedIn,
        isLoading,
        message,
        fieldErrors,
        clearMessage: () => setMessage(null),
        clearFieldErrors: () => setFieldErrors({}),
    };
};
