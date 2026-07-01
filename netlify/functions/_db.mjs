// Connexió a Postgres. Funciona amb Netlify DB (variable NETLIFY_DATABASE_URL,
// injectada automàticament) o amb una base de dades Neon pròpia (DATABASE_URL).
import { neon } from '@neondatabase/serverless';

const url = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
export const sql = neon(url);

let ensured = false;
// Crea les taules si no existeixen (idempotent).
export async function ensure() {
  if (ensured) return;
  await sql`create table if not exists users (
    id text primary key,
    name text not null,
    role text not null default 'user',
    pin_hash text not null,
    created_at timestamptz default now()
  )`;
  await sql`create table if not exists tickets (
    id text primary key,
    user_id text,
    user_name text,
    cat text not null,
    amount numeric(10,2) not null,
    ticket_no text,
    place text,
    date date not null,
    companions text,
    notes text,
    photo_url text,
    created_at timestamptz default now()
  )`;
  await sql`alter table tickets add column if not exists accounted boolean default false`;
  await sql`create table if not exists app_config (
    id int primary key default 1,
    email text default '',
    color text default '',
    logo text default ''
  )`;
  await sql`insert into app_config (id) values (1) on conflict (id) do nothing`;
  ensured = true;
}
