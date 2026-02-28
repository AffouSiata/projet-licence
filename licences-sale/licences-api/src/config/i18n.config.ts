import { registerAs } from '@nestjs/config';

export default registerAs('i18n', () => ({
	defaultLanguage: process.env.DEFAULT_LANGUAGE || 'fr',
	supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'fr,en').split(','),
}));
