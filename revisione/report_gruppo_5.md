# Report gruppo 5 (part4: chapter10, 31, 32, 33, 17, 34)

## Interventi applicati
- **#2 (label)**: `\label{cap:p4c10}`, `p4c31`, `p4c32`, `p4c33`, `p4c34`, `p4c17` dopo il `\chapter`; `\label{sec:p4c10-anatomia}` sulla §Anatomia del cap. 10.
- **#35 (chapter31)**: ridotto Gattaca da 4 citazioni a 2 (restano apertura e §finale con Vincent Freeman). Tolti i paragrafi Greenbaum & Gerstein, Ogbunugafor e Berkeley/Obasogie (con le loro note, parte del taglio Gattaca). Non toccati Pittman & Sheehan, Harris, Rilke (passo separato). Nota: i riferimenti a Pittman, Harris e Rilke indicati dal piano non sono stati modificati.
- **#36 (chapter32)**: atrofia sostituita con `cap.~\ref{cap:p3c23}, \S~\ref{sec:p3c23-svantaggi}` (C5). **Richiede che l'agente del part3/chapter23 aggiunga `\label{sec:p3c23-svantaggi}` alla §Gli Svantaggi** (riga 37) e `cap:p3c23`. Metafore alimentari («cibo cognitivo rapido», «zucchero cognitivo» x2) sostituite con immagini diverse (elicottero in montagna, gratificazione fulminea). Resnick non toccato.
- **#37 (chapter33)**: dichiarazione che personaggi e casi sono ipotetici (nuovo paragrafo prima del medico specializzando); Danziger/«decision fatigue» con rimando `cap.~\ref{cap:p2c28}` e segnalazione che lo studio è contestato (nota bibliografica invariata). Corrette anche le virgole spurie « ,» -> « — ».
- **#42 (parziale, miei file)**: «Il stesso» -> «Lo stesso» (chapter17); virgole spurie sostituite con trattino in chapter10, chapter33, chapter34. Nessun `captionof` vuoto nei miei file.

## Saltati
- #34 (chapter10 §2 Anatomia, R10) e #38 (chapter34 apertura, Malone & Shah): marcati opus. Per #38 resta il problema dell'apertura che dice «all'inizio di questo libro» (C5).
- Parti bibliografiche di #35/#36 (Pittman & Sheehan, Harris, Rilke, Resnick, Malone & Shah): passo separato.

## Immagini aggiunte
| Capitolo | File | Tipo | Descrizione |
|---|---|---|---|
| chapter10 | images/hacking_cognitivo.png | esistente (era solo in old/chapter1) | anatomia dell'hacking cognitivo, prima dei Quattro Pilastri |
| chapter34 | images/neurodiversita.png | esistente | neurodiversità funzionale (prudente, esploratore, critico, creativo), dopo il primo paragrafo |
| chapter31 | images/etichette_algoritmiche_confronto.png | segnaposto | etichetta alimentare affiancata a etichetta algoritmica, dopo la tabella di Instagram |
| chapter32 | images/oracolo_vs_tutor.png | segnaposto | schema a due colonne oracolo vs tutor |
| chapter33 | images/debriefing_cognitivo_simulatore.png | segnaposto | debriefing cognitivo con linea del tempo e grafico (caso ipotetico) |
| chapter17 | images/apofenia_pareidolia_creativa.png | segnaposto | nuvola/volto, sellino e manubrio -> toro di Picasso, macchia d'inchiostro |

`check_book.py` eseguito.
