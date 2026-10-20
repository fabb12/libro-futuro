# Report gruppo 3 (part2: chapter20, 13, 12, 29, 21, 30)

## Interventi applicati
- #2 (label): `\label{cap:p2c20}`, `cap:p2c13`, `cap:p2c12`, `cap:p2c29`, `cap:p2c21`, `cap:p2c30` dopo ogni \chapter. Label di sezione: `sec:p2c21-fomo` (chapter21, §La FOMO), `sec:p2c29-radici-psicologiche` (chapter29).
- #19 (chapter30, C3): rimandi sostituiti con \ref/\nameref: cap. 9 §Il bias finale (`cap:p2c15`, `sec:p2c15-bias-finale`); cap. 17 §Le radici psicologiche (`cap:p2c29`); cap. 18 §La FOMO (`cap:p2c21`); cap. 4 §Lo specchio opaco (`cap:p1c7`, `sec:p1c7-specchio-opaco`) per punto cieco e Dunning-Kruger; «Capitolo 11» -> `cap:p1c7`. Anche virgole spurie al posto dei trattini (3 punti).
- #30: i rimandi C7 per i miei file non esistono (le voci di «Cap. 12» e «Cap. 20» non hanno corrispondenza nel testo: il Dunning-Kruger non compare in chapter12; «Cap. 20» è part3/chapter11). Nessuna modifica oltre #19.
- #32 (chapter12): ridotto «cemento fresco» da 4 a 2 occorrenze (epigrafe e chiusura, quest'ultima riformulata sulla cera); una sola occorrenza di «cera calda» più il richiamo in chiusura.
- #33 (chapter29): 7 \fbox sostituite da \immagine (vedi sotto); conclusioni ridotte (tolti due paragrafi che ricalcavano «Strategie di Superamento» e «Prospettive Future»); aggiunto in apertura il rimando all'ancora dei prezzi (cap. 8, §Il senno di poi e l'ancora dei prezzi: `cap:p2c14`, `sec:p2c14-ancora-prezzi`); refuso «qualitativemente».
- #42: chapter12 (3) e chapter13 (3) captionof senza immagine: il commento `%\includegraphics` è stato sostituito da `\immagine` (stessi nomi file, file inesistenti -> segnaposto). Virgole spurie in chapter21 (2) e chapter30 (3).

## Saltati
- Tutte le correzioni/tagli di fonti e affermazioni legate a fonti (§6): Twenge (chapter20), Morris & Peng (chapter13), Smith & Johnson (chapter12, #32), Simon/maximizer (chapter21), Ellison/Hopkins/Young (chapter30), Conti/Blum-Ross (chapter29). Passo separato.
- Interventi opus non toccati.

## Label da creare negli altri file (per gli altri agenti)
`cap:p1c7`, `sec:p1c7-specchio-opaco`, `cap:p2c14`, `sec:p2c14-ancora-prezzi` (chapter14, §Il senno di poi e l'ancora dei prezzi), `cap:p2c15`, `sec:p2c15-bias-finale`.

## Immagini
| Capitolo | File | Descrizione | Stato |
|---|---|---|---|
| 14 (chapter20) | images/mosaico_cervello_sovrapposizione.png | Due curve a campana sovrapposte + cervello a mosaico (fig:mosaico_cervello) | segnaposto |
| 18 (chapter21) | images/maximizer_satisficer.png | Due percorsi di scelta, maximizer vs satisficer (fig:maximizer_satisficer) | segnaposto |
| 19 (chapter30) | images/sopravvissuto_aerei_wald.png | Sagoma aereo con fori solo nelle zone non vitali (fig:aerei_wald) | segnaposto |
| 17 (chapter29) | images/cap29_confronto_infanzie.png, cap29_meccanismi_neurali.png, cap29_competenze_digitali.png, cap29_divario_comunicativo.png, cap29_mappa_italia.png, cap29_educazione_bidirezionale.png, cap29_protocollo_assessment.png | Le 7 infografiche, con descrizioni dettagliate nel sorgente | segnaposto |
| 16 (chapter12) | critical_period_brain.jpg, mirror_neurons_child.jpg, bias_asymmetry_graph.jpg | caption originali | segnaposto |
| 15 (chapter13) | cultural_bias_spectrum.jpg, logic_systems_comparison.jpg, global_bias_collision.jpg | caption originali | segnaposto |

Nessuna immagine esistente in images/ era pertinente (neurodiversita.png visionata e scartata).

check_book.py eseguito: nessun errore; segnala «figura senza immagine» solo perché non riconosce \immagine.
