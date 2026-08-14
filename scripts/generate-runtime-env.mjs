/**
 * Writes public/runtime-env.js so Vercel/production gets Supabase config at build time.
 * Sources: process.env (Vercel) → .env.local → .env
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'runtime-env.js');

const KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_UPI_ID',
  'VITE_UPI_PAYEE_NAME',
  'VITE_WHATSAPP_NUMBER',
  'VITE_CONTACT_EMAIL',
  'VITE_CONTACT_PHONE',
  'VITE_CONTACT_ADDRESS',
  'VITE_GOOGLE_MAPS_URL',
  'VITE_GOOGLE_MAPS_EMBED',
];

const ALIASES = {
  VITE_SUPABASE_URL: ['SUPABASE_URL'],
  VITE_SUPABASE_ANON_KEY: ['SUPABASE_ANON_KEY', 'SUPABASE_KEY'],
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function pick(key, files, env) {
  for (const alias of [key, ...(ALIASES[key] ?? [])]) {
    if (env[alias]?.trim()) return env[alias].trim();
  }
  for (const file of files) {
    for (const alias of [key, ...(ALIASES[key] ?? [])]) {
      if (file[alias]?.trim()) return file[alias].trim();
    }
  }
  return '';
}

function readExistingRuntime() {
  if (!fs.existsSync(OUT)) return {};
  try {
    const raw = fs.readFileSync(OUT, 'utf8');
    const match = raw.match(/__RUNTIME_ENV__\s*=\s*(\{[\s\S]*\});/);
    return match ? JSON.parse(match[1]) : {};
  } catch {
    return {};
  }
}

const existing = readExistingRuntime();
const fileEnv = {
  ...parseEnvFile(path.join(ROOT, '.env')),
  ...parseEnvFile(path.join(ROOT, '.env.local')),
  ...parseEnvFile(path.join(ROOT, '.env.production')),
};

const runtime = {};
for (const key of KEYS) {
  const picked = pick(key, [fileEnv], process.env);
  runtime[key] = picked || existing[key] || '';
}

const body = `window.__RUNTIME_ENV__ = ${JSON.stringify(runtime, null, 2)};\n`;
fs.writeFileSync(OUT, body);

const INDEX = path.join(ROOT, 'index.html');
if (fs.existsSync(INDEX)) {
  const inline = `window.__RUNTIME_ENV__ = ${JSON.stringify(runtime)};`;
  let html = fs.readFileSync(INDEX, 'utf8');
  if (html.includes('id="lakhe-runtime-env"')) {
    html = html.replace(
      /<script id="lakhe-runtime-env">[\s\S]*?<\/script>/,
      `<script id="lakhe-runtime-env">${inline}</script>`
    );
    fs.writeFileSync(INDEX, html);
  }
}

const hasUrl = !!runtime.VITE_SUPABASE_URL;
const anonKey = runtime.VITE_SUPABASE_ANON_KEY ?? '';
const hasJwtAnon = anonKey.startsWith('eyJ');
if (hasUrl && anonKey && !hasJwtAnon) {
  console.warn(
    '[runtime-env] VITE_SUPABASE_ANON_KEY must be the JWT anon key (eyJ…), not sb_publishable_* — app will use demo catalog until fixed.'
  );
}
console.log(
  hasUrl && hasJwtAnon
    ? '[runtime-env] Supabase configured for production build.'
    : '[runtime-env] Demo mode on deploy (missing or invalid Supabase anon key).'
);
