# Memorie di un futuro anteriore

Libro in LaTeX di Fabio Fargnoli. I capitoli sono in `content/`, le immagini in `images/`, la struttura del libro in `main.tex`.

## 📱 Web app (PWA) per leggere e modificare il libro

Nella cartella [`docs/`](docs/) c'è una web app installabile su cellulare e tablet che permette di:

- **leggere** il libro in formato leggibile (il LaTeX viene convertito in testo scorrevole, con immagini, note a piè di pagina toccabili, citazioni e dialoghi);
- **modificare** il sorgente LaTeX di ogni capitolo direttamente dal browser;
- **salvare** le modifiche nel repository: ogni salvataggio diventa un commit su GitHub;
- **rileggere offline** gli ultimi capitoli aperti (l'app conserva una copia locale).

### Attivazione (una sola volta)

1. Su GitHub vai in **Settings → Pages** e in *Build and deployment* scegli:
   - **Source**: Deploy from a branch
   - **Branch**: `main`, cartella **`/docs`** (funziona anche con la cartella `/ (root)`: c'è un reindirizzamento automatico)
2. Dopo qualche minuto l'app sarà online su `https://fabb12.github.io/libro-futuro/`.

### Primo accesso

1. Apri l'indirizzo qui sopra dal telefono o tablet: **il libro si apre subito**, senza configurare nulla.
2. Il token GitHub serve solo quando **salvi** una modifica: al primo salvataggio l'app te lo chiede, con le istruzioni per crearlo
   (*github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens*, accesso al solo repository `fabb12/libro-futuro`, permesso **Contents: Read and write**). Resta salvato solo sul dispositivo.
3. Per installarla come app: dal browser scegli **"Aggiungi a schermata Home"** (iPhone/iPad) o **"Installa app"** (Android/Chrome).

### Uso quotidiano

- **☰** apre l'indice del libro (parti e capitoli, letti da `main.tex`).
- **✏️** passa alla modifica del sorgente LaTeX del capitolo; **💾** salva sul repository (un commit per ogni salvataggio).
- Toccando i numeri delle **note** si apre il testo della nota; le note complete sono anche in fondo al capitolo.
- La voce *"Struttura del libro (main.tex)"* in fondo all'indice permette di riordinare o attivare/disattivare i capitoli.

## 📄 Generazione del PDF

Il PDF viene compilato **su GitHub Actions** (non serve installare LaTeX in locale): il workflow [`.github/workflows/build-pdf.yml`](.github/workflows/build-pdf.yml) compila `main.tex` con `latexmk` (pdflatex + `texindy` per i due indici analitici) e pubblica il risultato su una **release con link diretto** (oltre che come *artifact* di riserva del run).

### ⬇️ Scaricare il PDF (link diretti, sempre aggiornati)

- **Versione finale**: <https://github.com/fabb12/libro-futuro/releases/download/pdf-finale/libro-finale.pdf>
- **Versione bozza**: <https://github.com/fabb12/libro-futuro/releases/download/pdf-bozza/libro-bozza.pdf>

I link puntano sempre all'**ultima compilazione** di ciascuna versione: un click e il download parte, senza zip e senza cercare il run giusto nel tab Actions. (Funzionano dopo la prima compilazione con il workflow aggiornato.)

Due modi per avviare la compilazione:

- **Da GitHub**: tab **Actions → Genera PDF → Run workflow**, scegliendo *finale* o *bozza*.
- **Dalla web app**: pulsante **📄 Genera PDF finale** nell'indice (☰). Avvia il workflow, segue lo stato e **a fine compilazione il download del PDF parte da solo**; nel riquadro trovi anche i link agli ultimi PDF già generati.

> Il pulsante nell'app funziona solo quando il workflow è presente sul **branch predefinito** del repository, e richiede un token GitHub con permesso **Actions: Read and write** (oltre a *Contents*). Il tab Actions di GitHub funziona sempre.
