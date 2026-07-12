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
  theme: 'lf.theme'
};
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
function textToB64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000)
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
async function ghGetFile(path) {
  try {
    const j = await ghJson(`${API}/repos/${state.repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${state.branch}`);
    const text = b64ToText(j.content);
    try { localStorage.setItem(LS.fileCache + path, JSON.stringify({ sha: j.sha, text })); } catch (e) {}
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
  return ghJson(`${API}/repos/${state.repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: textToB64(text), sha, branch: state.branch })
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

// Trova il run appena avviato (creato dopo `since`), ritentando finché appare
async function ghFindNewRun(since) {
  const url = `${API}/repos/${state.repo}/actions/workflows/${PDF_WORKFLOW}/runs?event=workflow_dispatch&per_page=10`;
  for (let i = 0; i < 20; i++) {
    const j = await ghJson(url);
    const run = (j.workflow_runs || [])
      .filter(r => new Date(r.created_at).getTime() >= since - 15000)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    if (run) return run;
    await sleep(3000);
  }
  return null;
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

  try {
    const since = Date.now();
    pdfSetStatus('Avvio della compilazione…', '', true);
    await ghDispatchWorkflow(mode);

    pdfSetStatus('Compilazione avviata, cerco il processo…', '', true);
    const run = await ghFindNewRun(since);
    if (!run) {
      pdfSetStatus('Avviata, ma non riesco a seguirne lo stato. Controlla il tab Actions su GitHub.', 'err');
      startBtn.disabled = false;
      return;
    }

    // Segui lo stato fino al completamento (max ~15 min)
    let current = run;
    for (let i = 0; i < 150; i++) {
      const label = current.status === 'queued' ? 'In coda…'
                  : current.status === 'in_progress' ? 'Compilazione in corso…'
                  : 'Completamento…';
      pdfSetStatus(label + ' (il libro è lungo, servono alcuni minuti)', '', true);
      if (current.status === 'completed') break;
      await sleep(6000);
      current = await ghJson(`${API}/repos/${state.repo}/actions/runs/${current.id}`);
    }

    const runUrl = current.html_url;
    if (current.conclusion === 'success') {
      pdfSetStatus('PDF pronto! Aprilo dalla pagina del processo e scarica l’artifact.', 'ok');
      $('pdf-links').innerHTML =
        `<a href="${runUrl}#artifacts" target="_blank" rel="noopener">⬇️ Apri e scarica il PDF</a>` +
        `<a class="secondary" href="${runUrl}" target="_blank" rel="noopener">Dettagli del processo</a>`;
      show($('pdf-links'));
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
    let hint = e.message;
    if (e.status === 403 || e.status === 404) {
      hint = 'Permesso negato. Il token deve avere anche “Actions: Read and write” e il workflow deve essere presente sul branch predefinito. (' + e.message + ')';
    }
    pdfSetStatus(hint, 'err');
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
    return m ? m[1].trim() : '';
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
    const comment = (m[2] || '').trim();
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
    localStorage.setItem(LS.lastPath, entry.path);

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
      const plain = t.replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?/g, '').replace(/[{}]/g, '').trim();
      if (plain) {
        entry.title = plain;
        state.titles[entry.path] = plain;
        localStorage.setItem(LS.titles, JSON.stringify(state.titles));
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
 * Note al testo — chiunque puo' annotare, salvate in locale o condivise
 * (Firestore). La configurazione condivisa sta in notes-config.js.
 * ========================================================================= */
const FS_BASE = 'https://firestore.googleapis.com/v1';

function notesConfig() {
  const base = (window.LF_NOTES_CONFIG && window.LF_NOTES_CONFIG.firestore) || {};
  const projectId = (localStorage.getItem(LS.fbProject) || base.projectId || '').trim();
  const apiKey = (localStorage.getItem(LS.fbKey) || base.apiKey || '').trim();
  return { mode: (projectId && apiKey) ? 'firestore' : 'local', projectId, apiKey };
}

function markMine(id) {
  const s = new Set(JSON.parse(localStorage.getItem(LS.myNotes) || '[]'));
  s.add(id);
  try { localStorage.setItem(LS.myNotes, JSON.stringify([...s])); } catch (e) {}
}
function isMine(id) {
  return new Set(JSON.parse(localStorage.getItem(LS.myNotes) || '[]')).has(id);
}
function localNotes(chapter) {
  return JSON.parse(localStorage.getItem(LS.notesCache + chapter) || '[]');
}
function saveLocalNotes(chapter, list) {
  try { localStorage.setItem(LS.notesCache + chapter, JSON.stringify(list)); } catch (e) {}
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
  if (cfg.mode === 'local') return localNotes(chapter);
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
  if (cfg.mode === 'local') {
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
  if (cfg.mode === 'local' || String(note.id).startsWith('loc-')) {
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
function selectionRect() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const rects = sel.getRangeAt(0).getClientRects();
  return rects.length ? rects[rects.length - 1] : null;
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
}
async function submitNote() {
  const text = $('note-text').value.trim();
  if (!text) { toast('Scrivi il testo della nota', true); return; }
  if (!state.current || !state.pendingAnchor) { closeComposer(); return; }
  const author = $('note-author').value.trim();
  try { localStorage.setItem(LS.noteAuthor, author); } catch (e) {}
  const a = state.pendingAnchor;
  const note = { chapter: state.current.path, quote: a.quote, prefix: a.prefix, suffix: a.suffix, text, author };
  closeComposer();
  loading(true, 'Salvo la nota…');
  try {
    const saved = await notesAdd(note);
    state.chapterNotes.push(saved);
    anchorAll();
    const shared = notesConfig().mode === 'firestore';
    toast(shared ? '✓ Nota condivisa con tutti' : '✓ Nota salvata (solo su questo dispositivo)');
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
    box.innerHTML = '<p class="note-empty">Nessuna nota in questo capitolo. Seleziona una frase del testo per aggiungerne una.</p>';
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
  hide($('note-add-btn'));
  closeComposer();
  closeNotePopup();
}

function initNotesUi() {
  const addBtn = $('note-add-btn');
  const updateAddBtn = () => {
    if (currentMode() !== 'read') { hide(addBtn); return; }
    const info = selectionInfo();
    if (!info) { hide(addBtn); return; }
    const rect = selectionRect();
    if (!rect) { hide(addBtn); return; }
    state.pendingAnchor = info;
    addBtn.style.top = (window.scrollY + rect.top - 42) + 'px';
    addBtn.style.left = (window.scrollX + rect.left) + 'px';
    show(addBtn);
  };
  document.addEventListener('selectionchange', () => {
    clearTimeout(state._selTimer);
    state._selTimer = setTimeout(updateAddBtn, 150);
  });
  addBtn.addEventListener('mousedown', e => e.preventDefault()); // non perdere la selezione
  addBtn.addEventListener('click', () => { const a = state.pendingAnchor; hide(addBtn); openComposer(a); });

  $('note-save').onclick = submitNote;
  $('note-cancel').onclick = closeComposer;
  $('note-popup-close').onclick = closeNotePopup;
  $('note-backdrop').onclick = () => { closeComposer(); closeNotePopup(); closePdfPopup(); };
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
// Cambio di modalita' voluto dall'utente: conserva il punto in cui stava
// leggendo o modificando, così non lo perde passando da una all'altra.
function switchMode(mode) {
  const from = currentMode();
  if (from === mode) return;
  if (from === 'read') state.readScroll = window.scrollY;
  else state.editScroll = $('editor-area').scrollTop;
  setMode(mode);
  if (mode === 'read') {
    requestAnimationFrame(() => window.scrollTo(0, state.readScroll || 0));
  } else {
    requestAnimationFrame(() => { $('editor-area').scrollTop = state.editScroll || 0; });
  }
}
function currentMode() { return $('editor').classList.contains('hidden') ? 'read' : 'edit'; }

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
    try { localStorage.setItem(LS.fileCache + state.current.path, JSON.stringify({ sha: state.fileSha, text: newText })); } catch (e) {}
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
    const entry = state.toc.find(e => e.path === last) || state.toc.find(e => !e.editorOnly);
    await openChapter(entry);
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
    localStorage.setItem(LS.repo, state.repo);
    localStorage.setItem(LS.branch, state.branch);
    localStorage.setItem(LS.token, state.token);
    localStorage.setItem(LS.fbProject, $('cfg-fb-project').value.trim());
    localStorage.setItem(LS.fbKey, $('cfg-fb-key').value.trim());
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
  try { localStorage.setItem(LS.theme, next); } catch (e) {}
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
  // Ctrl/Cmd+S per salvare
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (currentMode() === 'edit') saveFile(); }
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
    localStorage.setItem(TTS_LS.rate, $('tts-rate').value);
    if (tts.playing) { tts.gen++; speechSynthesis.cancel(); ttsSpeakChunk(); }
  };
  $('tts-voice').onchange = () => {
    localStorage.setItem(TTS_LS.voice, $('tts-voice').value);
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
initTheme();
initUi();
initNotesUi();
initTts();
// Il libro si apre subito (il repository e' pubblico, per leggere non serve nulla).
// Le impostazioni/token compaiono solo per salvare o se il caricamento fallisce.
startApp();
