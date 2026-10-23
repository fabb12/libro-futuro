# Prompt per generare le immagini mancanti

## Stile comune (da incollare all'inizio di ogni prompt)

> Flat editorial infographic illustration for a popular-science book about cognitive biases. Warm cream / parchment background (#FBF1DE), dark navy outlines (#1F2A44), limited palette: burnt orange (#D9622B), warm yellow (#F4B942), slate blue (#4F7CAC), muted teal (#6BA292), with soft off-white and light-grey accents. Simple friendly human characters with round heads and minimal faces, clean vector shapes, uniform line weight, subtle paper grain, very light shadows, generous white space, balanced composition, no photorealism, no 3D, no gradients mesh. Bold clean sans-serif lettering for titles and labels, **all text in Italian**, spelled exactly as given, few and short labels, large enough to be readable when the image is printed 12 cm wide. No logos, no watermarks, no real people's faces, no brand names.

**Formato:** orizzontale 3:2 (1536×1024 px) salvo indicazione diversa; PNG, sfondo pieno (non trasparente), margine di sicurezza del 5% su ogni lato.

**Consigli pratici**
- I generatori sbagliano spesso l'italiano nelle scritte: controlla ogni etichetta lettera per lettera. Se ci sono errori, rigenera senza testo («no text») e aggiungi le etichette con un editor (Canva, Figma, Photoshop).
- Per mantenere coerenza tra le immagini usa sempre lo stesso blocco di stile e, se lo strumento lo permette, allega come riferimento di stile 2–3 immagini già nel libro: `images/due_piloti_mente.png`, `images/neurodiversita.png`, `images/piramide_wallace.png`.
- Salva ogni file con il nome indicato in `images/`: appare da solo nel libro al posto del segnaposto.
- Le immagini 'verticali lunghe' del libro (`disso.png`, `tre_mappe_anima.png`, `infografica_cap3_*.png`) hanno un taglio da poster in stile più illustrato; qui il prompt usa lo stile piatto più semplice, ideale per figure singole.


## Prompt per immagine

Per ogni immagine: incolla prima il **blocco di stile**, poi la riga «Soggetto».

### fumatore_conflitto.png  (cap. 5)

- **File da salvare:** `images/fumatore_conflitto.png`  · **Capitolo:** `content/part1/chapter22.tex`
- **Didascalia nel libro:** La mente del fumatore è un campo di battaglia dove cognizioni incompatibili cercano disperatamente un equilibrio impossibile.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione della mente del fumatore come campo di battaglia: una testa in sezione con una sigaretta accesa, dentro la quale due schieramenti di pensieri si fronteggiano, da una parte «So che il fumo uccide» (con il pacchetto e le sue immagini di avvertenza) e dall'altra «Continuo a fumare» (con le giustificazioni: «mi rilassa», «mio nonno fumava»), con frecce e scintille a rendere la tensione tra le due cognizioni
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### disney_mondo_manicheo.png  (cap. 13)

- **File da salvare:** `images/disney_mondo_manicheo.png`  · **Capitolo:** `content/part2/chapter24.tex`
- **Didascalia nel libro:** Il bias manicheo: il mondo come lo racconta Disney, diviso in buoni e cattivi assoluti, e il mondo reale, fatto di sfumature.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione divisa in due metà affiancate. A sinistra, il mondo secondo Disney: un castello da fiaba con due schiere nettamente separate, da una parte personaggi luminosi e sorridenti (la principessa buona, l'eroe coraggioso), dall'altra figure scure e minacciose (la matrigna, il cattivo), con una linea netta al centro e l'etichetta buoni contro cattivi. A destra, il mondo reale: la stessa scena ma con una folla di persone in tutte le sfumature di grigio, volti ambigui e motivazioni diverse, nessun confine netto, con l'etichetta sfumature. Stile pulito da infografica, palette calda per la parte Disney e palette neutra per quella reale.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### mosaico_cervello_sovrapposizione.png  (cap. 14)

- **File da salvare:** `images/mosaico_cervello_sovrapposizione.png`  · **Capitolo:** `content/part2/chapter20.tex`
- **Didascalia nel libro:** Le differenze medie tra i sessi sono piccole e le distribuzioni si sovrappongono: ogni cervello è un mosaico di tratti, non un blocco «maschile» o «femminile».
- **Soggetto (da incollare dopo il blocco di stile):** Due curve a campana quasi sovrapposte (una per i cervelli maschili, una per i femminili) su un asse che rappresenta, ad esempio, il volume di una struttura cerebrale: le medie sono leggermente spostate ma la zona di sovrapposizione è enorme. Sotto, un cervello stilizzato a mosaico, con tessere in due colori mescolate in modo diverso in ogni individuo.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cultural_bias_spectrum.jpg  (cap. 15)

- **File da salvare:** `images/cultural_bias_spectrum.jpg`  · **Capitolo:** `content/part2/chapter13.tex`
- **Didascalia nel libro:** Lo spettro dei bias culturali: le culture individualiste e collettiviste mostrano pattern opposti di distorsione cognitiva nell'attribuzione causale, con conseguenze misurabili su comportamenti economici e sociali.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. Lo spettro dei bias culturali: le culture individualiste e collettiviste mostrano pattern opposti di distorsione cognitiva nell'attribuzione causale, con conseguenze misurabili su comportamenti economici e sociali.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### logic_systems_comparison.jpg  (cap. 15)

- **File da salvare:** `images/logic_systems_comparison.jpg`  · **Capitolo:** `content/part2/chapter13.tex`
- **Didascalia nel libro:** Rappresentazione schematica dei diversi sistemi logici culturali: la logica lineare occidentale (sequenziale e categorica) contrapposta alla logica circolare orientale (paradossale e contestuale), entrambe valide strumenti cognitivi per problemi diversi.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. Rappresentazione schematica dei diversi sistemi logici culturali: la logica lineare occidentale (sequenziale e categorica) contrapposta alla logica circolare orientale (paradossale e contestuale), entrambe valide strumenti cognitivi per problemi diversi.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### global_bias_collision.jpg  (cap. 15)

- **File da salvare:** `images/global_bias_collision.jpg`  · **Capitolo:** `content/part2/chapter13.tex`
- **Didascalia nel libro:** La collisione dei bias culturali nell'era digitale: flussi di informazione, fraintendimenti comunicativi e zone di incomprensione reciproca in una mappa della connettività globale che mostra come i bias si propaghino e si trasformino attraverso i confini.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. La collisione dei bias culturali nell'era digitale: flussi di informazione, fraintendimenti comunicativi e zone di incomprensione reciproca in una mappa della connettività globale che mostra come i bias si propaghino e si trasformino attraverso i confini.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### critical_period_brain.jpg  (cap. 16)

- **File da salvare:** `images/critical_period_brain.jpg`  · **Capitolo:** `content/part2/chapter12.tex`
- **Didascalia nel libro:** La finestra critica dello sviluppo cerebrale infantile mostra picchi di plasticità sinaptica tra i 3 e i 7 anni, periodo in cui si consolidano le strutture cognitive fondamentali, inclusi i bias sociali.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. La finestra critica dello sviluppo cerebrale infantile mostra picchi di plasticità sinaptica tra i 3 e i 7 anni, periodo in cui si consolidano le strutture cognitive fondamentali, inclusi i bias sociali.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### mirror_neurons_child.jpg  (cap. 16)

- **File da salvare:** `images/mirror_neurons_child.jpg`  · **Capitolo:** `content/part2/chapter12.tex`
- **Didascalia nel libro:** I neuroni specchio nel cervello infantile si attivano non solo durante l'esecuzione di azioni, ma anche durante l'osservazione di espressioni emotive degli adulti, trasmettendo bias senza necessità di istruzione esplicita.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. I neuroni specchio nel cervello infantile si attivano non solo durante l'esecuzione di azioni, ma anche durante l'osservazione di espressioni emotive degli adulti, trasmettendo bias senza necessità di istruzione esplicita.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### bias_asymmetry_graph.jpg  (cap. 16)

- **File da salvare:** `images/bias_asymmetry_graph.jpg`  · **Capitolo:** `content/part2/chapter12.tex`
- **Didascalia nel libro:** L'asimmetria della plasticità cerebrale: il cervello infantile acquisisce bias con velocità esponenziale nei primi anni di vita, mentre la capacità di eliminarli diminuisce progressivamente, creando una forbice sempre più ampia tra apprendimento e disapprendimento.
- **Soggetto (da incollare dopo il blocco di stile):** Illustrazione schematica. L'asimmetria della plasticità cerebrale: il cervello infantile acquisisce bias con velocità esponenziale nei primi anni di vita, mentre la capacità di eliminarli diminuisce progressivamente, creando una forbice sempre più ampia tra apprendimento e disapprendimento.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_confronto_infanzie.png  (cap. 17)

- **File da salvare:** `images/cap29_confronto_infanzie.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Il divario percettivo tra infanzia analogica e digitale: elementi di confronto generazionale
- **Soggetto (da incollare dopo il blocco di stile):** Due metà affiancate. A sinistra l'infanzia analogica degli anni '80-'90: bambini che giocano in cortile, bicicletta, figurine, telefono fisso, televisore con pochi canali, cassette. A destra l'infanzia digitale del 2020-2025: tablet, videogiochi online, videochiamate con i nonni, smartphone, piattaforme di streaming. Al centro un genitore che guarda le due scene con un'ancora disegnata accanto alla metà analogica.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_meccanismi_neurali.png  (cap. 17)

- **File da salvare:** `images/cap29_meccanismi_neurali.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Reti neurali coinvolte nel bias di ancoraggio nostalgico: dalla memoria autobiografica alle decisioni genitoriali
- **Soggetto (da incollare dopo il blocco di stile):** Schema semplificato del cervello in sezione con le reti attivate dalla nostalgia: memoria autobiografica (ippocampo), autoriflessione (corteccia prefrontale mediale), regolazione emotiva e ricompensa (amigdala e striato). Frecce da queste aree verso un riquadro finale «decisioni genitoriali».
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_competenze_digitali.png  (cap. 17)

- **File da salvare:** `images/cap29_competenze_digitali.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Evoluzione delle competenze digitali nell'infanzia: un processo di sviluppo complesso che richiede mediazione educativa
- **Soggetto (da incollare dopo il blocco di stile):** Mappa a scala crescente delle competenze digitali infantili: alla base le abilità di base (usare un dispositivo, navigare tra le app), poi comunicare e collaborare online, creare contenuti, infine valutare criticamente le informazioni. Una freccia laterale indica la mediazione educativa degli adulti che accompagna ogni livello.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_divario_comunicativo.png  (cap. 17)

- **File da salvare:** `images/cap29_divario_comunicativo.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Il divario comunicativo intergenerazionale: dalla comunicazione lineare alla multimedialità
- **Soggetto (da incollare dopo il blocco di stile):** Confronto a due colonne tra comunicazione analogica (telefonata, lettera, conversazione faccia a faccia: lineare, un messaggio alla volta) e digitale (chat, emoji, vocali, meme, videochiamate: multimediale e simultanea). Al centro un genitore e un figlio con fumetti che non si incontrano, a indicare il divario di codici.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_mappa_italia.png  (cap. 17)

- **File da salvare:** `images/cap29_mappa_italia.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Distribuzione geografica degli atteggiamenti genitoriali verso l'infanzia digitale in Italia
- **Soggetto (da incollare dopo il blocco di stile):** Mappa dell'Italia divisa in Nord, Centro, Sud e Isole, con le regioni colorate in una scala di intensità secondo la percentuale di utilizzo delle tecnologie digitali nell'infanzia e gli atteggiamenti dei genitori; legenda con le fasce percentuali. Dati indicativi, da allineare a quelli citati nel testo.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_educazione_bidirezionale.png  (cap. 17)

- **File da salvare:** `images/cap29_educazione_bidirezionale.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Strategie di apprendimento collaborativo intergenerazionale per superare il bias di ancoraggio
- **Soggetto (da incollare dopo il blocco di stile):** Schema circolare con genitori e figli ai due lati e frecce in entrambe le direzioni: i genitori portano saggezza relazionale e valutazione delle conseguenze a lungo termine, i figli competenze tecniche e linguaggi digitali. Al centro attività condivise di apprendimento collaborativo (alfabetizzazione digitale familiare).
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### cap29_protocollo_assessment.png  (cap. 17)

- **File da salvare:** `images/cap29_protocollo_assessment.png`  · **Capitolo:** `content/part2/chapter29.tex`
- **Didascalia nel libro:** Protocollo di assessment per professionisti: identificazione e valutazione del bias di ancoraggio nelle dinamiche familiari
- **Soggetto (da incollare dopo il blocco di stile):** Diagramma di flusso per professionisti: dall'osservazione della famiglia alla domanda «il bias di ancoraggio genitoriale è presente?», con passaggi di raccolta della storia digitale dei genitori, confronto con le esperienze dei figli, valutazione dell'impatto sulla relazione e scelta dell'intervento (psicoeducazione, mediazione attiva, invio).
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### maximizer_satisficer.png  (cap. 18)

- **File da salvare:** `images/maximizer_satisficer.png`  · **Capitolo:** `content/part2/chapter21.tex`
- **Didascalia nel libro:** Due strategie di scelta: il maximizer esplora tutto e dubita, il satisficer si ferma al «buono abbastanza».
- **Soggetto (da incollare dopo il blocco di stile):** Schema a due percorsi davanti a uno scaffale con molti prodotti. A sinistra il maximizer: una lunga freccia tortuosa che confronta ogni prodotto, termina in un acquisto con un'icona di dubbio e rimpianto. A destra il satisficer: una freccia breve che si ferma al primo prodotto che supera una soglia «abbastanza buono», termina con un'icona di soddisfazione.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### sopravvissuto_aerei_wald.png  (cap. 19)

- **File da salvare:** `images/sopravvissuto_aerei_wald.png`  · **Capitolo:** `content/part2/chapter30.tex`
- **Didascalia nel libro:** Il ragionamento di Abraham Wald: i fori sugli aerei rientrati mostrano dove si può essere colpiti e sopravvivere, non dove si deve rinforzare.
- **Soggetto (da incollare dopo il blocco di stile):** La sagoma di un bombardiere della Seconda guerra mondiale vista dall'alto, con puntini rossi che segnano i fori di proiettile sugli aerei rientrati: fitti su ali e fusoliera, quasi assenti su motori e cabina di pilotaggio. Accanto, la stessa sagoma con le zone vuote evidenziate in un cerchio e la didascalia «dove gli aerei colpiti non sono tornati».
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### bias_llm_specchio_deformante.png  (cap. 20)

- **File da salvare:** `images/bias_llm_specchio_deformante.png`  · **Capitolo:** `content/part3/chapter11.tex`
- **Didascalia nel libro:** Lo specchio deformante dei dati: gli LLM non si limitano a riflettere i nostri pregiudizi, li ingrandiscono.
- **Soggetto (da incollare dopo il blocco di stile):** Uno specchio deformante a parete: davanti, la sagoma di un banale stereotipo (un'infermiera con camice, un ingegnere con casco) riflessa in una versione ingrandita e distorta; sullo sfondo, una biblioteca infinita di libri e commenti social che alimenta lo specchio. Mostra come l'LLM non riflette ma amplifica i pregiudizi presenti nei dati.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### convergenza_divergenza.png  (cap. 22)

- **File da salvare:** `images/convergenza_divergenza.png`  · **Capitolo:** `content/part3/chapter37.tex`
- **Didascalia nel libro:** Convergenza e divergenza: il dialogo con la macchina conferma, la relazione umana sorprende e ci mette alla prova.
- **Soggetto (da incollare dopo il blocco di stile):** Schema a due colonne. A sinistra, una persona davanti a un chatbot: i fumetti dei due sono identici e speculari, le frecce tornano su sé stesse (convergenza, comfort). A destra, due persone che conversano: fumetti diversi, frecce che si incrociano e si urtano (divergenza, attrito, sorpresa)
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### giungla_deserto.png  (cap. 23)

- **File da salvare:** `images/giungla_deserto.png`  · **Capitolo:** `content/part3/chapter24.tex`
- **Didascalia nel libro:** La metafora di Lewis: il pericolo non è la giungla emotiva in sé, ma il deserto che lasciamo quando la tagliamo senza educarla. Due paesaggi interni che l'educazione può abitare o creare.
- **Soggetto (da incollare dopo il blocco di stile):** La metafora di Lewis: il pericolo non è la giungla emotiva in sé, ma il deserto che lasciamo quando la tagliamo senza educarla. Due paesaggi interni che l'educazione può abitare o creare.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### uomo_senza_petto.png  (cap. 23)

- **File da salvare:** `images/uomo_senza_petto.png`  · **Capitolo:** `content/part3/chapter24.tex`
- **Didascalia nel libro:** L'«uomo senza petto» di Lewis: una figura che possiede intelletto e istinti, ma ha perduto il centro emotivo che le tiene insieme. Una metafora per la crisi del carattere nell'era digitale.
- **Soggetto (da incollare dopo il blocco di stile):** L'«uomo senza petto» di Lewis: una figura che possiede intelletto e istinti, ma ha perduto il centro emotivo che le tiene insieme. Una metafora per la crisi del carattere nell'era digitale.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### ordo_amoris_algoritmo.png  (cap. 23)

- **File da salvare:** `images/ordo_amoris_algoritmo.png`  · **Capitolo:** `content/part3/chapter24.tex`
- **Didascalia nel libro:** L'algoritmo di raccomandazione come distorsore dell'ordo amoris: progettato per amplificare istinti primari, bypassa il petto e indebolisce la capacità di percepire valori autentici.
- **Soggetto (da incollare dopo il blocco di stile):** L'algoritmo di raccomandazione come distorsore dell'ordo amoris: progettato per amplificare istinti primari, bypassa il petto e indebolisce la capacità di percepire valori autentici.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### tolkien_mordor.png  (cap. 23)

- **File da salvare:** `images/tolkien_mordor.png`  · **Capitolo:** `content/part3/chapter24.tex`
- **Didascalia nel libro:** Il fango di Mordor come metafora pedagogica: la bellezza conquistata con fatica, l'amicizia come sacrificio, l'eroismo fragile. Il contrario esatto della gratificazione istantanea digitale.
- **Soggetto (da incollare dopo il blocco di stile):** Il fango di Mordor come metafora pedagogica: la bellezza conquistata con fatica, l'amicizia come sacrificio, l'eroismo fragile. Il contrario esatto della gratificazione istantanea digitale.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### danza_coevoluzione.png  (cap. 25)

- **File da salvare:** `images/danza_coevoluzione.png`  · **Capitolo:** `content/part3/chapter27.tex`
- **Didascalia nel libro:** Il feedback loop quotidiano: il cervello impara dall'AI che impara dal cervello.
- **Soggetto (da incollare dopo il blocco di stile):** Un anello di quattro passaggi con due figure che ballano al centro: un cervello umano stilizzato e un nodo di rete neurale artificiale. Frecce: l'utente clicca, l'algoritmo impara e propone contenuti simili, il bias di conferma si rafforza, l'utente clicca di nuovo. Mostra il feedback loop che si autoalimenta
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### deepfake_prova_percettiva.png  (cap. 26)

- **File da salvare:** `images/deepfake_prova_percettiva.png`  · **Capitolo:** `content/part3/chapter38.tex`
- **Didascalia nel libro:** Quando volto e voce possono essere fabbricati, la prova percettiva smette di essere una prova.
- **Soggetto (da incollare dopo il blocco di stile):** Un fotogramma video che si «sfalda» a metà: a sinistra un volto realistico in un telegiornale, a destra lo stesso volto come mappa di punti, maschera e forme d'onda della voce clonata, per mostrare come volto e voce siano costruiti artificialmente
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### etichette_algoritmiche_confronto.png  (cap. 28)

- **File da salvare:** `images/etichette_algoritmiche_confronto.png`  · **Capitolo:** `content/part4/chapter31.tex`
- **Didascalia nel libro:** L'etichetta nutrizionale degli alimenti e la sua controparte algoritmica: stesso formato, ingredienti diversi.
- **Soggetto (da incollare dopo il blocco di stile):** Confronto affiancato tra due etichette: a sinistra una classica etichetta nutrizionale alimentare (calorie, grassi, zuccheri), a destra una «etichetta algoritmica» dello stesso formato con gli ingredienti psicologici di un feed (bias di negatività, rinforzo intermittente, confronto sociale, conferma, estrazione dati), ciascuno con un indicatore da basso ad alto. Stile pulito da infografica, palette coerente con le altre figure del libro.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### oracolo_vs_tutor.png  (cap. 29)

- **File da salvare:** `images/oracolo_vs_tutor.png`  · **Capitolo:** `content/part4/chapter32.tex`
- **Didascalia nel libro:** Due modi di usare l'IA: l'oracolo che risponde al posto nostro e il tutor che ci aiuta a salire.
- **Soggetto (da incollare dopo il blocco di stile):** Schema a due colonne che confronta due modi di usare l'IA. Colonna «Oracolo»: una persona passiva riceve una risposta completa da una lavagna luminosa, freccia a senso unico, cervello «spento». Colonna «Tutor»: una persona e l'IA si scambiano domande e indizi con frecce a doppio senso, il cervello è attivo e una scala (impalcatura) sale accanto a un edificio in costruzione. Titoli, due esempi di prompt per colonna.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### debriefing_cognitivo_simulatore.png  (cap. 30)

- **File da salvare:** `images/debriefing_cognitivo_simulatore.png`  · **Capitolo:** `content/part4/chapter33.tex`
- **Didascalia nel libro:** Il debriefing cognitivo di un simulatore di bias (esempio ipotetico): il percorso decisionale ricostruito momento per momento.
- **Soggetto (da incollare dopo il blocco di stile):** Schermata esemplificativa del «debriefing cognitivo» di un simulatore di bias: a sinistra una linea del tempo della simulazione con i momenti chiave (menzione del sushi, domande poste, esami saltati) segnati da marcatori; a destra un grafico a barre con la quota di domande orientate a confermare l'ipotesi iniziale (87%) contro quelle esplorative, e un riquadro «bias rilevati: ancoraggio, conferma». Il caso è ipotetico e va indicato come tale nella figura.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### apofenia_pareidolia_creativa.png  (cap. 32)

- **File da salvare:** `images/apofenia_pareidolia_creativa.png`  · **Capitolo:** `content/part4/chapter17.tex`
- **Didascalia nel libro:** Dove la mente vede pattern che non ci sono può nascere un'idea: l'apofenia al servizio della creatività.
- **Soggetto (da incollare dopo il blocco di stile):** Composizione illustrata sull'apofenia produttiva: al centro una nuvola in cui si riconosce un profilo di volto; ai lati, in sequenza, il sellino e il manubrio di bicicletta che diventano la testa di toro di Picasso, e una macchia d'inchiostro che prende la forma di una figura. Frecce dalle forme «casuali» alle interpretazioni creative, didascalie brevi per ciascun passaggio.
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### tre_fragilita.png  (cap. 35)

- **File da salvare:** `images/tre_fragilita.png`  · **Capitolo:** `content/part4/chapter41.tex`
- **Didascalia nel libro:** Le tre fragilità su cui si regge il consumo digitale inconsapevole: ignoranza, distrazione e pigrizia.
- **Soggetto (da incollare dopo il blocco di stile):** Tre colonne affiancate, etichettate «Ignoranza come scelta», «Distrazione come sistema» e «Pigrizia come rinuncia», che reggono insieme un'unica trave con la scritta «consumo digitale inconsapevole»; sopra la trave, in piccolo, l'etichetta «Generato con IA» ignorata da una figura di spalle
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.

### tempesta_cognitiva.png  (cap. 36)

- **File da salvare:** `images/tempesta_cognitiva.png`  · **Capitolo:** `content/part4/chapter25.tex`
- **Didascalia nel libro:** La «tempesta cognitiva perfetta»: quattro bias che si alimentano a vicenda e proteggono la convinzione dalla realtà.
- **Soggetto (da incollare dopo il blocco di stile):** Diagramma circolare: al centro una convinzione da difendere; intorno a essa quattro frecce ad anello che collegano bias di conferma, effetto gregge, avversione alle perdite e punto cieco, ciascuno con una breve didascalia (cerco solo conferme, seguo chi la pensa come me, non abbandono ciò che ho già investito, io sono razionale), così da mostrare come si rinforzano a vicenda
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…»; se non ce ne sono, al massimo un titolo di 3-6 parole che riassuma la scena.


### inondazione_slop.png  (cap. 31)

- **File da salvare:** `images/inondazione_slop.png`  · **Capitolo:** `content/part4/chapter39.tex`
- **Didascalia nel libro:** L'inondazione dell'AI slop: contenuti plausibili, abbondanti e a costo quasi nullo sommergono il poco che è curato.
- **Soggetto (da incollare dopo il blocco di stile):** Una biblioteca invasa da una marea di fogli quasi identici che sale dagli scaffali; in primo piano un lettore cerca un libro autentico tra pile di copie plausibili. Etichette: «Quasi corretto», «Cento video mediocri», «Uno eccellente».
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…».

### archivio_distribuito.png  (cap. 34)

- **File da salvare:** `images/archivio_distribuito.png`  · **Capitolo:** `content/part4/chapter26.tex`
- **Didascalia nel libro:** L'archivio distribuito: l'identità è custodita negli altri, non nei profili digitali.
- **Soggetto (da incollare dopo il blocco di stile):** Una persona al centro collegata da fili sottili a molti volti e mani, ciascuno con un frammento luminoso del suo ricordo; a lato un server grigio e freddo con la scritta «Copia digitale». Etichette: «Archivio distribuito», «Copia digitale».
- **Testi in italiano da inserire:** solo le etichette citate nel soggetto tra «…».
