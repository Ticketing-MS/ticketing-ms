import { cookies } from 'next/headers';

export async function setUserSession(user: { id: string; role: string }) {
  (await cookies()).set('user', JSON.stringify(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  });
}
