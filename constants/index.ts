import { consoleTransport, logger } from 'react-native-logs';
import forgotPassword from '../assets/images/forgotPassword.png';
import logo from '../assets/images/logo.png';
import mailSent from '../assets/images/mailSent.png';
import noEvents from '../assets/images/no-events.png';
import noRecordings from '../assets/images/no-recordings.png';
import noDeviceArrow from '../assets/images/noDeviceArrow.png';
export const images = {
    logo,
    forgotPassword,
    mailSent,
    noDeviceArrow,
    noEvents,
    noRecordings,
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
