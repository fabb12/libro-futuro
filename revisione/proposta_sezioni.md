# Proposta di suddivisione in sezioni: sette capitoli

Nessun file .tex è stato modificato. Per ogni capitolo: motivazione, sezioni proposte in ordine, con il titolo e le prime parole del paragrafo da cui parte `\section{...}`. Il testo non va spostato. Dove c'è un testo prima della prima sezione, lo si indica come «apertura senza titolo».

Convenzione usata per i titoli, come negli altri capitoli (es. ch. 14 e 23): evocativi, 4-8 parole. Se l'autore vuole richiamarle con `\nameref`, le etichette si possono chiamare `sec:p?c??-...` sul modello già in uso.

---

## 1. Prologo (`content/prologo.tex`, `\chapter*`, ~3000 parole)

**Motivazione.** NON dividere (consiglio): è un testo introduttivo, in `\chapter*` (quindi fuori numerazione), scritto come un unico argomento continuo (Hinton → paradosso → Pleistocene → bias → IA → mappa del libro). Delle sezioni numerate lo farebbero somigliare a un capitolo e creerebbero voci d'indice e numerazioni strane («0.1»). La lunghezza è sostenibile perché i paragrafi sono già ritmati da cambi di tema e da elenchi.

**Se l'autore volesse comunque un respiro visivo** (alternativa, non consigliata): usare solo `\section*{...}` (non numerate, e `\section*` non entra nell'indice), in 3 punti. Apertura senza titolo = Hinton, paradosso, i «due tempi».

1. **I bias non sono bug: sono il sistema** — parte da: «Quando sentiamo parlare di distorsioni mentali sistematiche o semplicemente»
2. **Lo specchio digitale** — parte da: «Questo ci porta a una delle sfide più inquietanti del nostro»
3. **Il viaggio in quattro tappe** — parte da: «Il libro che avete tra le mani è strutturato come un viaggio»

Nota di refuso (da non toccare ora): alla riga 9 c'è un `\\` isolato dopo il terzo paragrafo, che produce uno spazio anomalo.

---

## 2. Capitolo 30, Il bias del sopravvissuto (`part2/chapter30.tex`, ~2200 parole, 0 sezioni)

**Motivazione.** Si divide: il capitolo ha un percorso chiaro (definizione e radici → esempi → era digitale → conseguenze → difese → chiusura) e oggi è un blocco unico di 24 paragrafi.

Apertura senza titolo: i primi quattro paragrafi (richiamo al cap. 15, «software cognitivo pleistocenico», definizione, radici nel Sistema 1). Le radici evolutive restano qui.

1. **Gli aerei che non sono tornati** — «Per comprendere appieno la portata di questo bias, consideriamo alcuni esempi» (Wald, figura, nonno fumatore, ponte romano)
2. **La vetrina dei vincitori** — «L'era digitale ha amplificato enormemente gli effetti del bias del sopravvissuto» (abbandoni universitari, social, algoritmi)
3. **Il costo dei fallimenti invisibili** — «Le conseguenze di questo bias cognitivo sono tutt'altro che triviali.» (decisioni, FOMO, punto cieco e Dunning-Kruger)
4. **Domandarsi cosa non stiamo vedendo** — «Come possiamo quindi difenderci da questo sabotatore cognitivo? La strategia» (pensiero controfattuale, dataset completo, umiltà epistemologica, fonti)
5. **L'alone invisibile dei tentativi falliti** — «Il bias del sopravvissuto rappresenta una potente dimostrazione di come» (chiusura, gentilezza verso sé stessi, ponte verso le macchine)

---

## 3. Capitolo 35, Il bias dell'antropomorfizzazione (`part3/chapter35.tex`, ~2150 parole, 1 sezione)

**Motivazione.** Si divide: c'è una sola sezione, posta male. `\section{Come funziona realmente una conversazione con ChatGPT}` sta alla riga 19, prima della figura `no_memory.png` e prima del paragrafo sulla sycophancy. Il contenuto che le corrisponde (copie diverse del modello, cronologia ritrasmessa, «memoria» come note incollate) è invece nel paragrafo «Ma l'illusione del dialogo…» (riga 32). Oggi la sezione esistente «copre» sycophancy e vulnerabilità, che non c'entrano col titolo.

**Consiglio sulla sezione esistente:** spostare il solo `\section{...}` esistente (con la figura) in corrispondenza del paragrafo «Ma l'illusione del dialogo con questi sistemi nasconde una realtà». Se l'autore preferisce non muoverla, resta dov'è e va ritolata, ma il consiglio è spostarla. Le sezioni da aggiungere sono pensate attorno a questa posizione.

Apertura senza titolo: i primi tre paragrafi (lutto digitale per GPT-4o, definizione del bias, LLM come predittori statistici).

1. **Da ELIZA alla savana: un'euristica antica** — «La storia ci insegna che questo bias non è emerso» (ELIZA, interazione con altri bias, euristica adattiva, fluenza linguistica e RLHF)
2. **Adulazione su misura: la sycophancy** — «Il fenomeno della «sycophancy» — la tendenza dei modelli a produrre» (+ paragrafo sulla vulnerabilità umana e solitudine)
3. *(esistente, nella posizione consigliata)* **Come funziona realmente una conversazione con ChatGPT** — «Ma l'illusione del dialogo con questi sistemi nasconde una realtà» (con la figura `no_memory.png`)
4. **Quando l'illusione costa cara** — «Le conseguenze di questo bias possono essere tragiche. Sono documentati casi» (danni, «psicosi da AI», reality testing)
5. **Progettati per farci affezionare** — «Le aziende che sviluppano questi sistemi portano una responsabilità non» (design, companion AI, loop di incapacità sociale)
6. **Come tenere i piedi per terra** — «Come per altri bias cognitivi, la consapevolezza è il primo passo» (debiasing, alfabetizzazione, vulnerabilità sociali)
7. **Il futuro e l'arte della calibrazione** — «Il futuro che si profila all'orizzonte non promette semplificazioni.» (avatar, defunti digitali, calibrazione cognitiva)

---

## 4. Capitolo 31, Le Etichette Nutrizionali Algoritmiche (`part4/chapter31.tex`, ~2200 parole, 0 sezioni)

**Motivazione.** Si divide: l'argomentazione è a tappe nette (diagnosi → proposta dell'etichetta → contratto sociale → alternativa → strategia → visione), già segnalate da stacchi tematici evidenti.

Apertura senza titolo: il primo paragrafo (dalla cassetta degli attrezzi individuale ai «monaci digitali»).

1. **Animali hackerabili e profezie di Gattaca** — «Yuval Noah Harari ci ha avvertito che stiamo diventando» (Harari, Gattaca, e anche i paragrafi su Rawls e Berlin: «La vera rivoluzione, quindi, non può» e «Se il problema è un ambiente digitale»)
2. **L'etichetta sul feed di Instagram** — «Ecco perché è giunto il momento di proporre l'introduzione» (proposta, tabella, figura, giustizia digitale)
3. **Tre principi per un contratto sociale digitale** — «Ma andiamo oltre la semplice etichettatura. Quello che propongo è» (Autonomia, Differenza, Trasparenza radicale)
4. **Se non facciamo nulla: la classe inutile** — «Considerate l'alternativa se non agiamo. Harari avverte che» (classe inutile, Gattaca e dati falsificati)
5. **Una lenta guerra di posizione** — «L'implementazione delle etichette algoritmiche richiederebbe quello che Antonio» (Gramsci, GDPR, Harris, Vallor, Sinclair)
6. **Accendere le luci nella fabbrica dell'attenzione** — «Immaginate un futuro dove aprire un'app richiede lo stesso livello» (visione, «pragmatismo radicale», Rilke, chiusura e ponte verso il capitolo successivo)

Variante: se si vuole una sezione in più, separare i paragrafi su Rawls e Berlin (da «La vera rivoluzione, quindi, non può» come sezione propria, ad es. «Perché la forza di volontà non basta»); sono però solo due paragrafi brevi.

---

## 5. Capitolo 33, Il Simulatore di Bias (`part4/chapter33.tex`, ~3000 parole, 0 sezioni)

**Motivazione.** Si divide: è il più lungo dei sette e ha movimenti distinti (scenario medico → debriefing → altri campi → personalizzazione → esperimenti reali → gamification → limiti → usi quotidiani).

Apertura senza titolo: i primi sette paragrafi (richiamo ai capitoli precedenti, «palestra cognitiva», concetto, avvertenza sui casi ipotetici). Va tenuta fuori dalle sezioni perché l'avvertenza «sono ipotetici» deve restare prima di tutti i casi.

1. **La trappola del sushi** — «Immaginate un giovane medico specializzando nel pronto soccorso di» (scenario del paziente virtuale e dell'esca cognitiva)
2. **Il debriefing: riavvolgere il pensiero** — «Dopo la simulazione, arriva il momento più importante: il debriefing» (debriefing, figura, replay, controfattuale, conseguenze)
3. **Dalla corsia all'aula di tribunale** — «Questo approccio si estende naturalmente ad altri campi ad alto rischio.» (procuratore, team virtuale, bias cascade)
4. **Su misura: profili di vulnerabilità cognitiva** — «Ma la vera innovazione arriva quando il simulatore diventa adattivo e» (profili, reverse bias engineering, protocolli di debiasing)
5. **Primi esperimenti tra ospedali e banche** — «Alcuni ospedali pionieristici stanno già sperimentando versioni primitive di questi» (Diagnostic Time-Outs, trading, bias impliciti)
6. **Cinture nere del pensiero critico** — «La gamification è un elemento cruciale per il successo di» (gamification, VR, cross-domain)
7. **Meta-bias, validazione e privacy** — «Ma dobbiamo anche considerare i rischi e le limitazioni. C'è» (limiti, etica, consenso)
8. **Igiene cognitiva: oltre la professione** — «Guardando al futuro, possiamo immaginare simulatori di bias che vanno» (uso quotidiano, scuola, boardroom, chiusura con Feynman e ponte)

---

## 6. Capitolo 34, Il Co-pilota per la Neurodiversità (`part4/chapter34.tex`, ~740 parole, 0 sezioni)

**Motivazione.** Si divide solo in due, con una breve apertura senza titolo: il capitolo è corto, ma ha due movimenti distinti (l'idea di neurodiversità come risorsa → il Co-pilota che la orchestra). L'alternativa, nessuna sezione, è accettabile; due titoli però aiutano l'indice e il ritmo senza frammentare. Tre sezioni sarebbero troppe per 740 parole.

Apertura senza titolo: il primo paragrafo («Partiamo da una parola: neurodiversità…»), che funziona da attacco.

1. **Sentinelle, esploratori e pianificatori** — «Facciamo un salto indietro, in un gruppo di cacciatori-raccoglitori. Un gruppo» (strategia evolutiva, gnu e formiche, figura)
2. **Un direttore d'orchestra silenzioso** — «Oggi, nel mondo aziendale e scientifico, parliamo costantemente di «diversità»» (meta-facilitatore, groupthink, intelligenza collettiva, rischio finale che fa da ponte)

---

## 7. Capitolo 8, Quando il nemico è in casa (`part4/chapter8.tex`, ~1780 parole, 0 sezioni)

**Motivazione.** Si divide: il capitolo è già scandito da `\bigskip` e `\medskip` usati come sezioni mute (conferma → perdite → gregge → punto cieco → tempesta → rimedi). Le sezioni darebbero titolo a quei blocchi; i `\bigskip`/`\medskip` diventerebbero ridondanti davanti a ciascun `\section` (decisione dell'autore, non tocco nulla).

Apertura senza titolo: i primi quattro paragrafi (non tutti i bias sono uguali, conferma, perdite e gregge in breve, il bias più pericoloso è credersi immuni). È una mini-anteprima, utile prima delle sezioni.

1. **Quando la realtà non ci corregge più** — «Se dovessimo stilare una classifica dei bias più devastanti dell'era» (bias di conferma, mondo fisico che «non mente», complottismo)
2. **Prigionieri del nostro status quo** — «Ma il bias di conferma è solo il più spettacolare di una» (avversione alle perdite)
3. **Quando tutti sbagliano insieme** — «E poi c'è l'effetto gregge, forse il bias più sottovalutato» (effetto gregge, dot-com)
4. **Il guardiano di tutti i bias** — «Ma c'è un bias ancora più insidioso di tutti quelli che» (punto cieco, rimando al cap. 25)
5. **La tempesta cognitiva perfetta** — «Ma forse l'aspetto più pericoloso di tutti questi bias è come» (rinforzo reciproco, figura, polarizzazione)
6. **Perché non possiamo eliminarli** — «Cosa possiamo fare di fronte a questi «bias di massa distruzione»?» (umiltà cognitiva)
7. **La razionalità come allenamento** — «Forse la lezione più importante che possiamo imparare dai bias più» (disciplina, forma fisica, chiusura e ponte)
