import { sql, ensure } from './_db.mjs';
import bcrypt from 'bcryptjs';
import { auth, json, uid } from './_auth.mjs';

async function makeUser(name, role, pin) {
  const nid = uid();
  const hash = await bcrypt.hash(String(pin), 10);
  await sql`insert into users (id,name,role,pin_hash,pin_plain) values (${nid},${name},${role},${hash},${String(pin)})`;
  return nid;
}

export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    const count = (await sql`select count(*)::int as n from users`)[0].n;

    // GET: sense sessió només retorna el nombre d'usuaris (per saber si cal crear el primer admin).
    // Amb sessió retorna la llista (amb PIN si qui ho demana és administrador).
    if (req.method === 'GET') {
      if (!me) return json({ count });
      function veh(v) { try { return v ? JSON.parse(v) : []; } catch (e) { return []; } }
      if (me.role === 'admin') {
        const rows = await sql`select id, name, role, pin_plain, vehicles, active_plate, main_plate from users order by name asc`;
        return json({ users: rows.map((u) => ({ id: u.id, name: u.name, role: u.role, pin: u.pin_plain || '', vehicles: veh(u.vehicles), activePlate: u.active_plate || '', mainPlate: u.main_plate || '' })) });
      }
      const rows = await sql`select id, name, role, vehicles, active_plate, main_plate from users order by name asc`;
      return json({ users: rows.map((u) => ({ id: u.id, name: u.name, role: u.role, vehicles: veh(u.vehicles), activePlate: u.active_plate || '', mainPlate: u.main_plate || '' })) });
    }

    if (req.method === 'POST') {
      const b = await req.json();

      // Marcar el vehicle habitual (principal).
      if (b.setMainPlate !== undefined) {
        if (!me) return json({ error: 'No autenticat' }, 401);
        const plate = String(b.setMainPlate || '').trim().toUpperCase();
        const cur = (await sql`select vehicles from users where id=${me.uid}`)[0] || {};
        let list = []; try { list = cur.vehicles ? JSON.parse(cur.vehicles) : []; } catch (e) { list = []; }
        if (plate && list.indexOf(plate) < 0) list.push(plate);
        await sql`update users set main_plate=${plate}, vehicles=${JSON.stringify(list)} where id=${me.uid}`;
        return json({ ok: true });
      }

      // Activar un vehicle (matrícula activa). L'afegeix a la llista si no hi és.
      if (b.setActivePlate !== undefined) {
        if (!me) return json({ error: 'No autenticat' }, 401);
        const plate = String(b.setActivePlate || '').trim().toUpperCase();
        const cur = (await sql`select vehicles from users where id=${me.uid}`)[0] || {};
        let list = []; try { list = cur.vehicles ? JSON.parse(cur.vehicles) : []; } catch (e) { list = []; }
        if (plate && list.indexOf(plate) < 0) list.push(plate);
        await sql`update users set active_plate=${plate}, vehicles=${JSON.stringify(list)} where id=${me.uid}`;
        return json({ ok: true });
      }

      // Afegir/treure vehicles (matrícules). L'usuari els seus; l'admin els de qualsevol.
      if (Array.isArray(b.setVehicles)) {
        if (!me) return json({ error: 'No autenticat' }, 401);
        const targetId = (b.id && me.role === 'admin') ? b.id : me.uid;
        const clean = b.setVehicles.map(function (x) { return String(x).trim().toUpperCase(); }).filter(Boolean);
        await sql`update users set vehicles=${JSON.stringify(clean)} where id=${targetId}`;
        return json({ ok: true });
      }

      // Canvi de la pròpia contrasenya (qualsevol usuari amb sessió).
      if (b.changePin) {
        if (!me) return json({ error: 'No autenticat' }, 401);
        if (!/^\d{4}$/.test(String(b.newPin || ''))) return json({ error: 'El PIN nou ha de tenir 4 dígits' }, 400);
        const cur = (await sql`select * from users where id=${me.uid}`)[0];
        if (!cur) return json({ error: 'Usuari no trobat' }, 404);
        let ok = (cur.pin_plain != null && cur.pin_plain !== '') ? (String(b.oldPin) === String(cur.pin_plain)) : await bcrypt.compare(String(b.oldPin || ''), cur.pin_hash);
        if (!ok) return json({ error: 'La contrasenya actual no és correcta' }, 403);
        const hash = await bcrypt.hash(String(b.newPin), 10);
        await sql`update users set pin_hash=${hash}, pin_plain=${String(b.newPin)} where id=${me.uid}`;
        return json({ ok: true });
      }

      // Importació massiva des d'Excel (admin).
      if (Array.isArray(b.bulk)) {
        if (!me || me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
        let created = 0, skipped = 0;
        for (const row of b.bulk) {
          const name = (row.name || '').trim();
          const pin = String(row.pin || '').trim();
          const role = (row.role === 'admin') ? 'admin' : 'user';
          if (!name || !/^\d{4}$/.test(pin)) { skipped++; continue; }
          const exists = (await sql`select 1 from users where lower(name)=lower(${name})`)[0];
          if (exists) { skipped++; continue; }
          await makeUser(name, role, pin);
          created++;
        }
        return json({ ok: true, created, skipped });
      }

      // Alta o edició d'un usuari.
      const isBootstrap = count === 0;
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
        if (b.pin) {
          if (!/^\d{4}$/.test(String(b.pin))) return json({ error: 'El PIN ha de tenir 4 dígits' }, 400);
          const hash = await bcrypt.hash(String(b.pin), 10);
          await sql`update users set name=${b.name}, role=${finalRole}, pin_hash=${hash}, pin_plain=${String(b.pin)} where id=${b.id}`;
        } else {
          await sql`update users set name=${b.name}, role=${finalRole} where id=${b.id}`;
        }
        await sql`update tickets set user_name=${b.name} where user_id=${b.id}`;
        return json({ ok: true, id: b.id });
      } else {
        if (!/^\d{4}$/.test(String(b.pin || ''))) return json({ error: 'El PIN ha de tenir 4 dígits' }, 400);
        const nid = await makeUser(b.name, finalRole, b.pin);
        return json({ ok: true, id: nid });
      }
    }

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
