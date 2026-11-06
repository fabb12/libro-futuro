# Nuove immagini proposte: concetti complessi ancora senza figura

Verifica rifatta sui capitoli inclusi in `main.tex` dopo l'aggiornamento di main con le due immagini del cap. 12 (novembre 2026). Numeri di capitolo = numerazione stampata.

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
| 12 | `part2/chapter24.tex` | 3 (`archetipi_jung.png` e `disney_miyazaki_bluey.png` aggiunte su main) | ok |
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

**Criterio di scelta.** Si tengono solo le immagini che spiegano un meccanismo difficile da capire a parole, e nessuna figura nuova sta a meno di circa 600 parole (quasi due pagine) da un'altra immagine dello stesso capitolo. `igurasola` occupa una pagina intera, quindi sotto quella distanza si avrebbero due pagine d'immagine di seguito.

Prologo e cap. 15 erano gli unici capitoli senza immagini: ora ne hanno una ciascuno.

**Cap. 4, piramide dell'autogiustificazione:** la frase di `chapter7.tex` è stata corretta e ora segue l'immagine originale di Tavris e Aronson, con due persone che partono dalla cima e scendono su versanti opposti.

**Immagini già presenti in `images/` ma non usate:** `due_piloti_mente.png` contiene la parola inglese «CONTROL» ed etichette ripetute; `uomo_senza_petto.png` è già sostituita da `giungla_deserto.png`. Non le consiglio come ripiego.

## 2. Come usare i prompt

**Le 9 figure qui sotto sono già inserite nel testo** con `\figurasola` e la didascalia proposta. Basta salvare l'immagine in `images/` con il nome indicato (minuscole, `.png`) e comparirà al posto del segnaposto.

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

## 3. Immagini inserite nel testo (9)

I numeri di capitolo sono quelli stampati.

### 1 · `prologo_ciclo_futuro_anteriore.png` (Prologo)

- **Dove:** `content/prologo.tex`, dopo il paragrafo «La terza riguarda noi…», prima di «Il libro segue questo filo…».
- **Concetto:** la tesi del libro in un anello. Una mente che distorce lascia tracce, le macchine imparano da quelle tracce e ci restituiscono il mondo, e le nostre nuove decisioni diventano nuove tracce. Le quattro parti del libro sono quattro tappe dell'anello.
- **Didascalia proposta:** Il ciclo del futuro anteriore. La mente costruisce una versione della realtà; le sue scelte diventano archivi; le macchine imparano da quegli archivi e ce li restituiscono; ciò che decidiamo oggi sarà stato il passato da cui impareranno domani.
- **Soggetto:** Grande anello circolare in senso orario con quattro stazioni illustrate. In alto, una testa stilizzata in sezione con una lente che deforma leggermente un paesaggio: «Parte I · La mente costruisce». A destra, scrivanie, cartelle cliniche, una bilancia della giustizia e un grafico di borsa che diventano fogli d'archivio: «Parte II · Le decisioni lasciano tracce». In basso, gli archivi entrano in una macchina astratta fatta di nodi luminosi che proietta uno schermo verso la persona: «Parte III · Le macchine imparano e restituiscono». A sinistra, la stessa persona con una bussola in mano, che si ferma e osserva: «Parte IV · Orientarsi». Al centro dell'anello, in caratteri eleganti, la scritta «sarà stato». Frecce morbide tra le stazioni; una freccia tratteggiata dalla bussola verso la testa, a indicare che il ciclo si può cambiare.
- **Testi:** «Parte I · La mente costruisce», «Parte II · Le decisioni lasciano tracce», «Parte III · Le macchine imparano e restituiscono», «Parte IV · Orientarsi», «sarà stato».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Grande anello circolare in senso orario con quattro stazioni illustrate. In alto, una testa stilizzata in sezione con una lente che deforma leggermente un paesaggio: «Parte I · La mente costruisce». A destra, scrivanie, cartelle cliniche, una bilancia della giustizia e un grafico di borsa che diventano fogli d'archivio: «Parte II · Le decisioni lasciano tracce». In basso, gli archivi entrano in una macchina astratta fatta di nodi luminosi che proietta uno schermo verso la persona: «Parte III · Le macchine imparano e restituiscono». A sinistra, la stessa persona con una bussola in mano, che si ferma e osserva: «Parte IV · Orientarsi». Al centro dell'anello, in caratteri eleganti, la scritta «sarà stato». Frecce morbide tra le stazioni; una freccia tratteggiata dalla bussola verso la testa, a indicare che il ciclo si può cambiare.

Scritte (in italiano, esattamente così, nient'altro): «Parte I · La mente costruisce», «Parte II · Le decisioni lasciano tracce», «Parte III · Le macchine imparano e restituiscono», «Parte IV · Orientarsi», «sarà stato».
```

### 2 · `tre_piani_pregiudizio.png` (cap. 15, L'apprendimento impossibile)

- **Dove:** `content/part2/chapter12.tex`, alla fine dell'introduzione, dopo «…perché le buone intenzioni non bastano a evitarli.» (prima di `\section{Che cosa c'è fin dall'inizio}`).
- **Concetto:** i tre piani distinti da cui nasce un pregiudizio. **Non** disegnare neuroni specchio né «finestre critiche» a età fisse: il testo le ha tolte perché non reggono ai dati.
- **Didascalia proposta:** Tre piani, non un unico meccanismo. Una predisposizione a notare le somiglianze, l'apprendimento di associazioni dai segnali degli adulti, e una socializzazione che indica quali categorie contano. Si può lavorare sugli ultimi due.
- **Soggetto:** Edificio a tre piani in sezione, come una casa delle bambole, con un bambino di circa 5 anni che sale una scala interna. Piano terra, «Predisposizione»: il bambino ordina forme e colori in mucchietti, con l'etichetta «notare le somiglianze». Primo piano, «Associazioni»: il bambino guarda due adulti; uno saluta una donna con un sorriso caldo, l'altro saluta una seconda donna con postura rigida e un'icona di ghiaccio; piccole frecce dagli adulti agli occhi del bambino, con l'etichetta «segnali non detti». Secondo piano, «Socializzazione»: un'aula con bambini in magliette metà blu e metà rosse, una maestra che indica due file separate, con l'etichetta «categorie rese importanti». Sul tetto un fumetto con la domanda «Come fai a saperlo?». Una piccola chiave inglese sui piani 1 e 2 indica che si possono modificare; il piano terra ha invece un lucchetto aperto con l'etichetta «utile per imparare».
- **Testi:** «Predisposizione», «notare le somiglianze», «Associazioni», «segnali non detti», «Socializzazione», «categorie rese importanti», «Come fai a saperlo?», «utile per imparare».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Edificio a tre piani in sezione, come una casa delle bambole, con un bambino di circa 5 anni che sale una scala interna. Piano terra, «Predisposizione»: il bambino ordina forme e colori in mucchietti, con l'etichetta «notare le somiglianze». Primo piano, «Associazioni»: il bambino guarda due adulti; uno saluta una donna con un sorriso caldo, l'altro saluta una seconda donna con postura rigida e un'icona di ghiaccio; piccole frecce dagli adulti agli occhi del bambino, con l'etichetta «segnali non detti». Secondo piano, «Socializzazione»: un'aula con bambini in magliette metà blu e metà rosse, una maestra che indica due file separate, con l'etichetta «categorie rese importanti». Sul tetto un fumetto con la domanda «Come fai a saperlo?». Una piccola chiave inglese sui piani 1 e 2 indica che si possono modificare; il piano terra ha invece un lucchetto aperto con l'etichetta «utile per imparare».

Scritte (in italiano, esattamente così, nient'altro): «Predisposizione», «notare le somiglianze», «Associazioni», «segnali non detti», «Socializzazione», «categorie rese importanti», «Come fai a saperlo?», «utile per imparare».
```

### 3 · `cinque_livelli_bias_ia.png` (cap. 18, Quando le macchine imparano i nostri pregiudizi)

- **Dove:** `content/part3/chapter11.tex`, alla fine dell'introduzione, subito prima di `\section{Primo livello: i dati}`: fa da mappa del capitolo. È stata messa lì e non dopo il riquadro dei cinque livelli perché in quel punto sarebbe finita a 85 parole da `bias_llm_specchio_deformante.png`.
- **Concetto:** è lo schema che regge tutta la Parte III. Una distorsione può nascere in cinque punti diversi, e ognuno richiede un rimedio diverso.
- **Didascalia proposta:** Cinque punti in cui può nascere la distorsione di un sistema di IA: i dati da cui impara, l'obiettivo per cui è ottimizzato, le scelte di chi lo progetta, il modo in cui lo interroghiamo, i bias di chi legge la risposta.
- **Soggetto:** Una catena di montaggio orizzontale con cinque stazioni numerate, attraversata da un nastro che porta un foglio dalla sinistra (una pila di archivi) alla destra (una persona che legge uno schermo). 1 «Dati»: scaffali di documenti con alcuni buchi vuoti e alcune pile sproporzionate. 2 «Obiettivo»: un bersaglio su cui è scritto «spesa» mentre accanto c'è un cuore con «salute» ignorato. 3 «Progettazione»: mani umane che regolano manopole e filtri. 4 «Interazione»: un fumetto di domanda che entra nella macchina e una freccia circolare di ritorno. 5 «Lettore»: una persona che annuisce davanti a un testo molto fluido, con un'aureola luminosa sopra lo schermo («effetto alone»). Sotto il nastro, una lente d'ingrandimento con la scritta «dove nasce l'errore?».
- **Testi:** «Dati», «Obiettivo», «Progettazione», «Interazione», «Lettore», «dove nasce l'errore?».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Una catena di montaggio orizzontale con cinque stazioni numerate, attraversata da un nastro che porta un foglio dalla sinistra (una pila di archivi) alla destra (una persona che legge uno schermo). 1 «Dati»: scaffali di documenti con alcuni buchi vuoti e alcune pile sproporzionate. 2 «Obiettivo»: un bersaglio su cui è scritto «spesa» mentre accanto c'è un cuore con «salute» ignorato. 3 «Progettazione»: mani umane che regolano manopole e filtri. 4 «Interazione»: un fumetto di domanda che entra nella macchina e una freccia circolare di ritorno. 5 «Lettore»: una persona che annuisce davanti a un testo molto fluido, con un'aureola luminosa sopra lo schermo («effetto alone»). Sotto il nastro, una lente d'ingrandimento con la scritta «dove nasce l'errore?».

Scritte (in italiano, esattamente così, nient'altro): «Dati», «Obiettivo», «Progettazione», «Interazione», «Lettore», «dove nasce l'errore?».
```

### 4 · `frequenze_base_marco.png` (cap. 7, Il casinò nella testa)

- **Dove:** `content/part2/chapter14.tex`, **dopo** il riquadro *Prova tu* «Le probabilità prima della storia» (non prima, altrimenti svela la soluzione).
- **Concetto:** trascurare la frequenza di base. Usa solo i numeri del testo, che sono già dichiarati illustrativi.
- **Didascalia proposta:** Chi è Marco? Su 800.000 insegnanti e 8.000 trader (numeri illustrativi), la descrizione si adatta a 4.000 trader ma a 8.000 insegnanti. Due «Marco» su tre insegnano.
- **Soggetto:** Diagramma ad albero per frequenze naturali con icone di persone. A sinistra un grande blocco di 100 piccole icone che rappresentano «800.000 insegnanti» e un blocco minuscolo con 1 icona che rappresenta «8.000 trader»: la differenza di scala deve essere evidente. Da ciascun blocco scende un ramo con il filtro «corrisponde alla descrizione?»: dal blocco insegnanti esce «1 su 100 = 8.000», dal blocco trader esce «1 su 2 = 4.000». In basso i due gruppi filtrati sono affiancati: 8.000 insegnanti (due terzi del riquadro, in blu) e 4.000 trader (un terzo, in arancio), con la conclusione «2 Marco su 3 insegnano». Una piccola nota a margine dice «numeri illustrativi».
- **Testi:** «800.000 insegnanti», «8.000 trader», «corrisponde alla descrizione?», «1 su 100 = 8.000», «1 su 2 = 4.000», «2 Marco su 3 insegnano», «numeri illustrativi».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Diagramma ad albero per frequenze naturali con icone di persone. A sinistra un grande blocco di 100 piccole icone che rappresentano «800.000 insegnanti» e un blocco minuscolo con 1 icona che rappresenta «8.000 trader»: la differenza di scala deve essere evidente. Da ciascun blocco scende un ramo con il filtro «corrisponde alla descrizione?»: dal blocco insegnanti esce «1 su 100 = 8.000», dal blocco trader esce «1 su 2 = 4.000». In basso i due gruppi filtrati sono affiancati: 8.000 insegnanti (due terzi del riquadro, in blu) e 4.000 trader (un terzo, in arancio), con la conclusione «2 Marco su 3 insegnano». Una piccola nota a margine dice «numeri illustrativi».

Scritte (in italiano, esattamente così, nient'altro): «800.000 insegnanti», «8.000 trader», «corrisponde alla descrizione?», «1 su 100 = 8.000», «1 su 2 = 4.000», «2 Marco su 3 insegnano», «numeri illustrativi».
```

### 5 · `errore_previsione_dopamina.png` (cap. 3, L'eredità del terrore)

- **Dove:** `content/part1/chapter2.tex`, sezione «Il tutore severo», dopo il paragrafo su Wolfram Schultz.
- **Concetto:** la dopamina come segnale di errore di previsione e non come «molecola del piacere». Il tema torna nei capitoli 7 e 19.
- **Didascalia proposta:** L'errore di previsione. I neuroni della dopamina reagiscono alla differenza tra ciò che ci aspettavamo e ciò che accade: più attivi quando va meglio del previsto, invariati quando va come previsto, meno attivi quando va peggio. Schema qualitativo.
- **Soggetto:** Tre pannelli affiancati, ognuno con una piccola scena sopra e un tracciato stilizzato sotto, simile a un elettrocardiogramma semplificato e senza scala numerica. Pannello 1, «Meglio del previsto»: una persona riceve un regalo inatteso e il tracciato ha un picco netto. Pannello 2, «Come previsto»: la persona riceve il caffè che aspettava e il tracciato è piatto. Pannello 3, «Peggio del previsto»: la persona apre una scatola vuota e il tracciato scende sotto la linea di base. Sotto i tre pannelli, una banda con una freccia circolare: «l'errore aggiorna la previsione».
- **Testi:** «Meglio del previsto», «Come previsto», «Peggio del previsto», «l'errore aggiorna la previsione», «schema qualitativo».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Tre pannelli affiancati, ognuno con una piccola scena sopra e un tracciato stilizzato sotto, simile a un elettrocardiogramma semplificato e senza scala numerica. Pannello 1, «Meglio del previsto»: una persona riceve un regalo inatteso e il tracciato ha un picco netto. Pannello 2, «Come previsto»: la persona riceve il caffè che aspettava e il tracciato è piatto. Pannello 3, «Peggio del previsto»: la persona apre una scatola vuota e il tracciato scende sotto la linea di base. Sotto i tre pannelli, una banda con una freccia circolare: «l'errore aggiorna la previsione».

Scritte (in italiano, esattamente così, nient'altro): «Meglio del previsto», «Come previsto», «Peggio del previsto», «l'errore aggiorna la previsione», «schema qualitativo».
```

### 6 · `spesa_non_e_bisogno.png` (cap. 17, Troppe scelte, troppi vincitori)

- **Dove:** `content/part2/chapter30.tex`, sezione «L'archivio dei sopravvissuti», dopo il paragrafo «Non è solo un'immagine. Nel 2019…».
- **Concetto:** una variabile sostitutiva (la spesa) che misura bene ma misura la cosa sbagliata. Fa da ponte tra gli aerei di Wald e la Parte III.
- **Didascalia proposta:** Dati accurati, domanda sbagliata. L'algoritmo stimava il bisogno di cure dalla spesa sanitaria passata; a parità di salute, chi aveva avuto meno accesso alle cure aveva speso meno e sembrava più sano. Come sugli aerei di Wald, mancava ciò che non era stato registrato.
- **Soggetto:** Due pazienti affiancati con lo stesso livello di salute, indicato da un identico termometro rosso a metà. Sopra il paziente A una pila alta di ricevute e farmaci, sopra il paziente B una pila bassa e accanto una porta d'ambulatorio chiusa con l'etichetta «meno accesso alle cure». Una macchina-algoritmo guarda solo le pile di ricevute con una lente («misura: spesa») e assegna ad A un cartellino «priorità alta» e a B «priorità bassa». In un piccolo inserto in alto a destra, la sagoma di un aereo con fori di proiettile e la scritta «chi manca?».
- **Testi:** «stessa salute», «meno accesso alle cure», «misura: spesa», «priorità alta», «priorità bassa», «chi manca?».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Due pazienti affiancati con lo stesso livello di salute, indicato da un identico termometro rosso a metà. Sopra il paziente A una pila alta di ricevute e farmaci, sopra il paziente B una pila bassa e accanto una porta d'ambulatorio chiusa con l'etichetta «meno accesso alle cure». Una macchina-algoritmo guarda solo le pile di ricevute con una lente («misura: spesa») e assegna ad A un cartellino «priorità alta» e a B «priorità bassa». In un piccolo inserto in alto a destra, la sagoma di un aereo con fori di proiettile e la scritta «chi manca?».

Scritte (in italiano, esattamente così, nient'altro): «stessa salute», «meno accesso alle cure», «misura: spesa», «priorità alta», «priorità bassa», «chi manca?».
```

### 7 · `saggezza_delle_folle.png` (cap. 6, La continuità evolutiva dei bias)

- **Dove:** `content/part1/chapter9.tex`, sezione «Quando il gruppo è più saggio, e quando no», subito dopo il riquadro «Quando la collettività aiuta, quando danneggia».
- **Concetto:** stime indipendenti contro stime che si copiano a vicenda. È la base della Parte III (social network).
- **Didascalia proposta:** La stessa folla, due esiti. Se ciascuno stima per conto suo, gli errori si compensano e la media si avvicina al vero; se tutti vedono subito la prima risposta, gli errori si sommano.
- **Soggetto:** Due pannelli con lo stesso bue disegnato su una pedana con un cartello «Quanto pesa?». Pannello sinistro, «Stime indipendenti»: dieci persone, ognuna con il proprio foglietto nascosto e numeri diversi (alcuni alti, alcuni bassi), frecce che convergono in un riquadro «media ≈ peso vero» con una spunta verde. Pannello destro, «Stime che si copiano»: le stesse persone guardano tutte il foglietto della prima, con frecce a catena da una persona all'altra, e tutti scrivono lo stesso numero sbagliato; riquadro «tutti d'accordo, tutti lontani» con una X arancio. Usa numeri generici e non il dato di Galton.
- **Testi:** «Quanto pesa?», «Stime indipendenti», «media ≈ peso vero», «Stime che si copiano», «tutti d'accordo, tutti lontani».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Due pannelli con lo stesso bue disegnato su una pedana con un cartello «Quanto pesa?». Pannello sinistro, «Stime indipendenti»: dieci persone, ognuna con il proprio foglietto nascosto e numeri diversi (alcuni alti, alcuni bassi), frecce che convergono in un riquadro «media ≈ peso vero» con una spunta verde. Pannello destro, «Stime che si copiano»: le stesse persone guardano tutte il foglietto della prima, con frecce a catena da una persona all'altra, e tutti scrivono lo stesso numero sbagliato; riquadro «tutti d'accordo, tutti lontani» con una X arancio. Usa numeri generici e non il dato di Galton.

Scritte (in italiano, esattamente così, nient'altro): «Quanto pesa?», «Stime indipendenti», «media ≈ peso vero», «Stime che si copiano», «tutti d'accordo, tutti lontani».
```

### 8 · `piramide_autogiustificazione.png` (cap. 4, L'illusione di essere razionali)

- **Dove:** `content/part1/chapter7.tex`, sezione «La coerenza a posteriori e le difese dell'ego», dopo il paragrafo su Tavris e Aronson. La frase del testo è già stata corretta.
- **Concetto:** piccole decisioni e giustificazioni che allontanano due persone partite quasi uguali.
- **Didascalia proposta:** La piramide dell'autogiustificazione di Tavris e Aronson. Due persone partono vicine, in cima; una piccola scelta in direzioni opposte, e ogni giustificazione le fa scendere un gradino più lontano, finché alla base sembrano non aver mai avuto nulla in comune.
- **Soggetto:** Piramide a gradoni vista di lato. In cima due persone quasi identiche, spalla a spalla, davanti a un piccolo bivio («una piccola scelta»). Ciascuna scende un versante opposto. Su ogni gradino c'è un fumetto con una giustificazione breve: a sinistra «era solo una volta», «lo fanno tutti», «avevo ragione io»; a destra «non è da me», «chi lo fa sbaglia», «io non sbaglio mai». Alla base, le due persone sono ai due estremi e si guardano con diffidenza, ciascuna con la scritta «convinzione sincera». Una doppia freccia lunga alla base dice «distanza».
- **Testi:** «una piccola scelta», «era solo una volta», «lo fanno tutti», «avevo ragione io», «non è da me», «chi lo fa sbaglia», «io non sbaglio mai», «convinzione sincera», «distanza».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Piramide a gradoni vista di lato. In cima due persone quasi identiche, spalla a spalla, davanti a un piccolo bivio («una piccola scelta»). Ciascuna scende un versante opposto. Su ogni gradino c'è un fumetto con una giustificazione breve: a sinistra «era solo una volta», «lo fanno tutti», «avevo ragione io»; a destra «non è da me», «chi lo fa sbaglia», «io non sbaglio mai». Alla base, le due persone sono ai due estremi e si guardano con diffidenza, ciascuna con la scritta «convinzione sincera». Una doppia freccia lunga alla base dice «distanza».

Scritte (in italiano, esattamente così, nient'altro): «una piccola scelta», «era solo una volta», «lo fanno tutti», «avevo ragione io», «non è da me», «chi lo fa sbaglia», «io non sbaglio mai», «convinzione sincera», «distanza».
```

### 9 · `petrov_tre_controlli.png` (cap. 21, Co-evoluzione uomo-IA)

- **Dove:** `content/part3/chapter27.tex`, dopo il paragrafo «Il suo dubbio non era sfiducia generica…».
- **Concetto:** il senso critico come procedura, e non come semplice istinto.
- **Didascalia proposta:** I tre controlli di Petrov. Il dubbio non era sfiducia generica, ma il confronto tra ciò che la macchina diceva e ciò che si sapeva del mondo. Oggi la seconda fonte, spesso, dobbiamo cercarla noi.
- **Soggetto:** Un ufficiale stilizzato di spalle davanti a uno schermo d'allarme («5 missili in arrivo»). Da lui partono tre fumetti-checklist con un'icona ciascuno: un mucchio di centinaia di frecce contro cinque frecce, con la scritta «un attacco vero: centinaia, non cinque»; un ingranaggio nuovo con l'etichetta «non collaudato» e la scritta «sistema nuovo»; uno schermo radar vuoto con la scritta «i radar di terra non vedono nulla». In fondo un timbro: «malfunzionamento». In un riquadro piccolo in basso, il parallelo con oggi: una persona davanti alla risposta di un chatbot che si chiede «qual è il mio radar di terra?».
- **Testi:** «5 missili in arrivo», «un attacco vero: centinaia, non cinque», «sistema nuovo», «i radar di terra non vedono nulla», «malfunzionamento», «qual è il mio radar di terra?».

**Prompt completo da incollare:**

```text
Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D. Bold clean sans-serif lettering, ALL TEXT IN ITALIAN, spelled exactly as given, few short labels, readable when printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names, no copyrighted characters.

Formato orizzontale 3:2, 1536×1024 px, sfondo pieno, margine di sicurezza 5%.

Soggetto: Un ufficiale stilizzato di spalle davanti a uno schermo d'allarme («5 missili in arrivo»). Da lui partono tre fumetti-checklist con un'icona ciascuno: un mucchio di centinaia di frecce contro cinque frecce, con la scritta «un attacco vero: centinaia, non cinque»; un ingranaggio nuovo con l'etichetta «non collaudato» e la scritta «sistema nuovo»; uno schermo radar vuoto con la scritta «i radar di terra non vedono nulla». In fondo un timbro: «malfunzionamento». In un riquadro piccolo in basso, il parallelo con oggi: una persona davanti alla risposta di un chatbot che si chiede «qual è il mio radar di terra?».

Scritte (in italiano, esattamente così, nient'altro): «5 missili in arrivo», «un attacco vero: centinaia, non cinque», «sistema nuovo», «i radar di terra non vedono nulla», «malfunzionamento», «qual è il mio radar di terra?».
```

---

## 4. Proposte scartate (non inserite)

| Immagine | Cap. | Motivo |
|---|---|---|
| `prestazione_vs_apprendimento` | 26 | sarebbe a meno di 500 parole da `oracolo_vs_tutor.png` |
| `dopo_il_pattern` | 28 | a 55 parole da `apofenia_pareidolia_creativa.png`, che dice già l'essenziale |
| `due_sale_controllo` | Epilogo | troppo vicina a `archivio_distribuito.png`; doppione della figura su Petrov del cap. 21 |
| `ricordare_il_futuro` | 2 | concetto già chiaro nel testo; il capitolo ha già due immagini |
| `bivio_dissonanza` | 5 | ripete l'elenco puntato del testo; il capitolo ha già due immagini |
| `ancora_in_tribunale` | 9 | sono solo due numeri, già chiari nel testo |
| `specchi_attribuzione` | 13 | concetto semplice, spiegato bene a parole |
| `riso_e_grano` | 14 | è un esempio, non un concetto difficile |
| `quantita_qualita_verita` | 22 | ripete un elenco già esplicito nel testo |
| `etichetta_e_filiera` | 23 | riguarda una proposta normativa, non un meccanismo da capire |
| `leve_e_contromisure` | 24 | `hacking_cognitivo.png` mostra già le leve; gli abbinamenti sono un elenco |

I prompt completi di queste immagini restano nella cronologia git del file, se un giorno servissero.
