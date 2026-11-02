# Revisione editoriale (novembre 2026)

Sintesi degli interventi applicati secondo il piano «La tesi del libro» e di ciò che resta da fare all'autore.

## Fatto

- **Sottotitolo**: «Perché il nostro cervello distorce la realtà nell'era dell'intelligenza artificiale» (`main.tex`).
- **Apertura unica**: il Prologo si apre con Chernobyl, distinguendo documenti (INSAG-1, INSAG-7), difetti tecnici/organizzativi e ipotesi psicologiche. La Prefazione è ridotta a una nota di lettura. Il testo sulla scrittura aumentata nella pagina del copyright rimanda alla Nota metodologica.
- **Quarta di copertina**: promessa verificabile, esplicito che il lettore non diventa immune dai bias.
- **Parte I**: cervello trino come metafora storica; amigdala e Sistema 1/2 come processi distribuiti (controesempio della paziente S.M.); memoria snellita (concetto storia/memoria di Barbero mantenuto); dissonanza senza riprese di Sartre/akrasia, con sezione «Quando il disagio fa cambiare idea»; cap. 9 con le condizioni in cui il gruppo decide meglio o peggio.
- **Parte II**: caso attuale (Australia, studi Meta 2023) nel cap. sull'algoritmo; nuovo diagramma TikZ «informazione → attenzione → interpretazione → decisione → rinforzo»; medicina con aneddoto separato dalle prove; giustizia con COMPAS distinto dall'IA generativa; clima con dati WMO/Copernicus; Pauling riscritto su fonti documentate; Disney da requisitoria a dati misurati e controesempi; genere senza la falsa conclusione «nessuna differenza»; cap. 13 riscritto senza stereotipi nazionali; cap. 12 e 29 separati (apprendimento dei pregiudizi / genitori e digitale).
- **Parte III**: cinque livelli del bias nei sistemi di IA (dati, obiettivo, progettazione, interazione, lettore), Bolukbasi 2016 e Caliskan 2017 citati per il loro oggetto; thymos definito; co-evoluzione con dati verificati, scenari e previsioni distinti; deepfake con distinzione sintetico/ingannevole e quadro normativo aggiornato (AI Act art. 50, L. 132/2025, Take It Down Act). Caso Schlein–Vannacci verificato (agosto 2026): il video nasceva come spiegazione sui deepfake ed è stato ritagliato.
- **Parte IV**: etichette algoritmiche con prototipo visivo e limiti di fattibilità; impalcatura socratica con dati (Bastani et al.) e conversazione esemplare breve; simulatore con telemetria dichiarata come mock-up; inganno volontario con responsabilità condivisa; bias sui bias con autovalutazione aperta; epilogo con una sola domanda e una scelta.
- **Cinque «Prova tu»** (ambiente `provatu` in `misc/options.tex`), seguendo le posizioni della sezione 5 del piano: conferma (cap. 7), tassi di base (casinò), due versioni dello stesso ricordo (infanzia, cap. 29), la macchina che mi dà ragione (antropomorfizzazione), chi correggerebbe te? (bias sui bias). L'ancoraggio è trattato nel testo del casinò.
- **Appendici nuove**: `appendix/bussola.tex` (anche stampabile: `misc/bussola_stampabile.tex`), `appendix/nota_metodologica.tex`, `appendix/bibliografia.tex` (con tabella del grado di evidenza). Il dialogo Liminal distingue graficamente trascrizione e commento.
- **Figure**: la mappa dell'Italia (`cap29_mappa_italia.png`) è sospesa finché non c'è un dataset citato; la figura della rana bollita ha una didascalia che segnala il valore non rilevato.

## Da fare (autore)

Nel PDF i punti aperti compaiono in rosso come «DA SCRIVERE DALL'AUTORE»:

1. **Tre casi personali autentici** (non vanno inventati):
   - un errore di giudizio — cap. 7 (`content/part1/chapter7.tex`);
   - un ripensamento davanti a una prova contraria — cap. 22 (`content/part1/chapter22.tex`);
   - che cosa ha insegnato l'esperienza Liminal — `appendix/dialogue.tex`.
2. **Criteri di montaggio della trascrizione Liminal** (tagli, traduzioni, dove è conservato l'originale) — `appendix/dialogue.tex`.
3. **Nota metodologica**: verificare e completare con periodo, strumenti e versioni, recapito per i lettori — `appendix/nota_metodologica.tex`.
4. **Immagine della rana** (`images/1000000076.png`): il riquadro «+1,5 °C in 50 anni» non corrisponde ai dati; meglio rigenerarla senza numero.

---

# Revisione narrativa (novembre 2026, seconda fase)

Applicata la lista di 22 modifiche editoriali. Guida di lavoro: `revisione/guida_revisione_narrativa.md`.

## Fatto

- **Struttura** (`main.tex`). Memoria anticipata al secondo capitolo della Parte I. Parte II in tre gruppi (decisioni e conseguenze; costruzione culturale della realtà; trasmissione e rinforzo delle convinzioni). Il capitolo sull'algoritmo passa nella Parte III, dopo «Quando le macchine imparano». «Il deserto del reale digitale» passa nella Parte III, prima dei deepfake. «Uomini senza petto» passa nella Parte IV, accorciato, dopo la responsabilità. Le label LaTeX sono rimaste quelle originali.
- **Prologo**. Domanda centrale esplicita e nuova sezione «Perché "futuro anteriore"» (memoria che prevede, macchine fatte di memorie, decisioni di oggi come dati di domani). Invito al lettore a compilare il taccuino.
- **Aperture delle parti** (`parts/`). Un testo di 220–300 parole per parte, più un riquadro del taccuino.
- **Filo narrativo**. Scartati il personaggio inventato e il taccuino del lettore. Aggiunta la storia vera di Stanislav Petrov (capitolo sulla co-evoluzione, richiamata nel prologo, nella Parte IV, nel capitolo sull'IA socratica e nell'epilogo) sul senso critico verso le macchine.
- **Testi dell'autore completati** con episodi documentati nel manoscritto: le fonti inesistenti accettate durante la scrittura (cap. 7), il ripensamento sul cervello trino (cap. 22), la riflessione su Liminal e i criteri di montaggio (appendice), periodo, strumenti e metodo di verifica nella nota metodologica. Da rileggere e confermare.
- **Transizioni** riscritte in tutti i capitoli; rimandi errati corretti (antropomorfizzazione → deepfake; simulatore → bias sui bias; altri emersi con lo spostamento).
- **Tagli e integrazioni**. Disney da 2780 a circa 1880 parole; thymos da circa 1630 a circa 1280; cap. 10, 17, 32, 39 accorciati; estratto Liminal commentato nel capitolo sull'antropomorfizzazione (fatti, contenuti generati, interpretazione) con rimando all'appendice (`app:liminal`).
- **Clima** collegato al futuro anteriore (sezione «Il passato di chi verrà»). **Sopravvissuto** come ponte verso la Parte III («L'archivio dei sopravvissuti»).
- **Metafore** ridotte a tre (condominio, due piloti, archivista bugiardo); spiegazioni evolutive concentrate nei capp. 1–2.
- **Verifica scientifica**. Libet (veto, Schurger et al. 2012), dopamina come errore di previsione, polarizzazione (Guess, Nyhan 2023; Bakshy 2015; Boxell 2017), giudici e pausa pranzo, Dunning-Kruger, marmellate, Wald, Milgram, Joel, Sparrow, Pope 2000 e altri.
- **Due punti** ridotti in tutto il testo rivisto.
- **Immagini**. Le figure che restano da sole in una pagina usano il comando `\figurasola`, che le ingrandisce al massimo senza deformarle (altezza utile piena, fino a 12 mm per lato nei margini).
- **ISBN**. Il numero precedente usava il prefisso di un editore reale; ora è «in attesa di assegnazione».
- **Compilazione** completa senza errori né rimandi irrisolti (399 pagine).
- **Test con lettori**. Protocollo pronto in `revisione/test_lettori.md`.

## Da fare (autore)

1. Rileggere e confermare i testi in prima persona (cap. 7, cap. 22, appendice Liminal, nota metodologica). In particolare: che la trascrizione completa di Liminal sia conservata, che la conversazione fosse in italiano, gli strumenti usati. Aggiungere un recapito per i lettori se lo si desidera.
3. Confermare l'episodio delle conferenze di psicologia raccontato in prima persona nel cap. «Bias sui bias».
4. Fonti da ricontrollare, segnalate durante la revisione: frase attribuita a Barbero e dato sui docenti «migliori della media» (Parte I); Libet 1985 e Scheibehenne 2010; Li 2021 (Cochrane, cap. medicina); NIJ 2020 e il dettaglio Guthrie 2001 (giustizia); Atari et al. 2023 (preprint) ed Eliot et al. 2021; Bavelier et al. 2021 e Işıkoğlu et al. 2025 (famiglia); Fišer et al. 2025, video Kurzgesagt, rinvii dell'AI Act (Parte III); Arantes 2019 e Floridi (Parte IV); fonte della frase di Sean Parker (Axios, 2017).
5. Eseguire il test con 8–12 lettori (punto 22).
6. Generare il PDF finale dal tab Actions dopo aver unito il ramo.
