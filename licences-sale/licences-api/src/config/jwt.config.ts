import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
	secret: process.env.JWT_SECRET || 'change-this-in-production',
	expiresIn: '15m',
	refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
	refreshExpiresIn: '7d',
}));
