import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to our IUA Bus Lines',
      description: 'This is description in English',
    },
  },
  vn: {
    translation: 'Chào mừng đến với tuyến xe buýt IUA của chúng tôi',
    description: 'Đây là mô tả bằng tiếng việt',
  },
};

// Cấu ình i18n
i18n
  .use(LanguageDetector) // Phát hiện ngôn ngữ
  .use(initReactI18next) // Tích hợp với React
  .init({
    resources,
    fallbackLng: 'vn', // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false, // React đã xử lý XSS
    },
  });

export default i18n;
