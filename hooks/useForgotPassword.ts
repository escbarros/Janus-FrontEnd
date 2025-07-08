import { log } from '@/constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sendResetEmail = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setEmailError('');
            setMessage(null);

            if (!email) {
                setEmailError('Email é obrigatório');
                return false;
            }

            if (!validateEmail(email)) {
                setEmailError('Por favor, insira um email válido');
                return false;
            }

            // TODO: Integrar com Clerk para envio de email de reset
            // const { signIn } = useSignIn();
            // await signIn.create({
            //     strategy: 'reset_password_email_code',
            //     identifier: email,
            // });

            log.debug('Reset email sent to:', email);
            setMessage('Email de recuperação enviado com sucesso!');
            return true;
        } catch (err: any) {
            log.error('Error sending reset email:', err);
            setMessage('Erro ao enviar email de recuperação. Tente novamente.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyResetCode = async (code: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setMessage(null);

            if (code.length !== 6) {
                setMessage('Código deve ter 6 dígitos');
                return false;
            }

            // TODO: Integrar com Clerk para verificar código
            // const { signIn } = useSignIn();
            // await signIn.attemptFirstFactor({
            //     strategy: 'reset_password_email_code',
            //     code: code,
            // });

            log.debug('Reset code verified:', code);
            setMessage('Código verificado com sucesso!');

            // Redirecionar para tela de nova senha
            router.push('/changePassword');
            return true;
        } catch (err: any) {
            log.error('Error verifying reset code:', err);
            setMessage('Código inválido. Tente novamente.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resendResetEmail = async (): Promise<boolean> => {
        return await sendResetEmail();
    };

    return {
        email,
        setEmail,
        emailError,
        isLoading,
        message,
        sendResetEmail,
        verifyResetCode,
        resendResetEmail,
        clearMessage: () => setMessage(null),
    };
};
