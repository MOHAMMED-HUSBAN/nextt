
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '123456');

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    throw new Error('Token verification failed');
  }
}

export async function getUser(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  try {
    const verified = await verifyToken(token);
    return verified;
  } catch (err) {
    return null;
  }
}