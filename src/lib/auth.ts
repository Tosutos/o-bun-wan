import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from './prisma';

export const COOKIE_NAME = 'obw_token';
const SECRET = process.env.AUTH_SECRET || 'dev-secret';

function sign(id: string): string {
  const mac = createHmac('sha256', SECRET).update(id).digest('hex');
  return `${id}.${mac}`;
}

function verify(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [id, mac] = parts;
  const expected = createHmac('sha256', SECRET).update(id).digest('hex');
  try {
    const a = Buffer.from(mac);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    return id;
  } catch {
    return null;
  }
}

export async function getUserFromCookies() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const id = verify(token);
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export function setAuthCookie(studentId: string) {
  const token = sign(studentId);
  (cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookie() {
  (cookies()).set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/' });
}

// Helpers for Route Handlers to set cookie on response directly
export function createAuthToken(studentId: string): string {
  return sign(studentId);
}

export function authCookieMaxAgeSec(): number {
  return 60 * 60 * 24 * 30; // 30 days
}
