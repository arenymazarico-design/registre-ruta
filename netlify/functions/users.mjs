import { sql, ensure } from './_db.mjs';
import bcrypt from 'bcryptjs';
import { auth, json, uid } from './_auth.mjs';

export default async (req) => {
  try {
    await ensure();

    // GET: llista pública (id, nom, rol) per a la pantalla d'inici de sessió.
    if (req.method === 'GET') {
      const rows = await sql`select id, name, role from users order by name asc`;
      return json({ users: rows });
    }

    const count = (await sql`select count(*)::int as n from users`)[0].n;
    const me = auth(req);

    // POST: crear o actualitzar.
    if (req.method === 'POST') {
      const b = await req.json();
      const isBootstrap = count === 0; // primer administrador, sense sessió
      if (!isBootstrap && (!me || me.role !== 'admin')) return json({ error: 'Només administradors' }, 403);
      if (!b.name) return json({ error: 'Falta el nom' }, 400);
      const finalRole = isBootstrap ? 'admin' : (b.role === 'admin' ? 'admin' : 'user');

      if (b.id) {
        const cur = (await sql`select * from users where id = ${b.id}`)[0];
        if (!cur) return json({ error: 'Usuari no trobat' }, 404);
        if (cur.role === 'admin' && finalRole !== 'admin') {
          const admins = (await sql`select count(*)::int as n from users where role='admin'`)[0].n;
          if (admins <= 1) return json({ error: "Ha d'existir com a mínim un administrador" }, 400);
        }
        const hash = b.pin ? await bcrypt.hash(String(b.pin), 10) : cur.pin_hash;
        await sql`update users set name=${b.name}, role=${finalRole}, pin_hash=${hash} where id=${b.id}`;
        await sql`update tickets set user_name=${b.name} where user_id=${b.id}`;
        return json({ ok: true, id: b.id });
      } else {
        if (!/^\d{4}$/.test(String(b.pin || ''))) return json({ error: 'El PIN ha de tenir 4 dígits' }, 400);
        const nid = uid();
        const hash = await bcrypt.hash(String(b.pin), 10);
        await sql`insert into users (id,name,role,pin_hash) values (${nid},${b.name},${finalRole},${hash})`;
        return json({ ok: true, id: nid });
      }
    }

    // DELETE: eliminar (admin).
    if (req.method === 'DELETE') {
      if (!me || me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
      const id = new URL(req.url).searchParams.get('id');
      if (!id) return json({ error: 'Falta id' }, 400);
      const cur = (await sql`select * from users where id=${id}`)[0];
      if (!cur) return json({ error: 'No trobat' }, 404);
      if (cur.role === 'admin') {
        const admins = (await sql`select count(*)::int as n from users where role='admin'`)[0].n;
        if (admins <= 1) return json({ error: "No pots eliminar l'únic administrador" }, 400);
      }
      await sql`delete from users where id=${id}`;
      return json({ ok: true });
    }

    return json({ error: 'Mètode no permès' }, 405);
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/users' };
