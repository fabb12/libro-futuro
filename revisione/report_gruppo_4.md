# Report gruppo 4 (part3: chapter11, 35, 37, 24, 23, 27, 38)

## Interventi applicati (9 + #2)
- **#2 label**: `cap:p3c11`, `p3c35` (accanto a `chap:ai-antropomorfo`), `p3c37`, `p3c24`, `p3c23`, `p3c27`, `p3c38` dopo ogni `\chapter`. Rimandi con `\ref` verso `cap:p1c1`, `p1c2`, `p1c6`, `p1c7`, `p1c9`, `p2c11`, `p2c13`, `p3c11`, `p3c35`, `p3c37`, `p4c17`. Nessuna label di sezione creata (le sezioni citate sono nei file altrui; scritte come testo, es. «§Lo spacciatore di dopamina»).
- **#4** (chapter38): tagliata la §Spotify/Yande, con transizione in §Soluzioni («Lo slop … lo affronteremo a parte. Qui il nemico è l'inganno»). Yande non toccato altrove.
- **#6** (chapter38): ¶2 delle Conseguenze ridotto a «come visto nel cap. 22, l'IA tende alla convergenza», eliminata «schiavitù volontaria».
- **#12** (chapter37, La Tesi Centrale): echo chamber ridotta, rimando alla sycophancy del cap. 21; aggiunta frase che distingue meccanismo (cap. 21) ed esito esistenziale (cap. 22). Note non toccate.
- **#13** (chapter27): «capitolo finale» riscritto (anche r.10); rimandi C2 convertiti in `\ref` (cap. 20, 2, 1, 3, 32, 7, 4, 15, dopamina cap. 7); Dottor Rossi presentato come nuovo «personaggio composito»; virgole spurie sostituite con trattini.
- **#15** (chapter23): «fast food cognitivo» sostituito con l'immagine del mangiare in piedi davanti al frigorifero («mentally» corretto in «mentalmente»); GPS tagliato; «Thinking Partnership» tradotto in «Partnership di Pensiero» nel titolo di sottosezione; trattini.
- **#16** (chapter35): caption «Illusione vs realtà»; «Nell'agosto»; virgole spurie in trattini. Brown/Weidinger/Kidd NON toccati (fonti, passo separato).
- **#17** (chapter11): epigrafe attribuita («— L'autore», con `\epigraph`); rimandi C7 (cap. 6, cap. 1 §Il carro alato e il condominio, cap. 4); ponte verso il cap. 21 in chiusura; refuso «Il Specchio»; " - " in trattini lunghi.
- **#18** (chapter24): rimando al carro alato del cap. 1 nella §geografia dell'anima (R8). Citazioni (b) non toccate.
- **#42**: oltre ai refusi sopra, in chapter38 «massicca» -> «massiccia» e virgole spurie; in chapter24 le 4 `captionof` senza immagine sono diventate figure `\immagine` con segnaposto (`giungla_deserto.png`, `uomo_senza_petto.png`, `ordo_amoris_algoritmo.png`, `tolkien_mordor.png`; descrizione = caption, da specificare meglio a chi le creerà).

## Saltati
- #3, #7, #10, #11, #14 (opus). Non fatti anche R21 (titolo §1 cap. 25 «Il Cerchio si Chiude»), R6, R7, R19, R20 per cap. 25 e ponti C6 (non nei miei numeri).
- Cap. 21, defunti (R23): il cap. 38 riscritto non contiene più la §3 con Bassett, quindi nessun rimando; nel chapter35 resta solo la menzione di una riga («simulazioni di persone decedute»), già ridotta.
- Rimando «Kurzgesagt/slop → cap. 34» in chapter38 non aggiunto (D1, opus).

## Immagini aggiunte (tutte segnaposto, nessuna esistente adatta)
| Capitolo | File | Segnaposto | Descrizione |
|---|---|---|---|
| 20 (chapter11) | images/bias_llm_specchio_deformante.png | sì | Specchio deformante che ingrandisce stereotipi (infermiera/ingegnere), biblioteca/social sullo sfondo |
| 22 (chapter37) | images/convergenza_divergenza.png | sì | Due colonne: persona-chatbot con fumetti speculari vs due persone con fumetti diversi |
| 25 (chapter27) | images/danza_coevoluzione.png | sì | Anello del feedback loop utente-algoritmo-bias con cervello e nodo di rete al centro |
| 26 (chapter38) | images/deepfake_prova_percettiva.png | sì | Fotogramma video che si sfalda: volto reale a sinistra, maschera/punti/forme d'onda a destra |
| 23 (chapter24) | 4 immagini .png (vedi #42) | sì | figure già previste dal testo |

`python3 -I tools/check_book.py .` eseguito: nessun errore.
