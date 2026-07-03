import { sql, ensure } from './_db.mjs';
import { auth, json, uid } from './_auth.mjs';

function rowToClient(r) {
  return {
    id: r.id, userId: r.user_id, user: r.user_name, ym: r.ym,
    date: (r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10)),
    km: r.km != null ? Number(r.km) : null
  };
}

export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);

    if (req.method === 'GET') {
      const rows = me.role === 'admin'
        ? await sql`select * from readings order by ym asc`
        : await sql`select * from readings where user_id=${me.uid} order by ym asc`;
      return json({ readings: rows.map(rowToClient) });
    }

    // POST: apuntar/actualitzar la lectura del mes (una per usuari i mes).
    if (req.method === 'POST') {
      const b = await req.json();
      if (b.km == null || isNaN(Number(b.km))) return json({ error: 'Km no vàlids' }, 400);
      const date = b.date || new Date().toISOString().slice(0, 10);
      const ym = date.slice(0, 7);
      const km = Number(b.km);
      const exists = (await sql`select id from readings where user_id=${me.uid} and ym=${ym}`)[0];
      if (exists) {
        await sql`update readings set km=${km}, date=${date} where id=${exists.id}`;
        return json({ ok: true, id: exists.id });
      }
      const id = uid();
      await sql`insert into readings (id,user_id,user_name,ym,date,km) values (${id},${me.uid},${me.name},${ym},${date},${km})`;
      return json({ ok: true, id });
    }

    if (req.method === 'DELETE') {
      const id = new URL(req.url).searchParams.get('id');
      if (!id) return json({ error: 'Falta id' }, 400);
      const cur = (await sql`select * from readings where id=${id}`)[0];
      if (!cur) return json({ error: 'No trobat' }, 404);
      if (me.role !== 'admin' && cur.user_id !== me.uid) return json({ error: 'Sense permís' }, 403);
      await sql`delete from readings where id=${id}`;
      return json({ ok: true });
    }

    return json({ error: 'Mètode no permès' }, 405);
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/readings' };
