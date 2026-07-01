import { auth, json } from './_auth.mjs';

const PROMPT =
  "Estàs llegint la foto d'un tiquet o rebut (probablement en català o castellà). " +
  "Respon NOMÉS amb un objecte JSON, sense text ni marques de codi, amb aquestes claus: " +
  '{"date":"YYYY-MM-DD" o null,"ticket_number":string o null,"amount":number (total a pagar, decimal amb punt) o null,' +
  '"business_name":string o null,"category":un de "dietes","gastos","bascules","peatges" o null}. ' +
  "Dates en format dia/mes/any i decimals amb coma. Retorna com a amount el TOTAL final. " +
  "Restaurant o bar => dietes; peatge d'autopista => peatges; pesatge/bàscula => bascules; altrament gastos. Si no pots llegir un camp, null.";

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Mètode no permès' }, 405);
  try {
    const me = auth(req);
    if (!me) return json({ error: 'No autenticat' }, 401);
    if (!process.env.ANTHROPIC_API_KEY) return json({ parsed: null, reason: 'no-key' });

    const { imageBase64, mediaType } = await req.json();
    if (!imageBase64) return json({ error: 'Falta la imatge' }, 400);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: PROMPT }
          ]
        }]
      })
    });
    if (!r.ok) {
      let detail = '';
      try { const err = await r.json(); detail = (err && err.error && (err.error.message || err.error.type)) || ''; } catch (e) { }
      return json({ parsed: null, reason: 'api-' + r.status + (detail ? ': ' + String(detail).slice(0, 80) : '') });
    }
    const data = await r.json();
    let text = (data.content || []).filter((x) => x.type === 'text').map((x) => x.text).join('').trim();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const s = text.indexOf('{'), e = text.lastIndexOf('}');
    if (s >= 0 && e >= 0) text = text.slice(s, e + 1);
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (err) { parsed = null; }
    return json({ parsed });
  } catch (e) {
    return json({ parsed: null, reason: String(e) });
  }
};

export const config = { path: '/api/extract' };
