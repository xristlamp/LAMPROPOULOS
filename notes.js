/*
  ΣΗΜΕΙΩΣΕΙΣ ΜΑΘΗΜΑΤΩΝ
  ---------------------
  Για να προσθέσεις νέο μάθημα:
    1. Βάλε τα αρχεία στον φάκελο files/markopoulo/ ή files/glyfada/
       (ή τρέξε το tools/convert.ps1 που φτιάχνει μόνο του το PDF).
    2. Αντέγραψε ένα { ... } παρακάτω και άλλαξε τα στοιχεία.
    3. visible: false  -> το μάθημα ΔΕΝ εμφανίζεται στους μαθητές.

  date: μορφή "ΕΕΕΕ-ΜΜ-ΗΗ"
  pdf / pptx: διαδρομή του αρχείου (το pptx είναι προαιρετικό)
*/

window.SITE = {
  teacher: "Χρήστος Λαμπρόπουλος",

  app: {
    name: "Πληροφορική Γ' Λυκείου",
    tagline: "Μάθε Ψευδοκώδικα & Θεωρία για τις Πανελλαδικές Πληροφορικής, παίζοντας.",
    url: "https://play.google.com/store/apps/details?id=com.pliroforiki.app",
    appStore: "https://apps.apple.com/gr/app/id6804878348",
    icon: "assets/app/icon.png",
    shots: ["assets/app/shot1.png", "assets/app/shot2.png", "assets/app/shot3.png"],
    features: [
      "Διαδραστικά μαθήματα σε όλη την εξεταστέα ύλη",
      "Ενσωματωμένος διερμηνέας ΓΛΩΣΣΑΣ που τρέχει τον κώδικα βήμα-βήμα",
      "Θέματα Πανελλαδικών & ΟΕΦΕ με ενδεικτικές λύσεις",
      "Quiz, XP, καθημερινές αποστολές και κατάταξη",
      "Λειτουργεί χωρίς ίντερνετ",
    ],
    note: "Εντελώς δωρεάν · Χωρίς διαφημίσεις · Χωρίς αγορές",
  },

  classes: [
    {
      id: "markopoulo",
      school: "ΣΑΕΚ Μαρκοπούλου",
      course: "Σύγχρονα Λειτουργικά Συστήματα",
      meta: "Α΄ εξάμηνο · Τρίτη 16:25–18:50 · Εργαστήριο",
      color: "teal",
      emoji: "🖥️",
      weekday: 2,              // 0=Κυριακή, 1=Δευτέρα, 2=Τρίτη ...
      end: "2027-02-02",       // τελευταίο μάθημα
      total: 15,               // σύνολο μαθημάτων εξαμήνου
      terminal: [
        "C:\\> systeminfo | find \"OS Name\"",
        "OS Name:  Microsoft Windows 11 ✔",
        "C:\\> tasklist | find /c \"chrome\"",
        "14   ← τόσες διεργασίες ένας browser! 😮",
      ],
      tips: [
        "Ctrl + Shift + Esc ανοίγει κατευθείαν τη Διαχείριση Εργασιών.",
        "Win + E ανοίγει την Εξερεύνηση αρχείων.",
        "Win + . (τελεία) ανοίγει τα emoji 😎",
        "Win + Shift + S: στιγμιότυπο από ένα κομμάτι της οθόνης.",
        "Στη γραμμή εντολών, γράψε systeminfo για να δεις τα στοιχεία του ΛΣ σου.",
        "Πρόγραμμα = αρχείο στον δίσκο. Διεργασία = πρόγραμμα που τρέχει στη μνήμη.",
      ],
      notes: [
        {
          title: "Εργαστήριο 1 · Τι είναι το Λειτουργικό Σύστημα",
          kind: "Θεωρία",
          date: "2026-10-06",
          desc: "Το ΛΣ ως «μεσάζων» ανάμεσα σε χρήστη, εφαρμογές και υλικό. Βασικοί στόχοι και αρμοδιότητες: διεργασίες, μνήμη, αρχεία, συσκευές.",
          pdf: "files/markopoulo/sls-01-theoria.pdf",
          pptx: "files/markopoulo/sls-01-theoria.pptx",
          visible: true,
        },
        {
          title: "Εργαστήριο 1 · Πρακτικό",
          kind: "Πρακτικό",
          date: "2026-10-06",
          desc: "Αποστολές στο PC: γνώρισε τον υπολογιστή σου, συμπλήρωσε την κάρτα συστήματος, βρες τις 6 δουλειές του ΛΣ.",
          pdf: "files/markopoulo/sls-01-praktiko.pdf",
          pptx: "files/markopoulo/sls-01-praktiko.pptx",
          visible: true,
        },
        {
          title: "Εργαστήριο 2 · Κατηγορίες ΛΣ και διεργασίες",
          kind: "Θεωρία",
          date: "2026-10-13",
          desc: "Από την ομαδική επεξεργασία στον πολυπρογραμματισμό και τον καταμερισμό χρόνου. ΛΣ πραγματικού χρόνου και οι 5 κατηγορίες σε έναν πίνακα.",
          pdf: "files/markopoulo/sls-02-theoria.pdf",
          pptx: "files/markopoulo/sls-02-theoria.pptx",
          visible: true,
        },
        {
          title: "Εργαστήριο 2 · Διεργασίες στην πράξη",
          kind: "Πρακτικό",
          date: "2026-10-13",
          desc: "Πρόγραμμα ή διεργασία; Ένα πρόγραμμα με 3 διεργασίες, γιατί ο browser έχει τόσες διεργασίες, μετρήσεις στη Διαχείριση Εργασιών.",
          pdf: "files/markopoulo/sls-02-praktiko.pdf",
          pptx: "files/markopoulo/sls-02-praktiko.pptx",
          visible: true,
        },
      ],
    },
    {
      id: "glyfada",
      school: "ΣΑΕΚ Γλυφάδας",
      course: "Προγραμματισμός Εφαρμογών Διαδικτύου & Παιχνιδιών (Python, Pygame)",
      meta: "Γ΄ εξάμηνο · Δευτέρα 3η–6η ώρα · Εργαστήριο",
      color: "amber",
      emoji: "🐍",
      weekday: 1,
      end: "2027-01-25",
      total: 15,
      terminal: [
        ">>> print(\"Γεια σου, κόσμε!\")",
        "Γεια σου, κόσμε!",
        ">>> grades = [12, 17, 19]",
        ">>> sum(grades) / len(grades)",
        "16.0",
      ],
      tips: [
        "a, b = b, a αντιμεταθέτει δύο μεταβλητές σε μία γραμμή.",
        "fruits[-1] σου δίνει το τελευταίο στοιχείο της λίστας.",
        "Το range(5) δίνει 0, 1, 2, 3, 4. Το 5 δεν μπαίνει!",
        "Το // κάνει ακέραια διαίρεση: 7 // 2 δίνει 3.",
        "f-strings: print(f\"Βαθμός: {grade}\") βάζει την τιμή μέσα στο κείμενο.",
        "Κόλλησε το πρόγραμμα σε while True; Πάτα Ctrl + C.",
      ],
      notes: [
        {
          title: "Μάθημα 1 · Γνωριμία με την Python",
          kind: "Θεωρία + ασκήσεις",
          date: "2026-10-05",
          desc: "Εγκατάσταση, REPL και αρχεία .py, μεταβλητές, τύποι, τελεστές, είσοδος/έξοδος. Από το πρώτο print() μέχρι ένα πρόγραμμα που δίνει ρέστα. 8 ασκήσεις με λύσεις.",
          pdf: "files/glyfada/python-01-gnorimia.pdf",
          pptx: "files/glyfada/python-01-gnorimia.pptx",
          visible: true,
        },
        {
          title: "Μάθημα 2 · if · while · for",
          kind: "Θεωρία + ασκήσεις",
          date: "2026-10-12",
          desc: "Το πρόγραμμα αποφασίζει και επαναλαμβάνει: if / elif / else, επαναλήψεις με while και for. 3 ασκήσεις και 6 προγράμματα με λύσεις.",
          pdf: "files/glyfada/python-02-if-while-for.pdf",
          pptx: "files/glyfada/python-02-if-while-for.pptx",
          visible: true,
        },
        {
          title: "Μάθημα 3 · Λίστες και πλειάδες",
          kind: "Θεωρία + ασκήσεις",
          date: "2026-10-19",
          desc: "Πολλές τιμές σε μία μεταβλητή: δημιουργία λιστών, δείκτες (και αρνητικοί), slicing, προσθήκη στοιχείων, πλειάδες. 3 ασκήσεις και 3 προγράμματα με λύσεις.",
          pdf: "files/glyfada/python-03-listes.pdf",
          pptx: "files/glyfada/python-03-listes.pptx",
          visible: true,
        },
      ],
    },
  ],
};
