import { sql, ensure } from './_db.mjs';
import { auth, json } from './_auth.mjs';

export default async (req) => {
  try {
    await ensure();
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);

    if (req.method === 'GET') {
      const c = (await sql`select email, color, logo, cif, names from app_config where id=1`)[0] || {};
      return json({ email: c.email || '', color: c.color || '', logo: c.logo || '', cif: c.cif || '', names: c.names || '' });
    }

    if (req.method === 'POST') {
      if (me.role !== 'admin') return json({ error: 'Només administradors' }, 403);
      const { email, color, logo, cif, names } = await req.json();
      await sql`update app_config set email=${email || ''}, color=${color || ''}, logo=${logo || ''}, cif=${cif || ''}, names=${names || ''} where id=1`;
      return json({ ok: true });
    }

    return json({ error: 'Mètode no permès' }, 405);
  } catch (e) {
    return json({ error: 'Error del servidor', detail: String(e) }, 500);
  }
};

export const config = { path: '/api/config' };
