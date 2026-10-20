# Report gruppo 1

## Interventi applicati
- **#1** main.tex: nuovo ordine Parte IV (10, 31, 32, 33, 34, 17, 39, 40, 41, 8, 25, 26). `git mv` di part2/chapter19.tex e part4/chapter42.tex in content/old/ (le righe `\input` già commentate ora puntano a content/old/).
- **#2** label: `\label{cap:p1cN}` dopo `\chapter` in part1/chapter1, 2, 6, 7, 22, 9. Label di sezione aggiunte per le sezioni citate dal piano:
  - sec:p1c1-origini, sec:p1c1-carro-alato (chapter1)
  - sec:p1c2-eredita-terrore, sec:p1c2-due-piloti (chapter2)
  - sec:p1c7-specchio-opaco, sec:p1c7-mala-fede (chapter7)
  - sec:p1c22-armadio (chapter22)
  - sec:p1c9-topo-filosofo, sec:p1c9-stupidita-massa (chapter9)
- **#25** frontmatter/preface.tex: R3 ridotto (via il Pleistocene/«savane»; l'IA resta come solo «specchio alieno», senza la spiegazione dell'antropologo); eliminato il residuo `%, ,`; virgole spurie al posto dei trattini sostituite con «—».
- **#27** part1/chapter9.tex: R5 inserito «Il principio del rilevatore di fumo (cap.~\ref{cap:p1c2})»; ponte finale riallineato (il prossimo capitolo è quello sull'algoritmo, cap:p2c11; il kit di sopravvivenza rimandato a cap:p4c10); label figura `fig:archivista_cervello` -> `fig:tre_regole`.
- **#41** appendix/dialogue.tex: «Capitolo 8» -> `Capitolo~\ref{cap:p1c9}` (stampa 6).
- **#42** (miei file): part1/chapter22 fig:fumatore con `\immagine` al posto mancante; refusi evidenti `perchè`/`nè` -> `perché`/`né` in chapter1, chapter6 e negli altri file miei; virgole spurie in preface. Controllati: nessun `\begin{center}` senza chiusura, nessuna caption vuota o «Descrizione» nei miei file.

## Saltato
- **#26** (chapter1 r. 29, nota Morris & Caron): è una fonte.
- **#27**, eliminazione della nota Haselton & Nettle duplicata in chapter9: è una nota bibliografica. Il rimando al cap. 2 è nel testo, la nota è rimasta.
- **#27**, rinomina del file «L_Espansione_del_Cerchio_Morale (1).png»: il file immagine non è tra i miei file. Va rinominato aggiornando anche l'`\includegraphics` in chapter9 r. ~80.
- Blocchi `\begin{comment}` in chapter1 (r. 77-92) e chapter6 (r. 104-126): il piano chiede di decidere se eliminarli o spostarli in old, e non rientrano in #42. Lasciati intatti.
- Interventi opus (#23, #24): non eseguiti.

## Immagini segnaposto create
- `images/fumatore_conflitto.png` (part1/chapter22, fig:fumatore): testa del fumatore come campo di battaglia, con due schieramenti di pensieri contrapposti («So che il fumo uccide» con pacchetto e avvertenze, «Continuo a fumare» con le giustificazioni) e frecce a mostrare la tensione.

## Note
- `check_book.py`: restano ref senza label solo verso file di altri gruppi: cap:p2c11, cap:p4c10 (da chapter9 mia) e cap:p3c37, cap:p3c23 (da file altrui).
- Il checker segnala ancora «figura senza immagine» in chapter22, perché non riconosce `\immagine`.
