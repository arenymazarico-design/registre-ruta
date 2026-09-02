import { sql, ensure } from './_db.mjs';
import { auth, json } from './_auth.mjs';

export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);

    if (req.method === 'GET') {
      const c = (await sql`select email, color, logo, cif, names, menu_max, blocked_places, announce_msg, announce_id from app_config where id=1`)[0] || {};
      return json({ email: c.email || '', color: c.color || '', logo: c.logo || '', cif: c.cif || '', names: c.names || '', menuMax: c.menu_max != null ? Number(c.menu_max) : 0, blockedPlaces: c.blocked_places || '', announceMsg: c.announce_msg || '', announceId: c.announce_id || '' });
    }

    if (req.method === 'POST') {
      if (me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
      const b = await req.json();
      const { email, color, logo, cif, names, menuMax, blockedPlaces } = b;
      const mx = (menuMax != null && !isNaN(Number(menuMax))) ? Number(menuMax) : 0;
      await sql`update app_config set email=${email || ''}, color=${color || ''}, logo=${logo || ''}, cif=${cif || ''}, names=${names || ''}, menu_max=${mx}, blocked_places=${blockedPlaces || ''} where id=1`;
      // Missatge d'avís per a tots els usuaris: nou id cada cop que canvia (perquè es torni a mostrar).
      if (b.announceMsg !== undefined) {
        const cur = (await sql`select announce_msg from app_config where id=1`)[0] || {};
        const msg = String(b.announceMsg || '').trim();
        if (!msg) {
          await sql`update app_config set announce_msg='', announce_id='' where id=1`;
        } else if (msg !== (cur.announce_msg || '')) {
          const aid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
          await sql`update app_config set announce_msg=${msg}, announce_id=${aid} where id=1`;
        }
      }
      return json({ ok: true });
    }

    return json({ error: 'Mètode no permès' }, 405);
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/config' };
