import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {},
});

const loadedLanguages: string[] = [];

const languageFiles = import.meta.glob('./*.ts');

const loadLanguageAsync = async (lang: string): Promise<void> => {
  const globalI18n = i18n.global as any;

  if (globalI18n.locale.value === lang && loadedLanguages.includes(lang)) {
    return;
  }

  if (loadedLanguages.includes(lang)) {
    globalI18n.locale.value = lang;
    return;
  }

  const fileMap: Record<string, string> = {
    'zh-CN': './zh-CN.ts',
    'en-US': './en-US.ts',
  };

  const filePath = fileMap[lang];
  if (!filePath) {
    console.warn(`Language ${lang} not supported`);
    return;
  }

  try {
    const module = await languageFiles[filePath]();
    const messages = (module as any).default;

    globalI18n.setLocaleMessage(lang, messages);
    loadedLanguages.push(lang);
    globalI18n.locale.value = lang;
    localStorage.setItem('locale', lang);

    document.documentElement.lang = lang;
  } catch (error) {
    console.error(`Failed to load language ${lang}:`, error);
  }
};

const setI18nLanguage = (lang: string): void => {
  loadLanguageAsync(lang);
};

const initI18n = async (): Promise<void> => {
  const savedLocale = localStorage.getItem('locale') || 'zh-CN';
  await loadLanguageAsync(savedLocale);
};

export default i18n;
export { loadLanguageAsync, setI18nLanguage, initI18n };
