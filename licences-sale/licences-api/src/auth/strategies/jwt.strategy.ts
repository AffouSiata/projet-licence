import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwt.secret') || 'default-secret',
		});
	}

	async validate(payload: { sub: string; email: string; role: string }) {
		const admin = await this.authService.validateAdmin(payload.sub);

		if (!admin) {
			throw new UnauthorizedException();
		}

		return admin;
	}
}
