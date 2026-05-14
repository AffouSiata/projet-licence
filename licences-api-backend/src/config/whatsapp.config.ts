import { registerAs } from '@nestjs/config';

export default registerAs('whatsapp', () => ({
	phoneNumber: process.env.WHATSAPP_PHONE_NUMBER || '+33612345678',
	businessApi: process.env.WHATSAPP_BUSINESS_API || 'https://wa.me',
}));
