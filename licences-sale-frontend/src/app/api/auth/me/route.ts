import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth_token')?.value;

	if (!token) {
		return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		const user = await response.json();
		return NextResponse.json(user);
	} catch {
		return NextResponse.json(
			{ error: 'Erreur de connexion au serveur' },
			{ status: 500 }
		);
	}
}
