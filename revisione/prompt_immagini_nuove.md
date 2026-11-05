# Nuove immagini proposte: concetti complessi ancora senza figura

Verifica fatta sui capitoli inclusi in `main.tex` (novembre 2026). Numeri di capitolo = numerazione stampata.

## 1. Copertura attuale

| Cap. | File | Immagini presenti | Stato |
|---|---|---|---|
| Prologo | `content/prologo.tex` | nessuna | **manca** |
| 1 | `part1/chapter1.tex` | 3 | ok |
| 2 | `part1/chapter6.tex` | 2 | ok |
| 3 | `part1/chapter2.tex` | 3 | ok |
| 4 | `part1/chapter7.tex` | 1 | ok |
| 5 | `part1/chapter22.tex` | 2 | ok |
| 6 | `part1/chapter9.tex` | 2 | ok |
| 7 | `part2/chapter14.tex` | 2 | ok |
| 8 | `part2/chapter15.tex` | 2 | ok |
| 9 | `part2/chapter28.tex` | 2 | ok |
| 10 | `part2/chapter18.tex` | 3 | ok |
| 11 | `part2/chapter16.tex` | 3 | ok |
| 12 | `part2/chapter24.tex` | 1 + **2 segnaposto senza file** (`archetipi_jung.png`, `disney_miyazaki_bluey.png`) | **mancano 2 file** |
| 13 | `part2/chapter20.tex` | 1 | ok |
| 14 | `part2/chapter13.tex` | 1 | ok |
| 15 | `part2/chapter12.tex` | nessuna (le 3 vecchie sono state tolte nella revisione scientifica) | **manca** |
| 16 | `part2/chapter29.tex` | 3 | ok |
| 17 | `part2/chapter30.tex` | 2 | ok |
| 18 | `part3/chapter11.tex` | 1 | ok |
| 19 | `part3/chapter19.tex` | 2 + schema TikZ | ok |
| 20 | `part3/chapter35.tex` | 2 | ok |
| 21 | `part3/chapter27.tex` | 1 | ok |
| 22 | `part3/chapter39.tex` | 1 | ok |
| 23 | `part3/chapter38.tex` | 1 | ok |
| 24 | `part4/chapter10.tex` | 1 | ok |
| 25 | `part4/chapter31.tex` | 1 + prototipo in LaTeX | ok |
| 26 | `part4/chapter32.tex` | 1 | ok |
| 27 | `part4/chapter33.tex` | 2 | ok |
| 28 | `part4/chapter17.tex` | 1 | ok |
| 29 | `part4/chapter41.tex` | 1 | ok |
| 30 | `part4/chapter24.tex` | 1 | ok |
| 31 | `part4/chapter25.tex` | 2 | ok |
| 32 (Epilogo) | `part4/chapter26.tex` | 1 | ok |

**Da sistemare per forza:** Prologo, cap. 15, e i due file mancanti del cap. 12. Le altre proposte servono a illustrare concetti difficili che oggi sono spiegati solo a parole.

**Una cosa da verificare nel testo (cap. 4).** `chapter7.tex` descrive la «piramide dell'autogiustificazione» di Tavris e Aronson come una salita («ogni giustificazione ci porta un gradino più in alto, finché ci ritroviamo in cima»). In *Mistakes Were Made (But Not by Me)* l'immagine è al contrario: due persone partono vicine **in cima**, prendono una piccola decisione opposta e, giustificandola, **scivolano giù** su versanti opposti fino a ritrovarsi lontanissime alla base. Il prompt n. 9 segue l'originale; conviene correggere la frase prima di inserire la figura.

**Immagini già presenti in `images/` ma non usate:** `due_piloti_mente.png` contiene la parola inglese «CONTROL» ed etichette ripetute; `uomo_senza_petto.png` è già sostituita da `giungla_deserto.png`. Non le consiglio come ripiego.

## 2. Come usare i prompt

Usa lo **stesso blocco di stile** di `revisione/prompt_immagini.md` (sfondo crema #FBF1DE, contorni blu notte, palette arancio/giallo/blu ardesia/verde acqua, testi in italiano) e allega come riferimento `images/neurodiversita.png` e `images/piramide_wallace.png`. Formato 3:2 (1536×1024) salvo indicazione diversa.

Per inserirle nel libro, dopo il paragrafo indicato:

```latex
\figurasola{images/NOMEFILE.png}{DIDASCALIA}{fig:ETICHETTA}
```

Se il file non esiste ancora, `\figurasola` mostra un segnaposto e il libro compila lo stesso.

Regole valide per tutte le immagini qui sotto:
- nessun numero inventato: si usano solo cifre già presenti nel testo, oppure andamenti qualitativi dichiarati come tali;
- niente personaggi, loghi o marchi riconoscibili (Disney, Pixar, Ghibli, Bluey, social network);
- se una scritta in italiano esce sbagliata, rigenera con «no text» e aggiungi le etichette in Canva o Figma.

---

## 3. Obbligatorie

### P1 · `prologo_ciclo_futuro_anteriore.png` (Prologo)

- **Dove:** `content/prologo.tex`, dopo il paragrafo «La terza riguarda noi…», prima di «Il libro segue questo filo…».
- **Concetto:** la tesi del libro in un anello. Una mente che distorce lascia tracce, le macchine imparano da quelle tracce e ci restituiscono il mondo, e le nostre nuove decisioni diventano nuove tracce. Le quattro parti del libro sono quattro tappe dell'anello.
- **Didascalia proposta:** Il ciclo del futuro anteriore. La mente costruisce una versione della realtà; le sue scelte diventano archivi; le macchine imparano da quegli archivi e ce li restituiscono; ciò che decidiamo oggi sarà stato il passato da cui impareranno domani.
- **Soggetto:** Grande anello circolare in senso orario con quattro stazioni illustrate. In alto, una testa stilizzata in sezione con una lente che deforma leggermente un paesaggio: «Parte I · La mente costruisce». A destra, scrivanie, cartelle cliniche, una bilancia della giustizia e un grafico di borsa che diventano fogli d'archivio: «Parte II · Le decisioni lasciano tracce». In basso, gli archivi entrano in una macchina astratta fatta di nodi luminosi che proietta uno schermo verso la persona: «Parte III · Le macchine imparano e restituiscono». A sinistra, la stessa persona con una bussola in mano, che si ferma e osserva: «Parte IV · Orientarsi». Al centro dell'anello, in caratteri eleganti, la scritta «sarà stato». Frecce morbide tra le stazioni; una freccia tratteggiata dalla bussola verso la testa, a indicare che il ciclo si può cambiare.
- **Testi:** «Parte I · La mente costruisce», «Parte II · Le decisioni lasciano tracce», «Parte III · Le macchine imparano e restituiscono», «Parte IV · Orientarsi», «sarà stato».

### P2 · `tre_piani_pregiudizio.png` (cap. 15, L'apprendimento impossibile)

- **Dove:** `content/part2/chapter12.tex`, alla fine dell'introduzione, dopo «…perché le buone intenzioni non bastano a evitarli.» (prima di `\section{Che cosa c'è fin dall'inizio}`).
- **Concetto:** i tre piani distinti da cui nasce un pregiudizio. **Non** disegnare neuroni specchio né «finestre critiche» a età fisse: il testo le ha tolte perché non reggono ai dati.
- **Didascalia proposta:** Tre piani, non un unico meccanismo. Una predisposizione a notare le somiglianze, l'apprendimento di associazioni dai segnali degli adulti, e una socializzazione che indica quali categorie contano. Si può lavorare sugli ultimi due.
- **Soggetto:** Edificio a tre piani in sezione, come una casa delle bambole, con un bambino di circa 5 anni che sale una scala interna. Piano terra, «Predisposizione»: il bambino ordina forme e colori in mucchietti, con l'etichetta «notare le somiglianze». Primo piano, «Associazioni»: il bambino guarda due adulti; uno saluta una donna con un sorriso caldo, l'altro saluta una seconda donna con postura rigida e un'icona di ghiaccio; piccole frecce dagli adulti agli occhi del bambino, con l'etichetta «segnali non detti». Secondo piano, «Socializzazione»: un'aula con bambini in magliette metà blu e metà rosse, una maestra che indica due file separate, con l'etichetta «categorie rese importanti». Sul tetto un fumetto con la domanda «Come fai a saperlo?». Una piccola chiave inglese sui piani 1 e 2 indica che si possono modificare; il piano terra ha invece un lucchetto aperto con l'etichetta «utile per imparare».
- **Testi:** «Predisposizione», «notare le somiglianze», «Associazioni», «segnali non detti», «Socializzazione», «categorie rese importanti», «Come fai a saperlo?».

### P3 · `archetipi_jung.png` (cap. 12, La fabbrica dei sogni e dei bias): segnaposto già nel testo

- **Dove:** già inserito in `content/part2/chapter24.tex` (riga ~64). La didascalia esiste già.
- **Concetto:** perché culture lontane raccontano storie simili. La spiegazione di Jung (un inconscio collettivo ereditato) contro due spiegazioni più semplici (problemi comuni e storie tramandate), più l'analogia della carcinizzazione. In fondo, tre destini dello stesso archetipo.
- **Soggetto (formato verticale 2:3, 1024×1536):** Infografica dall'alto verso il basso. In alto, «Perché tutte le storie si somigliano?»: un mappamondo con quattro piccoli fuochi di narratori in continenti diversi, e sopra ciascuno la stessa sagoma di un eroe con una spada. Al centro, due colonne. Colonna sinistra, toni grigi e un punto interrogativo: «Jung: un inconscio collettivo ereditato», con uno stampo misterioso da cui escono figure identiche e l'etichetta «nessuna prova sperimentale». Colonna destra, toni caldi: due riquadri. Il primo, «Problemi comuni», con icone di un neonato che dipende dagli adulti, una tomba e un confine tra gruppi. Il secondo, «Storie tramandate», con un albero genealogico i cui rami sono libri e pergamene e l'etichetta «migliaia di anni». Sotto la colonna destra, un riquadro piccolo con cinque crostacei diversi che convergono nella stessa forma di granchio: «Convergenza, non stampo». In basso, la stessa sagoma di eroe in tre versioni: un'etichetta rigida appesa al collo («etichetta»), una sagoma con una crepa da cui filtra luce («si incrina»), una sagoma morbida e imperfetta che tiene per mano un bambino («si fa umano»). Nessun personaggio riconoscibile.
- **Testi:** «Perché tutte le storie si somigliano?», «Jung: un inconscio collettivo ereditato», «nessuna prova sperimentale», «Problemi comuni», «Storie tramandate», «Convergenza, non stampo», «etichetta», «si incrina», «si fa umano».

### P4 · `disney_miyazaki_bluey.png` (cap. 12): segnaposto già nel testo

- **Dove:** già inserito in `content/part2/chapter24.tex` (riga ~73). La didascalia esiste già.
- **Attenzione diritti:** niente personaggi Disney, Ghibli o Bluey e niente loghi. Ogni colonna va rappresentata con un'icona generica: un castello da fiaba, una foresta con uno spirito astratto e una casetta con una famiglia di cani generici disegnati in stile proprio.
- **Soggetto:** Tabella illustrata a tre colonne e quattro righe. Intestazioni: icona del castello «Disney classico», icona della foresta «Miyazaki», icona della casetta con i cani «Bluey». Righe: «Bene e male», «Emozioni difficili», «Quanto spiega», «Identificazione». Nelle celle, piccoli pittogrammi con due o tre parole ciascuno:
  - Disney classico: «buoni contro cattivi»; «solo ai cattivi»; «spiega tutto»; «con l'eroe perfetto».
  - Miyazaki: «nessun cattivo assoluto»; «a tutti»; «lascia spazi»; «con chi cambia».
  - Bluey: «nessun cattivo»; «anche ai genitori»; «si fida di chi guarda»; «con chi sbaglia e ripara».
  In basso, a caratteri piccoli: «Schema indicativo, non un giudizio di valore».
- **Testi:** quelli elencati sopra.

---

## 4. Consigliate: concetti complessi senza figura

Ordinate per priorità. Le prime sei sono quelle che, secondo me, aiutano di più il lettore.

### N1 · `cinque_livelli_bias_ia.png` (cap. 18, Quando le macchine imparano i nostri pregiudizi) ★

- **Dove:** `content/part3/chapter11.tex`, subito dopo il riquadro con l'elenco 1–5 (Dati, Obiettivo, Progettazione, Interazione, Lettore). L'immagine esistente, `bias_llm_specchio_deformante.png`, illustra solo il primo livello.
- **Concetto:** è lo schema che regge tutta la Parte III. Una distorsione può nascere in cinque punti diversi, e ognuno richiede un rimedio diverso.
- **Didascalia proposta:** Cinque punti in cui può nascere la distorsione di un sistema di IA: i dati da cui impara, l'obiettivo per cui è ottimizzato, le scelte di chi lo progetta, il modo in cui lo interroghiamo, i bias di chi legge la risposta.
- **Soggetto:** Una catena di montaggio orizzontale con cinque stazioni numerate, attraversata da un nastro che porta un foglio dalla sinistra (una pila di archivi) alla destra (una persona che legge uno schermo). 1 «Dati»: scaffali di documenti con alcuni buchi vuoti e alcune pile sproporzionate. 2 «Obiettivo»: un bersaglio su cui è scritto «spesa» mentre accanto c'è un cuore con «salute» ignorato. 3 «Progettazione»: mani umane che regolano manopole e filtri. 4 «Interazione»: un fumetto di domanda che entra nella macchina e una freccia circolare di ritorno. 5 «Lettore»: una persona che annuisce davanti a un testo molto fluido, con un'aureola luminosa sopra lo schermo («effetto alone»). Sotto il nastro, una lente d'ingrandimento con la scritta «dove nasce l'errore?».
- **Testi:** «Dati», «Obiettivo», «Progettazione», «Interazione», «Lettore», «dove nasce l'errore?».

### N2 · `frequenze_base_marco.png` (cap. 7, Il casinò nella testa) ★

- **Dove:** `content/part2/chapter14.tex`, **dopo** il riquadro *Prova tu* «Le probabilità prima della storia» (non prima, altrimenti svela la soluzione).
- **Concetto:** trascurare la frequenza di base. Usa solo i numeri del testo, che sono già dichiarati illustrativi.
- **Didascalia proposta:** Chi è Marco? Su 800.000 insegnanti e 8.000 trader (numeri illustrativi), la descrizione si adatta a 4.000 trader ma a 8.000 insegnanti. Due «Marco» su tre insegnano.
- **Soggetto:** Diagramma ad albero per frequenze naturali con icone di persone. A sinistra un grande blocco di 100 piccole icone che rappresentano «800.000 insegnanti» e un blocco minuscolo con 1 icona che rappresenta «8.000 trader»: la differenza di scala deve essere evidente. Da ciascun blocco scende un ramo con il filtro «corrisponde alla descrizione?»: dal blocco insegnanti esce «1 su 100 = 8.000», dal blocco trader esce «1 su 2 = 4.000». In basso i due gruppi filtrati sono affiancati: 8.000 insegnanti (due terzi del riquadro, in blu) e 4.000 trader (un terzo, in arancio), con la conclusione «2 Marco su 3 insegnano». Una piccola nota a margine dice «numeri illustrativi».
- **Testi:** «800.000 insegnanti», «8.000 trader», «corrisponde alla descrizione?», «1 su 100 = 8.000», «1 su 2 = 4.000», «2 Marco su 3 insegnano», «numeri illustrativi».

### N3 · `errore_previsione_dopamina.png` (cap. 3, L'eredità del terrore) ★

- **Dove:** `content/part1/chapter2.tex`, sezione «Il tutore severo», dopo il paragrafo su Wolfram Schultz.
- **Concetto:** la dopamina come segnale di errore di previsione e non come «molecola del piacere». Il tema torna nei capitoli 7 e 19.
- **Didascalia proposta:** L'errore di previsione. I neuroni della dopamina reagiscono alla differenza tra ciò che ci aspettavamo e ciò che accade: più attivi quando va meglio del previsto, invariati quando va come previsto, meno attivi quando va peggio. Schema qualitativo.
- **Soggetto:** Tre pannelli affiancati, ognuno con una piccola scena sopra e un tracciato stilizzato sotto, simile a un elettrocardiogramma semplificato e senza scala numerica. Pannello 1, «Meglio del previsto»: una persona riceve un regalo inatteso e il tracciato ha un picco netto. Pannello 2, «Come previsto»: la persona riceve il caffè che aspettava e il tracciato è piatto. Pannello 3, «Peggio del previsto»: la persona apre una scatola vuota e il tracciato scende sotto la linea di base. Sotto i tre pannelli, una banda con una freccia circolare: «l'errore aggiorna la previsione».
- **Testi:** «Meglio del previsto», «Come previsto», «Peggio del previsto», «l'errore aggiorna la previsione», «schema qualitativo».

### N4 · `prestazione_vs_apprendimento.png` (cap. 26, L'IA come impalcatura socratica) ★

- **Dove:** `content/part4/chapter32.tex`, fine della sezione «Che cosa dicono i dati», prima di «Il paradosso della fatica desiderabile».
- **Concetto:** la differenza tra andare bene durante l'esercizio e aver imparato. Il testo non riporta percentuali, quindi il grafico deve restare qualitativo.
- **Didascalia proposta:** Prestazione e apprendimento non sono la stessa cosa. Durante gli esercizi l'assistente senza vincoli aiuta molto; all'esame senza assistente chi lo ha usato va peggio di chi non l'ha mai avuto, mentre chi aveva un tutor che dava solo suggerimenti non mostra il calo. Andamento qualitativo, da un solo studio.
- **Soggetto:** Grafico a barre raggruppate in due momenti: «Durante gli esercizi» e «All'esame, senza IA». Tre gruppi con icone: un libro («Materiali tradizionali», grigio), un robot che consegna una risposta finita («IA che risolve», arancio) e un robot che indica una scala («IA che suggerisce», verde acqua). Nel primo momento le barre arancio e verde sono molto più alte di quella grigia. Nel secondo momento la barra arancio scende sotto quella grigia e quella verde resta circa alla pari con la grigia. Nessun valore sull'asse. Un'etichetta con una freccia sulla barra arancio dice «sembrava imparare».
- **Testi:** «Durante gli esercizi», «All'esame, senza IA», «Materiali tradizionali», «IA che risolve», «IA che suggerisce», «sembrava imparare», «andamento qualitativo».

### N5 · `spesa_non_e_bisogno.png` (cap. 17, Troppe scelte, troppi vincitori) ★

- **Dove:** `content/part2/chapter30.tex`, sezione «L'archivio dei sopravvissuti», dopo il paragrafo «Non è solo un'immagine. Nel 2019…».
- **Concetto:** una variabile sostitutiva (la spesa) che misura bene ma misura la cosa sbagliata. Fa da ponte tra gli aerei di Wald e la Parte III.
- **Didascalia proposta:** Dati accurati, domanda sbagliata. L'algoritmo stimava il bisogno di cure dalla spesa sanitaria passata; a parità di salute, chi aveva avuto meno accesso alle cure aveva speso meno e sembrava più sano. Come sugli aerei di Wald, mancava ciò che non era stato registrato.
- **Soggetto:** Due pazienti affiancati con lo stesso livello di salute, indicato da un identico termometro rosso a metà. Sopra il paziente A una pila alta di ricevute e farmaci, sopra il paziente B una pila bassa e accanto una porta d'ambulatorio chiusa con l'etichetta «meno accesso alle cure». Una macchina-algoritmo guarda solo le pile di ricevute con una lente («misura: spesa») e assegna ad A un cartellino «priorità alta» e a B «priorità bassa». In un piccolo inserto in alto a destra, la sagoma di un aereo con fori di proiettile e la scritta «chi manca?».
- **Testi:** «stessa salute», «meno accesso alle cure», «misura: spesa», «priorità alta», «priorità bassa», «chi manca?».

### N6 · `due_sale_controllo.png` (cap. 32, Epilogo) ★

- **Dove:** `content/part4/chapter26.tex`, sezione «La domanda del prologo», dopo il paragrafo «Tra il 1983 e il 1986…». In alternativa nel cap. 21, vedi N7.
- **Concetto:** il senso critico serve in due direzioni, verso le proprie convinzioni e verso le macchine. Chiude il cerchio aperto nel Prologo.
- **Didascalia proposta:** Due sale controllo, due direzioni del senso critico. A Chernobyl, nel 1986, i segnali che contraddicevano un piano già deciso non furono visti. A Serpuchov-15, nel 1983, Stanislav Petrov non credette a una macchina che annunciava la catastrofe con assoluta sicurezza.
- **Soggetto:** Due pannelli speculari in stile retrò anni Ottanta, con quadri di comando, luci e monitor verdi. A sinistra, «1986 · Chernobyl»: operatori di spalle concentrati su un foglio intitolato «piano del test», mentre sul pannello alle loro spalle lampeggiano spie d'allarme che nessuno guarda; una freccia indica «dubitare delle proprie convinzioni». A destra, «1983 · Petrov»: un ufficiale di spalle davanti a un grande schermo con la scritta «LANCIO» in caratteri cirillici stilizzati illeggibili, con una mano alzata in gesto di attesa e accanto un piccolo schermo radar vuoto; una freccia indica «dubitare della macchina». Al centro, tra i due pannelli, una bussola. Nessun volto riconoscibile.
- **Testi:** «1986 · Chernobyl», «1983 · Petrov», «dubitare delle proprie convinzioni», «dubitare della macchina».

### N7 · `petrov_tre_controlli.png` (cap. 21, Co-evoluzione uomo-IA)

- **Dove:** `content/part3/chapter27.tex`, dopo il paragrafo «Il suo dubbio non era sfiducia generica…».
- **Concetto:** il senso critico come procedura, e non come semplice istinto. Usare N7 oppure N6 se si vuole evitare due figure su Petrov.
- **Didascalia proposta:** I tre controlli di Petrov. Il dubbio non era sfiducia generica, ma il confronto tra ciò che la macchina diceva e ciò che si sapeva del mondo. Oggi la seconda fonte, spesso, dobbiamo cercarla noi.
- **Soggetto:** Un ufficiale stilizzato di spalle davanti a uno schermo d'allarme («5 missili in arrivo»). Da lui partono tre fumetti-checklist con un'icona ciascuno: un mucchio di centinaia di frecce contro cinque frecce, con la scritta «un attacco vero: centinaia, non cinque»; un ingranaggio nuovo con l'etichetta «non collaudato» e la scritta «sistema nuovo»; uno schermo radar vuoto con la scritta «i radar di terra non vedono nulla». In fondo un timbro: «malfunzionamento». In un riquadro piccolo in basso, il parallelo con oggi: una persona davanti alla risposta di un chatbot che si chiede «qual è il mio radar di terra?».
- **Testi:** «5 missili in arrivo», «un attacco vero: centinaia, non cinque», «sistema nuovo», «i radar di terra non vedono nulla», «malfunzionamento», «qual è il mio radar di terra?».

### N8 · `saggezza_delle_folle.png` (cap. 6, La continuità evolutiva dei bias)

- **Dove:** `content/part1/chapter9.tex`, sezione «Quando il gruppo è più saggio, e quando no», subito prima del riquadro «Quando la collettività aiuta, quando danneggia».
- **Concetto:** stime indipendenti contro stime che si copiano a vicenda. È la base della Parte III (social network).
- **Didascalia proposta:** La stessa folla, due esiti. Se ciascuno stima per conto suo, gli errori si compensano e la media si avvicina al vero; se tutti vedono subito la prima risposta, gli errori si sommano.
- **Soggetto:** Due pannelli con lo stesso bue disegnato su una pedana con un cartello «Quanto pesa?». Pannello sinistro, «Stime indipendenti»: dieci persone, ognuna con il proprio foglietto nascosto e numeri diversi (alcuni alti, alcuni bassi), frecce che convergono in un riquadro «media ≈ peso vero» con una spunta verde. Pannello destro, «Stime che si copiano»: le stesse persone guardano tutte il foglietto della prima, con frecce a catena da una persona all'altra, e tutti scrivono lo stesso numero sbagliato; riquadro «tutti d'accordo, tutti lontani» con una X arancio. Usa numeri generici e non il dato di Galton.
- **Testi:** «Quanto pesa?», «Stime indipendenti», «media ≈ peso vero», «Stime che si copiano», «tutti d'accordo, tutti lontani».

### N9 · `piramide_autogiustificazione.png` (cap. 4, L'illusione di essere razionali)

- **Dove:** `content/part1/chapter7.tex`, sezione «La coerenza a posteriori e le difese dell'ego», dopo il paragrafo su Tavris e Aronson. **Prima correggi la frase** (vedi la nota in alto).
- **Concetto:** piccole decisioni e giustificazioni che allontanano due persone partite quasi uguali.
- **Didascalia proposta:** La piramide dell'autogiustificazione di Tavris e Aronson. Due persone partono vicine, in cima; una piccola scelta in direzioni opposte, e ogni giustificazione le fa scendere un gradino più lontano, finché alla base sembrano non aver mai avuto nulla in comune.
- **Soggetto:** Piramide a gradoni vista di lato. In cima due persone quasi identiche, spalla a spalla, davanti a un piccolo bivio («una piccola scelta»). Ciascuna scende un versante opposto. Su ogni gradino c'è un fumetto con una giustificazione breve: a sinistra «era solo una volta», «lo fanno tutti», «avevo ragione io»; a destra «non è da me», «chi lo fa sbaglia», «io non sbaglio mai». Alla base, le due persone sono ai due estremi e si guardano con diffidenza, ciascuna con la scritta «convinzione sincera». Una doppia freccia lunga alla base dice «distanza».
- **Testi:** «una piccola scelta», le sei giustificazioni, «convinzione sincera», «distanza».

### N10 · `quantita_qualita_verita.png` (cap. 22, Il Deserto del Reale Digitale)

- **Dove:** `content/part3/chapter39.tex`, sezione «Quantità, qualità, verità», dopo i tre paragrafi in grassetto.
- **Concetto:** sotto la parola «slop» ci sono tre problemi diversi, che non coincidono per forza.
- **Didascalia proposta:** Tre problemi da non confondere. Tanti contenuti non vuol dire contenuti mediocri, e un contenuto mediocre non è per forza falso. Ogni problema attiva bias diversi e chiede rimedi diversi.
- **Soggetto:** Diagramma di Venn con tre cerchi parzialmente sovrapposti. «Quantità», con icona di un rubinetto aperto che riversa fogli; «Qualità», con icona di un piatto di brodo trasparente e insapore; «Verità», con icona di una bilancia con una moneta falsa. Nelle zone che non si sovrappongono, piccoli esempi: in Quantità soltanto, «mille video accurati, tutti uguali»; in Verità soltanto, «un saggio scritto a mano, ma falso». Al centro, dove si sovrappongono tutti e tre, una piccola nuvola scura con la scritta «il caso peggiore».
- **Testi:** «Quantità», «Qualità», «Verità», i due esempi, «il caso peggiore».

### N11 · `leve_e_contromisure.png` (cap. 24, Dal prezzo dell'evoluzione all'ecosistema)

- **Dove:** `content/part4/chapter10.tex`, sezione «Dall'autocontrollo al progetto», dopo i tre paragrafi su attrito, valori predefiniti e confini. L'immagine esistente, `hacking_cognitivo.png`, mostra solo le leve.
- **Concetto:** non si vince stringendo i denti nel momento della tentazione: si progetta l'ambiente prima. A ogni leva corrisponde una contromisura.
- **Didascalia proposta:** Dall'autocontrollo al progetto. A ogni leva usata dalle piattaforme corrisponde una contromisura che non chiede forza di volontà nel momento della tentazione, ma una scelta fatta prima.
- **Soggetto:** Tabella a due colonne collegate da tre frecce orizzontali, con gli abbinamenti esatti del testo. Riga 1: a sinistra, in arancio, un marshmallow su un piatto («gratificazione immediata»); a destra, in verde acqua, un'app spostata in fondo a un cassetto («attrito»). Riga 2: una slot machine («rinforzo intermittente») collegata a un interruttore già impostato su «off» («valori predefiniti»). Riga 3: una notifica con un punto rosso e un cervello con troppe finestre aperte («paura di restare fuori e sovraccarico») collegati alla porta di una camera da letto con il telefono lasciato fuori («confini»). Intestazioni delle colonne: «Le leve» e «Le contromisure». In basso, separato, un cartello «S.T.O.P.» con le parole «Fermati · Respira · Osserva · Procedi» e l'etichetta «quando l'impulso arriva comunque».
- **Testi:** «Le leve», «Le contromisure», i nomi tra parentesi, «S.T.O.P.», «Fermati · Respira · Osserva · Procedi», «quando l'impulso arriva comunque».

### N12 · `dopo_il_pattern.png` (cap. 28, L'arte dell'errore creativo)

- **Dove:** `content/part4/chapter17.tex`, dopo il paragrafo «La differenza tra Fleming e un complottista…».
- **Concetto:** vedere un pattern che non c'è è comune a scienziato e complottista; li distingue ciò che fanno dopo. Collega anche la regola finale del capitolo, «separare le fasi».
- **Didascalia proposta:** Lo stesso pattern, due strade. Fleming mise alla prova la muffa che uccideva i batteri; il complottista protegge il suo disegno da ogni prova. L'apofenia è feconda solo se è seguita da una verifica.
- **Soggetto:** Una persona osserva una piastra di Petri con macchie che formano un disegno suggestivo, con un fumetto «e se…?». Da lì il sentiero si biforca. Ramo sinistro, in verde acqua, «verificare»: provette, un quaderno di laboratorio, una lampadina accesa e una scoperta. Ramo destro, in arancio scuro, «proteggere»: una bacheca con fili rossi che collegano foto, un muro che respinge le frecce delle prove contrarie. Sopra il bivio, due cartelli: «fase 1: generare» prima della biforcazione e «fase 2: verificare» sul ramo sinistro.
- **Testi:** «e se…?», «verificare», «proteggere», «fase 1: generare», «fase 2: verificare».

### N13 · `ricordare_il_futuro.png` (cap. 2, Memoria: l'archivista bugiardo)

- **Dove:** `content/part1/chapter6.tex`, sezione «Ricordare il futuro», dopo il paragrafo su Schacter e Addis.
- **Concetto:** le stesse reti ricostruiscono il passato e immaginano il futuro, quindi un ricordo distorto prepara previsioni distorte. È il fondamento biologico del titolo del libro.
- **Didascalia proposta:** Ricordare è già prevedere. Le stesse reti cerebrali ricombinano frammenti di esperienza per ricostruire il passato e per immaginare il futuro; un frammento deformato entra in entrambe le scene.
- **Soggetto:** Al centro, un archivista stilizzato (lo stesso personaggio usato nel libro per la memoria) a un banco di lavoro, con scatole di frammenti: un odore, un volto, una stanza, un suono. Con la mano sinistra monta una scena al passato, in toni seppia, etichettata «ricordo». Con la mano destra usa gli stessi frammenti per montare una scena futura, in toni freschi, etichettata «previsione». Uno dei frammenti è leggermente deformato, con un bordo tratteggiato arancio, e compare in tutte e due le scene, collegato da due frecce con l'etichetta «lo stesso errore, due volte».
- **Testi:** «ricordo», «previsione», «lo stesso errore, due volte».

### N14 · `bivio_dissonanza.png` (cap. 5, La dissonanza cognitiva)

- **Dove:** `content/part1/chapter22.tex`, sezione «Quando il disagio fa cambiare idea», al posto dell'elenco puntato o subito dopo.
- **Concetto:** quando la dissonanza produce un cambiamento invece di una giustificazione. È la «piccola mappa» che il testo stesso propone.
- **Didascalia proposta:** Il bivio della dissonanza. Lo stesso disagio porta più spesso a cambiare idea quando la contraddizione è personale, c'è un'alternativa concreta, ammettere l'errore non significa perdere la faccia e c'è tempo per pensare. Altrimenti vince la giustificazione.
- **Soggetto:** Una persona con una piccola nuvola temporalesca sopra la testa («disagio») arriva a un bivio. Strada in salita a sinistra, «cambiare», illuminata, con quattro lampioni; ogni lampione ha un cartello: «contraddizione personale», «alternativa concreta», «nessuna perdita di faccia», «tempo per pensare». Strada in discesa a destra, «giustificare», comoda, con un tappeto mobile e un cartello «via più economica». Alcuni lampioni a sinistra sono spenti, a indicare che, quando mancano le condizioni, la gente scivola a destra.
- **Testi:** «disagio», «cambiare», i quattro cartelli, «giustificare», «via più economica».

### N15 · `specchi_attribuzione.png` (cap. 13, Venere e Marte)

- **Dove:** `content/part2/chapter20.tex`, sezione «La sindrome dell'impostore e il suo specchio», dopo il paragrafo «In chi ha lo stile opposto…».
- **Concetto:** due stili di attribuzione speculari. Non vanno legati al genere: le icone devono essere neutre.
- **Didascalia proposta:** Due specchi deformanti. Chi tende all'impostore attribuisce il successo alla fortuna e il fallimento a sé; chi tende alla sovrastima fa il contrario. Sono stili diffusi in entrambi i sessi, con differenze medie piccole.
- **Soggetto:** Tabella 2×2 illustrata. Colonne: «Successo» (coppa) e «Fallimento» (vaso rotto). Righe: «Stile impostore», con uno specchio concavo che rimpicciolisce una figura neutra, e «Stile sovrastima», con uno specchio convesso che la ingrandisce. Celle: impostore e successo, «è stata fortuna»; impostore e fallimento, «è colpa mia»; sovrastima e successo, «è merito mio»; sovrastima e fallimento, «è stata sfortuna». Figure senza tratti di genere marcati.
- **Testi:** «Successo», «Fallimento», «Stile impostore», «Stile sovrastima», le quattro frasi.

### N16 · `riso_e_grano.png` (cap. 14, Mille modi di sbagliare)

- **Dove:** `content/part2/chapter13.tex`, sezione «Le differenze dentro i confini», dopo il paragrafo sullo Yangtze.
- **Concetto:** le differenze culturali attraversano anche i confini nazionali. La «terza regola di lettura» del capitolo, resa visibile.
- **Didascalia proposta:** Riso e grano. In Cina, gli studenti delle regioni di tradizione risicola mostrano in media uno stile un po' più olistico e interdipendente di quelli delle regioni del grano, anche a parità di ricchezza. L'ipotesi è discussa, ma mostra che le differenze non coincidono con i confini nazionali.
- **Soggetto:** Mappa molto stilizzata della Cina, senza confini provinciali precisi, divisa da una linea ondulata che segue il fiume Yangtze. A nord, campi dorati di grano e un contadino che lavora da solo, con l'etichetta «grano: lavoro individuale». A sud, risaie verdi a terrazze con canali d'irrigazione condivisi e più famiglie che lavorano insieme, con l'etichetta «riso: irrigazione condivisa». Sotto la mappa, due piccole icone di stile cognitivo: un pesce isolato in primo piano per il nord («più analitico») e un pesce dentro il suo stagno per il sud («più olistico»), con una barra doppia e l'indicazione «in media, con ampia sovrapposizione».
- **Testi:** «Yangtze», «grano: lavoro individuale», «riso: irrigazione condivisa», «più analitico», «più olistico», «in media, con ampia sovrapposizione».

### N17 · `ancora_in_tribunale.png` (cap. 9, Quando la giustizia sbaglia)

- **Dove:** `content/part2/chapter28.tex`, dopo il paragrafo sull'esperimento del risarcimento.
- **Concetto:** l'ancoraggio misurato su giudici veri, con i numeri del testo.
- **Didascalia proposta:** L'ancora in tribunale. Giudici che non avevano sentito alcuna cifra assegnarono in media circa 1.249.000 dollari; quelli a cui era stata menzionata una soglia di 75.000 dollari si fermarono a circa 882.000.
- **Soggetto:** Due colonne verticali di monete o banconote stilizzate. La colonna «Senza ancora» arriva a «≈ 1.249.000 $». La colonna «Con l'ancora» arriva a «≈ 882.000 $» ed è trattenuta verso il basso da una catena legata a una piccola ancora con l'etichetta «75.000 $ citati di sfuggita». Sullo sfondo, un martelletto da giudice e una bilancia. Un piccolo cartello alla base dice «stesso caso, stessi fatti».
- **Testi:** «Senza ancora», «Con l'ancora», «≈ 1.249.000 $», «≈ 882.000 $», «75.000 $ citati di sfuggita», «stesso caso, stessi fatti».

### N18 · `etichetta_e_filiera.png` (cap. 23, Deepfake e realtà condivisa)

- **Dove:** `content/part3/chapter38.tex`, dopo «Proposta 2: responsabilità lungo la filiera».
- **Concetto:** perché un'etichetta visibile non basta, e chi risponde di che cosa.
- **Didascalia proposta:** Un'etichetta difficile da rimuovere e una responsabilità per ogni anello. Chi produce gli strumenti risponde della robustezza delle marcature, chi distribuisce della rapidità d'intervento; solo dopo l'etichetta la scelta passa all'utente.
- **Soggetto:** Una filiera orizzontale in tre anelli. Primo anello, «Chi crea lo strumento»: una fabbrica che stampa un video con una filigrana invisibile, resa come una trama di puntini dentro l'immagine, e l'etichetta «marcatura robusta». Secondo anello, «Chi distribuisce»: una piattaforma generica con un pulsante di segnalazione e un cronometro, «interviene in fretta». Terzo anello, «Chi guarda»: una persona con una lente che legge un'etichetta «generato con IA», «crede, condivide o ignora». Sopra la filiera, un piccolo riquadro: un paio di forbici che taglia via un'etichetta visibile «IA» dal bordo di un video, mentre la filigrana interna resta, con la scritta «il ritaglio non basta».
- **Testi:** «Chi crea lo strumento», «marcatura robusta», «Chi distribuisce», «interviene in fretta», «Chi guarda», «generato con IA», «crede, condivide o ignora», «il ritaglio non basta».

---

## 5. Facoltative (se resta tempo)

- **Cap. 11, Il piedistallo cognitivo**: `ammirazione_granulare.png`. Una persona-medaglia in cui solo un settore (il campo di competenza) è dorato e gli altri sono grigi, contro un piedistallo tutto d'oro. Il capitolo ha già tre immagini.
- **Cap. 20, L'antropomorfizzazione**: `sycophancy_due_cornici.png`. La stessa domanda posta con due cornici diverse riceve due risposte opposte, come nel *Prova tu*. Va messa dopo la spiegazione.
- **Appendice, La bussola in 7 domande**: `bussola_sette_domande.png`. Una rosa dei venti con le sette domande sui raggi, da usare anche come pagina staccabile.
