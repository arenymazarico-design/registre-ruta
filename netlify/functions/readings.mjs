import { sql, ensure } from './_db.mjs';
import { auth, json, uid } from './_auth.mjs';

function rowToClient(r) {
  return {
    id: r.id, userId: r.user_id, user: r.user_name, ym: r.ym, plate: r.plate || '',
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

    // POST: apuntar/actualitzar la lectura del mes (una per usuari, matrícula i mes).
    if (req.method === 'POST') {
      const b = await req.json();
      if (b.km == null || isNaN(Number(b.km))) return json({ error: 'Km no vàlids' }, 400);
      const km = Number(b.km);

      // Edició d'una lectura concreta per id (pròpia o admin).
      if (b.id) {
        const cur = (await sql`select * from readings where id=${b.id}`)[0];
        if (!cur) return json({ error: 'No trobat' }, 404);
        if (me.role !== 'admin' && cur.user_id !== me.uid) return json({ error: 'Sense permís' }, 403);
        const date = b.date || (cur.date instanceof Date ? cur.date.toISOString().slice(0, 10) : String(cur.date).slice(0, 10));
        const ym = date.slice(0, 7);
        const plate = (me.role === 'admin' && b.plate != null) ? String(b.plate).trim().toUpperCase() : (cur.plate || '');
        const clash = (await sql`select id from readings where user_id=${cur.user_id} and ym=${ym} and coalesce(plate,'')=${plate} and id<>${b.id}`)[0];
        if (clash) return json({ error: 'Ja hi ha una lectura d\'aquesta matrícula per aquest mes.' }, 409);
        await sql`update readings set km=${km}, date=${date}, ym=${ym}, plate=${plate} where id=${b.id}`;
        return json({ ok: true, id: b.id });
      }

      const date = b.date || new Date().toISOString().slice(0, 10);
      const ym = date.slice(0, 7);
      let targetUid = me.uid, targetName = me.name, targetActive = '';
      if (b.forUserId && me.role === 'admin') {
        const tu = (await sql`select id, name, active_plate from users where id=${b.forUserId}`)[0];
        if (tu) { targetUid = tu.id; targetName = tu.name; targetActive = tu.active_plate || ''; }
      } else {
        const u = (await sql`select active_plate from users where id=${me.uid}`)[0] || {};
        targetActive = u.active_plate || '';
      }
      const plate = (b.plate != null ? String(b.plate) : targetActive).trim().toUpperCase();
      const exists = (await sql`select id from readings where user_id=${targetUid} and ym=${ym} and coalesce(plate,'')=${plate}`)[0];
      if (exists) {
        await sql`update readings set km=${km}, date=${date} where id=${exists.id}`;
        return json({ ok: true, id: exists.id });
      }
      const id = uid();
      await sql`insert into readings (id,user_id,user_name,ym,date,km,plate) values (${id},${targetUid},${targetName},${ym},${date},${km},${plate})`;
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
