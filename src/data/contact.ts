/* Shared contact details. Single source for the quote form, the quote
   dialog and anywhere else that links out; values match the original
   Contact section. */

export const CONTACT_EMAIL = 'abdullahi.haroon.tech@gmail.com';
export const CONTACT_WHATSAPP_DISPLAY = '+234 708 125 8889';
/** Digits only, for wa.me links. */
export const CONTACT_WHATSAPP_NUMBER = '2347081258889';
export const CONTACT_GITHUB_URL = 'https://github.com/yaawaleed-tech';
export const CONTACT_GITHUB_LABEL = 'GitHub: yaawaleed-tech';
export const WHATSAPP_QUOTE_TEXT = 'Hello Karamba, I would like a quote.';
export const WEB3FORMS_SUBJECT = 'New inquiry from karambatechnologies.com';

export const WHATSAPP_QUOTE_URL =
  `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_QUOTE_TEXT)}`;
export const CONTACT_EMAIL_URL = `mailto:${CONTACT_EMAIL}`;
