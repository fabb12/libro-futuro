/* =========================================================================
 * Configurazione delle NOTE CONDIVISE
 * -------------------------------------------------------------------------
 * Di default le note che i lettori aggiungono al testo restano salvate SOLO
 * sul loro dispositivo (nel browser). Per renderle CONDIVISE con TUTTI i
 * lettori — chiunque scrive, tutti vedono, anche in forma anonima — basta un
 * progetto gratuito Firebase (Firestore) e incollare qui sotto due valori.
 *
 * Come ottenerli (una sola volta):
 *   1. Vai su https://console.firebase.google.com e crea un progetto.
 *   2. Menu "Build" -> "Firestore Database" -> "Crea database".
 *   3. Nella scheda "Regole" (Rules) consenti lettura/scrittura sulla
 *      raccolta "notes", per esempio:
 *
 *        rules_version = '2';
 *        service cloud.firestore {
 *          match /databases/{database}/documents {
 *            match /notes/{id} {
 *              allow read: if true;
 *              allow create: if request.resource.data.text is string
 *                            && request.resource.data.text.size() < 4000;
 *              allow delete: if true;   // moderazione aperta (vedi note sotto)
 *            }
 *          }
 *        }
 *
 *   4. In "Impostazioni progetto" (l'ingranaggio) -> scheda "Generale":
 *        - "ID progetto"  -> incollalo in projectId
 *        - "Chiave API Web" (Web API Key) -> incollala in apiKey
 *      (La chiave API Web NON e' un segreto: puo' stare qui nel repository.
 *       La sicurezza dipende dalle Regole di Firestore qui sopra.)
 *
 * Lascia i due campi vuoti per tenere le note solo-locali.
 * ========================================================================= */
window.LF_NOTES_CONFIG = {
  firestore: {
    projectId: '',   // es. "libro-futuro-note"
    apiKey: ''        // es. "AIza..."
  }
};
