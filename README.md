# Σημειώσεις μαθημάτων — Χ. Λαμπρόπουλος

Στατικό site για GitHub Pages με τις σημειώσεις των τμημάτων ΣΑΕΚ Μαρκοπούλου και ΣΑΕΚ Γλυφάδας, και με προβολή της εφαρμογής «Πληροφορική Γ' Λυκείου».

## Ανέβασμα στο GitHub Pages (δωρεάν)

1. Στο github.com: **New repository**, π.χ. `simeioseis`, **Public**.
2. **Add file → Upload files**: σύρε ΟΛΑ τα περιεχόμενα αυτού του φακέλου (index.html, notes.js, .nojekyll, assets/, files/, tools/). Πάτα **Commit changes**.
3. **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, φάκελος `/ (root)`, **Save**.
4. Σε 1–2 λεπτά το site είναι στο `https://<username>.github.io/simeioseis/`.

Ξεχωριστό link για κάθε τμήμα:
- Μαρκόπουλο: `https://<username>.github.io/simeioseis/#markopoulo`
- Γλυφάδα: `https://<username>.github.io/simeioseis/#glyfada`

## Νέο μάθημα

1. Πρόσθεσε μια γραμμή στο `tools/convert.ps1` και τρέξε:
   `powershell -ExecutionPolicy Bypass -File tools\convert.ps1`
   (φτιάχνει PDF + αντίγραφο .pptx μέσα στο `files/`, χρειάζεται PowerPoint).
2. Πρόσθεσε μια εγγραφή στο `notes.js` (υπάρχουν οδηγίες στην αρχή του αρχείου).
3. Ανέβασε στο GitHub τα αλλαγμένα/νέα αρχεία (Upload files → Commit).

`visible: false` κρύβει ένα μάθημα από τη λίστα. Το αρχείο όμως παραμένει προσβάσιμο αν κάποιος ξέρει τη διεύθυνσή του, οπότε ό,τι δεν θέλεις να το δουν ακόμη, μην το ανεβάσεις.
