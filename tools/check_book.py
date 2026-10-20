import re, sys, os, collections
os.chdir(sys.argv[1])
def strip(s):  # remove LaTeX comments
    return "\n".join(re.sub(r'(?<!\\)%.*','',l) for l in s.split("\n"))
read=lambda p: open(p,encoding='utf-8',errors='replace').read()
main=strip(read('main.tex'))
inputs=re.findall(r'\\(?:input|include)\{([^}]+)\}',main)
active=[]
for i in inputs:
    p=i if i.endswith('.tex') else i+'.tex'
    if not os.path.exists(p): print("MISSING INPUT:",p)
    else: active.append(p)
# nested inputs
seen=set(active); q=list(active)
while q:
    f=q.pop()
    for i in re.findall(r'\\(?:input|include)\{([^}]+)\}',strip(read(f))):
        p=i if i.endswith('.tex') else i+'.tex'
        if os.path.exists(p) and p not in seen: seen.add(p);q.append(p)
active=sorted(seen)
alltex=[os.path.join(d,f) for d,_,fs in os.walk('.') for f in fs if f.endswith('.tex') and '.git' not in d]
alltex=[p[2:] for p in alltex]
print("== FILE .tex NON INCLUSI (orfani/old) ==")
for p in sorted(alltex):
    if p not in active: print("  ",p)
print("\n== IMMAGINI ==")
imgs=set(os.listdir('images')) if os.path.isdir('images') else set()
used=set()
for f in active:
    t=strip(read(f))
    for m in re.finditer(r'\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}',t):
        n=m.group(1); used.add(os.path.basename(n))
        ok=os.path.exists(n) or any(os.path.exists(n+e) for e in ('.png','.jpg','.jpeg','.pdf'))
        if not ok: print(f"  RIFERIMENTO ROTTO {f}: {n}")
    for m in re.finditer(r'\\begin\{figure\}.*?\\end\{figure\}',t,re.S):
        b=m.group(0)
        if '\\caption' not in b: print(f"  figura senza caption in {f}")
        if '\\label' not in b: print(f"  figura senza label in {f}")
        if 'includegraphics' not in b: print(f"  figura senza immagine in {f}")
    for m in re.finditer(r'\{\{?\s*(?:FIGURA|IMMAGINE|TODO|DA INSERIRE)[^}]*\}',t,re.I): print(f"  segnaposto in {f}: {m.group(0)[:60]}")
print("  immagini in images/ mai usate:",sorted(i for i in imgs if i not in used and not i.startswith('.')))
print("\n== LABEL / REF ==")
labels=collections.Counter(); refs=[]
for f in active:
    t=strip(read(f))
    for l in re.findall(r'\\label\{([^}]+)\}',t): labels[l]+=1
    for r in re.findall(r'\\(?:ref|pageref|autoref|cref|Cref|nameref|vref)\{([^}]+)\}',t): refs.append((f,r))
mt=main+strip(read('misc/options.tex')) if os.path.exists('misc/options.tex') else main
for l in re.findall(r'\\label\{([^}]+)\}',mt): labels[l]+=1
for l,c in labels.items():
    if c>1: print("  label duplicata:",l)
for f,r in refs:
    if r not in labels: print(f"  ref senza label {f}: {r}")
print("  totale label",len(labels),"ref",len(refs))
print("\n== SORA / DEEPFAKE ==")
for f in active+['main.tex']:
    for n,l in enumerate(read(f).split("\n"),1):
        if re.search(r'sora',l,re.I): print(f"  {f}:{n}: {l.strip()[:110]}")
print("\n== FORMATTAZIONE: ambienti e comandi usati per file ==")
env=collections.defaultdict(set); cmds=collections.defaultdict(set)
for f in active:
    t=strip(read(f))
    for e in re.findall(r'\\begin\{([^}]+)\}',t): env[e].add(f)
    for c in re.findall(r'\\([a-zA-Z]+)',t): cmds[c].add(f)
print("  ambienti usati in pochi file (possibile incoerenza):")
for e,fs in sorted(env.items(),key=lambda x:len(x[1])):
    if len(fs)<=2: print("   ",e,"->",sorted(fs))
print("  macro custom definite:",)
defs=set(re.findall(r'\\(?:newcommand|renewcommand|newtcolorbox|newenvironment|DeclareRobustCommand)\*?\{?\\?([a-zA-Z]+)',strip(read('main.tex')+read('misc/options.tex'))))
print("   ",sorted(defs))
print("  macro custom mai usate:",sorted(d for d in defs if d not in cmds and d not in env))
print("\n== STILE: virgolette e trattini ==")
for f in active:
    t=strip(read(f))
    s=[]
    if '"' in t: s.append(f'"dritte"={t.count(chr(34))}')
    if re.search(r'``',t): s.append("``tex``")
    if re.search(r'[«»]',t): s.append("«»")
    if re.search(r'[“”]',t): s.append("“”")
    if '--' in t: s.append("--")
    if '—' in t: s.append("—em")
    if '...' in t: s.append("...")
    if re.search(r'  +\S',t.replace('\n','')) and False: pass
    print(f"  {f}: {' '.join(s)}")
print("\n== STRUTTURA: capitoli e sezioni ==")
for f in active:
    t=strip(read(f)); 
    ch=re.findall(r'\\chapter\*?\{([^}]*)\}',t); sec=len(re.findall(r'\\section',t)); 
    w=len(re.sub(r'\\[a-zA-Z]+|[{}]',' ',t).split())
    print(f"  {f}: {w}p, {sec} sez, chap={ch[:1] if ch else 'NESSUN \\chapter'}")
