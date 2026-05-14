import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// Configure session (use custom cookie name to align with test script)
	app.use(
		session({
			name: 'sessionId',
			secret: configService.get<string>('jwt.secret') || 'session-secret-key',
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				httpOnly: true,
				secure: configService.get<string>('app.nodeEnv') === 'production',
				sameSite: 'lax',
			},
		}),
	);

	// Enable CORS
	app.enableCors({
		origin: configService.get<string>('app.frontendUrl'),
		credentials: true,
	});

	// API prefix
	const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
	app.setGlobalPrefix(apiPrefix);

	// Swagger configuration
	const config = new DocumentBuilder()
		.setTitle('Licences API')
		.setDescription(
			'API REST pour plateforme de vente de licences - Documentation complète avec Swagger UI',
		)
		.setVersion('1.0')
		.addTag('Auth', 'Authentification et gestion des admins')
		.addTag('Categories', 'Gestion des catégories de produits')
		.addTag('Products', 'Gestion des produits et licences')
		.addTag('Cart', "Gestion du panier d'achat")
		.addTag('Orders', 'Gestion des commandes')
		.addTag('Health', 'Health checks')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Entrez le token JWT pour accéder aux routes protégées',
			},
			'JWT-auth',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document, {
		customSiteTitle: 'Licences API - Swagger UI',
		customCss: '.swagger-ui .topbar { display: none }',
		swaggerOptions: {
			persistAuthorization: true,
			docExpansion: 'none',
			filter: true,
			showRequestDuration: true,
		},
	});

	const port = configService.get<number>('app.port') || 3000;
	await app.listen(port);
	console.log(`🚀 Application is running on: http://localhost:${port}/api`);
	console.log(`📚 Swagger UI available at: http://localhost:${port}/api/docs`);
}
bootstrap();
