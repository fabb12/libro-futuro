# Guida alla revisione narrativa (novembre 2026)

Documento di lavoro condiviso per la revisione strutturale di *Memorie di un futuro anteriore*.

## 1. Il titolo e la tesi

**Domanda centrale del libro**, a cui ogni capitolo deve contribuire: *come può una mente che distorce la realtà creare macchine che influenzeranno la realtà del futuro?*

**Significato del titolo.** Il futuro anteriore è il tempo verbale di ciò che «sarà stato» («quando leggerai, avrò già deciso»). Tre livelli:
1. **La memoria serve a immaginare il futuro.** Le stesse reti cerebrali che ricostruiscono il passato servono a simulare il futuro (Schacter e Addis, 2007; Hassabis et al., 2007, pazienti amnesici con lesioni ippocampali che faticano a immaginare esperienze nuove). Ricordare è già prevedere, e un ricordo distorto produce previsioni distorte.
2. **Le macchine sono fatte di memorie.** I sistemi di IA sono addestrati sulle tracce del nostro passato (testi, dati, decisioni registrate) e le usano per prevedere e orientare ciò che verrà. Sono, letteralmente, memorie che producono futuro.
3. **Le decisioni di oggi saranno i dati di domani.** Ciò che scegliamo ora, con i nostri bias, *sarà stato* il materiale su cui impareranno le macchine che influenzeranno il futuro. Il futuro anteriore è il tempo della responsabilità.

## 2. Nuovo ordine dei capitoli

**Prologo** (`content/prologo.tex`)

**Parte I · La mente inaspettata** — come la mente costruisce la realtà
1. `part1/chapter1` L'architettura impossibile del cervello (label `cap:p1c1`)
2. `part1/chapter6` Memoria: l'archivista bugiardo (`cap:p1c6`) — ANTICIPATO al secondo posto
3. `part1/chapter2` L'eredità del terrore e i due piloti della mente (`cap:p1c2`)
4. `part1/chapter7` L'illusione di essere razionali (`cap:p1c7`)
5. `part1/chapter22` La dissonanza cognitiva (`cap:p1c22`)
6. `part1/chapter9` La continuità evolutiva dei bias: dal topo all'intelligenza collettiva (`cap:p1c9`)

**Parte II · La mente fuori posto** — come questa costruzione influenza le decisioni
- *Decisioni e conseguenze*
  7. `part2/chapter14` Il casinò nella testa — finanza (`cap:p2c14`)
  8. `part2/chapter15` Dottori, pazienti e l'arte di sbagliarsi — medicina (`cap:p2c15`)
  9. `part2/chapter28` Quando la giustizia sbaglia — giustizia (`cap:p2c28`)
  10. `part2/chapter18` Il pianeta che bolle — clima (`cap:p2c18`)
- *Costruzione culturale della realtà*
  11. `part2/chapter16` Il piedistallo cognitivo — autorità (`cap:p2c16`)
  12. `part2/chapter24` La fabbrica dei sogni e dei bias — narrazioni (`cap:p2c24`)
  13. `part2/chapter20` Venere e Marte hanno lo stesso cervello (quasi) — genere (`cap:p2c20`)
  14. `part2/chapter13` Mille modi di sbagliare — culture (`cap:p2c13`)
- *Trasmissione e rinforzo delle convinzioni*
  15. `part2/chapter12` L'apprendimento impossibile — infanzia (`cap:p2c12`)
  16. `part2/chapter29` L'infanzia come ancora — famiglia (`cap:p2c29`)
  17. `part2/chapter30` Troppe scelte, troppi vincitori: il bias del sopravvissuto — scelte e successo, PONTE verso la Parte III (`cap:p2c30`)

**Parte III · Lo specchio digitale** — come l'IA entra nel processo
18. `part3/chapter11` Quando le macchine imparano i nostri pregiudizi (`cap:p3c11`)
19. `part3/chapter19` La gravità dell'algoritmo e la caverna digitale (`cap:p2c11`, label invariata) — SPOSTATO dalla Parte II
20. `part3/chapter35` Il bias dell'antropomorfizzazione (`cap:p3c35`) — con estratto Liminal
21. `part3/chapter27` Co-evoluzione uomo-IA (`cap:p3c27`)
22. `part3/chapter39` Il deserto del reale digitale (`cap:p4c39`, label invariata) — SPOSTATO dalla Parte IV, prima dei deepfake
23. `part3/chapter38` Deepfake e realtà condivisa (`cap:p3c38`)

**Parte IV · La bussola del pensiero** — come orientarsi e mettere in discussione le proprie certezze
24. `part4/chapter10` Difese personali: dal prezzo dell'evoluzione all'ecosistema consapevole (`cap:p4c10`)
25. `part4/chapter31` Trasparenza: le etichette nutrizionali algoritmiche (`cap:p4c31`)
26. `part4/chapter32` L'IA come impalcatura socratica (`cap:p4c32`)
27. `part4/chapter33` Il simulatore di bias (`cap:p4c33`)
28. `part4/chapter17` L'arte dell'errore creativo (`cap:p4c17`)
29. `part4/chapter41` Responsabilità: l'architettura dell'inganno volontario (`cap:p4c41`)
30. `part4/chapter24` Uomini senza petto: autonomia di giudizio (`cap:p3c24`, label invariata) — SPOSTATO dalla Parte III e accorciato
31. `part4/chapter25` Bias sui bias: consapevolezza dei propri limiti (`cap:p4c25`)
32. `part4/chapter26` Epilogo (`cap:p4c26`)

Le label LaTeX restano quelle originali anche per i file spostati (non rinominarle).

## 3. La storia di Giulia (filo narrativo ricorrente, DICHIARATAMENTE IMMAGINARIA)

Una storia inventata, costruita su meccanismi documentati, che attraversa le quattro parti. Va sempre presentata nel riquadro `\begin{storia}[titoletto]...\end{storia}` (il riquadro dichiara da solo che è la «storia di Giulia»; il prologo dice al lettore che è inventata). Niente numeri inventati, niente statistiche dentro la storia: i dati stanno nel testo del capitolo, con le fonti.

**Personaggio.** Giulia, medico di medicina generale in una cittadina di provincia, poco più di cinquant'anni, vent'anni di professione. Brava, scrupolosa, stanca come molti suoi colleghi.

**Episodi (già decisi, non cambiarli):**
- **Parte I (memoria e identità).** All'inizio della carriera Giulia mandò a casa un giovane con un dolore al petto «da stress»; tornò due giorni dopo con un infarto, e sopravvisse. Da allora quel caso è il suo ricordo fondativo: «non sbaglio due volte». Negli anni il ricordo si è riorganizzato (oggi ricorda un paziente pallido e sudato, mentre la sua cartella di allora annotava «buone condizioni generali»). Il ricordo protegge un'identità e genera una convinzione operativa: davanti a un uomo giovane con dolore toracico è velocissima. Memoria → identità → convinzione → costruzione della realtà.
- **Parte II (decisioni e conseguenze).** Arriva Anna, 52 anni, nausea, affanno e un peso al petto. Nella cartella c'è da anni la diagnosi di «disturbo d'ansia». Giulia si ancora a quella etichetta (il ricordo fondativo riguarda un uomo, non una donna; il prototipo che ha in mente non le somiglia). Scrive «sintomi ansiosi, rivalutare». Anna per fortuna va in pronto soccorso su insistenza della figlia: è un infarto. Lato documentato: i sintomi femminili di infarto sono stati a lungo meno riconosciuti (per esempio Pope et al., *NEJM* 2000, sulle diagnosi mancate di ischemia cardiaca in pronto soccorso). Conseguenza meno visibile: la nota «ansia» resta nei registri, una tra milioni.
- **Ponte II → III (bias del sopravvissuto).** Nei registri restano solo i casi che qualcuno ha scritto, e scritto in un certo modo; i pazienti rimandati a casa che non sono più tornati, o sono andati altrove, non lasciano traccia. Sono gli «aerei che non sono tornati» dei dati sanitari.
- **Parte III (l'IA entra nel processo).** L'azienda sanitaria adotta un sistema di supporto al triage addestrato su dieci anni di cartelle della regione, comprese quelle di Giulia. Il sistema ha imparato il passato: segnala come urgenti i casi simili a quelli che i medici hanno trattato come urgenti. Una sera, a fine turno, il sistema classifica «bassa priorità» una donna con sintomi simili a quelli di Anna, e Giulia, stanca, è tentata di fidarsi (bias di automazione; il tono sicuro della risposta; la tentazione di attribuire alla macchina un giudizio). Lato documentato: Obermeyer et al., *Science* 2019 (algoritmo sanitario che riproduceva disuguaglianze attraverso i dati di spesa); Seyyed-Kalantari et al., *Nature Medicine* 2021 (sottodiagnosi nei gruppi meno rappresentati); Dratsch et al., *Radiology* 2023 (bias di automazione nella lettura delle mammografie). La macchina è una memoria del passato che produce futuro.
- **Parte IV (soluzioni).** Giulia non spegne il sistema e non gli obbedisce: lo interroga. Chiede su quali dati è stato addestrato e dove è meno affidabile (trasparenza), gli chiede di argomentare l'ipotesi contraria (uso socratico), partecipa con i colleghi a esercitazioni sui casi in cui uomo e macchina sbagliano insieme (simulazione), e scrive in cartella il proprio ragionamento, non solo la conclusione, sapendo che quelle righe *saranno state* i dati di domani (responsabilità). Davanti al caso dubbio si pone la domanda del libro: *che cosa mi farebbe cambiare idea?*
- **Epilogo.** Chiusura del cerchio sul futuro anteriore: ogni nota che Giulia scrive oggi è una memoria di un futuro che altri leggeranno.

**Dove compare:** prologo (annuncio), aperture delle quattro parti (episodi principali), e riquadri brevi (120–220 parole) in: cap. Memoria (`part1/chapter6`), cap. Medicina (`part2/chapter15`), cap. Sopravvissuto (`part2/chapter30`), cap. Macchine che imparano (`part3/chapter11`), cap. Co-evoluzione (`part3/chapter27`, bias di automazione), cap. Impalcatura socratica (`part4/chapter32`), epilogo. Non aggiungerla altrove.

## 4. Regole di scrittura

- **Due punti con parsimonia.** È una richiesta esplicita dell'autore: non introdurre frasi costruite su «X: Y» a ripetizione. Preferire punto, virgola, «perché», «cioè», una subordinata, o due frasi. Nei testi rivisti, ridurre anche i due punti esistenti dove abbondano (lasciarli negli elenchi, nelle citazioni e dove sono davvero necessari).
- **Transizioni.** L'inizio di ogni capitolo riprende un risultato del capitolo precedente; la chiusura mostra perché quel risultato rende necessaria la domanda successiva. Rapporto logico o causale, mai il semplice «nel prossimo capitolo vedremo…». Niente annunci del tipo «ne parleremo nel capitolo X» quando non serve.
- **Metafore.** Tre immagini restano e vanno usate in modo coerente: il **condominio** (architettura stratificata del cervello, cap. 1), i **due piloti** (Sistema 1 e Sistema 2), l'**archivista bugiardo** (memoria). Le altre (sabotatore, elefante e cavaliere, narratori vari) vanno ridotte o ricondotte a queste. L'immagine di Haidt dell'elefante e del cavaliere può restare nel cap. 7 come citazione dell'autore, presentata come una variante della stessa idea dei due piloti, non come nuova metafora del libro.
- **Spiegazioni evolutive.** Savana, cervello «antico», automatismi ancestrali: spiegati bene una volta nella Parte I (cap. 1 e 2), con la cautela che le spiegazioni evolutive dei bias sono ipotesi plausibili, non fatti dimostrati. Dalla Parte II in poi richiamarli solo se servono davvero, in una frase, senza ripetere l'intera spiegazione.
- **Rigore.** Non inventare esperienze personali, dati, citazioni o fonti. Se un'affermazione è troppo categorica, attenuarla («alcuni studi suggeriscono», «è un'ipotesi discussa») o eliminarla. Separare documentato, plausibile, ipotesi/metafora.
- **Voce.** Conservare la voce dell'autore, la prima persona plurale/singolare già presente, le idee originali. Non trasformare il libro in un'enciclopedia dei bias.
- **Lunghezza.** Non allungare i capitoli. Ogni aggiunta va compensata, dove possibile, da tagli di ripetizioni.
- **Casi personali.** I riquadri `casopersonale` con `\dascrivere{...}` restano segnaposto per l'autore: non riempirli.
- **LaTeX.** Mantenere label, `\index`, note a piè di pagina e figure. Rimandi con `cap.~\ref{...}`. Controllare che i rimandi «come abbiamo visto» puntino a capitoli che nel nuovo ordine vengono PRIMA, e che «vedremo» puntino a capitoli che vengono DOPO.
