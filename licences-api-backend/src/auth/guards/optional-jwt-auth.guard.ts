import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Variante de JwtAuthGuard qui n'échoue pas si le token est absent ou invalide.
 * Quand un token valide est présent, `req.user` est défini ; sinon `req.user` est null.
 * Utile pour des endpoints "guest-friendly" qui veulent lier la ressource à un user
 * connecté quand c'est possible, sans bloquer les visiteurs anonymes.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
	handleRequest<TUser>(_err: unknown, user: TUser | false): TUser | null {
		return user || null;
	}
}
