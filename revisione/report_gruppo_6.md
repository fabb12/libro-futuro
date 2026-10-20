# Report gruppo 6 (part4: chapter8, 39, 40, 25, 41, 26)

## Interventi applicati
- **#2 (label)**: `\label{cap:p4c8}`, `p4c39`, `p4c40`, `p4c25`, `p4c41`, `p4c26` subito dopo ogni `\chapter`. Nessuna `\label{sec:...}` aggiunta (nessuna sezione dei miei file è citata da altri capitoli nel mio perimetro).
- **#9 (chapter39)**: Kurzgesagt unificato, con nota alla menzione («Kurzgesagt – In a Nutshell (2025), «AI Slop Is Killing Our Channel», YouTube, ottobre 2025», stessa forma del cap. 38). Aggiunto il rimando D6 in §Una questione di fiducia: «la diffidenza generalizzata e il dividendo del bugiardo sono al centro del cap.~\ref{cap:p3c38}».
- **#40 (chapter26)**: «Quattro Sberle» -> titolo di sezione senza numero («Le Sberle all'Antropocentrismo Perduto») e «le quattro sberle» -> «le cinque sberle» a fine capitolo; David dichiarato scenario immaginario (apertura riscritta al presente, «Il caso è immaginario, ma non è fantascienza»); GDPR: «adottato nel 2016 e applicato dal 2018»; Post Scriptum: tolto «come promesso nel prologo»; «[Fine?]» mantenuto.
- **#42** (solo i miei file):
  - chapter39: rimossi 3 blocchi `captionof` senza immagine (fig:ai_content_flood, attention_fragmentation, human_authenticity).
  - chapter26: rimossi 3 blocchi `captionof` senza immagine (quattro_rivoluzioni, specchio_digitale, convergenza_crisi). Nessuna di queste etichette era referenziata altrove.
  - chapter40: eliminato `\textit{}` vuoto dopo `\end{center}`.
  - Virgole spurie al posto del trattino (« ,x » -> « — x ») corrette in chapter39, 25, 41, 26 (0 occorrenze residue). Nel cap. 26 anche il titolo in nota «Selfies ,Living» -> «Selfies—Living» (refuso evidente).

## Saltati
- #5, #8, #21, #22, #39, #43 (opus), come da istruzioni.
- Epigrafe Lanier (ch41, r. 6, «,J. Lanier ... 2027»): lasciata intatta (passo fonti separato / #39).
- Note bibliografiche: non toccate (salvo il refuso Selfies). Rimandi C7 del cap. 35 (dopamina -> cap. 2) non nel mio perimetro.
- Per le caption tolte nei cap. 26 e 39 ho scelto la rimozione, non il segnaposto (la tabella §5 ammette entrambe).

## Immagini
- chapter40: `images/musica_apollineo_dionisiaco.jpg` e `images/musica_langer_simbolo.jpg` ora avvolte in `\immagine{...}{descrizione}` (segnaposto, file inesistenti), nome file e caption invariati.
- chapter25: **esistente**, `images/kruger.png` (curva Dunning-Kruger, inutilizzata altrove), nella §L'Effetto Dunning-Kruger del Dunning-Kruger, label `fig:kruger`.
- chapter8: **segnaposto** `images/tempesta_cognitiva.png`: diagramma circolare con al centro una convinzione e quattro bias (conferma, gregge, perdite, punto cieco) che si rinforzano a vicenda. Posto dopo il primo elenco delle «tempeste cognitive perfette», label `fig:tempesta_cognitiva`.
- chapter41: **segnaposto** `images/tre_fragilita.png`: tre colonne (ignoranza, distrazione, pigrizia) che reggono il «consumo digitale inconsapevole», con l'etichetta «Generato con IA» ignorata. Posto all'inizio di §Le Tre Fragilità Fondamentali, label `fig:tre_fragilita`.
- Valutate e scartate: rivoluzioni.png (sono le rivoluzioni cognitiva/agricola/scientifica/AI, non quelle di Floridi usate nel cap. 26), hacking_cognitivo.png (già in content/old), attenzione.png (non pertinente ai capitoli senza figure).

## Verifica
`python3 -I tools/check_book.py .`: nessun problema segnalato nei miei file (figure senza immagine residue solo in part1/chapter22 e part2/chapter20, non miei).
