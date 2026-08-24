import { sql, ensure } from './_db.mjs';
import { auth, json } from './_auth.mjs';

// Estat del sistema: comptadors de dades, mida de la base de dades i de les fotos.
export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);
    if (me.role !== 'admin') return json({ error: 'Només administradors' }, 403);

    const n = async (q) => Number((await q)[0].c);
    const users = await n(sql`select count(*)::int c from users`);
    const tickets = await n(sql`select count(*)::int c from tickets`);
    const withPhoto = await n(sql`select count(*)::int c from tickets where coalesce(photo_url,'')<>''`);
    const readings = await n(sql`select count(*)::int c from readings`);

    const byCatRows = await sql`select cat, count(*)::int c, coalesce(sum(amount),0)::float s from tickets group by cat`;
    const byCat = byCatRows.map((r) => ({ cat: r.cat, count: Number(r.c), sum: Number(r.s) }));

    let dbBytes = 0;
    try { dbBytes = Number((await sql`select pg_database_size(current_database()) c`)[0].c); } catch (e) { dbBytes = 0; }

    const known = Number((await sql`select coalesce(sum(photo_bytes),0)::bigint c from tickets`)[0].c);
    const kn = await n(sql`select count(*)::int c from tickets where photo_bytes is not null and coalesce(photo_url,'')<>''`);
    const un = await n(sql`select count(*)::int c from tickets where photo_bytes is null and coalesce(photo_url,'')<>''`);
    const avg = kn > 0 ? known / kn : 200000; // mitjana de bytes per foto (o 200 KB per defecte)
    const photoBytes = known + Math.round(un * avg);

    return json({
      users, tickets, withPhoto, readings, byCat,
      dbBytes, dbLimitBytes: 512 * 1024 * 1024, // Neon capa gratuïta ~0,5 GB (orientatiu)
      photoBytes, photosExact: un === 0, photosUnknown: un
    });
  } catch (e) {
    return json({ error: String((e && e.message) || e) }, 500);
  }
};

export const config = { path: '/api/status' };
