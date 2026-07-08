# Registre de ruta — app per a Netlify

App instal·lable (PWA) per apuntar **dietes, gastos, bàscules i peatges**:
foto del tiquet → lectura automàtica amb IA → repàs de les dades → en guardar,
la foto s'envia sola al correu configurat. Comptes gestionats per administradors
(pot haver-n'hi més d'un), i panell d'administrador per consultar-ho tot.

## Què fa cada peça
- **Frontend (PWA)**: carpeta `public/`. Instal·lable al mòbil i s'actualitza sola a l'última versió.
- **Funcions** (`netlify/functions/`): l'API (login, usuaris, tiquets, configuració, lectura IA, fotos).
- **Base de dades**: Postgres (Netlify DB o Neon) — usuaris, tiquets i configuració.
- **Fotos**: Netlify Blobs.
- **Correu**: Resend.
- **Lectura del tiquet**: API d'Anthropic (Claude).

---

## Desplegament pas a pas

### 1. Puja el codi a GitHub
Crea un repositori i puja aquesta carpeta. (Fer-ho via GitHub és el que permet que,
cada vegada que canviïs res, Netlify torni a desplegar i l'app agafi l'última versió.)

### 2. Crea el lloc a Netlify
A [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project**,
tria el repositori. Netlify detectarà `netlify.toml` (publish `public`, funcions `netlify/functions`).

### 3. Base de dades (tria'n una)
- **Opció A — Netlify DB (recomanada):** al teu lloc, **Storage → Netlify DB → provision**.
  Injecta `NETLIFY_DATABASE_URL` automàticament. No has de fer res més.
- **Opció B — Neon gratuït:** crea un projecte a [neon.com](https://neon.com), copia la
  *connection string* i posa-la com a variable `DATABASE_URL` (pas 4).

Les taules es creen soles el primer cop que s'usa l'app.

### 4. Variables d'entorn
A **Site configuration → Environment variables**, afegeix (mira també `.env.example`):

| Variable | Valor |
|---|---|
| `APP_SECRET` | una cadena llarga i aleatòria (per signar les sessions) |
| `RESEND_API_KEY` | la clau de [resend.com](https://resend.com) |
| `MAIL_FROM` | remitent, ex. `Registre <tiquets@laseva-empresa.com>` |
| `ANTHROPIC_API_KEY` | la clau d'[Anthropic](https://console.anthropic.com) (per a la lectura IA) |
| `DATABASE_URL` | només si has triat l'opció B (Neon) |

### 5. Desplega
**Deploy**. Quan acabi, obre la URL. La primera pantalla et demanarà crear el **primer administrador**
(nom + PIN). Després, des del menu (a dalt a la dreta) → **Gestionar usuaris** per donar d'alta la gent,
i **Configuració** per posar el correu de destinació, el color i el logo.

### 6. Instal·la-la al mòbil
Obre la URL al mòbil:
- **Android (Chrome):** menú ⋮ → *Afegir a la pantalla d'inici*.
- **iPhone (Safari):** *Compartir* → *Afegir a la pantalla d'inici*.

### 7. Actualitzacions automàtiques
Cada canvi que puges a GitHub redesplega a Netlify. L'app fa servir *network-first*, així que
quan hi ha connexió sempre carrega l'última versió; sense connexió, funciona amb l'última guardada.

---

## Correu: llegeix això
Amb el remitent de proves `onboarding@resend.dev` **només pots enviar al teu propi correu de Resend**.
Per enviar a qualsevol adreça (comptabilitat, gestoria…), a Resend has de **verificar un domini**
i posar el teu remitent a `MAIL_FROM` (ex. `tiquets@laseva-empresa.com`). El pla gratuït fa 3.000 correus/mes.

## Notes de seguretat (és un MVP)
- Els PINs es guarden **xifrats** (bcrypt); tot i així, un PIN de 4 dígits és una barrera pràctica, no forta.
  Per a més seguretat, augmenta la longitud o afegeix contrasenya real.
- Les fotos es serveixen per `/api/photo?id=<id>` amb un id aleatori i **sense token**, perquè es puguin
  mostrar en etiquetes `<img>`. Per a dades sensibles, caldria signar URLs temporals.
- Revisa i prova el flux amb dades de mentida abans de fer-lo servir amb informació real.

## Desenvolupament local (opcional)
```
npm install
npm i -g netlify-cli
netlify dev
```
Posa les variables en un fitxer `.env` (basat en `.env.example`).
