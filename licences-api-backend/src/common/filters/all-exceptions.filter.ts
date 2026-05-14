import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';
		let errors: unknown;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'object') {
				message =
					(exceptionResponse as { message?: string }).message || message;
				errors = (exceptionResponse as { errors?: unknown }).errors;
			} else {
				message = exceptionResponse;
			}
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		this.logger.error(
			`${request.method} ${request.url} - Status: ${status} - ${message}`,
			exception instanceof Error ? exception.stack : '',
		);

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
			errors: errors || undefined,
		});
	}
}
