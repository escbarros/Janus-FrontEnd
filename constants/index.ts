import { consoleTransport, logger } from 'react-native-logs';
import logo from '../assets/images/logo.png';
export const images = {
    logo,
};
export const onboardingSteps = [
    {
        title: 'onboarding.welcomeTitle',
        subtitle: 'onboarding.welcomeSubtitle',
    },
    {
        title: 'onboarding.communicationTitle',
        subtitle: 'onboarding.communicationSubtitle',
    },
    {
        title: 'onboarding.textToSpeechTitle',
        subtitle: 'onboarding.textToSpeechSubtitle',
    },
];

export const log = logger.createLogger({
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: 'debug',
    transport: consoleTransport,
    transportOptions: {
        colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
        },
    },
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    fixedExtLvlLength: false,
    enabled: true,
});
