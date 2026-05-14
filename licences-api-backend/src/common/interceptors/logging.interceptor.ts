import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from '@nestjs/common';
import { type Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest();
		const { method, url } = request;
		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				const response = context.switchToHttp().getResponse();
				const delay = Date.now() - now;
				this.logger.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
			}),
		);
	}
}
