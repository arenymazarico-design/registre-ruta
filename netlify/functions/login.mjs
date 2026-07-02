import { sql, ensure } from './_db.mjs';
import bcrypt from 'bcryptjs';
import { sign, json } from './_auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Mètode no permès' }, 405);
  try {
    await ensure();
    const { userId, name, pin } = await req.json();
    if ((!userId && !name) || !pin) return json({ error: 'Falten dades' }, 400);
    let rows;
    if (userId) rows = await sql`select * from users where id = ${userId}`;
    else rows = await sql`select * from users where lower(name) = lower(${name})`;
    if (rows.length > 1) return json({ error: 'Hi ha diversos usuaris amb aquest nom; contacta amb l\'administrador' }, 409);
    const u = rows[0];
    if (!u) return json({ error: 'Usuari o PIN incorrectes' }, 401);
    let ok = false;
    if (u.pin_plain != null && u.pin_plain !== '') ok = (String(pin) === String(u.pin_plain));
    else ok = await bcrypt.compare(String(pin), u.pin_hash);
    if (!ok) return json({ error: 'Usuari o PIN incorrectes' }, 401);
    return json({ token: sign(u), user: { id: u.id, name: u.name, role: u.role } });
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/login' };
