import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
	port: Number.parseInt(process.env.PORT || '3000', 10),
	apiPrefix: process.env.API_PREFIX || 'api',
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
	nodeEnv: process.env.NODE_ENV || 'development',
}));
