// Autenticació amb token JWT signat amb APP_SECRET.
import jwt from 'jsonwebtoken';

const SECRET = process.env.APP_SECRET || 'canvia-aquest-secret';

export function sign(u) {
  return jwt.sign({ uid: u.id, role: u.role, name: u.name }, SECRET, { expiresIn: '30d' });
}

// Retorna el payload del token (o null) a partir de la capçalera Authorization.
export function auth(req) {
  const h = req.headers.get('authorization') || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  try { return jwt.verify(t, SECRET); } catch (e) { return null; }
}

export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
