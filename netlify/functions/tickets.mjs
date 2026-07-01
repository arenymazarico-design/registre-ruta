import { sql, ensure } from './_db.mjs';
import { getStore } from '@netlify/blobs';
import { Resend } from 'resend';
import { auth, json, uid } from './_auth.mjs';

const CATS = { dietes: 'Dietes', gastos: 'Gastos', bascules: 'Bàscules', peatges: 'Peatges' };

function photos() { return getStore('ticket-photos'); }

function rowToClient(r) {
  return {
    id: r.id, userId: r.user_id, user: r.user_name, cat: r.cat,
    amount: Number(r.amount), ticket: r.ticket_no || '', place: r.place || '',
    date: (r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10)),
    companions: r.companions || '', notes: r.notes || '',
    photo: r.photo_url || null, accounted: !!r.accounted,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : 0
  };
}

async function sendEmail(rec, cfg) {
  if (!cfg.email || !process.env.RESEND_API_KEY || !rec.photoBase64) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const place = rec.place || CATS[rec.cat] || '';
  const subject = `${rec.userName} - ${rec.date} - ${place}`;
  const filename = subject.replace(/[\/\\:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim() + '.jpg';
  const amount = rec.amount != null ? String(rec.amount).replace('.', ',') : '';
  const body =
    `Tiquet\nUsuari: ${rec.userName}\nData: ${rec.date}\nCategoria: ${CATS[rec.cat] || rec.cat}\n` +
    `Restaurant/Empresa: ${place}\nNúm. tiquet: ${rec.ticket_no || '-'}\nImport: ${amount} €` +
    (rec.cat === 'dietes' && rec.companions ? `\nAcompanyants: ${rec.companions}` : '') +
    (rec.notes ? `\nObservacions: ${rec.notes}` : '');
  await resend.emails.send({
    from: process.env.MAIL_FROM || 'Registre <onboarding@resend.dev>',
    to: cfg.email,
    subject,
    text: body,
    attachments: [{ filename, content: rec.photoBase64 }]
  });
}

export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);

    // GET: llista de tiquets visibles.
    if (req.method === 'GET') {
      const rows = me.role === 'admin'
        ? await sql`select * from tickets order by date desc, created_at desc`
        : await sql`select * from tickets where user_id=${me.uid} order by date desc, created_at desc`;
      return json({ tickets: rows.map(rowToClient) });
    }

    // POST: crear tiquet (+ pujar foto + enviar correu automàtic).
    if (req.method === 'POST') {
      const b = await req.json();
      if (b.amount == null || isNaN(Number(b.amount))) return json({ error: 'Import no vàlid' }, 400);
      const id = uid();
      let photoUrl = null;
      if (b.photoBase64) { await photos().set(id, b.photoBase64); photoUrl = '/api/photo?id=' + id; }
      await sql`insert into tickets (id,user_id,user_name,cat,amount,ticket_no,place,date,companions,notes,photo_url)
        values (${id},${me.uid},${me.name},${b.cat},${Number(b.amount)},${b.ticket_no || ''},${b.place || ''},
        ${b.date},${b.cat === 'dietes' ? (b.companions || '') : ''},${b.notes || ''},${photoUrl})`;

      // enviament automàtic
      const cfg = (await sql`select email from app_config where id=1`)[0] || {};
      let emailed = false;
      if (b.photoBase64 && cfg.email) {
        try {
          await sendEmail({ ...b, userName: me.name }, cfg);
          emailed = true;
        } catch (e) { emailed = false; }
      }
      return json({ ok: true, id, emailed });
    }

    // PUT: actualitzar tiquet (propietari o admin), o marcar/desmarcar comptabilitzat (admin).
    if (req.method === 'PUT') {
      const b = await req.json();
      if (!b.id) return json({ error: 'Falta id' }, 400);
      const cur = (await sql`select * from tickets where id=${b.id}`)[0];
      if (!cur) return json({ error: 'No trobat' }, 404);

      // Marcar/desmarcar com a comptabilitzat (només admin).
      if (typeof b.setAccounted === 'boolean') {
        if (me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
        await sql`update tickets set accounted=${b.setAccounted} where id=${b.id}`;
        return json({ ok: true, id: b.id, accounted: b.setAccounted });
      }

      // Edició normal: bloquejada si està comptabilitzat.
      if (cur.accounted) return json({ error: 'Tiquet comptabilitzat: bloquejat' }, 409);
      if (me.role !== 'admin' && cur.user_id !== me.uid) return json({ error: 'Sense permís' }, 403);
      let photoUrl = cur.photo_url;
      if (b.photoBase64) { await photos().set(b.id, b.photoBase64); photoUrl = '/api/photo?id=' + b.id; }
      await sql`update tickets set cat=${b.cat}, amount=${Number(b.amount)}, ticket_no=${b.ticket_no || ''},
        place=${b.place || ''}, date=${b.date}, companions=${b.cat === 'dietes' ? (b.companions || '') : ''},
        notes=${b.notes || ''}, photo_url=${photoUrl} where id=${b.id}`;
      return json({ ok: true, id: b.id });
    }

    // DELETE: eliminar tiquet (propietari o admin), si no està comptabilitzat.
    if (req.method === 'DELETE') {
      const id = new URL(req.url).searchParams.get('id');
      if (!id) return json({ error: 'Falta id' }, 400);
      const cur = (await sql`select * from tickets where id=${id}`)[0];
      if (!cur) return json({ error: 'No trobat' }, 404);
      if (cur.accounted) return json({ error: 'Tiquet comptabilitzat: no es pot eliminar' }, 409);
      if (me.role !== 'admin' && cur.user_id !== me.uid) return json({ error: 'Sense permís' }, 403);
      try { await photos().delete(id); } catch (e) { /* pot no tenir foto */ }
      await sql`delete from tickets where id=${id}`;
      return json({ ok: true });
    }

    return json({ error: 'Mètode no permès' }, 405);
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/tickets' };
