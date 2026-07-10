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
