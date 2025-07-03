// i18n/index.ts
import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt.json';

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18next.use(initReactI18next).init({
    lng: deviceLanguage,

    fallbackLng: 'en',

    resources: {
        en: en,
        pt: pt,
    },

    interpolation: {
        escapeValue: false,
    },

    react: {
        useSuspense: false,
    },
});

export default i18next;
