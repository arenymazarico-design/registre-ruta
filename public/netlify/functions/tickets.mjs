import { sql, ensure } from './_db.mjs';
import { getStore } from '@netlify/blobs';
import { Resend } from 'resend';
import { auth, json, uid } from './_auth.mjs';

const CATS = { dietes: 'Dietes', gastos: 'Gastos', bascules: 'Bàscules', peatges: 'Peatges' };

function photos() { return getStore('ticket-photos'); }

function rowToClient(r) {
  return {
    id: r.id, userId: r.user_id, user: r.user_name, cat: r.cat,
    amount: Number(r.amount), ticket: r.ticket_no || '', place: r.place || '', cif: r.cif || '',
    date: (r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10)),
    companions: r.companions || '', notes: r.notes || '',
    litres: r.litres != null ? Number(r.litres) : null, km: r.km != null ? Number(r.km) : null,
    plate: r.plate || '',
    photo: r.photo_url || null, accounted: !!r.accounted,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : 0
  };
}

async function sendEmail(rec, cfg) {
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
  return await resend.emails.send({
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

      // Detecció de duplicats (entre tots els usuaris): mateixa data + proveïdor + número.
      // Si en troba un, es bloqueja el desat.
      {
        const place = (b.place || '').trim();
        const num = (b.ticket_no || '').trim();
        if (place || num) {
          const dups = await sql`select user_name, date, place, ticket_no from tickets
            where date = ${b.date}
            and lower(coalesce(place,'')) = lower(${place})
            and coalesce(ticket_no,'') = ${num}
            limit 1`;
          if (dups.length) {
            const d = dups[0];
            return json({ duplicate: true, of: { user: d.user_name, date: d.date, place: d.place, ticket: d.ticket_no } }, 409);
          }
        }
      }

      const id = uid();
      let photoUrl = null;
      if (b.photoBase64) { await photos().set(id, b.photoBase64); photoUrl = '/api/photo?id=' + id; }
      const litresIn = (b.cat === 'combustible' && b.litres !== '' && b.litres != null && !isNaN(Number(b.litres))) ? Number(b.litres) : null;
      const kmIn = (b.cat === 'combustible' && b.km !== '' && b.km != null && !isNaN(Number(b.km))) ? Number(b.km) : null;
      const au = (await sql`select active_plate from users where id=${me.uid}`)[0] || {};
      const plateIn = (b.plate !== undefined && b.plate !== null) ? String(b.plate).trim().toUpperCase() : (au.active_plate || '').trim().toUpperCase();
      await sql`insert into tickets (id,user_id,user_name,cat,amount,ticket_no,place,cif,date,companions,notes,photo_url,litres,km,plate)
        values (${id},${me.uid},${me.name},${b.cat},${Number(b.amount)},${b.ticket_no || ''},${b.place || ''},${b.cif || ''},
        ${b.date},${b.cat === 'dietes' ? (b.companions || '') : ''},${b.notes || ''},${photoUrl},${litresIn},${kmIn},${plateIn})`;

      // enviament automàtic (amb motiu si no s'envia)
      const cfg = (await sql`select email from app_config where id=1`)[0] || {};
      let emailed = false, emailReason = '';
      if (!b.photoBase64) emailReason = 'sense foto';
      else if (!cfg.email) emailReason = 'sense correu de destinació (posa\'l a Configuració)';
      else if (!process.env.RESEND_API_KEY) emailReason = 'falta RESEND_API_KEY';
      else {
        try {
          const result = await sendEmail({ ...b, userName: me.name }, cfg);
          if (result && result.error) {
            const er = result.error;
            emailReason = 'Resend: ' + String(er.message || er.name || JSON.stringify(er)).slice(0, 140);
          } else { emailed = true; }
        } catch (e) { emailReason = 'error: ' + String(e).slice(0, 140); }
      }
      return json({ ok: true, id, emailed, emailReason });
    }

    // PUT: actualitzar tiquet (propietari o admin), o marcar/desmarcar comptabilitzat (admin).
    if (req.method === 'PUT') {
      const b = await req.json();

      // Validar en bloc (marcar com a validat) diversos tiquets (només admin).
      if (Array.isArray(b.validateIds)) {
        if (me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
        if (b.validateIds.length) await sql`update tickets set accounted = true where id = any(${b.validateIds})`;
        return json({ ok: true, validated: b.validateIds.length });
      }

      if (!b.id) return json({ error: 'Falta id' }, 400);
      const cur = (await sql`select * from tickets where id=${b.id}`)[0];
      if (!cur) return json({ error: 'No trobat' }, 404);

      // Marcar/desmarcar com a validat (només admin).
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
      const litresUp = (b.cat === 'combustible' && b.litres !== '' && b.litres != null && !isNaN(Number(b.litres))) ? Number(b.litres) : null;
      const kmUp = (b.cat === 'combustible' && b.km !== '' && b.km != null && !isNaN(Number(b.km))) ? Number(b.km) : null;
      const plateUp = (b.plate !== undefined && b.plate !== null) ? String(b.plate).trim().toUpperCase() : (cur.plate || '');
      await sql`update tickets set cat=${b.cat}, amount=${Number(b.amount)}, ticket_no=${b.ticket_no || ''},
        place=${b.place || ''}, cif=${b.cif || ''}, date=${b.date}, companions=${b.cat === 'dietes' ? (b.companions || '') : ''},
        notes=${b.notes || ''}, photo_url=${photoUrl}, litres=${litresUp}, km=${kmUp}, plate=${plateUp} where id=${b.id}`;
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
