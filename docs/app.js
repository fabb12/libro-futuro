/* =========================================================================
 * Libro Futuro — PWA reader/editor per il libro LaTeX su GitHub
 * ========================================================================= */
'use strict';

/* ---------------- Config & stato ---------------- */
const LS = {
  repo: 'lf.repo', branch: 'lf.branch', token: 'lf.token',
  titles: 'lf.titles', lastPath: 'lf.lastPath', fileCache: 'lf.file:',
  fbProject: 'lf.fbProject', fbKey: 'lf.fbKey',
  noteAuthor: 'lf.noteAuthor', myNotes: 'lf.myNotes', notesCache: 'lf.notes:',
  theme: 'lf.theme', fontSize: 'lf.fontSize', fontFamily: 'lf.fontFamily',
  bookmark: 'lf.bookmark'
};

/* ---------------- localStorage: cache auto-pulente ----------------
 * Le copie locali dei capitoli (lf.file:*) e delle note (lf.notes:*)
 * possono saturare la quota (~5 MB) e far fallire anche le scritture
 * piccole (es. lf.titles). Rimedi:
 *  - purgeLocalCache() elimina solo le chiavi di cache, mai config/token;
 *  - lsSet() riprova la scrittura dopo una pulizia se la quota è piena;
 *  - una pulizia una-tantum all'avvio libera lo spazio già saturo. */
function purgeLocalCache() {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith(LS.fileCache) || k.startsWith(LS.notesCache)) {
      try { localStorage.removeItem(k); } catch (e) {}
    }
  }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) {
    try { purgeLocalCache(); localStorage.setItem(key, value); return true; }
    catch (e2) { return false; }
  }
}
try {
  if (!localStorage.getItem('lf.cachePurged.v1')) {
    purgeLocalCache();
    localStorage.setItem('lf.cachePurged.v1', '1');
  }
} catch (e) {}

const state = {
  repo: localStorage.getItem(LS.repo) || 'fabb12/libro-futuro',
  branch: localStorage.getItem(LS.branch) || 'main',
  token: localStorage.getItem(LS.token) || '',
  toc: [],            // [{path, title, part, editorOnly}]
  current: null,      // entry corrente
  fileSha: null,      // sha del file aperto
  fileText: '',       // testo remoto del file aperto
  dirty: false,
  notes: [],          // footnotes del capitolo corrente
  imagesIndex: null,  // {name -> {sha,size}}
  imgUrls: {},        // sha -> objectURL
  meta: null,         // {title, subtitleA, subtitleB, author} da main.tex
  titles: JSON.parse(localStorage.getItem(LS.titles) || '{}'),
  chapterNotes: [],   // note del capitolo corrente
  pendingAnchor: null,// selezione in attesa di diventare nota
  readScroll: 0,      // scroll salvato della lettura (per non perdere il punto)
  editScroll: 0       // scroll salvato dell'editor
};

/* ---------------- Helpers DOM ---------------- */
const $ = id => document.getElementById(id);
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
let toastTimer = null;
function toast(msg, isErr) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.toggle('err', !!isErr);
  show(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => hide(t), 3500);
}
function loading(on, msg) {
  if (msg) $('loading-msg').textContent = msg;
  on ? show($('loading')) : hide($('loading'));
}

/* ---------------- GitHub API ---------------- */
const API = 'https://api.github.com';
function ghHeaders() {
  const h = { 'Accept': 'application/vnd.github+json' };
  if (state.token) h['Authorization'] = 'Bearer ' + state.token;
  return h;
}
async function ghJson(url, opts) {
  const res = await fetch(url, Object.assign({ headers: ghHeaders() }, opts));
  if (!res.ok) {
    let msg = res.status + ' ' + res.statusText;
    try { msg += ': ' + (await res.json()).message; } catch (e) {}
    const err = new Error(msg); err.status = res.status; throw err;
  }
  return res.json();
}
function b64ToText(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}
function bytesToB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000)
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function textToB64(text) {
  return bytesToB64(new TextEncoder().encode(text));
}
async function ghGetFile(path) {
  try {
    const j = await ghJson(`${API}/repos/${state.repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${state.branch}`);
    const text = b64ToText(j.content);
    lsSet(LS.fileCache + path, JSON.stringify({ sha: j.sha, text }));
    return { text, sha: j.sha };
  } catch (err) {
    // offline / errore: prova la copia locale
    const cached = localStorage.getItem(LS.fileCache + path);
    if (cached) {
      toast('Offline: mostro l’ultima copia locale di ' + path, true);
      const c = JSON.parse(cached);
      return { text: c.text, sha: c.sha, fromCache: true };
    }
    throw err;
  }
}
async function ghPutFile(path, text, sha, message) {
  return ghPutB64(path, textToB64(text), sha, message);
}
async function ghPutB64(path, contentB64, sha, message) {
  return ghJson(`${API}/repos/${state.repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: contentB64, sha, branch: state.branch })
  });
}

/* ---------------- Generazione PDF (GitHub Actions) ---------------- */
const PDF_WORKFLOW = 'build-pdf.yml';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Avvia il workflow (POST che restituisce 204 senza corpo)
async function ghDispatchWorkflow(mode) {
  const url = `${API}/repos/${state.repo}/actions/workflows/${PDF_WORKFLOW}/dispatches`;
  const res = await fetch(url, {
    method: 'POST',
    headers: Object.assign(ghHeaders(), { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ ref: state.branch, inputs: { mode } })
  });
  if (!res.ok) {
    let msg = res.status + ' ' + res.statusText;
    try { msg += ': ' + (await res.json()).message; } catch (e) {}
    const err = new Error(msg); err.status = res.status; throw err;
  }
}

// Trova il run appena avviato (creato dopo `since`), ritentando finché appare.
// Gli errori di rete passeggeri non interrompono la ricerca: si riprova.
async function ghFindNewRun(since) {
  const url = `${API}/repos/${state.repo}/actions/workflows/${PDF_WORKFLOW}/runs?event=workflow_dispatch&per_page=10`;
  for (let i = 0; i < 20; i++) {
    try {
      const j = await ghJson(url);
      const run = (j.workflow_runs || [])
        .filter(r => new Date(r.created_at).getTime() >= since - 15000)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      if (run) return run;
    } catch (e) { /* rete assente per un momento: nuovo tentativo tra poco */ }
    await sleep(3000);
  }
  return null;
}

// URL diretto del PDF pubblicato dal workflow sulla release "pdf-<modalità>":
// punta sempre all'ultima versione generata, senza zip né tab Actions.
function pdfDirectUrl(mode) {
  return `https://github.com/${state.repo}/releases/download/pdf-${mode}/libro-${mode}.pdf`;
}

// Fa partire il download del PDF senza cambiare pagina (GitHub risponde
// con Content-Disposition: attachment, quindi il browser salva il file).
function pdfTriggerDownload(mode) {
  const a = document.createElement('a');
  a.href = pdfDirectUrl(mode);
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 2000);
}

// Mostra nel popup i link agli ultimi PDF già generati (finale e bozza),
// con la data dell'ultima compilazione, così si recuperano in un click
// anche senza rilanciare la generazione.
async function pdfShowLast() {
  const box = $('pdf-last');
  box.className = 'hidden';
  box.innerHTML = '';
  const rows = await Promise.all(['finale', 'bozza'].map(async mode => {
    try {
      const rel = await ghJson(`${API}/repos/${state.repo}/releases/tags/pdf-${mode}`, { cache: 'no-store' });
      const asset = (rel.assets || []).find(a => /\.pdf$/i.test(a.name));
      if (!asset) return null;
      const when = new Date(asset.updated_at).toLocaleDateString('it-IT',
        { day: 'numeric', month: 'short', year: 'numeric' });
      return `<a class="secondary" href="${pdfDirectUrl(mode)}" rel="noopener">⬇️ Ultimo PDF ${mode} (${when})</a>`;
    } catch (e) { return null; } // nessun PDF ancora pubblicato per questa modalità
  }));
  const items = rows.filter(Boolean);
  if (items.length) {
    box.innerHTML = '<div class="pdf-last-label">PDF già generati:</div>' + items.join('');
    box.className = '';
  }
}

function pdfSetStatus(msg, cls, spinning) {
  const el = $('pdf-status');
  el.className = cls || '';
  el.innerHTML = (spinning ? '<span class="mini-spin"></span>' : '') +
    '<span>' + escHtml(msg) + '</span>';
}

function closePdfPopup() { hide($('pdf-popup')); hide($('note-backdrop')); }

async function runPdfGeneration() {
  if (!state.token) {
    pdfSetStatus('Serve il token GitHub per avviare la generazione. Aprilo da “Impostazioni / esci”.', 'err');
    return;
  }
  const mode = $('pdf-mode').value;
  const startBtn = $('pdf-start');
  startBtn.disabled = true;
  $('pdf-links').className = 'hidden';
  $('pdf-links').innerHTML = '';
  let dispatched = false; // la compilazione è partita su GitHub?

  try {
    const since = Date.now();
    pdfSetStatus('Avvio della compilazione…', '', true);
    await ghDispatchWorkflow(mode);
    dispatched = true;

    pdfSetStatus('Compilazione avviata, cerco il processo…', '', true);
    const run = await ghFindNewRun(since);
    if (!run) {
      pdfSetStatus('Avviata, ma non riesco a seguirne lo stato. Controlla il tab Actions su GitHub.', 'err');
      startBtn.disabled = false;
      return;
    }

    // Segui lo stato fino al completamento (max ~15 min). Un errore di rete
    // isolato (schermo bloccato, cambio Wi-Fi/4G, connessione instabile) non
    // deve interrompere il monitoraggio: si riprova al giro successivo, e si
    // rinuncia solo dopo molti errori consecutivi.
    let current = run;
    let netErrors = 0;
    for (let i = 0; i < 150; i++) {
      const label = current.status === 'queued' ? 'In coda…'
                  : current.status === 'in_progress' ? 'Compilazione in corso…'
                  : 'Completamento…';
      pdfSetStatus(label + ' (il libro è lungo, servono alcuni minuti)', '', true);
      if (current.status === 'completed') break;
      await sleep(6000);
      try {
        current = await ghJson(`${API}/repos/${state.repo}/actions/runs/${current.id}`, { cache: 'no-store' });
        netErrors = 0;
      } catch (e) {
        netErrors++;
        if (netErrors >= 10) throw e; // ~1 minuto senza rete: mostra i link di ripiego
      }
    }

    const runUrl = current.html_url;
    if (current.conclusion === 'success') {
      pdfSetStatus('✓ PDF pronto: il download parte da solo. Se non parte, usa il pulsante qui sotto.', 'ok');
      $('pdf-links').innerHTML =
        `<a href="${pdfDirectUrl(mode)}" rel="noopener">⬇️ Scarica il PDF (${mode})</a>` +
        `<a class="secondary" href="${runUrl}" target="_blank" rel="noopener">Dettagli del processo</a>`;
      show($('pdf-links'));
      pdfTriggerDownload(mode);
      pdfShowLast(); // aggiorna anche la lista "PDF già generati"
    } else if (current.status !== 'completed') {
      pdfSetStatus('Ci sta mettendo più del previsto. Continua a seguirlo dalla pagina del processo.', 'err');
      $('pdf-links').innerHTML = `<a class="secondary" href="${runUrl}" target="_blank" rel="noopener">Apri il processo su GitHub</a>`;
      show($('pdf-links'));
    } else {
      pdfSetStatus('Compilazione fallita. Apri i dettagli per vedere il log dell’errore.', 'err');
      $('pdf-links').innerHTML = `<a class="secondary" href="${runUrl}" target="_blank" rel="noopener">Apri il log dell’errore</a>`;
      show($('pdf-links'));
    }
  } catch (e) {
    if (dispatched) {
      // La compilazione ormai è partita su GitHub e arriverà comunque al
      // link diretto: anche se abbiamo perso il collegamento, offri il
      // download invece di un errore secco ("Failed to fetch").
      pdfSetStatus('Connessione persa mentre seguivo la compilazione, che però continua su GitHub. ' +
        'Attendi qualche minuto e scarica il PDF dal pulsante qui sotto.', 'err');
      $('pdf-links').innerHTML =
        `<a href="${pdfDirectUrl(mode)}" rel="noopener">⬇️ Scarica il PDF (${mode})</a>` +
        `<a class="secondary" href="https://github.com/${state.repo}/actions" target="_blank" rel="noopener">Stato della compilazione su GitHub</a>`;
      show($('pdf-links'));
    } else {
      let hint = e.message;
      if (e.status === 403 || e.status === 404) {
        hint = 'Permesso negato. Il token deve avere anche “Actions: Read and write” e il workflow deve essere presente sul branch predefinito. (' + e.message + ')';
      } else if (!e.status) {
        hint = 'Rete non raggiungibile: controlla la connessione e riprova.';
      }
      pdfSetStatus(hint, 'err');
    }
  } finally {
    startBtn.disabled = false;
  }
}

/* ---------------- Immagini (via git blobs, con cache) ---------------- */
async function loadImagesIndex() {
  if (state.imagesIndex) return state.imagesIndex;
  try {
    const list = await ghJson(`${API}/repos/${state.repo}/contents/images?ref=${state.branch}`);
    state.imagesIndex = {};
    for (const f of list) state.imagesIndex[f.name.toLowerCase()] = { sha: f.sha };
  } catch (e) { state.imagesIndex = {}; }
  return state.imagesIndex;
}
function mimeFor(name) {
  if (/\.jpe?g$/i.test(name)) return 'image/jpeg';
  if (/\.gif$/i.test(name)) return 'image/gif';
  if (/\.svg$/i.test(name)) return 'image/svg+xml';
  if (/\.webp$/i.test(name)) return 'image/webp';
  return 'image/png';
}
async function imageUrl(texPath) {
  // normalizza: "images/foo.png" | "foo.png" | "foo" (senza estensione)
  let name = texPath.replace(/^\.?\//, '').replace(/^images\//, '').toLowerCase();
  const idx = await loadImagesIndex();
  let entry = idx[name];
  if (!entry) {
    for (const ext of ['.png', '.jpg', '.jpeg']) {
      if (idx[name + ext]) { entry = idx[name + ext]; name += ext; break; }
    }
  }
  if (!entry) throw new Error('immagine non trovata: ' + texPath);
  if (state.imgUrls[entry.sha]) return state.imgUrls[entry.sha];

  const cacheKey = 'https://img.cache/' + entry.sha;
  let blob = null;
  if (window.caches) {
    try {
      const hit = await caches.match(cacheKey);
      if (hit) blob = await hit.blob();
    } catch (e) {}
  }
  if (!blob) {
    const j = await ghJson(`${API}/repos/${state.repo}/git/blobs/${entry.sha}`);
    const bin = atob(j.content.replace(/\n/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    blob = new Blob([bytes], { type: mimeFor(name) });
    if (window.caches) {
      try { const c = await caches.open('lf-images'); await c.put(cacheKey, new Response(blob)); } catch (e) {}
    }
  }
  const url = URL.createObjectURL(blob);
  state.imgUrls[entry.sha] = url;
  return url;
}

/* =========================================================================
 * Inserimento di un'immagine nel capitolo (dalla modalita' modifica)
 * -------------------------------------------------------------------------
 * Il pulsante 🖼️ nella barra dell'editor apre un pannello che:
 *  - carica l'immagine scelta nella cartella images/ del repository
 *    (via API GitHub, serve il token con Contents: Read and write);
 *  - genera il blocco \begin{figure}...\end{figure} con la larghezza
 *    scelta e l'eventuale didascalia;
 *  - lo inserisce nel punto in cui era il cursore nell'editor.
 * Se si scrive solo il nome di un'immagine gia' presente in images/
 * (senza scegliere un file) viene inserito solo il codice LaTeX.
 * ========================================================================= */
const imgInsert = { file: null, cursor: 0, previewUrl: null };

const IMG_MIME_EXT = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
  'image/webp': 'webp', 'image/svg+xml': 'svg'
};

// Nome sicuro per LaTeX e per l'URL: niente spazi, accenti o parentesi
// (i file con spazi/underscore "strani" rompono \includegraphics).
function sanitizeImageName(name, mime) {
  let ext = '';
  const m = name.match(/\.([a-zA-Z0-9]+)$/);
  if (m) { ext = m[1].toLowerCase(); name = name.slice(0, -(m[1].length + 1)); }
  if (ext === 'jpeg') ext = 'jpg';
  if (!/^(png|jpg|gif|webp|svg)$/.test(ext)) ext = IMG_MIME_EXT[mime] || '';
  const base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'immagine';
  return ext ? base + '.' + ext : base;
}

// Legge i byte di un file/blob. File.arrayBuffer() manca sui Safari meno
// recenti (iPhone/iPad non aggiornati): in quel caso si usa FileReader.
function readFileBytes(file) {
  if (typeof file.arrayBuffer === 'function')
    return file.arrayBuffer().then(b => new Uint8Array(b));
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(new Uint8Array(r.result));
    r.onerror = () => reject(r.error || new Error('lettura del file fallita'));
    r.readAsArrayBuffer(file);
  });
}

// Prepara il file per il libro: PNG e JPG passano cosi' come sono; gli altri
// formati (HEIC delle foto iPhone, WebP, GIF...) non sono gestiti da LaTeX,
// quindi si prova a convertirli in PNG con un canvas.
async function imgPrepareUpload(file) {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/png') return { bytes: await readFileBytes(file), ext: 'png' };
  if (type === 'image/jpeg' || type === 'image/jpg')
    return { bytes: await readFileBytes(file), ext: 'jpg' };
  const url = URL.createObjectURL(file);
  try {
    const im = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('immagine non leggibile'));
      i.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = im.naturalWidth; canvas.height = im.naturalHeight;
    canvas.getContext('2d').drawImage(im, 0, 0);
    const blob = await new Promise(resolve =>
      canvas.toBlob ? canvas.toBlob(resolve, 'image/png') : resolve(null));
    if (!blob) throw new Error('conversione fallita');
    return { bytes: await readFileBytes(blob), ext: 'png', converted: true };
  } catch (e) {
    throw new Error('Formato immagine non supportato dal libro (' + (type || 'sconosciuto') +
      '): scegli una foto PNG o JPG.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

function imgLatexSnippet(fileName, width, caption) {
  const w = String(parseFloat(width) || 0.8).replace(/^0?\./, '0.');
  const lines = [
    '\\begin{figure}[htbp]',
    '    \\centering',
    `    \\includegraphics[width=${w}\\textwidth]{images/${fileName}}`
  ];
  if (caption) {
    const safe = caption.replace(/([%&#_])/g, '\\$1');
    lines.push(`    \\caption{${safe}}`);
    lines.push(`    \\label{fig:${fileName.replace(/\.[^.]+$/, '')}}`);
  }
  lines.push('\\end{figure}');
  return lines.join('\n');
}

// Inserisce il blocco nel punto salvato del cursore, isolato da righe
// vuote (in LaTeX una figure "attaccata" al paragrafo cambia l'impaginazione).
function imgInsertAtCursor(snippet) {
  const ta = $('editor-area');
  const pos = Math.min(imgInsert.cursor, ta.value.length);
  const before = ta.value.slice(0, pos), after = ta.value.slice(pos);
  const pre = !before.trim() ? '' : /\n\s*\n$/.test(before) ? '' : /\n$/.test(before) ? '\n' : '\n\n';
  const post = !after.trim() ? '\n' : /^\s*\n/.test(after) ? '' : '\n\n';
  const block = pre + snippet + post;
  ta.value = before + block + after;
  ta.dispatchEvent(new Event('input')); // aggiorna dirty flag e pulsante salva
  const newPos = pos + block.length;
  ta.focus();
  try { ta.setSelectionRange(newPos, newPos); } catch (e) {}
}

function imgSetStatus(msg, cls, spinning) {
  const el = $('img-status');
  el.className = cls || '';
  el.innerHTML = (spinning ? '<span class="mini-spin"></span>' : '') +
    '<span>' + escHtml(msg) + '</span>';
}

function openImgPopup() {
  if (!state.current) return;
  const ta = $('editor-area');
  imgInsert.cursor = typeof ta.selectionStart === 'number' ? ta.selectionStart : ta.value.length;
  imgInsert.file = null;
  $('img-file').value = '';
  $('img-name').value = '';
  $('img-caption').value = '';
  $('img-status').className = 'hidden';
  $('img-insert').disabled = false;
  if (imgInsert.previewUrl) { URL.revokeObjectURL(imgInsert.previewUrl); imgInsert.previewUrl = null; }
  hide($('img-preview-wrap'));
  show($('note-backdrop')); show($('img-popup'));
  loadImagesIndex(); // prefetch: servira' per il controllo dei nomi duplicati
}
function closeImgPopup() {
  hide($('img-popup')); hide($('note-backdrop'));
  if (imgInsert.previewUrl) { URL.revokeObjectURL(imgInsert.previewUrl); imgInsert.previewUrl = null; }
  imgInsert.file = null;
}

function onImgFileChosen() {
  const f = $('img-file').files[0];
  if (!f) return;
  imgInsert.file = f;
  $('img-name').value = sanitizeImageName(f.name, f.type);
  if (imgInsert.previewUrl) URL.revokeObjectURL(imgInsert.previewUrl);
  imgInsert.previewUrl = URL.createObjectURL(f);
  $('img-preview').src = imgInsert.previewUrl;
  show($('img-preview-wrap'));
  $('img-status').className = 'hidden';
}

async function submitImage() {
  const btn = $('img-insert');
  const width = $('img-width').value;
  const caption = $('img-caption').value.trim();
  let name = sanitizeImageName($('img-name').value.trim(),
    imgInsert.file ? imgInsert.file.type : '');
  if (!$('img-name').value.trim()) {
    imgSetStatus('Scegli un\'immagine o scrivi il nome di una già presente in images/.', 'err');
    return;
  }
  btn.disabled = true;
  try {
    const idx = await loadImagesIndex();

    if (!imgInsert.file) {
      // solo inserimento: l'immagine deve gia' esistere nel repository
      let found = idx[name.toLowerCase()] ? name : null;
      if (!found && !/\.[a-z0-9]+$/i.test(name)) {
        for (const ext of ['.png', '.jpg', '.jpeg', '.gif', '.webp']) {
          if (idx[(name + ext).toLowerCase()]) { found = name + ext; break; }
        }
      }
      if (!found) {
        imgSetStatus(`Nessuna immagine chiamata "${name}" in images/. Scegli un file da caricare oppure controlla il nome.`, 'err');
        return;
      }
      imgInsertAtCursor(imgLatexSnippet(found, width, caption));
      closeImgPopup();
      toast('✓ Codice LaTeX inserito. Ricorda di salvare il capitolo (💾)');
      return;
    }

    if (!state.token) {
      imgSetStatus('Per caricare l\'immagine sul repository serve il token GitHub: aggiungilo da "Impostazioni / esci".', 'err');
      return;
    }

    imgSetStatus('Preparo l\'immagine…', '', true);
    const prepared = await imgPrepareUpload(imgInsert.file);
    // la conversione (es. HEIC/WebP -> PNG) puo' cambiare l'estensione
    name = name.replace(/\.[a-zA-Z0-9]+$/, '') + '.' + prepared.ext;

    const existing = idx[name.toLowerCase()];
    if (existing && !confirm(`In images/ esiste già "${name}". Vuoi sovrascriverla?\n(Annulla per cambiare nome)`)) {
      $('img-status').className = 'hidden';
      return;
    }

    imgSetStatus('Carico l\'immagine su GitHub…', '', true);
    const bytes = prepared.bytes;
    const res = await ghPutB64('images/' + name, bytesToB64(bytes),
      existing ? existing.sha : undefined,
      (existing ? 'Aggiornata immagine ' : 'Aggiunta immagine ') + name + ' dalla web app');

    // aggiorna gli indici locali, cosi' la lettura mostra subito l'immagine
    if (!state.imagesIndex) state.imagesIndex = {};
    const newSha = res.content && res.content.sha;
    state.imagesIndex[name.toLowerCase()] = { sha: newSha };
    if (newSha) {
      try {
        state.imgUrls[newSha] = URL.createObjectURL(new Blob([bytes], { type: mimeFor(name) }));
      } catch (e) {}
    }

    imgInsertAtCursor(imgLatexSnippet(name, width, caption));
    closeImgPopup();
    toast('✓ Immagine caricata in images/ e codice inserito. Ricorda di salvare il capitolo (💾)');
  } catch (err) {
    let msg = err.message;
    if (err.status === 401 || err.status === 403) {
      msg = 'Il token non ha i permessi per scrivere su questo repository (serve Contents: Read and write). ' + err.message;
    } else if (!err.status) {
      msg = 'Rete non raggiungibile: controlla la connessione e riprova. ' + err.message;
    }
    imgSetStatus('Immagine non caricata: ' + msg, 'err');
  } finally {
    btn.disabled = false;
  }
}

function initImgUi() {
  $('btn-img').onclick = openImgPopup;
  $('img-cancel').onclick = closeImgPopup;
  $('img-insert').onclick = submitImage;
  $('img-file').onchange = onImgFileChosen;
  // .click() programmatico: l'etichetta <label for> su un input nascosto
  // non apre la galleria su alcuni Safari/iOS, il click diretto si'
  $('img-choose').onclick = () => $('img-file').click();
}

/* =========================================================================
 * Convertitore LaTeX -> HTML (sottoinsieme usato dal libro)
 * ========================================================================= */
const ACCENTS = {
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' },
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' },
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' },
  '"': { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü' },
  '~': { n: 'ñ', a: 'ã', o: 'õ' }
};
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// Converte gli accenti LaTeX (\`{a}, \`a, \'e, ...) in caratteri Unicode.
// Serve per i titoli mostrati fuori dal renderer (barra in alto, indice).
function latexAccentsToText(s) {
  return String(s).replace(/\\([`'^"~])\{?([a-zA-Z])\}?/g,
    (m, acc, ch) => (ACCENTS[acc] && ACCENTS[acc][ch]) || ch);
}

function latexToHtml(src, notes) {
  // --- pulizia preliminare ---
  src = src.replace(/\\begin\{comment\}[\s\S]*?\\end\{comment\}/g, '');
  src = src.replace(/\\iffalse[\s\S]*?\\fi/g, '');
  // commenti di riga (% non preceduto da \)
  src = src.split('\n').map(line => {
    let out = '';
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '%' && line[i - 1] !== '\\') break;
      out += line[i];
    }
    return out;
  }).join('\n');

  let pos = 0;

  function readCmdName() { // dopo il backslash
    let n = '';
    while (pos < src.length && /[a-zA-Z]/.test(src[pos])) n += src[pos++];
    return n;
  }
  function skipWs() { while (pos < src.length && /[ \t\n]/.test(src[pos])) pos++; }
  function readBraceArg() {
    const save = pos;
    skipWs();
    if (src[pos] !== '{') { pos = save; return null; }
    pos++; // {
    let depth = 1, out = '';
    while (pos < src.length && depth > 0) {
      const c = src[pos];
      if (c === '\\' && (src[pos + 1] === '{' || src[pos + 1] === '}')) { out += c + src[pos + 1]; pos += 2; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { pos++; break; } }
      out += c; pos++;
    }
    return out;
  }
  function readOptArg() {
    const save = pos;
    skipWs();
    if (src[pos] !== '[') { pos = save; return null; }
    pos++;
    let out = '';
    while (pos < src.length && src[pos] !== ']') out += src[pos++];
    pos++;
    return out;
  }

  // renderizza una stringa isolata (argomenti di comandi) come inline
  function renderFragment(s) {
    const savedSrc = src, savedPos = pos;
    src = s; pos = 0;
    const html = parseBlocks(null, true);
    src = savedSrc; pos = savedPos;
    return html;
  }

  function envSplitItems(body) {
    // divide su \item a profondita' zero
    const items = [];
    let depth = 0, cur = '', i = 0;
    while (i < body.length) {
      if (body[i] === '\\') {
        if (body.startsWith('\\begin', i)) depth++;
        else if (body.startsWith('\\end', i)) depth--;
        else if (depth === 0 && body.startsWith('\\item', i) && !/[a-zA-Z]/.test(body[i + 5] || '')) {
          items.push(cur); cur = ''; i += 5; continue;
        }
      } else if (body[i] === '{') depth++;
      else if (body[i] === '}') depth--;
      cur += body[i]; i++;
    }
    items.push(cur);
    return items.slice(1).length ? items.slice(1) : items; // scarta il preambolo prima del primo \item
  }

  function extractEnvBody(name) {
    // pos e' subito dopo \begin{name}: estrae fino al \end{name} corrispondente
    let depth = 1, body = '';
    const beginTok = '\\begin{' + name + '}', endTok = '\\end{' + name + '}';
    while (pos < src.length) {
      if (src.startsWith(beginTok, pos)) { depth++; body += beginTok; pos += beginTok.length; continue; }
      if (src.startsWith(endTok, pos)) {
        depth--;
        pos += endTok.length;
        if (depth === 0) return body;
        body += endTok; continue;
      }
      body += src[pos++];
    }
    return body;
  }

  function handleEnv(name, para) {
    const opt = readOptArg(); // es. [htbp]
    const body = extractEnvBody(name);
    switch (name) {
      case 'itemize': case 'enumerate': {
        const tag = name === 'itemize' ? 'ul' : 'ol';
        const items = envSplitItems(body).map(it => '<li>' + renderFragment(it) + '</li>').join('');
        return `<${tag}>${items}</${tag}>`;
      }
      case 'quote': case 'quotation': case 'modernquote': case 'displayquote':
        return '<blockquote>' + renderFragment(body) + '</blockquote>';
      case 'flushright': return '<div class="flushright">' + renderFragment(body) + '</div>';
      case 'flushleft': return '<div class="flushleft">' + renderFragment(body) + '</div>';
      case 'center': case 'figure': case 'table': {
        const inner = renderFragment(body);
        if (/data-imgpath|<figcaption/.test(inner)) return '<figure>' + inner + '</figure>';
        return '<div class="center">' + inner + '</div>';
      }
      case 'minipage': readBraceArg(); return '<div class="center">' + renderFragment(body.replace(/^\s*\{[^}]*\}/, '')) + '</div>';
      case 'tabular': case 'tabularx':
        return '<pre class="fbox">' + escHtml(body) + '</pre>';
      default:
        return renderFragment(body);
    }
  }

  function imgTag(path, opt) {
    let style = '';
    const m = opt && opt.match(/width\s*=\s*([\d.]+)\\(?:text|line|column)width/);
    if (m) style = ` style="width:${Math.round(parseFloat(m[1]) * 100)}%"`;
    return `<span class="img-slot"><img data-imgpath="${escHtml(path)}" alt=""${style}><span class="img-loading">Carico immagine…</span></span>`;
  }

  function handleCommand(name) {
    switch (name) {
      // --- struttura ---
      case 'chapter': {
        const star = src[pos] === '*'; if (star) pos++;
        return { block: '<h1>' + renderFragment(readBraceArg() || '') + '</h1>' };
      }
      case 'section': {
        if (src[pos] === '*') pos++;
        return { block: '<h2>' + renderFragment(readBraceArg() || '') + '</h2>' };
      }
      case 'subsection': {
        if (src[pos] === '*') pos++;
        return { block: '<h3>' + renderFragment(readBraceArg() || '') + '</h3>' };
      }
      case 'subsubsection': {
        if (src[pos] === '*') pos++;
        return { block: '<h4>' + renderFragment(readBraceArg() || '') + '</h4>' };
      }
      // --- inline con 1 argomento ---
      case 'textit': case 'emph': case 'itshape':
        return { inline: '<em>' + renderFragment(readBraceArg() || '') + '</em>' };
      case 'textbf': case 'firstwords':
        return { inline: '<strong>' + renderFragment(readBraceArg() || '') + '</strong>' };
      case 'textsc': case 'smallcaps':
        return { inline: '<span class="smallcaps">' + renderFragment(readBraceArg() || '') + '</span>' };
      case 'texttt':
        return { inline: '<code>' + renderFragment(readBraceArg() || '') + '</code>' };
      case 'underline': case 'uline':
        return { inline: '<u>' + renderFragment(readBraceArg() || '') + '</u>' };
      case 'MakeUppercase':
        return { inline: '<span style="text-transform:uppercase">' + renderFragment(readBraceArg() || '') + '</span>' };
      case 'textls':
        readOptArg();
        return { inline: renderFragment(readBraceArg() || '') };
      case 'fbox': case 'mbox':
        return { inline: '<span class="fbox">' + renderFragment(readBraceArg() || '') + '</span>' };
      case 'footnote': {
        const content = readBraceArg() || '';
        notes.push(renderFragment(content));
        const n = notes.length;
        return { inline: `<sup class="fnref" data-note="${n - 1}">${n}</sup>` };
      }
      // --- immagini e didascalie ---
      case 'includegraphics': {
        const opt = readOptArg();
        const path = readBraceArg() || '';
        return { inline: imgTag(path, opt) };
      }
      case 'caption':
        return { inline: '<figcaption>' + renderFragment(readBraceArg() || '') + '</figcaption>' };
      case 'captionof': {
        readBraceArg(); // "figure"
        return { inline: '<figcaption>' + renderFragment(readBraceArg() || '') + '</figcaption>' };
      }
      // --- citazioni ---
      case 'epigraph': case 'chapterquote': {
        const q = renderFragment(readBraceArg() || '');
        const a = renderFragment(readBraceArg() || '');
        return { block: `<div class="epigraph"><div>${q}</div><div class="epigraph-source">${a}</div></div>` };
      }
      // --- dialoghi appendice ---
      case 'human': case 'humanbox':
        return { block: `<div class="msg human"><span class="msg-label">UMANO</span>${renderFragment(readBraceArg() || '')}</div>` };
      case 'ai': case 'aibox':
        return { block: `<div class="msg ai"><span class="msg-label">AI</span>${renderFragment(readBraceArg() || '')}</div>` };
      // --- spaziature ---
      case 'bigskip': return { block: '<div class="bigskip"></div>' };
      case 'medskip': return { block: '<div class="medskip"></div>' };
      case 'smallskip': return { block: '<div class="smallskip"></div>' };
      case 'vspace': { if (src[pos] === '*') pos++; readBraceArg(); return { block: '<div class="medskip"></div>' }; }
      case 'hspace': { if (src[pos] === '*') pos++; readBraceArg(); return { inline: ' ' }; }
      case 'rule': { readOptArg(); readBraceArg(); readBraceArg(); return { block: '<hr class="latex-rule">' }; }
      case 'par': return { parbreak: true };
      // --- accenti in forma \c{c} ---
      case 'c': {
        const a = readBraceArg();
        if (a === 'c') return { inline: 'ç' };
        if (a === 'C') return { inline: 'Ç' };
        return { inline: a || '' };
      }
      // --- da ignorare (con eventuali argomenti da consumare) ---
      case 'index': readOptArg(); readBraceArg(); return { inline: '' };
      case 'label': readBraceArg(); return { inline: '' };
      case 'ref': case 'pageref': readBraceArg(); return { inline: '<em>(vedi figura)</em>' };
      case 'cite': readOptArg(); readBraceArg(); return { inline: '' };
      case 'color': case 'pagestyle': case 'thispagestyle': case 'bibliographystyle':
        readBraceArg(); return { inline: '' };
      case 'addcontentsline': readBraceArg(); readBraceArg(); readBraceArg(); return { inline: '' };
      case 'setcounter': case 'setlength': readBraceArg(); readBraceArg(); return { inline: '' };
      case 'input': case 'include': case 'graphicspath': readBraceArg(); return { inline: '' };
      case 'lettrine': { readOptArg(); const a = readBraceArg() || '', b = readBraceArg() || ''; return { inline: renderFragment(a + b) }; }
      case 'noindent': case 'centering': case 'justifying': case 'raggedright':
      case 'clearpage': case 'cleardoublepage': case 'newpage': case 'vfill': case 'hfill':
      case 'sffamily': case 'rmfamily': case 'bfseries': case 'scshape': case 'normalfont':
      case 'small': case 'footnotesize': case 'scriptsize': case 'normalsize':
      case 'large': case 'Large': case 'LARGE': case 'huge': case 'Huge':
      case 'tableofcontents': case 'printindex': case 'appendix':
      case 'frontmatter': case 'mainmatter': case 'backmatter': case 'protect':
      case 'hrule': case 'linebreak': case 'nolinebreak': case 'nopagebreak': case 'pagebreak':
      case 'phantomsection': case 'indent': case 'relax': case 'ldots':
        return { inline: name === 'ldots' ? '…' : '' };
      case 'dots': case 'textellipsis': return { inline: '…' };
      case 'textquotedblleft': return { inline: '“' };
      case 'textquotedblright': return { inline: '”' };
      case 'LaTeX': return { inline: 'LaTeX' };
      case 'TeX': return { inline: 'TeX' };
      case 'begin': case 'end': return null; // gestiti dal chiamante
      default: {
        // comando sconosciuto: se ha un argomento, mostra il contenuto
        const arg = readBraceArg();
        if (arg !== null) return { inline: renderFragment(arg) };
        return { inline: '' };
      }
    }
  }

  function parseBlocks(stopEnv, inlineMode) {
    let html = '', para = '';
    const flush = () => {
      const t = para.trim();
      if (t) html += inlineMode && !/<(h\d|div|figure|blockquote|ul|ol|figcaption|hr|pre)/.test(html + t)
        ? t : '<p>' + t + '</p>';
      para = '';
    };
    while (pos < src.length) {
      const c = src[pos];
      if (c === '\\') {
        pos++;
        const nxt = src[pos];
        // simboli speciali \\, \%, \&, \_, ecc.
        if (nxt === '\\') { pos++; readOptArg(); para += '<br>'; continue; }
        if ('%&_#$'.indexOf(nxt) >= 0) { para += escHtml(nxt); pos++; continue; }
        if (nxt === '{' || nxt === '}') { para += nxt; pos++; continue; }
        if (nxt === ',') { para += ' '; pos++; continue; }
        if (nxt === ' ') { para += ' '; pos++; continue; }
        if (ACCENTS[nxt]) { // \`{a} oppure \`a
          pos++;
          let ch = null;
          if (src[pos] === '{') { const a = readBraceArg(); ch = a && a.length === 1 ? a : null; if (!ch && a) { para += escHtml(a); continue; } }
          else { ch = src[pos]; pos++; }
          para += (ACCENTS[nxt][ch] || ch || '');
          continue;
        }
        const name = readCmdName();
        if (!name) continue;
        if (name === 'begin') {
          const env = readBraceArg();
          flush();
          html += handleEnv(env, para);
          continue;
        }
        if (name === 'end') {
          const env = readBraceArg();
          if (stopEnv && env === stopEnv) { flush(); return html; }
          continue;
        }
        const r = handleCommand(name);
        if (!r) continue;
        if (r.parbreak) { flush(); continue; }
        if (r.block) { flush(); html += r.block; continue; }
        para += r.inline || '';
        continue;
      }
      if (c === '\n') {
        // riga vuota => nuovo paragrafo
        let j = pos + 1, blank = false;
        while (j < src.length && (src[j] === ' ' || src[j] === '\t')) j++;
        if (src[j] === '\n') blank = true;
        if (blank) { flush(); while (pos < src.length && /\s/.test(src[pos])) pos++; }
        else { para += ' '; pos++; }
        continue;
      }
      if (c === '`') {
        if (src[pos + 1] === '`') { para += '“'; pos += 2; } else { para += '‘'; pos++; }
        continue;
      }
      if (c === "'") {
        if (src[pos + 1] === "'") { para += '”'; pos += 2; } else { para += '’'; pos++; }
        continue;
      }
      if (c === '-') {
        if (src.startsWith('---', pos)) { para += '—'; pos += 3; }
        else if (src.startsWith('--', pos)) { para += '–'; pos += 2; }
        else { para += '-'; pos++; }
        continue;
      }
      if (c === '~') { para += ' '; pos++; continue; }
      if (c === '{' || c === '}') { pos++; continue; } // gruppi anonimi
      para += escHtml(c);
      pos++;
    }
    flush();
    return html;
  }

  return parseBlocks(null, false);
}

/* =========================================================================
 * TOC: parsing di main.tex
 * ========================================================================= */
const PART_TITLES = { part1: 'Parte I', part2: 'Parte II', part3: 'Parte III', part4: 'Parte IV' };
function parseBookMeta(text) {
  const get = name => {
    const m = text.match(new RegExp('\\\\newcommand\\{\\\\' + name + '\\}\\{([^}]*)\\}'));
    return m ? latexAccentsToText(m[1].trim()) : '';
  };
  return {
    title: get('booktitle'),
    subtitleA: get('subtitleA'),
    subtitleB: get('subtitleB'),
    author: get('authorname')
  };
}
function parseMainTex(text) {
  state.meta = parseBookMeta(text);
  const toc = [];
  toc.push({ path: 'frontmatter/titlepage.tex', title: 'Copertina', part: 'Inizio', cover: true });
  toc.push({ path: 'frontmatter/preface.tex', title: 'Prefazione', part: 'Inizio' });
  let currentPart = 'Inizio';
  const partDesc = {}; // part1 -> "LA MENTE INASPETTATA"
  const partRe = /^%\s*PARTE\s+([IV]+)\s*:\s*(.+)$/;
  const lines = text.split('\n');
  const roman = { I: 'part1', II: 'part2', III: 'part3', IV: 'part4' };
  for (const raw of lines) {
    const line = raw.trim();
    const pm = line.match(partRe);
    if (pm && roman[pm[1]]) { partDesc[roman[pm[1]]] = pm[2].trim(); continue; }
    if (line.startsWith('%')) continue;
    const m = line.match(/^\\input\{([^}]+)\}\s*(?:%\s*(.*))?$/);
    if (!m) continue;
    let p = m[1];
    if (!/\.tex$/.test(p)) p += '.tex';
    const comment = latexAccentsToText((m[2] || '').trim());
    const partMatch = p.match(/^parts\/(part\d)\.tex$/);
    if (partMatch) {
      const key = partMatch[1];
      currentPart = PART_TITLES[key] + (partDesc[key] ? ' — ' + titleCase(partDesc[key]) : '');
      continue;
    }
    if (p.startsWith('frontmatter/') || p.startsWith('misc/')) continue; // preambolo, titlepage ecc.
    let title = state.titles[p] || comment || p.split('/').pop().replace('.tex', '');
    if (p === 'content/prologo.tex') title = state.titles[p] || 'Prologo';
    if (p.startsWith('appendix/')) { currentPart = 'Appendice'; title = state.titles[p] || 'Dialogo'; }
    toc.push({ path: p, title, part: currentPart });
  }
  toc.push({ path: 'main.tex', title: 'Struttura del libro (main.tex)', part: 'File sorgente', editorOnly: true });
  return toc;
}
function titleCase(s) {
  return s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
}

/* ---------------- TOC UI ---------------- */
function renderToc() {
  const list = $('toc-list');
  list.innerHTML = '';
  let lastPart = null;
  for (const entry of state.toc) {
    if (entry.part !== lastPart) {
      const h = document.createElement('div');
      h.className = 'toc-part';
      h.textContent = entry.part;
      list.appendChild(h);
      lastPart = entry.part;
    }
    const b = document.createElement('button');
    b.className = 'toc-item' + (state.current && state.current.path === entry.path ? ' active' : '');
    b.textContent = entry.title;
    b.onclick = () => { closeToc(); openChapter(entry); };
    list.appendChild(b);
  }
}
function openToc() { show($('toc-drawer')); show($('toc-backdrop')); renderToc(); }
function closeToc() { hide($('toc-drawer')); hide($('toc-backdrop')); }

/* ---------------- Apertura capitolo ---------------- */
async function openChapter(entry, keepMode) {
  if (state.dirty && !confirm('Ci sono modifiche non salvate. Le abbandoni?')) return;
  loading(true, 'Carico ' + entry.title + '…');
  try {
    const f = await ghGetFile(entry.path);
    state.current = entry;
    state.fileSha = f.sha;
    state.fileText = f.text;
    state.dirty = false;
    lsSet(LS.lastPath, entry.path);

    // aggiorna titolo dal \chapter{...}
    const tm = f.text.match(/\\chapter\*?\s*\{/);
    if (tm) {
      const start = tm.index + tm[0].length;
      let depth = 1, i = start, t = '';
      while (i < f.text.length && depth > 0) {
        if (f.text[i] === '{') depth++;
        else if (f.text[i] === '}') { depth--; if (!depth) break; }
        t += f.text[i]; i++;
      }
      const plain = latexAccentsToText(t).replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?/g, '').replace(/[{}]/g, '').trim();
      if (plain) {
        entry.title = plain;
        state.titles[entry.path] = plain;
        lsSet(LS.titles, JSON.stringify(state.titles));
      }
    }
    $('chapter-label').textContent = entry.title;
    $('editor-path').textContent = entry.path;
    $('editor-area').value = f.text;
    hide($('dirty-flag'));

    hideNoteUi();
    state.chapterNotes = [];
    if (entry.editorOnly) setMode('edit');
    else if (!keepMode) setMode('read');
    if (!entry.editorOnly) renderReader();
    window.scrollTo(0, 0);
    $('editor-area').scrollTop = 0;
    state.readScroll = 0; state.editScroll = 0;
    saveBookmark(); // nuovo capitolo: il segnalibro riparte dalla sua cima
    if (!entry.editorOnly && !entry.cover) refreshNotes();
    else updateNotesCount();
  } catch (err) {
    toast('Errore: ' + err.message, true);
  } finally {
    loading(false);
  }
}

function renderCover() {
  const m = state.meta || {};
  let html = '<div class="cover-page">' +
    '<span class="cover-imgwrap"><img data-imgpath="Cover.png" alt="Copertina del libro">' +
    '<span class="img-loading">Carico la copertina…</span></span>' +
    '<div class="cover-overlay">' +
    '<h1 class="cover-title">' + escHtml(m.title || 'Il mio libro') + '</h1>';
  if (m.subtitleA || m.subtitleB) {
    html += '<p class="cover-subtitle"><em>' + escHtml(m.subtitleA || '') +
      (m.subtitleA && m.subtitleB ? '<br>' : '') + escHtml(m.subtitleB || '') + '</em></p>';
  }
  if (m.author) html += '<p class="cover-author">' + escHtml(m.author) + '</p>';
  html += '</div></div>';
  return html;
}

function renderReader() {
  state.notes = [];
  let out;
  if (state.current && state.current.cover) {
    // La copertina si renderizza come pagina dedicata (il sorgente resta
    // modificabile in modalita' editor: frontmatter/titlepage.tex)
    out = renderCover();
  } else {
    out = latexToHtml(state.fileText, state.notes);
    if (state.notes.length) {
      out += '<div class="endnotes"><h4>Note</h4><ol>' +
        state.notes.map(n => '<li>' + n + '</li>').join('') + '</ol></div>';
    }
  }
  $('reader-content').innerHTML = out;
  hydrateImages();
  hydrateFootnotes();
  anchorAll();
  updateNavButtons();
  // ricerca aperta: ri-evidenzia le occorrenze sul testo appena renderizzato
  search.groups = []; search.idx = -1;
  if (!$('search-bar').classList.contains('hidden')) searchApply();
  // capitolo nuovo: ferma la lettura in corso e riprepara la coda
  if (typeof ttsStop === 'function') {
    ttsStop();
    if (!$('tts-bar').classList.contains('hidden')) ttsBuildQueue();
  }
}

function hydrateImages() {
  document.querySelectorAll('#reader-content img[data-imgpath]').forEach(async img => {
    const slot = img.parentElement;
    try {
      const url = await imageUrl(img.dataset.imgpath);
      img.src = url;
      img.onload = () => { const l = slot.querySelector('.img-loading'); if (l) l.remove(); };
    } catch (e) {
      const l = slot.querySelector('.img-loading');
      if (l) l.textContent = '⚠︎ ' + img.dataset.imgpath;
      img.remove();
    }
  });
}
function hydrateFootnotes() {
  document.querySelectorAll('#reader-content sup.fnref').forEach(sup => {
    sup.onclick = () => {
      $('fn-popup-text').innerHTML = '<b>' + (Number(sup.dataset.note) + 1) + '.</b> ' + state.notes[sup.dataset.note];
      show($('fn-popup'));
    };
  });
}
function updateNavButtons() {
  const readable = state.toc.filter(e => !e.editorOnly);
  const i = readable.findIndex(e => e === state.current);
  $('btn-prev').disabled = i <= 0;
  $('btn-next').disabled = i < 0 || i >= readable.length - 1;
  $('btn-prev').onclick = () => i > 0 && openChapter(readable[i - 1]);
  $('btn-next').onclick = () => i < readable.length - 1 && openChapter(readable[i + 1]);
}

/* =========================================================================
 * Note al testo — chiunque puo' annotare. Di default le note sono CONDIVISE:
 * vengono salvate in un file JSON del repository (docs/notes-data.json) e
 * chiunque apre la pagina le vede. Per scriverle serve il token GitHub (lo
 * stesso usato per salvare i capitoli); senza token la nota resta salvata
 * solo sul dispositivo. In alternativa si puo' usare Firestore (vedi
 * notes-config.js), utile se i lettori non hanno un token.
 * ========================================================================= */
const FS_BASE = 'https://firestore.googleapis.com/v1';

function notesConfig() {
  const base = (window.LF_NOTES_CONFIG && window.LF_NOTES_CONFIG.firestore) || {};
  const projectId = (localStorage.getItem(LS.fbProject) || base.projectId || '').trim();
  const apiKey = (localStorage.getItem(LS.fbKey) || base.apiKey || '').trim();
  return { mode: (projectId && apiKey) ? 'firestore' : 'repo', projectId, apiKey };
}

function markMine(id) {
  const s = new Set(JSON.parse(localStorage.getItem(LS.myNotes) || '[]'));
  s.add(id);
  lsSet(LS.myNotes, JSON.stringify([...s]));
}
function isMine(id) {
  return new Set(JSON.parse(localStorage.getItem(LS.myNotes) || '[]')).has(id);
}
function localNotes(chapter) {
  return JSON.parse(localStorage.getItem(LS.notesCache + chapter) || '[]');
}
function saveLocalNotes(chapter, list) {
  lsSet(LS.notesCache + chapter, JSON.stringify(list));
}

/* ---- note condivise nel repository (docs/notes-data.json) ---- */
const NOTES_PATH = 'docs/notes-data.json';
let repoNotes = { sha: null, list: [], loaded: false };

async function repoNotesLoad() {
  try {
    // cache: 'no-store' bypassa la cache del browser: l'API GitHub tiene le
    // risposte per 60s, e rileggere una versione vecchia del file (sha
    // superato) faceva fallire con 409 il salvataggio successivo
    const j = await ghJson(`${API}/repos/${state.repo}/contents/${NOTES_PATH}?ref=${state.branch}`, { cache: 'no-store' });
    let list = [];
    try { list = JSON.parse(b64ToText(j.content)).notes || []; } catch (e) {}
    repoNotes = { sha: j.sha, list, loaded: true };
  } catch (err) {
    if (err.status !== 404) throw err;
    repoNotes = { sha: null, list: [], loaded: true }; // il file non esiste ancora
  }
  return repoNotes;
}

async function repoNotesMutate(mutate, message) {
  // applica la modifica alla copia in memoria (aggiornata dall'ultimo
  // salvataggio o dall'ultima lettura) e salva; se qualcun altro ha salvato
  // nel frattempo (sha cambiato) GitHub risponde 409/422: si ricarica il
  // file, con una piccola attesa crescente, e si riprova da capo
  let lastErr = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0 || !repoNotes.loaded) {
      if (attempt > 0) await sleep(700 * attempt);
      await repoNotesLoad();
    }
    const list = mutate(repoNotes.list.slice());
    const text = JSON.stringify({ notes: list }, null, 2) + '\n';
    try {
      const res = await ghPutFile(NOTES_PATH, text, repoNotes.sha || undefined, message);
      repoNotes = { sha: res.content.sha, list, loaded: true };
      return list;
    } catch (err) {
      lastErr = err;
      if (err.status !== 409 && err.status !== 422) throw err;
    }
  }
  throw lastErr;
}

function fsParse(fields) {
  const o = {};
  for (const k in fields) {
    const v = fields[k];
    o[k] = v.stringValue !== undefined ? v.stringValue
      : v.integerValue !== undefined ? Number(v.integerValue)
      : v.doubleValue !== undefined ? v.doubleValue
      : v.booleanValue !== undefined ? v.booleanValue : '';
  }
  return o;
}

async function notesList(chapter) {
  const cfg = notesConfig();
  if (cfg.mode === 'repo') {
    try {
      const { list } = await repoNotesLoad();
      const shared = list.filter(n => n.chapter === chapter);
      // le note create senza token restano solo su questo dispositivo (id "loc-")
      const localOnly = localNotes(chapter).filter(n => String(n.id).startsWith('loc-'));
      const all = shared.concat(localOnly);
      all.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      saveLocalNotes(chapter, all); // copia locale per l'offline
      return all;
    } catch (e) {
      return localNotes(chapter); // offline / errore: ultima copia nota
    }
  }
  try {
    const url = `${FS_BASE}/projects/${cfg.projectId}/databases/(default)/documents:runQuery?key=${cfg.apiKey}`;
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'notes' }],
        where: { fieldFilter: { field: { fieldPath: 'chapter' }, op: 'EQUAL', value: { stringValue: chapter } } }
      }
    };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Firestore ' + res.status);
    const rows = await res.json();
    const list = [];
    for (const r of rows) {
      if (!r.document) continue;
      const d = fsParse(r.document.fields || {});
      d.id = r.document.name.split('/').pop();
      list.push(d);
    }
    list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    saveLocalNotes(chapter, list); // copia locale per l'offline
    return list;
  } catch (e) {
    return localNotes(chapter); // offline / errore: ultima copia nota
  }
}

async function notesAdd(note) {
  const cfg = notesConfig();
  note.createdAt = Date.now();
  if (cfg.mode === 'repo' && state.token) {
    const stored = {
      id: 'n-' + note.createdAt + '-' + Math.random().toString(36).slice(2, 7),
      book: 'libro-futuro',
      chapter: note.chapter,
      quote: note.quote,
      prefix: note.prefix || '',
      suffix: note.suffix || '',
      text: note.text,
      author: note.author || '',
      createdAt: note.createdAt
    };
    await repoNotesMutate(list => { list.push(stored); return list; },
      'Nota di ' + (stored.author || 'Anonimo') + ' su ' + stored.chapter);
    markMine(stored.id);
    const list = localNotes(stored.chapter); list.push(stored); saveLocalNotes(stored.chapter, list);
    return stored;
  }
  if (cfg.mode !== 'firestore') {
    // niente token: la nota resta salvata solo su questo dispositivo
    note.id = 'loc-' + note.createdAt + '-' + Math.random().toString(36).slice(2, 7);
    const list = localNotes(note.chapter); list.push(note); saveLocalNotes(note.chapter, list);
    markMine(note.id);
    return note;
  }
  const url = `${FS_BASE}/projects/${cfg.projectId}/databases/(default)/documents/notes?key=${cfg.apiKey}`;
  const fields = {
    book: { stringValue: 'libro-futuro' },
    chapter: { stringValue: note.chapter },
    quote: { stringValue: note.quote },
    prefix: { stringValue: note.prefix || '' },
    suffix: { stringValue: note.suffix || '' },
    text: { stringValue: note.text },
    author: { stringValue: note.author || '' },
    createdAt: { integerValue: String(note.createdAt) }
  };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) });
  if (!res.ok) {
    let m = 'Firestore ' + res.status;
    try { m += ': ' + (await res.json()).error.message; } catch (e) {}
    throw new Error(m);
  }
  const doc = await res.json();
  note.id = doc.name.split('/').pop();
  markMine(note.id);
  return note;
}

async function notesDelete(note) {
  const cfg = notesConfig();
  if (String(note.id).startsWith('loc-')) {
    saveLocalNotes(note.chapter, localNotes(note.chapter).filter(n => n.id !== note.id));
    return;
  }
  if (cfg.mode === 'repo') {
    if (!state.token) throw new Error('serve il token GitHub per eliminare una nota condivisa');
    await repoNotesMutate(list => list.filter(n => n.id !== note.id),
      'Eliminata una nota da ' + note.chapter);
    saveLocalNotes(note.chapter, localNotes(note.chapter).filter(n => n.id !== note.id));
    return;
  }
  const url = `${FS_BASE}/projects/${cfg.projectId}/databases/(default)/documents/notes/${note.id}?key=${cfg.apiKey}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error('Firestore ' + res.status);
}

/* ---- ancoraggio delle note al testo renderizzato ---- */
function readerTextNodes() {
  const root = $('reader-content');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
      const p = n.parentElement;
      if (!p || p.closest('.endnotes, figure, .cover-page, sup.fnref, .img-loading'))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  let n; while ((n = walker.nextNode())) nodes.push(n);
  return nodes;
}
function readerTextIndex() {
  const nodes = readerTextNodes();
  let full = ''; const starts = new Map();
  for (const n of nodes) { starts.set(n, full.length); full += n.nodeValue; }
  return { nodes, full, starts };
}
function findQuoteRange(full, note) {
  const q = note.quote;
  if (!q) return null;
  let from = 0, best = -1, bestScore = -1;
  while (true) {
    const idx = full.indexOf(q, from);
    if (idx < 0) break;
    let score = 0;
    if (note.prefix) {
      const before = full.slice(Math.max(0, idx - note.prefix.length), idx);
      if (before.endsWith(note.prefix)) score += 2;
      else if (before.slice(-8) && before.slice(-8) === note.prefix.slice(-8)) score += 1;
    }
    if (note.suffix) {
      const after = full.slice(idx + q.length, idx + q.length + note.suffix.length);
      if (after.startsWith(note.suffix)) score += 2;
      else if (after.slice(0, 8) && after.slice(0, 8) === note.suffix.slice(0, 8)) score += 1;
    }
    if (score > bestScore) { bestScore = score; best = idx; }
    from = idx + 1;
  }
  return best < 0 ? null : { start: best, end: best + q.length };
}
function wrapQuote(note) {
  const { nodes, full, starts } = readerTextIndex();
  const r = findQuoteRange(full, note);
  if (!r) return false;
  for (const node of nodes) {
    const nodeStart = starts.get(node), nodeEnd = nodeStart + node.nodeValue.length;
    const s = Math.max(r.start, nodeStart), e = Math.min(r.end, nodeEnd);
    if (s >= e) continue;
    let target = node;
    const localStart = s - nodeStart, localEnd = e - nodeStart;
    if (localEnd < target.nodeValue.length) target.splitText(localEnd);
    if (localStart > 0) target = target.splitText(localStart);
    const mark = document.createElement('mark');
    mark.className = 'note-hl';
    mark.dataset.noteId = note.id;
    target.parentNode.replaceChild(mark, target);
    mark.appendChild(target);
  }
  return true;
}
function anchorAll() {
  const root = $('reader-content');
  root.querySelectorAll('mark.note-hl').forEach(m => {
    const p = m.parentNode;
    while (m.firstChild) p.insertBefore(m.firstChild, m);
    p.removeChild(m);
  });
  root.normalize();
  for (const note of state.chapterNotes) wrapQuote(note);
  updateNotesCount();
}

async function refreshNotes() {
  state.chapterNotes = [];
  updateNotesCount();
  if (!state.current || state.current.editorOnly || state.current.cover) return;
  const chapter = state.current.path;
  const list = await notesList(chapter);
  if (!state.current || state.current.path !== chapter) return; // capitolo cambiato nel frattempo
  state.chapterNotes = list;
  if (currentMode() === 'read') anchorAll(); else updateNotesCount();
}

function updateNotesCount() {
  const btn = $('btn-notes');
  if (!btn) return;
  const n = state.chapterNotes.length;
  btn.textContent = n ? '🗨️' + n : '🗨️';
  btn.classList.toggle('has-notes', n > 0);
}

/* ---- selezione del testo -> nuova nota ---- */
function selectionInfo() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const root = $('reader-content');
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  const { full, starts } = readerTextIndex();
  if (!starts.has(range.startContainer) || !starts.has(range.endContainer)) return null;
  const start = starts.get(range.startContainer) + range.startOffset;
  const end = starts.get(range.endContainer) + range.endOffset;
  if (end <= start) return null;
  const quote = full.slice(start, end);
  if (!quote.trim() || quote.length > 1200) return null;
  return {
    quote,
    prefix: full.slice(Math.max(0, start - 40), start),
    suffix: full.slice(end, end + 40)
  };
}
function openComposer(anchor) {
  if (!anchor) return;
  state.pendingAnchor = anchor;
  $('note-quote').textContent = '“' + anchor.quote.trim() + '”';
  $('note-text').value = '';
  $('note-author').value = localStorage.getItem(LS.noteAuthor) || '';
  show($('note-composer')); show($('note-backdrop'));
  $('note-text').focus();
}
function closeComposer() {
  hide($('note-composer')); hide($('note-backdrop'));
  state.pendingAnchor = null;
  const s = window.getSelection(); if (s) s.removeAllRanges();
}
async function submitNote() {
  const text = $('note-text').value.trim();
  if (!text) { toast('Scrivi il testo della nota', true); return; }
  if (!state.current || !state.pendingAnchor) { closeComposer(); return; }
  const author = $('note-author').value.trim();
  lsSet(LS.noteAuthor, author);
  const a = state.pendingAnchor;
  const note = { chapter: state.current.path, quote: a.quote, prefix: a.prefix, suffix: a.suffix, text, author };
  closeComposer();
  loading(true, 'Salvo la nota…');
  try {
    const saved = await notesAdd(note);
    state.chapterNotes.push(saved);
    anchorAll();
    const shared = !String(saved.id).startsWith('loc-');
    toast(shared ? '✓ Nota condivisa: la vedranno tutti i lettori'
                 : '✓ Nota salvata solo su questo dispositivo (per condividerla aggiungi il token GitHub nelle impostazioni)');
    window.getSelection().removeAllRanges();
  } catch (e) {
    toast('Nota non salvata: ' + e.message, true);
  } finally { loading(false); }
}

/* ---- lettura / elenco delle note ---- */
function noteCard(n, showQuote) {
  const when = n.createdAt ? new Date(n.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const who = escHtml(n.author || 'Anonimo');
  const q = (n.quote || '').trim();
  const quote = showQuote
    ? `<div class="note-quote-ref" data-jump="${n.id}">“${escHtml(q.slice(0, 80))}${q.length > 80 ? '…' : ''}”</div>` : '';
  const del = (isMine(n.id) || String(n.id).startsWith('loc-'))
    ? `<button class="btn small ghost" data-del="${n.id}">Elimina</button>` : '';
  return `<div class="note-card">${quote}<div class="note-meta"><b>${who}</b>${when ? ' · ' + when : ''}</div>` +
    `<div class="note-body">${escHtml(n.text).replace(/\n/g, '<br>')}</div>${del}</div>`;
}
function wireNotePopup() {
  const box = $('note-popup-text');
  box.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
    const note = state.chapterNotes.find(n => n.id === b.dataset.del);
    if (!note || !confirm('Elimini questa nota?')) return;
    try {
      await notesDelete(note);
      state.chapterNotes = state.chapterNotes.filter(n => n.id !== note.id);
      closeNotePopup(); anchorAll(); toast('Nota eliminata');
    } catch (e) { toast('Non eliminata: ' + e.message, true); }
  });
  box.querySelectorAll('[data-jump]').forEach(el => el.onclick = () => jumpToNote(el.dataset.jump));
}
function openNotePopup(id) {
  const notes = state.chapterNotes.filter(n => n.id === id);
  if (!notes.length) return;
  $('note-popup-text').innerHTML = notes.map(n => noteCard(n, false)).join('');
  wireNotePopup();
  show($('note-popup')); show($('note-backdrop'));
}
function openNotesList() {
  const box = $('note-popup-text');
  if (!state.chapterNotes.length) {
    box.innerHTML = '<p class="note-empty">Nessuna nota in questo capitolo. Premi due volte su una parola del testo per aggiungerne una.</p>';
  } else {
    box.innerHTML = state.chapterNotes.map(n => noteCard(n, true)).join('');
  }
  wireNotePopup();
  show($('note-popup')); show($('note-backdrop'));
}
function closeNotePopup() { hide($('note-popup')); hide($('note-backdrop')); }
function jumpToNote(id) {
  closeNotePopup();
  const mark = document.querySelector(`mark.note-hl[data-note-id="${id}"]`);
  if (!mark) { toast('Il testo di questa nota non è più nel capitolo', true); return; }
  mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
  mark.classList.add('note-flash');
  setTimeout(() => mark.classList.remove('note-flash'), 1500);
}

function hideNoteUi() {
  closeComposer();
  closeNotePopup();
  if (typeof closeImgPopup === 'function') closeImgPopup();
}

/* ---- doppio tocco/click su una parola -> seleziona la parola ---- */
function selectWordAtPoint(x, y) {
  const root = $('reader-content');
  let node, offset;
  if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (!r) return false;
    node = r.startContainer; offset = r.startOffset;
  } else if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (!p) return false;
    node = p.offsetNode; offset = p.offset;
  } else return false;
  if (!node || node.nodeType !== Node.TEXT_NODE || !root.contains(node)) return false;
  const text = node.nodeValue || '';
  const isWord = c => !!c && /[\p{L}\p{N}'’\-]/u.test(c);
  let start = offset, end = offset;
  if (!isWord(text[start]) && isWord(text[start - 1])) { start--; end--; }
  while (start > 0 && isWord(text[start - 1])) start--;
  while (end < text.length && isWord(text[end])) end++;
  if (end <= start) return false;
  const range = document.createRange();
  range.setStart(node, start); range.setEnd(node, end);
  const sel = window.getSelection();
  sel.removeAllRanges(); sel.addRange(range);
  return true;
}

// Apre il composer per la parola su cui si e' premuto due volte.
// Con coordinate (tocco) seleziona prima la parola; senza (dblclick del
// mouse) usa la selezione che il browser ha gia' creato.
function noteFromWord(x, y) {
  if (currentMode() !== 'read') return;
  const byPoint = typeof x === 'number' && typeof y === 'number';
  if (byPoint && !selectWordAtPoint(x, y)) return;
  const info = selectionInfo();
  if (!info) {
    if (byPoint) window.getSelection().removeAllRanges();
    return;
  }
  openComposer(info);
}

function initNotesUi() {
  const reader = $('reader-content');

  // Se al momento della pressione c'e' gia' una selezione (una o piu' parole)
  // e si preme SOPRA di essa, memorizziamo la selezione PRIMA che il
  // tocco/click la annulli, per poterla trasformare in nota al rilascio.
  let tapInfo = null; // { info, x, y }
  const captureSelectionTap = (px, py) => {
    tapInfo = null;
    if (currentMode() !== 'read') return;
    const info = selectionInfo();
    if (!info) return;
    const sel = window.getSelection();
    const rects = sel.rangeCount ? [...sel.getRangeAt(0).getClientRects()] : [];
    const on = rects.some(r => px >= r.left - 6 && px <= r.right + 6 &&
                               py >= r.top - 6 && py <= r.bottom + 6);
    if (on) tapInfo = { info, x: px, y: py };
  };
  // Vale solo se il rilascio e' vicino alla pressione: cosi' un trascinamento
  // (nuova selezione) o uno scorrimento non aprono il composer per sbaglio.
  const releaseOnSelection = (x, y) => {
    if (!tapInfo) return null;
    const near = Math.abs(x - tapInfo.x) < 12 && Math.abs(y - tapInfo.y) < 12;
    const info = tapInfo.info; tapInfo = null;
    return near ? info : null;
  };

  reader.addEventListener('mousedown', e => captureSelectionTap(e.clientX, e.clientY));

  // Touch: un doppio tocco apre la nota SOLO se entrambi i tocchi sono "tap"
  // veri: dito fermo, pressione breve e pagina non in movimento. Scorrendo
  // veloce (due flick ravvicinati, o un tocco che ferma l'inerzia) il
  // conteggio del doppio tap si azzera e la nota non si apre piu' per sbaglio.
  const TAP_MAX_MS = 300;      // durata massima di un tap
  const TAP_MAX_MOVE = 10;     // movimento massimo del dito durante il tap (px)
  const DOUBLE_TAP_MS = 350;   // tempo massimo tra i due tap
  const DOUBLE_TAP_DIST = 30;  // distanza massima tra i due tap (px)
  const SCROLL_QUIET_MS = 150; // la pagina deve essere ferma da almeno tanto cosi'

  let lastScrollAt = 0;
  window.addEventListener('scroll', () => { lastScrollAt = Date.now(); }, { passive: true });

  let touchStart = null; // dati del tocco in corso {x, y, t, scrollY, scrolling}
  reader.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { touchStart = null; return; }
    const t = e.touches[0];
    touchStart = {
      x: t.clientX, y: t.clientY, t: Date.now(), scrollY: window.scrollY,
      scrolling: Date.now() - lastScrollAt < SCROLL_QUIET_MS // tocco che ferma l'inerzia
    };
    captureSelectionTap(t.clientX, t.clientY);
  }, { passive: true });

  // Desktop
  reader.addEventListener('mouseup', e => {
    const info = releaseOnSelection(e.clientX, e.clientY); // premuto su una selezione
    if (info) openComposer(info);
  });
  // Il doppio click seleziona gia' la parola: la trasformiamo in nota.
  reader.addEventListener('dblclick', () => { tapInfo = null; noteFromWord(); });

  // Touch: doppio tocco su una parola (il dblclick nativo non e' affidabile e
  // il doppio tap farebbe lo zoom) oppure tocco su una selezione esistente.
  let lastTap = 0, lastX = 0, lastY = 0;
  reader.addEventListener('touchend', e => {
    if (currentMode() !== 'read' || e.changedTouches.length !== 1) return;
    const t = e.changedTouches[0];
    const start = touchStart; touchStart = null;
    const isTap = start && !start.scrolling &&
      Date.now() - start.t <= TAP_MAX_MS &&
      Math.abs(t.clientX - start.x) <= TAP_MAX_MOVE &&
      Math.abs(t.clientY - start.y) <= TAP_MAX_MOVE &&
      Math.abs(window.scrollY - start.scrollY) < 3;
    if (!isTap) { lastTap = 0; tapInfo = null; return; } // flick / scorrimento: non conta
    const info = releaseOnSelection(t.clientX, t.clientY);
    if (info) { // premuto su una selezione di una o piu' parole
      lastTap = 0;
      e.preventDefault();
      openComposer(info);
      return;
    }
    const now = Date.now();
    if (now - lastTap < DOUBLE_TAP_MS &&
        Math.abs(t.clientX - lastX) < DOUBLE_TAP_DIST &&
        Math.abs(t.clientY - lastY) < DOUBLE_TAP_DIST) {
      lastTap = 0;
      e.preventDefault(); // evita zoom / avvio TTS sul doppio tocco
      noteFromWord(t.clientX, t.clientY);
    } else {
      lastTap = now; lastX = t.clientX; lastY = t.clientY;
    }
  }, { passive: false });

  $('note-save').onclick = submitNote;
  $('note-cancel').onclick = closeComposer;
  $('note-popup-close').onclick = closeNotePopup;
  $('note-backdrop').onclick = () => { closeComposer(); closeNotePopup(); closePdfPopup(); closeImgPopup(); };
  $('btn-notes').onclick = openNotesList;

  // toccare un'evidenziazione apre la relativa nota
  $('reader-content').addEventListener('click', e => {
    const mark = e.target.closest('mark.note-hl');
    if (mark) openNotePopup(mark.dataset.noteId);
  });
}

/* ---------------- Modalita' lettura / modifica ---------------- */
function setMode(mode) {
  hideNoteUi();
  if (mode === 'edit') {
    if (typeof ttsCloseBar === 'function') ttsCloseBar();
    if (typeof searchCloseBar === 'function') searchCloseBar();
    hide($('reader')); show($('editor')); show($('btn-save'));
    $('btn-mode').textContent = '📖'; // 📖
    $('btn-mode').title = 'Torna alla lettura';
  } else {
    show($('reader')); hide($('editor'));
    if (!state.dirty) hide($('btn-save'));
    $('btn-mode').textContent = '✏️'; // ✏️
    $('btn-mode').title = 'Modifica';
  }
}
/* ---- sincronizzazione della posizione tra lettura e modifica ----
 * Passando da una modalita' all'altra si resta sullo stesso punto del testo:
 * si prendono le prime parole visibili nella modalita' di partenza e si
 * cercano nel testo dell'altra. Se la ricerca fallisce (copertina, main.tex,
 * testo cambiato) si ripristina l'ultimo scroll salvato di quella modalita'. */
const normText = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Cerca una sequenza di parole in un testo normalizzato, tollerando fino a
// maxGap caratteri qualsiasi tra una parola e l'altra (comandi LaTeX ecc.).
function findWordsIndex(hay, words, maxGap) {
  for (let n = Math.min(6, words.length); n >= 2; n--) {
    try {
      const re = new RegExp(words.slice(0, n).join('[\\s\\S]{0,' + maxGap + '}?'), 'u');
      const m = re.exec(hay);
      if (m) return m.index;
    } catch (e) {}
  }
  const w = words.find(w => w.length >= 6);
  return w ? hay.indexOf(w) : -1;
}

// Prime parole di testo visibili nella lettura: si scorrono i nodi di testo
// nell'ordine del documento e si prende il primo che sporge sotto la barra
// in alto (misurato con i rettangoli dei Range, affidabile ovunque; il vecchio
// caretRangeFromPoint dava risultati diversi da browser a browser).
function readerVisibleWords() {
  try {
    const { nodes, full, starts } = readerTextIndex();
    const bar = $('topbar');
    const topY = (bar ? bar.getBoundingClientRect().bottom : 56) + 4;
    const range = document.createRange();
    for (const node of nodes) {
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      if (!rect || (!rect.height && !rect.width)) continue; // nodo non visibile
      if (rect.bottom <= topY) continue;                    // tutto sopra la barra
      let off = starts.get(node);
      if (rect.top < topY && node.nodeValue.length > 1) {
        // il nodo inizia sopra la barra: primo carattere visibile (ric. binaria)
        let lo = 0, hi = node.nodeValue.length - 1;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          range.setStart(node, mid); range.setEnd(node, mid + 1);
          if (range.getBoundingClientRect().bottom <= topY) lo = mid + 1; else hi = mid;
        }
        off += lo;
      }
      // full e' la concatenazione di tutti i nodi: 300 caratteri bastano
      // anche se il nodo trovato e' corto (si prosegue nei successivi)
      const words = normText(full.slice(off, off + 300)).match(/[\p{L}\p{N}]{3,}/gu);
      if (words && words.length >= 2) return words;
    }
  } catch (e) {}
  return null;
}

// Porta la lettura sul punto del capitolo che contiene le parole date.
function readerScrollToWords(words) {
  try {
    const { nodes, full, starts } = readerTextIndex();
    const off = findWordsIndex(normText(full), words, 40);
    if (off < 0) return false;
    for (const node of nodes) {
      const s = starts.get(node);
      if (off >= s && off < s + node.nodeValue.length) {
        const range = document.createRange();
        range.setStart(node, off - s);
        range.setEnd(node, Math.min(off - s + 1, node.nodeValue.length));
        const r = range.getBoundingClientRect();
        const top = (r && (r.top || r.height)) ? r.top
          : node.parentElement.getBoundingClientRect().top;
        window.scrollTo(0, Math.max(0, window.scrollY + top - 80));
        return true;
      }
    }
  } catch (e) {}
  return false;
}

// Copia invisibile dell'editor con gli stessi stili: serve a convertire
// indice nel testo <-> posizione verticale tenendo conto dell'a-capo
// automatico del textarea (le righe "logiche" non bastano).
function editorMirror(ta) {
  const cs = getComputedStyle(ta);
  const div = document.createElement('div');
  for (const p of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
                   'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'boxSizing'])
    div.style[p] = cs[p];
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.left = '-9999px';
  div.style.top = '0';
  div.style.width = ta.clientWidth + 'px';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflowWrap = 'break-word';
  document.body.appendChild(div);
  return div;
}

// Indice del primo carattere visibile in cima all'editor (ricerca binaria
// sull'altezza del testo misurata nella copia invisibile).
function editorTopIndex() {
  const ta = $('editor-area');
  if (!ta.scrollTop) return 0;
  if (!ta.clientWidth) return -1; // editor non visibile: impossibile misurare
  const div = editorMirror(ta);
  const target = ta.scrollTop;
  let lo = 0, hi = ta.value.length;
  while (hi - lo > 32) {
    const mid = (lo + hi) >> 1;
    div.textContent = ta.value.slice(0, mid);
    if (div.offsetHeight <= target) lo = mid; else hi = mid;
  }
  div.remove();
  return hi;
}

// Scorre l'editor fino a mostrare il carattere all'indice dato.
// Restituisce lo scroll di destinazione (per poterlo ri-applicare dopo).
function editorScrollToIndex(idx) {
  const ta = $('editor-area');
  if (!ta.clientWidth) return 0;
  const div = editorMirror(ta);
  div.textContent = ta.value.slice(0, Math.max(1, idx));
  const y = div.offsetHeight;
  div.remove();
  const line = parseFloat(getComputedStyle(ta).lineHeight) || 22;
  const top = Math.max(0, y - 2 * line);
  ta.scrollTop = top;
  return top;
}

// Prime parole "di prosa" (senza comandi LaTeX) dalla cima dell'editor:
// serviranno a ritrovare lo stesso punto nella lettura.
function editorVisibleWords() {
  const idx = editorTopIndex();
  if (idx < 0) return null;
  const snippet = $('editor-area').value.slice(idx, idx + 800)
    .replace(/\\(begin|end|label|index|ref|pageref|cite|includegraphics|input|vspace|hspace)\*?(\[[^\]]*\])?\{[^}]*\}/g, ' ')
    .replace(/%[^\n]*/g, ' ')
    .replace(/\\[a-zA-Z]+\*?/g, ' ')
    .replace(/[{}\[\]~]/g, ' ');
  const words = normText(snippet).match(/[\p{L}\p{N}]{3,}/gu);
  return words && words.length >= 2 ? words : null;
}

// Cambio di modalita' voluto dall'utente: conserva il punto in cui stava
// leggendo o modificando, così non lo perde passando da una all'altra.
function switchMode(mode) {
  const from = currentMode();
  if (from === mode) return;
  let words = null;
  if (from === 'read') {
    state.readScroll = window.scrollY;
    if (window.scrollY <= 40) { // inizio del capitolo: si va all'inizio del sorgente
      setMode(mode);
      $('editor-area').scrollTop = 0;
      return;
    }
    words = readerVisibleWords();
  } else {
    state.editScroll = $('editor-area').scrollTop;
    if (state.editScroll <= 20) { // inizio del sorgente: si va in cima alla lettura
      setMode(mode);
      window.scrollTo(0, 0);
      return;
    }
    words = editorVisibleWords(); // da chiamare PRIMA di nascondere l'editor
  }
  setMode(mode);
  // Lo scroll va applicato DOPO che la nuova vista e' visibile; su alcuni
  // browser (soprattutto su telefono) viene azzerato subito dopo il cambio,
  // quindi poco piu' tardi si ricontrolla e, se serve, si ri-applica.
  if (mode === 'edit') {
    const ta = $('editor-area');
    requestAnimationFrame(() => {
      const idx = words ? findWordsIndex(normText(ta.value), words, 300) : -1;
      const top = idx >= 0 ? editorScrollToIndex(idx) : (state.editScroll || 0);
      if (idx < 0) ta.scrollTop = top;
      setTimeout(() => {
        if (Math.abs(ta.scrollTop - top) > 40) ta.scrollTop = top;
      }, 250);
    });
  } else {
    requestAnimationFrame(() => {
      if (!words || !readerScrollToWords(words)) window.scrollTo(0, state.readScroll || 0);
      const applied = window.scrollY;
      setTimeout(() => {
        if (Math.abs(window.scrollY - applied) > 4) return; // l'utente si e' gia' mosso
        if (!words || !readerScrollToWords(words)) window.scrollTo(0, state.readScroll || 0);
      }, 250);
    });
  }
}
function currentMode() { return $('editor').classList.contains('hidden') ? 'read' : 'edit'; }

/* ---------------- Segnalibro automatico ----------------
 * Alla riapertura l'app riparte esattamente da dove si era rimasti:
 * capitolo, modalita' (lettura o modifica) e punto del testo. Il punto si
 * salva come prime parole visibili (ritrovabili anche se le immagini
 * caricate dopo spostano l'impaginazione) piu' lo scroll grezzo come
 * ripiego. Si aggiorna mentre si scorre e quando si lascia l'app
 * (cambio di app o scheda, blocco dello schermo, chiusura). */
function saveBookmark() {
  if (!state.current) return;
  const mode = currentMode();
  const bm = { path: state.current.path, mode };
  if (mode === 'edit') {
    bm.editScroll = $('editor-area').scrollTop;
  } else {
    bm.scrollY = window.scrollY;
    if (window.scrollY > 40) {
      const words = readerVisibleWords();
      if (words) bm.words = words.slice(0, 6);
    }
  }
  lsSet(LS.bookmark, JSON.stringify(bm));
}

function loadBookmark() {
  try { return JSON.parse(localStorage.getItem(LS.bookmark) || 'null'); }
  catch (e) { return null; }
}

// Riporta l'app al punto salvato; da chiamare a capitolo appena aperto.
function restoreBookmark(bm) {
  if (!bm || !state.current || state.current.path !== bm.path) return;
  if (bm.mode === 'edit') {
    if (currentMode() !== 'edit') setMode('edit');
    requestAnimationFrame(() => { $('editor-area').scrollTop = bm.editScroll || 0; });
    return;
  }
  if (state.current.editorOnly || !(bm.words || bm.scrollY)) return;
  // Le immagini arrivano dopo il testo e lo spostano: si ri-ancora alle
  // parole salvate anche piu' tardi, ma solo finche' il lettore non ha
  // gia' ripreso a scorrere per conto suo.
  let anchoredY = null;
  const apply = () => {
    if (!state.current || state.current.path !== bm.path || currentMode() !== 'read') return;
    if (anchoredY !== null && Math.abs(window.scrollY - anchoredY) > 4) return;
    if (bm.words && readerScrollToWords(bm.words)) anchoredY = window.scrollY;
    else if (anchoredY === null && bm.scrollY) { window.scrollTo(0, bm.scrollY); anchoredY = window.scrollY; }
  };
  requestAnimationFrame(apply);
  if (bm.words) { setTimeout(apply, 700); setTimeout(apply, 2000); }
}

/* ---------------- Ricerca nel capitolo (modalita' lettura) ----------------
 * Il pulsante 🔍 apre una riga di ricerca sotto la barra: mentre si scrive
 * vengono evidenziate tutte le occorrenze nel capitolo (ignorando maiuscole
 * e accenti) con il conteggio e i pulsanti ▲/▼ per saltare tra i risultati.
 * Efficienza: il testo del capitolo viene indicizzato una sola volta per
 * ricerca e le occorrenze si avvolgono dall'ultima alla prima, cosi' gli
 * indici calcolati restano validi mentre i nodi vengono spezzati. */
const search = { groups: [], idx: -1, capped: false };
const SEARCH_MAX = 400; // limite di occorrenze evidenziate

function searchClear() {
  const root = $('reader-content');
  root.querySelectorAll('mark.search-hl').forEach(m => {
    const p = m.parentNode;
    while (m.firstChild) p.insertBefore(m.firstChild, m);
    p.removeChild(m);
  });
  root.normalize();
  search.groups = []; search.idx = -1; search.capped = false;
  searchUpdateCount();
}

function searchUpdateCount() {
  const el = $('search-count');
  if (!el) return;
  const q = $('search-input').value.trim();
  if (q.length < 2) { el.textContent = ''; return; }
  const n = search.groups.length;
  if (!n) { el.textContent = '0'; return; }
  const tot = n + (search.capped ? '+' : '');
  el.textContent = (search.idx >= 0 ? (search.idx + 1) + '/' : '') + tot;
}

function searchApply() {
  searchClear();
  const q = normText($('search-input').value.trim());
  if (q.length < 2 || currentMode() !== 'read') { searchUpdateCount(); return; }
  const { nodes, full, starts } = readerTextIndex();
  // normalizza carattere per carattere tenendo la mappa verso gli indici
  // originali (togliere gli accenti puo' cambiare la lunghezza)
  let norm = ''; const map = [];
  for (let i = 0; i < full.length; i++) {
    const c = normText(full[i]);
    for (let j = 0; j < c.length; j++) map.push(i);
    norm += c;
  }
  // tutte le occorrenze, non sovrapposte
  const ranges = [];
  let from = 0;
  while (ranges.length < SEARCH_MAX) {
    const at = norm.indexOf(q, from);
    if (at < 0) break;
    ranges.push({ start: map[at], end: map[at + q.length - 1] + 1 });
    from = at + q.length;
  }
  search.capped = ranges.length >= SEARCH_MAX;
  if (!ranges.length) { searchUpdateCount(); return; }
  // estremi originali dei nodi, per trovare con una ricerca binaria il nodo
  // in cui inizia ogni occorrenza
  const bounds = nodes.map(n => ({ node: n, start: starts.get(n), end: starts.get(n) + n.nodeValue.length }));
  // dall'ultima occorrenza alla prima: gli splitText accorciano i nodi solo
  // in coda, quindi gli indici delle occorrenze precedenti restano validi
  const groups = [];
  for (let k = ranges.length - 1; k >= 0; k--) {
    const r = ranges[k];
    const marks = [];
    let lo = 0, hi = bounds.length - 1, first = bounds.length;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (bounds[mid].end > r.start) { first = mid; hi = mid - 1; } else lo = mid + 1;
    }
    for (let bi = first; bi < bounds.length && bounds[bi].start < r.end; bi++) {
      const node = bounds[bi].node, ns = bounds[bi].start;
      const s = Math.max(r.start, ns), e = Math.min(r.end, ns + node.nodeValue.length);
      if (s >= e) continue;
      let target = node;
      if (e - ns < target.nodeValue.length) target.splitText(e - ns);
      if (s - ns > 0) target = target.splitText(s - ns);
      const mark = document.createElement('mark');
      mark.className = 'search-hl';
      target.parentNode.replaceChild(mark, target);
      mark.appendChild(target);
      marks.push(mark);
    }
    if (marks.length) groups.unshift(marks); // un'occorrenza puo' occupare piu' nodi
  }
  search.groups = groups;
  searchUpdateCount();
}

function searchSetCurrent(i) {
  document.querySelectorAll('mark.search-hl.search-current')
    .forEach(m => m.classList.remove('search-current'));
  search.idx = i;
  const g = search.groups[i];
  if (g) {
    g.forEach(m => m.classList.add('search-current'));
    g[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  searchUpdateCount();
}

function searchJump(delta) {
  const n = search.groups.length;
  if (!n) return;
  const base = search.idx < 0 ? (delta > 0 ? -1 : 0) : search.idx;
  searchSetCurrent((base + delta + n) % n);
}

// Dopo una nuova ricerca: va alla prima occorrenza da qui in giu'
// (o alla prima del capitolo se sono tutte piu' in alto).
function searchJumpNearest() {
  if (!search.groups.length) return;
  const bar = $('topbar');
  const topY = bar ? bar.getBoundingClientRect().bottom : 56;
  let i = search.groups.findIndex(g => g[0].getBoundingClientRect().top >= topY);
  if (i < 0) i = 0;
  searchSetCurrent(i);
}

function searchOpenBar() {
  if (currentMode() === 'edit') switchMode('read');
  show($('search-bar'));
  const inp = $('search-input');
  inp.focus();
  try { inp.select(); } catch (e) {}
  if (inp.value.trim().length >= 2) { searchApply(); searchJumpNearest(); }
}

function searchCloseBar() {
  hide($('search-bar'));
  searchClear();
}

function initSearchUi() {
  const inp = $('search-input');
  let t = null;
  $('btn-search').onclick = () =>
    $('search-bar').classList.contains('hidden') ? searchOpenBar() : searchCloseBar();
  $('search-close').onclick = searchCloseBar;
  $('search-prev').onclick = () => searchJump(-1);
  $('search-next').onclick = () => searchJump(1);
  inp.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { searchApply(); searchJumpNearest(); }, 250);
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(t);
      if (!search.groups.length) { searchApply(); searchJumpNearest(); }
      else searchJump(e.shiftKey ? -1 : 1);
    } else if (e.key === 'Escape') searchCloseBar();
  });
}

function initBookmark() {
  let t = null;
  const later = () => { clearTimeout(t); t = setTimeout(saveBookmark, 400); };
  window.addEventListener('scroll', later, { passive: true });
  $('editor-area').addEventListener('scroll', later, { passive: true });
  // Momento decisivo: quando l'app va in secondo piano (o si chiude) la
  // posizione va scritta subito, senza aspettare il timer.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { clearTimeout(t); saveBookmark(); }
  });
  window.addEventListener('pagehide', () => { clearTimeout(t); saveBookmark(); });
}

/* ---- comandi di formattazione nell'editor (grassetto / corsivo) ----
 * Avvolge la selezione in \textbf{...} o \textit{...}. Se la selezione e'
 * gia' dentro al comando (o lo contiene per intero) lo toglie, cosi' i
 * pulsanti funzionano da interruttore. Senza selezione inserisce il comando
 * vuoto e lascia il cursore tra le graffe, pronto per scrivere. */
function editorWrapSelection(cmd) {
  if (currentMode() !== 'edit') return;
  const ta = $('editor-area');
  const start = ta.selectionStart, end = ta.selectionEnd;
  const sel = ta.value.slice(start, end);
  const open = '\\' + cmd + '{';
  const before = ta.value.slice(Math.max(0, start - open.length), start);
  if (before === open && ta.value[end] === '}') {
    // selezione gia' avvolta nel comando: lo rimuove
    ta.value = ta.value.slice(0, start - open.length) + sel + ta.value.slice(end + 1);
    ta.setSelectionRange(start - open.length, end - open.length);
  } else if (sel.startsWith(open) && sel.endsWith('}')) {
    // comando incluso per intero nella selezione: lo rimuove
    const inner = sel.slice(open.length, -1);
    ta.value = ta.value.slice(0, start) + inner + ta.value.slice(end);
    ta.setSelectionRange(start, start + inner.length);
  } else {
    ta.value = ta.value.slice(0, start) + open + sel + '}' + ta.value.slice(end);
    ta.setSelectionRange(start + open.length, start + open.length + sel.length);
  }
  ta.dispatchEvent(new Event('input')); // aggiorna dirty flag e pulsante salva
  ta.focus();
}

function initFormatUi() {
  const bind = (id, cmd) => {
    const b = $(id);
    // mousedown/touchend con preventDefault: premere il pulsante non deve
    // togliere il focus (e quindi la selezione) al textarea dell'editor
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('touchend', e => { e.preventDefault(); editorWrapSelection(cmd); });
    b.addEventListener('click', () => editorWrapSelection(cmd));
  };
  bind('btn-bold', 'textbf');
  bind('btn-italic', 'textit');
}

async function saveFile() {
  if (!state.current) return;
  if (!state.token) {
    state.pendingSave = true;
    initSetupScreen('Per salvare le modifiche sul repository serve un token GitHub: incollalo qui sotto e premi "Salva e continua".');
    return;
  }
  const newText = $('editor-area').value;
  loading(true, 'Salvo su GitHub…');
  try {
    const msg = 'Modifica ' + state.current.path + ' dalla web app';
    let res;
    try {
      res = await ghPutFile(state.current.path, newText, state.fileSha, msg);
    } catch (err) {
      if (err.status === 409 || err.status === 422) {
        // il file e' cambiato sul repo: riprova con lo sha aggiornato
        const fresh = await ghJson(`${API}/repos/${state.repo}/contents/${state.current.path}?ref=${state.branch}`);
        res = await ghPutFile(state.current.path, newText, fresh.sha, msg);
        toast('Attenzione: il file era cambiato sul repo, ho sovrascritto con la tua versione', true);
      } else throw err;
    }
    state.fileSha = res.content.sha;
    state.fileText = newText;
    state.dirty = false;
    hide($('dirty-flag'));
    lsSet(LS.fileCache + state.current.path, JSON.stringify({ sha: state.fileSha, text: newText }));
    if (!state.current.editorOnly) renderReader();
    if (state.current.path === 'main.tex') await buildToc(newText);
    toast('✓ Salvato: ' + state.current.path);
  } catch (err) {
    if (err.status === 403 || err.status === 401) {
      state.pendingSave = true;
      initSetupScreen('Il token non ha i permessi per scrivere su questo repository. ' +
        'Aprilo su GitHub (Settings → Developer settings → Fine-grained tokens): in "Repository access" scegli ' +
        '"Only select repositories" con ' + state.repo + ' e in "Permissions" imposta Contents = Read and write. ' +
        'Poi torna qui e premi "Salva e continua" (le tue modifiche non sono andate perse).');
      $('setup-error').textContent = 'GitHub ha risposto: ' + err.message;
      show($('setup-error'));
    } else {
      toast('Errore nel salvataggio: ' + err.message, true);
    }
  } finally {
    loading(false);
  }
}

/* ---------------- Avvio ---------------- */
async function buildToc(mainTexText) {
  let text = mainTexText;
  if (!text) text = (await ghGetFile('main.tex')).text;
  state.toc = parseMainTex(text);
  renderToc();
}

async function startApp() {
  hide($('setup-screen'));
  show($('app-screen'));
  loading(true, 'Carico l’indice del libro…');
  try {
    await buildToc();
    loadImagesIndex(); // prefetch in background
    const last = localStorage.getItem(LS.lastPath);
    const bm = loadBookmark(); // da leggere PRIMA di aprire (openChapter lo azzera)
    const entry = state.toc.find(e => e.path === last) || state.toc.find(e => !e.editorOnly);
    await openChapter(entry);
    restoreBookmark(bm); // riparte dal punto in cui si era rimasti
  } catch (err) {
    toast('Impossibile caricare il libro: ' + err.message, true);
    initSetupScreen('Non riesco a caricare il libro. Controlla repository e branch (se il repository è privato serve un token).');
    $('setup-error').textContent = err.message;
    show($('setup-error'));
  } finally {
    loading(false);
  }
}

function initSetupScreen(hint) {
  $('cfg-repo').value = state.repo;
  $('cfg-branch').value = state.branch;
  $('cfg-token').value = state.token;
  const nc = (window.LF_NOTES_CONFIG && window.LF_NOTES_CONFIG.firestore) || {};
  $('cfg-fb-project').value = localStorage.getItem(LS.fbProject) || nc.projectId || '';
  $('cfg-fb-key').value = localStorage.getItem(LS.fbKey) || nc.apiKey || '';
  // La dimensione del testo si applica e si salva subito, senza "Salva e continua"
  $('cfg-fontsize').value = localStorage.getItem(LS.fontSize) || '1';
  $('cfg-fontsize').onchange = () => {
    const v = $('cfg-fontsize').value;
    lsSet(LS.fontSize, v);
    applyFontScale(v);
  };
  // Anche il carattere si applica e si salva subito
  $('cfg-fontfamily').value = localStorage.getItem(LS.fontFamily) || 'serif';
  $('cfg-fontfamily').onchange = () => {
    const v = $('cfg-fontfamily').value;
    lsSet(LS.fontFamily, v);
    applyFontFamily(v);
  };
  const h = $('setup-hint');
  if (hint) { h.textContent = hint; show(h); } else hide(h);
  hide($('app-screen'));
  show($('setup-screen'));
  if (hint && /token/i.test(hint)) {
    const d = document.querySelector('.token-help');
    if (d) d.open = true;
    $('cfg-token').focus();
  }
  $('btn-connect').onclick = async () => {
    const sameRepo = $('cfg-repo').value.trim() === state.repo &&
      ($('cfg-branch').value.trim() || 'main') === state.branch;
    state.repo = $('cfg-repo').value.trim();
    state.branch = $('cfg-branch').value.trim() || 'main';
    state.token = $('cfg-token').value.trim();
    lsSet(LS.repo, state.repo);
    lsSet(LS.branch, state.branch);
    lsSet(LS.token, state.token);
    lsSet(LS.fbProject, $('cfg-fb-project').value.trim());
    lsSet(LS.fbKey, $('cfg-fb-key').value.trim());
    hide($('setup-error'));
    if (sameRepo && state.current) {
      // torna al libro senza ricaricare (preserva eventuali modifiche in corso)
      hide($('setup-screen'));
      show($('app-screen'));
      if (state.pendingSave && state.token) { state.pendingSave = false; saveFile(); }
      else if (state.token) toast('Token salvato ✓');
    } else {
      state.pendingSave = false;
      startApp();
    }
  };
}

/* ---------------- Dimensione del testo di lettura ---------------- */
// Scala scelta nelle impostazioni (0.85, 1, 1.15, 1.3): moltiplica la
// dimensione base del testo di lettura tramite la variabile CSS --font-scale.
function applyFontScale(v) {
  const scale = parseFloat(v) || 1;
  document.documentElement.style.setProperty('--font-scale', scale);
}
function initFontScale() {
  applyFontScale(localStorage.getItem(LS.fontSize) || '1');
}

/* ---------------- Carattere del testo (serif / sans serif) ---------------- */
// Scelta nelle impostazioni: 'serif' (default) o 'sans'. Il CSS applica la
// famiglia corrispondente tramite l'attributo data-font sull'elemento <html>.
function applyFontFamily(v) {
  document.documentElement.setAttribute('data-font', v === 'sans' ? 'sans' : 'serif');
}
function initFontFamily() {
  applyFontFamily(localStorage.getItem(LS.fontFamily) || 'serif');
}

/* ---------------- Lettura notturna (tema chiaro/scuro) ---------------- */
// Tema effettivo corrente: la scelta salvata dall'utente oppure, se assente,
// la preferenza del sistema operativo.
function currentTheme() {
  const saved = localStorage.getItem(LS.theme);
  if (saved === 'dark' || saved === 'light') return saved;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark' : 'light';
}

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  const btn = $('btn-theme');
  if (btn) {
    btn.textContent = dark ? '☀️' : '🌙';
    btn.title = dark ? 'Lettura diurna' : 'Lettura notturna';
    btn.setAttribute('aria-label', btn.title);
  }
  // Adegua il colore della barra di stato (PWA a schermo intero).
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0e0e12' : '#1a1a2e');
}

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  lsSet(LS.theme, next);
  applyTheme(next);
}

function initTheme() {
  applyTheme(currentTheme());
  $('btn-theme').onclick = toggleTheme;
  // Se l'utente non ha ancora scelto, segui i cambi di tema del sistema.
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!localStorage.getItem(LS.theme)) applyTheme(currentTheme()); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
  }
}

function initUi() {
  $('btn-toc').onclick = openToc;
  $('btn-toc-close').onclick = closeToc;
  $('toc-backdrop').onclick = closeToc;
  $('btn-mode').onclick = () => switchMode(currentMode() === 'read' ? 'edit' : 'read');
  $('btn-save').onclick = saveFile;
  $('btn-pdf').onclick = () => {
    closeToc();
    $('pdf-status').className = 'hidden';
    $('pdf-links').className = 'hidden';
    $('pdf-links').innerHTML = '';
    $('pdf-start').disabled = false;
    show($('note-backdrop')); show($('pdf-popup'));
    pdfShowLast(); // in sottofondo: link agli ultimi PDF già generati
  };
  $('pdf-close').onclick = closePdfPopup;
  $('pdf-start').onclick = runPdfGeneration;
  $('btn-refresh').onclick = async () => {
    closeToc();
    state.imagesIndex = null;
    await buildToc();
    if (state.current) openChapter(state.current, true);
    toast('Indice ricaricato');
  };
  $('btn-logout').onclick = () => {
    closeToc();
    hide($('app-screen'));
    initSetupScreen();
  };
  $('editor-area').addEventListener('input', () => {
    state.dirty = $('editor-area').value !== state.fileText;
    state.dirty ? show($('dirty-flag')) : hide($('dirty-flag'));
    state.dirty ? show($('btn-save')) : null;
  });
  $('fn-popup-close').onclick = () => hide($('fn-popup'));
  window.addEventListener('beforeunload', e => {
    if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
  });
  // Ctrl/Cmd+S per salvare; Ctrl/Cmd+B e Ctrl/Cmd+I per grassetto e corsivo
  window.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 's') { e.preventDefault(); if (currentMode() === 'edit') saveFile(); }
    else if (k === 'b' && currentMode() === 'edit') { e.preventDefault(); editorWrapSelection('textbf'); }
    else if (k === 'i' && currentMode() === 'edit') { e.preventDefault(); editorWrapSelection('textit'); }
  });
}

/* =========================================================================
 * Lettura ad alta voce (TTS)
 * ========================================================================= */
const TTS_LS = { rate: 'lf.ttsRate', voice: 'lf.ttsVoice' };
const tts = {
  queue: [],      // elementi del capitolo da leggere, in ordine
  idx: 0,         // elemento corrente
  chunkIdx: 0,    // frase corrente dentro l'elemento
  chunks: [],
  playing: false,
  gen: 0,         // contatore per invalidare gli utterance in coda
  errStreak: 0,   // errori consecutivi di sintesi
  voices: [],
  wakeLock: null
};
const TTS_SEL = 'h1,h2,h3,h4,p,li,blockquote,.epigraph,.msg,.flushright';

function ttsSupported() { return 'speechSynthesis' in window; }

function ttsCollectVoices() {
  if (!ttsSupported()) return;
  const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('it'));
  // preferisci le voci piu' naturali: neurali/online prima delle robotiche locali
  const score = v =>
    (/natural|neural|premium|enhanced|wavenet/i.test(v.name) ? 8 : 0) +
    (/google/i.test(v.name) ? 4 : 0) +
    (v.localService ? 0 : 2);
  vs.sort((a, b) => score(b) - score(a));
  tts.voices = vs;
  const sel = $('tts-voice');
  sel.innerHTML = '';
  if (!vs.length) {
    const o = document.createElement('option');
    o.textContent = 'voce predefinita del dispositivo';
    sel.appendChild(o);
    return;
  }
  const saved = localStorage.getItem(TTS_LS.voice);
  vs.forEach((v, i) => {
    const o = document.createElement('option');
    o.value = v.name;
    o.textContent = v.name.replace(/^(Microsoft|Google)\s*/i, '') + (v.localService ? '' : ' · online');
    if (v.name === saved || (!saved && i === 0)) o.selected = true;
    sel.appendChild(o);
  });
}

function ttsPickedVoice() {
  const name = $('tts-voice').value;
  return tts.voices.find(v => v.name === name) || tts.voices[0] || null;
}

function ttsBuildQueue() {
  const root = $('reader-content');
  tts.queue = [...root.querySelectorAll(TTS_SEL)].filter(el => {
    if (el.closest('.endnotes') || el.closest('figure') || el.closest('.cover-page')) return false;
    if (el.querySelector(TTS_SEL)) return false; // tieni solo i "blocchi foglia"
    return ttsTextOf(el).length > 0;
  });
  tts.idx = 0; tts.chunkIdx = 0;
}

function ttsTextOf(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('sup.fnref, .img-loading, img').forEach(n => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

function ttsSplit(text) {
  // spezza in frasi e raggruppa in blocchi brevi (Chrome tronca gli utterance lunghi)
  const sentences = text.match(/[^.!?…]+[.!?…]+[»"”')\]]*\s*|[^.!?…]+$/g) || [text];
  const chunks = [];
  let cur = '';
  for (const s of sentences) {
    if (cur && (cur + s).length > 220) { chunks.push(cur.trim()); cur = s; }
    else cur += s;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

function ttsHighlight(el) {
  document.querySelectorAll('.tts-current').forEach(n => n.classList.remove('tts-current'));
  if (el) {
    el.classList.add('tts-current');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function ttsWakeLock(on) {
  try {
    if (on && 'wakeLock' in navigator && !tts.wakeLock) {
      tts.wakeLock = await navigator.wakeLock.request('screen');
      tts.wakeLock.addEventListener('release', () => { tts.wakeLock = null; });
    } else if (!on && tts.wakeLock) {
      await tts.wakeLock.release();
      tts.wakeLock = null;
    }
  } catch (e) {}
}

function ttsSpeakChunk() {
  const gen = tts.gen;
  if (!tts.playing || tts.idx >= tts.queue.length) { ttsStop(); return; }
  const el = tts.queue[tts.idx];
  if (tts.chunkIdx === 0) {
    tts.chunks = ttsSplit(ttsTextOf(el));
    ttsHighlight(el);
  }
  if (tts.chunkIdx >= tts.chunks.length) {
    tts.idx++; tts.chunkIdx = 0;
    ttsSpeakChunk();
    return;
  }
  const u = new SpeechSynthesisUtterance(tts.chunks[tts.chunkIdx]);
  u.lang = 'it-IT';
  const v = ttsPickedVoice();
  if (v) u.voice = v;
  u.rate = parseFloat($('tts-rate').value) || 1;
  u.onend = () => {
    if (gen !== tts.gen || !tts.playing) return;
    tts.errStreak = 0;
    tts.chunkIdx++;
    ttsSpeakChunk();
  };
  u.onerror = ev => {
    if (gen !== tts.gen || !tts.playing) return;
    if (ev.error === 'interrupted' || ev.error === 'canceled') return;
    if (++tts.errStreak >= 3) {
      ttsStop();
      toast('La sintesi vocale non funziona su questo dispositivo: controlla che sia installata una voce italiana', true);
      return;
    }
    tts.chunkIdx++;
    ttsSpeakChunk();
  };
  speechSynthesis.speak(u);
}

function ttsPlay(fromIdx) {
  if (!ttsSupported()) { toast('La sintesi vocale non è disponibile su questo browser', true); return; }
  if (!tts.queue.length) ttsBuildQueue();
  if (!tts.queue.length) { toast('Niente da leggere in questa pagina', true); return; }
  speechSynthesis.cancel();
  tts.gen++;
  if (typeof fromIdx === 'number') { tts.idx = Math.max(0, Math.min(fromIdx, tts.queue.length - 1)); tts.chunkIdx = 0; }
  tts.playing = true;
  $('tts-play').textContent = '⏸';
  $('tts-play').title = 'Pausa';
  ttsWakeLock(true);
  ttsSpeakChunk();
}

function ttsPause() {
  tts.playing = false;
  tts.gen++;
  speechSynthesis.cancel();  // riprenderemo dall'inizio della frase corrente
  $('tts-play').textContent = '▶';
  $('tts-play').title = 'Ascolta';
  ttsWakeLock(false);
}

function ttsStop() {
  ttsPause();
  tts.idx = 0; tts.chunkIdx = 0;
  ttsHighlight(null);
}

function ttsSkip(delta) {
  const wasPlaying = tts.playing;
  tts.gen++;
  speechSynthesis.cancel();
  tts.idx = Math.max(0, Math.min(tts.idx + delta, tts.queue.length - 1));
  tts.chunkIdx = 0;
  ttsHighlight(tts.queue[tts.idx]);
  if (wasPlaying) { tts.playing = true; ttsSpeakChunk(); }
}

function ttsOpenBar() {
  ttsBuildQueue();
  ttsCollectVoices();
  show($('tts-bar'));
  document.body.classList.add('tts-open');
}

function ttsCloseBar() {
  ttsStop();
  hide($('tts-bar'));
  document.body.classList.remove('tts-open');
}

function initTts() {
  if (!ttsSupported()) { hide($('btn-tts')); return; }
  $('tts-rate').value = localStorage.getItem(TTS_LS.rate) || '1';
  speechSynthesis.onvoiceschanged = ttsCollectVoices;
  ttsCollectVoices();

  $('btn-tts').onclick = () => {
    if ($('tts-bar').classList.contains('hidden')) {
      if (currentMode() === 'edit') setMode('read');
      ttsOpenBar();
    } else ttsCloseBar();
  };
  $('tts-close').onclick = ttsCloseBar;
  $('tts-play').onclick = () => tts.playing ? ttsPause() : ttsPlay();
  $('tts-prev').onclick = () => ttsSkip(-1);
  $('tts-next').onclick = () => ttsSkip(1);
  $('tts-rate').onchange = () => {
    lsSet(TTS_LS.rate, $('tts-rate').value);
    if (tts.playing) { tts.gen++; speechSynthesis.cancel(); ttsSpeakChunk(); }
  };
  $('tts-voice').onchange = () => {
    lsSet(TTS_LS.voice, $('tts-voice').value);
    if (tts.playing) { tts.gen++; speechSynthesis.cancel(); ttsSpeakChunk(); }
  };
  // toccando un paragrafo (con la barra aperta) la lettura parte da li'
  $('reader-content').addEventListener('click', e => {
    if ($('tts-bar').classList.contains('hidden')) return;
    if (e.target.closest('sup.fnref') || e.target.closest('mark.note-hl')) return; // note e annotazioni restano toccabili
    const el = e.target.closest(TTS_SEL);
    if (!el || el.closest('.endnotes')) return;
    const i = tts.queue.indexOf(el);
    if (i >= 0) ttsPlay(i);
  });
  // se cambia pagina o si passa all'editor, ferma la lettura
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && tts.playing) ttsWakeLock(true);
  });
}

/* ---------------- Service worker ---------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* ---------------- Boot ---------------- */
// Ripara i titoli salvati in passato con gli accenti LaTeX non convertiti
// (es. "continuit\`a" -> "continuità"), così indice e barra tornano leggibili.
(function fixCachedTitles() {
  let changed = false;
  for (const k in state.titles) {
    const fixed = latexAccentsToText(state.titles[k]);
    if (fixed !== state.titles[k]) { state.titles[k] = fixed; changed = true; }
  }
  if (changed) lsSet(LS.titles, JSON.stringify(state.titles));
})();
initFontScale();
initFontFamily();
initTheme();
initUi();
initBookmark();
initSearchUi();
initNotesUi();
initImgUi();
initFormatUi();
initTts();
// Il libro si apre subito (il repository e' pubblico, per leggere non serve nulla).
// Le impostazioni/token compaiono solo per salvare o se il caricamento fallisce.
startApp();
