import { computed, ref } from 'vue';
import enTranslations from '../lang/en.json';
import roTranslations from '../lang/ro.json';
import ruTranslations from '../lang/ru.json';

type LanguageCode = 'en' | 'ro' | 'ru';

const translations = {
    en: enTranslations,
    ro: roTranslations,
    ru: ruTranslations,
};

const currentLanguage = ref<LanguageCode>('en');

if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    if (savedLanguage && ['en', 'ro', 'ru'].includes(savedLanguage)) {
        currentLanguage.value = savedLanguage;
    }
}

export function useI18n() {
    const t = (key: string): any => {
        const keys = key.split('.');
        let value: any = translations[currentLanguage.value];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                value = translations.en;
                for (const fallbackKey of keys) {
                    if (
                        value &&
                        typeof value === 'object' &&
                        fallbackKey in value
                    ) {
                        value = value[fallbackKey];
                    } else {
                        return key;
                    }
                }
                return key;
            }
        }

        return value;
    };

    const setLanguage = (lang: LanguageCode) => {
        if (['en', 'ro', 'ru'].includes(lang)) {
            currentLanguage.value = lang;
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', lang);
            }
        }
    };

    const availableLanguages = [
        { code: 'en' as LanguageCode, name: 'English' },
        { code: 'ro' as LanguageCode, name: 'Română' },
        { code: 'ru' as LanguageCode, name: 'Русский' },
    ];

    return {
        t,
        currentLanguage: computed(() => currentLanguage.value),
        setLanguage,
        availableLanguages,
    };
}
