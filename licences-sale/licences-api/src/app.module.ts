import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import i18nConfig from './config/i18n.config';
import jwtConfig from './config/jwt.config';
import whatsappConfig from './config/whatsapp.config';
import { HealthModule } from './health/health.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';

@Module({
	imports: [
		// Configuration globale
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			load: [appConfig, databaseConfig, jwtConfig, whatsappConfig, i18nConfig],
		}),

		// i18n
		I18nModule.forRoot({
			fallbackLanguage: 'fr',
			loaderOptions: {
				path: path.join(__dirname, '../i18n/'),
				watch: true,
			},
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				new HeaderResolver(['x-lang']),
				AcceptLanguageResolver,
			],
		}), // Prisma with custom adapter
		PrismaModule,

		// Upload module (global)
		UploadModule,

		// Feature modules
		HealthModule,
		AuthModule,
		CategoriesModule,
		ProductsModule,
		CartModule,
		OrdersModule,
	],
	controllers: [],
	providers: [
		// Global Zod validation pipe
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		// Global exception filter
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		// Global logging interceptor
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {}
