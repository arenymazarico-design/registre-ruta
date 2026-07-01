import { sql, ensure } from './_db.mjs';
import bcrypt from 'bcryptjs';
import { sign, json } from './_auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Mètode no permès' }, 405);
  try {
    await ensure();
    const { userId, pin } = await req.json();
    if (!userId || !pin) return json({ error: 'Falten dades' }, 400);
    const rows = await sql`select * from users where id = ${userId}`;
    const u = rows[0];
    if (!u) return json({ error: 'Usuari no trobat' }, 401);
    const ok = await bcrypt.compare(String(pin), u.pin_hash);
    if (!ok) return json({ error: 'PIN incorrecte' }, 401);
    return json({ token: sign(u), user: { id: u.id, name: u.name, role: u.role } });
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/login' };
