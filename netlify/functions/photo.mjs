import { getStore } from '@netlify/blobs';

// Serveix la imatge d'un tiquet. La referencien les etiquetes <img>, per això no
// porta token (l'id és aleatori). Per a dades sensibles, vegeu la nota de seguretat al README.
export default async (req) => {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return new Response('Falta id', { status: 400 });
  try {
    const b64 = await getStore('ticket-photos').get(id);
    if (!b64) return new Response('No trobat', { status: 404 });
    const bytes = Buffer.from(b64, 'base64');
    return new Response(bytes, {
      status: 200,
      headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=86400' }
    });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};

export const config = { path: '/api/photo' };
