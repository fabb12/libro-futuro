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
