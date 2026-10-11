/*
  ΕΡΓΑΣΤΗΡΙΟ PYTHON — αληθινή Python μέσα στον browser (Pyodide) με ασκήσεις ανά μάθημα.
  Ο μαθητής γράφει κώδικα, πατά ▶ Τρέξε, και με ✔ Έλεγχος η σελίδα ελέγχει αυτόματα αν η λύση είναι σωστή.

  Για να προσθέσεις μάθημα ή άσκηση: δες τη λίστα LESSONS πιο κάτω.
  Κάθε άσκηση έχει:
    id, title, tag, desc, ex (παράδειγμα εκτέλεσης), starter (αρχικός κώδικας), hint (υπόδειξη),
    tests: [{ in: [είσοδοι για input()], has: [τι πρέπει να εμφανιστεί], not: [τι δεν πρέπει] }]
           (στο has/not: κείμενο, /regex/ ή N("5") για «ο αριθμός 5 ακριβώς»)
    need:  [{ re: /regex στον κώδικα/, msg: "μήνυμα αν λείπει" }]   (προαιρετικό)
    setup: "κώδικας Python που τρέχει πριν" (προαιρετικό)
*/
(function () {
  "use strict";

  var XP = 20;
  var CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";

  function N(x) { return { n: String(x) }; }

  // ======================= ΜΑΘΗΜΑΤΑ & ΑΣΚΗΣΕΙΣ =======================
  var LESSONS = [
    {
      id: "m1", num: 1, title: "Γνωριμία με την Python", short: "Γνωριμία", date: "2026-10-05",
      ex: [
        { id: "m1a", tag: "Ζέσταμα", title: "Το πρώτο σου πρόγραμμα",
          desc: "Γράψε πρόγραμμα που εμφανίζει το μήνυμα: Γεια σου, κόσμε!",
          ex: "Γεια σου, κόσμε!",
          starter: "# Γράψε τον κώδικά σου εδώ και πάτα ▶ Τρέξε\n",
          hint: 'Με την print() εμφανίζεις κείμενο. Το κείμενο μπαίνει μέσα σε εισαγωγικά: print("...")',
          tests: [{ in: [], has: ["Γεια σου, κόσμε!"] }] },
        { id: "m1b", tag: "Ζέσταμα", title: "Χαιρετισμός με input()",
          desc: "Ζήτα από τον χρήστη το όνομά του και εμφάνισε: Γεια σου, <όνομα>!",
          ex: "Όνομα: Νίκος\nΓεια σου, Νίκος!",
          starter: 'name = input("Όνομα: ")\n# εμφάνισε τον χαιρετισμό\n',
          hint: 'Με f-string βάζεις τη μεταβλητή μέσα στο κείμενο: print(f"Γεια σου, {name}!")',
          tests: [{ in: ["Νίκος"], has: ["Γεια σου, Νίκος!"] }, { in: ["Μαρία"], has: ["Γεια σου, Μαρία!"] }] },
        { id: "m1c", tag: "Άσκηση", title: "Οι τελεστές /  //  %",
          desc: "Διάβασε δύο ακέραιους a και b και εμφάνισε, σε ξεχωριστές γραμμές: το a / b, το a // b και το a % b.",
          ex: "a: 23\nb: 4\n5.75\n5\n3",
          starter: 'a = int(input("a: "))\nb = int(input("b: "))\n',
          hint: "Η / δίνει πάντα float, η // το ακέραιο πηλίκο και η % το υπόλοιπο. Τρία print(), ένα για καθεμία.",
          tests: [{ in: ["23", "4"], has: ["5.75", N(5), N(3)] }, { in: ["10", "2"], has: ["5.0", N(5), N(0)] }] },
        { id: "m1d", tag: "Εργαστήριο 1", title: "Δείκτης Μάζας Σώματος",
          desc: "Διάβασε βάρος (kg) και ύψος (m) και εμφάνισε τον ΔΜΣ με 2 δεκαδικά. Τύπος: ΔΜΣ = βάρος / ύψος²",
          ex: "Βάρος σε kg: 70\nΎψος σε m: 1.75\nΔΜΣ: 22.86",
          starter: "# bmi.py — Δείκτης Μάζας Σώματος\n",
          hint: 'Το ύψος έχει δεκαδικά, οπότε float(input(...)). Το ύψος² γράφεται height ** 2. Για 2 δεκαδικά: f"{bmi:.2f}"',
          tests: [{ in: ["70", "1.75"], has: ["22.86"] }, { in: ["50", "1.6"], has: ["19.53"] }] },
        { id: "m1e", tag: "Εργαστήριο 2", title: "Μετατροπή θερμοκρασίας",
          desc: "Διάβασε θερμοκρασία σε Κελσίου και εμφάνισέ τη σε Φαρενάιτ (1 δεκαδικό) και σε Κέλβιν (2 δεκαδικά). Τύποι: F = C × 9/5 + 32,  K = C + 273.15",
          ex: "Θερμοκρασία (°C): 25\n25.0°C = 77.0°F = 298.15K",
          starter: 'c = float(input("Θερμοκρασία (°C): "))\n',
          hint: 'Υπολόγισε f = c * 9 / 5 + 32 και k = c + 273.15. Για 1 δεκαδικό {f:.1f}, για 2 δεκαδικά {k:.2f}.',
          tests: [{ in: ["25"], has: ["77.0", "298.15"] }, { in: ["-40"], has: ["-40.0", "233.15"] }, { in: ["100"], has: ["212.0", "373.15"] }] },
        { id: "m1f", tag: "Ο στόχος", title: "Ρέστα σε κέρματα",
          desc: "Το πρόγραμμα βρίσκει τα ρέστα και πόσα κέρματα από το καθένα να δώσει ο ταμίας, με τα λιγότερα δυνατά. Κέρματα: 2€, 1€, 50λ, 20λ, 10λ, 5λ, 2λ, 1λ. Συμπλήρωσε τους υπολογισμούς.",
          ex: "Ποσό (€): 15.12\nΠληρωμή (€): 20\nΡέστα: 4.88€\n2€: 2  1€: 0  50λ: 1  20λ: 1\n10λ: 1  5λ: 1  2λ: 1  1λ: 1",
          starter: '# change.py — Ρέστα σε κέρματα\nprice = float(input("Ποσό (€): "))\npaid = float(input("Πληρωμή (€): "))\nrest = round((paid - price) * 100)   # τα ρέστα σε λεπτά\nprint(f"Ρέστα: {rest / 100:.2f}€")\n\n# Συμπλήρωσε: πόσα κέρματα από το καθένα; (θυμήσου // και %)\nc200 = 0\nc100 = 0\nc50 = 0\nc20 = 0\nc10 = 0\nc5 = 0\nc2 = 0\nc1 = 0\n\nprint("2€:", c200, " 1€:", c100, " 50λ:", c50, " 20λ:", c20)\nprint("10λ:", c10, " 5λ:", c5, " 2λ:", c2, " 1λ:", c1)\n',
          hint: "Για κάθε κέρμα: πόσα χωράνε = rest // 200 και ό,τι μένει = rest % 200. Π.χ. c200, rest = rest // 200, rest % 200 και μετά το ίδιο για 100, 50, 20…",
          tests: [
            { in: ["15.12", "20"], has: ["4.88", /(^|\s)2€:\s*2\b/, /(^|\s)1€:\s*0\b/, /50λ:\s*1\b/, /(^|\s)20λ:\s*1\b/, /(^|\s)10λ:\s*1\b/, /(^|\s)5λ:\s*1\b/, /(^|\s)2λ:\s*1\b/, /(^|\s)1λ:\s*1\b/] },
            { in: ["7.30", "10"], has: ["2.70", /(^|\s)2€:\s*1\b/, /(^|\s)1€:\s*0\b/, /50λ:\s*1\b/, /(^|\s)20λ:\s*1\b/, /(^|\s)10λ:\s*0\b/, /(^|\s)5λ:\s*0\b/, /(^|\s)2λ:\s*0\b/, /(^|\s)1λ:\s*0\b/] }
          ] },
        { id: "m1g", tag: "Για το σπίτι", title: "Άθροισμα ψηφίων τριψήφιου",
          desc: "Διάβασε έναν τριψήφιο αριθμό και εμφάνισε το άθροισμα των ψηφίων του. Μόνο με // και %.",
          ex: "Αριθμός: 472\n13",
          starter: 'n = int(input("Αριθμός: "))\n',
          hint: "Εκατοντάδες: n // 100. Δεκάδες: (n // 10) % 10. Μονάδες: n % 10.",
          tests: [{ in: ["472"], has: [N(13)] }, { in: ["999"], has: [N(27)] }, { in: ["105"], has: [N(6)] }],
          need: [{ re: /%/, msg: "Χρησιμοποίησε τον τελεστή % (υπόλοιπο) για τα ψηφία." }] },
        { id: "m1h", tag: "Πρόκληση", title: "Δευτερόλεπτα σε ΩΩ:ΛΛ:ΔΔ",
          desc: "Διάβασε ένα πλήθος δευτερολέπτων και εμφάνισέ το σε μορφή ΩΩ:ΛΛ:ΔΔ (πάντα 2 ψηφία).",
          ex: "Δευτερόλεπτα: 7384\n02:03:04",
          starter: 'total = int(input("Δευτερόλεπτα: "))\n',
          hint: 'Ώρες = total // 3600, ό,τι μένει = total % 3600. Μετά λεπτά και δευτερόλεπτα με // 60 και % 60. Για 2 ψηφία: f"{h:02d}"',
          tests: [{ in: ["7384"], has: ["02:03:04"] }, { in: ["59"], has: ["00:00:59"] }, { in: ["3600"], has: ["01:00:00"] }] }
      ]
    },
    {
      id: "m2", num: 2, title: "if · while · for", short: "if · while · for", date: "2026-10-12",
      ex: [
        { id: "m2a", tag: "Ζέσταμα", title: "Ζυγός ή μονός;",
          desc: "Διάβασε έναν ακέραιο και εμφάνισε «Ζυγός» ή «Μονός».",
          ex: "Αριθμός: 7\nΜονός",
          starter: 'n = int(input("Αριθμός: "))\n',
          hint: "Ένας αριθμός είναι ζυγός όταν n % 2 == 0. Μετά if … else.",
          tests: [{ in: ["4"], has: ["Ζυγός"], not: ["Μονός"] }, { in: ["7"], has: ["Μονός"], not: ["Ζυγός"] }, { in: ["0"], has: ["Ζυγός"], not: ["Μονός"] }] },
        { id: "m2b", tag: "Άσκηση", title: "Βαθμός σε χαρακτηρισμό",
          desc: "Διάβασε βαθμό (0–20) και εμφάνισε: 18–20 «Άριστα», 15–17.9 «Πολύ καλά», 10–14.9 «Καλά», κάτω από 10 «Απορρίπτεται». Για βαθμό εκτός 0–20: «Λάθος βαθμός».",
          ex: "Βαθμός: 16\nΠολύ καλά",
          starter: 'grade = float(input("Βαθμός: "))\n',
          hint: "Με if / elif / else ελέγχεις από τον μεγαλύτερο προς τον μικρότερο. Βάλε πρώτα τον έλεγχο για «Λάθος βαθμός» (grade < 0 or grade > 20).",
          tests: [{ in: ["19"], has: ["Άριστα"] }, { in: ["18"], has: ["Άριστα"] }, { in: ["16"], has: ["Πολύ καλά"] }, { in: ["12"], has: ["Καλά"], not: ["Πολύ"] }, { in: ["10"], has: ["Καλά"], not: ["Πολύ"] }, { in: ["7"], has: ["Απορρίπτεται"] }, { in: ["25"], has: ["Λάθος βαθμός"], not: ["Άριστα"] }] },
        { id: "m2c", tag: "Επέκταση", title: "ΔΜΣ με κατηγορία",
          desc: "Πάρε το πρόγραμμα του ΔΜΣ από το Μάθημα 1 και πρόσθεσε κατηγορία: κάτω από 18.5 «Λιποβαρής», κάτω από 25 «Φυσιολογικός», αλλιώς «Υπέρβαρος».",
          ex: "Βάρος σε kg: 70\nΎψος σε m: 1.75\nΔΜΣ: 22.86\nΦυσιολογικός",
          starter: 'weight = float(input("Βάρος σε kg: "))\nheight = float(input("Ύψος σε m: "))\nbmi = weight / height ** 2\nprint(f"ΔΜΣ: {bmi:.2f}")\n# πρόσθεσε την κατηγορία με if / elif / else\n',
          hint: "if bmi < 18.5: … elif bmi < 25: … else: …",
          tests: [{ in: ["70", "1.75"], has: ["22.86", "Φυσιολογικός"] }, { in: ["50", "1.80"], has: ["15.43", "Λιποβαρής"] }, { in: ["95", "1.75"], has: ["31.02", "Υπέρβαρος"] }] },
        { id: "m2d", tag: "Εργαστήριο 1", title: "Προπαίδεια",
          desc: "Διάβασε έναν αριθμό n και εμφάνισε την προπαίδειά του από το 1 έως το 10.",
          ex: "Αριθμός: 7\n7 x  1 =   7\n7 x  2 =  14\n...\n7 x 10 =  70",
          starter: 'n = int(input("Αριθμός: "))\n',
          hint: 'for i in range(1, 11): και μέσα print(f"{n} x {i:2d} = {n * i:3d}")',
          tests: [{ in: ["7"], has: [/7\s*x\s*1\s*=\s*7(?!\d)/, /7\s*x\s*5\s*=\s*35/, /7\s*x\s*10\s*=\s*70/], not: [/x\s*11/, /x\s*0\s*=/] }, { in: ["3"], has: [/3\s*x\s*10\s*=\s*30/] }],
          need: [{ re: /\bfor\b/, msg: "Χρησιμοποίησε βρόχο for με range()." }] },
        { id: "m2e", tag: "Άσκηση", title: "Άθροισμα από 1 έως n",
          desc: "Διάβασε έναν θετικό ακέραιο n και εμφάνισε το άθροισμα 1 + 2 + … + n, με βρόχο.",
          ex: "n: 100\n5050",
          starter: 'n = int(input("n: "))\ntotal = 0   # αθροιστής\n',
          hint: "Μοτίβο αθροιστή: total = 0 και μέσα στον βρόχο total += i. Το range(1, n + 1) περιλαμβάνει και το n.",
          tests: [{ in: ["100"], has: [N(5050)] }, { in: ["10"], has: [N(55)] }, { in: ["1"], has: [N(1)] }],
          need: [{ re: /\b(for|while)\b/, msg: "Λύσ' το με βρόχο (for ή while)." }] },
        { id: "m2f", tag: "Εργαστήριο 2", title: "Είναι πρώτος;",
          desc: "Διάβασε έναν ακέραιο και πες αν είναι πρώτος. Αν δεν είναι, δείξε έναν διαιρέτη του: «Όχι — διαιρείται με το 7». Για αριθμούς κάτω από 2: «Δεν είναι πρώτος».",
          ex: "Αριθμός: 91\nΌχι — διαιρείται με το 7",
          starter: 'n = int(input("Αριθμός: "))\n',
          hint: "Ψάξε διαιρέτες με for d in range(2, n): και if n % d == 0. Με break σταματάς στον πρώτο. Το else του for τρέχει μόνο αν δεν έγινε break!",
          tests: [{ in: ["17"], has: ["Είναι πρώτος"], not: ["Δεν", "Όχι"] }, { in: ["2"], has: ["Είναι πρώτος"], not: ["Δεν", "Όχι"] }, { in: ["91"], has: [/διαιρείται με το 7\b/] }, { in: ["1"], has: ["Δεν είναι πρώτος"] }] },
        { id: "m2g", tag: "Εργαστήριο 3", title: "Μάντεψε τον αριθμό",
          desc: "Ο υπολογιστής «σκέφτεται» έναν αριθμό από 1 έως 100 (random.randint). Ο παίκτης μαντεύει και παίρνει απάντηση «Μεγαλύτερος!» ή «Μικρότερος!» μέχρι να τον βρει. Στο τέλος: «Μπράβο! Το βρήκες σε N προσπάθειες.»",
          ex: "Μάντεψε (1-100): 50\nΜικρότερος!\nΜάντεψε (1-100): 25\nΜεγαλύτερος!\nΜάντεψε (1-100): 42\nΜπράβο! Το βρήκες σε 3 προσπάθειες.",
          starter: "import random\nsecret = random.randint(1, 100)\ntries = 0\nguess = 0\n",
          hint: "while guess != secret: … διάβασε guess, tries += 1, και με if / elif πες «Μεγαλύτερος!» ή «Μικρότερος!». Μετά τον βρόχο τύπωσε το μπράβο.",
          setup: "import random\nrandom.randint = lambda a, b: 42",
          tests: [{ in: ["50", "25", "42"], has: ["Μικρότερος", "Μεγαλύτερος", "Μπράβο", N(3)] }, { in: ["42"], has: ["Μπράβο", N(1)], not: ["Μικρότερος", "Μεγαλύτερος"] }],
          need: [{ re: /\bwhile\b/, msg: "Χρησιμοποίησε while (δεν ξέρεις από πριν πόσες προσπάθειες θα χρειαστούν)." }] },
        { id: "m2h", tag: "Ο στόχος", title: "Μενού κονσόλας",
          desc: "Πρόγραμμα με μενού: 1. Προπαίδεια, 2. Έλεγχος πρώτου, 0. Έξοδος. Εκτελεί την επιλογή και ξαναδείχνει το μενού, μέχρι να δοθεί 0 («Αντίο!»). Για άλλη επιλογή: «Λάθος επιλογή». Για τον πρώτο εμφάνισε «Πρώτος» ή «Όχι πρώτος».",
          ex: "1. Προπαίδεια\n2. Έλεγχος πρώτου\n0. Έξοδος\nΕπιλογή: 2\nΑριθμός: 17\nΠρώτος\n...\nΕπιλογή: 0\nΑντίο!",
          starter: 'while True:\n    print("\\n1. Προπαίδεια")\n    print("2. Έλεγχος πρώτου")\n    print("0. Έξοδος")\n    choice = input("Επιλογή: ")\n    # συμπλήρωσε με if / elif / else\n',
          hint: 'if choice == "1": … elif choice == "2": … elif choice == "0": print("Αντίο!") και break … else: print("Λάθος επιλογή")',
          tests: [{ in: ["1", "3", "2", "17", "9", "2", "15", "0"], has: [/3\s*x\s*10\s*=\s*30/, "Πρώτος", "Όχι πρώτος", "Λάθος επιλογή", "Αντίο"] }],
          need: [{ re: /\bbreak\b/, msg: "Το while True θέλει break για να σταματήσει στο 0." }] },
        { id: "m2i", tag: "Για το σπίτι", title: "Ψηφία με while",
          desc: "Διάβασε θετικό ακέραιο και εμφάνισε πόσα ψηφία έχει και το άθροισμά τους. Με while, // και %.",
          ex: "Αριθμός: 4721\nΨηφία: 4\nΆθροισμα: 14",
          starter: 'n = int(input("Αριθμός: "))\ncount = 0\ntotal = 0\n',
          hint: "while n > 0: πάρε το τελευταίο ψηφίο με n % 10, πρόσθεσέ το, μέτρησέ το, και κόψ' το με n = n // 10.",
          tests: [{ in: ["4721"], has: [N(4), N(14)] }, { in: ["7"], has: [N(1), N(7)] }, { in: ["1000"], has: [N(4), N(1)] }],
          need: [{ re: /\bwhile\b/, msg: "Λύσ' το με while." }] }
      ]
    },
    {
      id: "m3", num: 3, title: "Λίστες και πλειάδες", short: "Λίστες", date: "2026-10-19",
      ex: [
        { id: "m3a", tag: "Ζέσταμα", title: "Δείκτες και κομμάτια",
          desc: "Από τη λίστα days εμφάνισε: τη δεύτερη μέρα, την τελευταία (με αρνητικό δείκτη), το κομμάτι από Τρι έως Τετ, και πόσες μέρες έχει η λίστα.",
          ex: "Τρι\nΠαρ\n['Τρι', 'Τετ']\n5",
          starter: 'days = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ"]\n',
          hint: "Οι θέσεις ξεκινούν από το 0: days[1] είναι η δεύτερη. days[-1] η τελευταία. days[1:3] δίνει τις θέσεις 1 και 2. len(days) το πλήθος.",
          tests: [{ in: [], has: [/^Τρι$/m, /^Παρ$/m, "['Τρι', 'Τετ']", N(5)] }],
          need: [{ re: /\[\s*-\s*1\s*\]/, msg: "Για την τελευταία χρησιμοποίησε αρνητικό δείκτη: days[-1]" }] },
        { id: "m3b", tag: "Άσκηση", title: "Καλάθι αγορών",
          desc: "Ξεκίνα με cart = [\"ψωμί\"]. Πρόσθεσε στο τέλος «γάλα», βάλε στην αρχή «αυγά», βγάλε το «ψωμί» και εμφάνισε το καλάθι.",
          ex: "['αυγά', 'γάλα']",
          starter: 'cart = ["ψωμί"]\n',
          hint: 'cart.append("γάλα") στο τέλος, cart.insert(0, "αυγά") στην αρχή, cart.remove("ψωμί") για αφαίρεση.',
          tests: [{ in: [], has: ["['αυγά', 'γάλα']"] }],
          need: [{ re: /\.append\s*\(/, msg: "Χρησιμοποίησε append()." }, { re: /\.insert\s*\(/, msg: "Χρησιμοποίησε insert()." }, { re: /\.remove\s*\(/, msg: "Χρησιμοποίησε remove()." }] },
        { id: "m3c", tag: "Εργαστήριο 1", title: "Βαθμολογίες τάξης",
          desc: "Διάβασε το πλήθος των μαθητών και τους βαθμούς τους σε λίστα. Εμφάνισε μέσο όρο (2 δεκαδικά), μέγιστο και ελάχιστο, πόσοι πέρασαν (≥ 10) και τους βαθμούς ταξινομημένους από τον μεγαλύτερο.",
          ex: "Πόσοι μαθητές; 5\nΒαθμός 1: 12\n...\nΜέσος όρος: 12.30\nΜέγιστος: 17.0  Ελάχιστος: 8.5\nΠέρασαν: 3 από 5\nΤαξινομημένοι: [17.0, 15.0, 12.0, 9.0, 8.5]",
          starter: 'n = int(input("Πόσοι μαθητές; "))\ngrades = []\n',
          hint: "Σε for i in range(n): διάβασε float και κάνε grades.append(g). Μετά: sum(grades) / len(grades), max(), min(), και sorted(grades, reverse=True).",
          tests: [{ in: ["5", "12", "8.5", "17", "9", "15"], has: ["12.30", "17.0", "8.5", /Πέρασαν\D*3/, "[17.0, 15.0, 12.0, 9.0, 8.5]"] }, { in: ["2", "10", "20"], has: ["15.00", "[20.0, 10.0]"] }],
          need: [{ re: /\.append\s*\(/, msg: "Γέμισε τη λίστα με append()." }] },
        { id: "m3d", tag: "Εργαστήριο 2", title: "Πάνω από τον μέσο όρο",
          desc: "Έχεις δύο λίστες: ονόματα και βαθμούς (στην ίδια σειρά). Εμφάνισε τον μέσο όρο, όσους είναι πάνω από αυτόν, και το όνομα του καλύτερου.",
          ex: "Μέσος όρος: 12.30\n  Μαρία: 17\n  Ελένη: 15\nΚαλύτερος/η: Μαρία",
          starter: 'names = ["Άννα", "Νίκος", "Μαρία", "Γιώργος", "Ελένη"]\ngrades = [12, 8.5, 17, 9, 15]\n',
          hint: "Με for name, g in zip(names, grades): περπατάς και τις δύο λίστες μαζί. Ο καλύτερος: names[grades.index(max(grades))]",
          tests: [{ in: [], has: ["12.30", "Μαρία", "Ελένη"], not: ["Άννα", "Νίκος", "Γιώργος"] }] },
        { id: "m3e", tag: "Άσκηση", title: "Μόνο οι ζυγοί (comprehension)",
          desc: "Από τη λίστα nums φτιάξε νέα λίστα μόνο με τους ζυγούς, σε μία γραμμή (list comprehension), και εμφάνισέ τη.",
          ex: "[8, 12, 4]",
          starter: "nums = [3, 8, 5, 12, 7, 4]\n",
          hint: "evens = [x for x in nums if x % 2 == 0]",
          tests: [{ in: [], has: ["[8, 12, 4]"] }],
          need: [{ re: /\[[^\]]*\bfor\b[^\]]*\bin\b[^\]]*\]/, msg: "Γράψ' το σε μία γραμμή: [x for x in nums if …]" }] },
        { id: "m3f", tag: "Άσκηση", title: "Πλειάδα: πόσο μακριά;",
          desc: "Ο παίκτης είναι στο σημείο point = (3, 4). «Ξεπακετάρισε» την πλειάδα σε x, y και εμφάνισε την απόστασή του από το (0, 0).",
          ex: "5.0",
          starter: "point = (3, 4)\n",
          hint: "x, y = point και μετά (x ** 2 + y ** 2) ** 0.5",
          tests: [{ in: [], has: ["5.0"] }],
          need: [{ re: /\w+\s*,\s*\w+\s*=\s*point\b/, msg: "Χρησιμοποίησε unpacking: x, y = point" }] },
        { id: "m3g", tag: "Ο στόχος", title: "Μαγικό τετράγωνο",
          desc: "Ένας πίνακας 3×3 είναι μαγικός όταν όλες οι γραμμές, οι στήλες και οι δύο διαγώνιοι έχουν το ίδιο άθροισμα. Υπολόγισε τα αθροίσματα και εμφάνισε «Μαγικό!» ή «Όχι μαγικό».",
          ex: "Γραμμές: [15, 15, 15]  Στήλες: [15, 15, 15]\nΔιαγώνιοι: 15 15\nΜαγικό!",
          starter: "m = [[2, 7, 6],\n     [9, 5, 1],\n     [4, 3, 8]]\n",
          hint: "Γραμμές: [sum(row) for row in m]. Στήλη c: m[0][c] + m[1][c] + m[2][c]. Διαγώνιοι: m[i][i] και m[i][2 - i]. Μαγικό αν min(όλα) == max(όλα).",
          tests: [{ in: [], has: ["Μαγικό!", "[15, 15, 15]"], not: ["Όχι"] }] },
        { id: "m3h", tag: "Για το σπίτι", title: "Λέξεις μέχρι κενή γραμμή",
          desc: "Διάβαζε λέξεις μέχρι να δοθεί κενή γραμμή. Εμφάνισε πόσες είναι, τις λέξεις αλφαβητικά και πόσες ξεκινούν από «Α».",
          ex: "Λέξη: Αθήνα\nΛέξη: μήλο\nΛέξη: Αλέκος\nΛέξη: \nΠλήθος: 3\n['Αθήνα', 'Αλέκος', 'μήλο']\nΑπό Α: 2",
          starter: "words = []\n",
          hint: 'while True: w = input("Λέξη: ") και if w == "": break. Αλλιώς words.append(w). Για το «Α»: w.startswith("Α").',
          tests: [{ in: ["Αθήνα", "μήλο", "Αλέκος", "σπίτι", ""], has: [N(4), N(2), "Αθήνα"] }, { in: [""], has: [N(0)] }],
          need: [{ re: /\bwhile\b/, msg: "Χρησιμοποίησε while (δεν ξέρεις πόσες λέξεις θα δοθούν)." }] }
      ]
    }
  ];

  // ======================= Python runner =======================
  var RUNNER = [
    "import sys, traceback",
    "class _Limit(Exception): pass",
    "def __run(code, inputs, interactive, setup, limit=1000000):",
    "    shown = []",
    "    printed = []",
    "    feed = [str(x) for x in inputs]",
    "    def _inp(prompt=''):",
    "        prompt = str(prompt)",
    "        shown.append(prompt)",
    "        if feed:",
    "            v = feed.pop(0)",
    "        elif interactive:",
    "            import js",
    "            v = js.window.prompt(prompt or 'input()', '')",
    "            if v is None:",
    "                raise KeyboardInterrupt('CANCEL')",
    "            v = str(v)",
    "        else:",
    "            raise EOFError('NOINPUT')",
    "        shown.append('\\x00' + v + '\\x01\\n')",
    "        return v",
    "    class W:",
    "        def write(self, s):",
    "            shown.append(s); printed.append(s); return len(s)",
    "        def flush(self): pass",
    "    steps = [0]",
    "    def local(frame, event, arg):",
    "        if event == 'line':",
    "            steps[0] += 1",
    "            if steps[0] > limit: raise _Limit()",
    "        return local",
    "    def glob(frame, event, arg):",
    "        return local if frame.f_code.co_filename == '<κώδικας>' else None",
    "    ns = {'__name__': '__main__', 'input': _inp}",
    "    old = sys.stdout, sys.stderr",
    "    sys.stdout = sys.stderr = W()",
    "    err = None",
    "    try:",
    "        if setup: exec(setup, ns)",
    "        c = compile(code, '<κώδικας>', 'exec')",
    "        sys.settrace(glob)",
    "        try:",
    "            exec(c, ns)",
    "        finally:",
    "            sys.settrace(None)",
    "    except _Limit:",
    "        err = {'type': 'Loop', 'msg': '', 'line': 0}",
    "    except SyntaxError as e:",
    "        err = {'type': type(e).__name__, 'msg': str(e.msg), 'line': e.lineno or 0}",
    "    except SystemExit:",
    "        err = None",
    "    except BaseException as e:",
    "        tb = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == '<κώδικας>']",
    "        err = {'type': type(e).__name__, 'msg': str(e), 'line': tb[-1].lineno if tb else 0}",
    "    finally:",
    "        sys.stdout, sys.stderr = old",
    "    return {'shown': ''.join(shown), 'out': ''.join(printed), 'err': err}"
  ].join("\n");

  var PY = null, loading = null, pyState = "idle", api = null, root = null;

  function setState(st) { pyState = st; if (root) paintState(); }
  function loadPy() {
    if (PY) return Promise.resolve(PY);
    if (loading) return loading;
    setState("loading");
    loading = new Promise(function (res, rej) {
      function boot() {
        window.loadPyodide({ indexURL: CDN }).then(function (py) {
          py.runPython(RUNNER); PY = py; setState("ready"); res(py);
        }, function (e) { rej(e); });
      }
      if (window.loadPyodide) return boot();
      var s = document.createElement("script");
      s.src = CDN + "pyodide.js"; s.onload = boot; s.onerror = function () { rej(new Error("net")); };
      document.head.appendChild(s);
    });
    loading.catch(function () { loading = null; setState("error"); });
    return loading;
  }
  function runPy(code, inputs, interactive, setup) {
    var fn = PY.globals.get("__run");
    var r = fn(code, inputs || [], !!interactive, setup || "");
    var o = r.toJs({ dict_converter: Object.fromEntries });
    r.destroy(); fn.destroy();
    return o;
  }

  // ======================= Ελληνικές εξηγήσεις λαθών =======================
  function explain(err) {
    var t = err.type, m = err.msg || "";
    if (t === "Loop") return "Ατέρμων βρόχος! Ο κώδικας έτρεξε εκατομμύρια βήματα χωρίς να τελειώσει. Έλεγξε ότι η συνθήκη του while κάποτε γίνεται ψευδής (π.χ. αλλάζει η μεταβλητή μέσα στον βρόχο;) ή ότι υπάρχει break.";
    if (t === "EOFError" && /NOINPUT/.test(m)) return "Το πρόγραμμα ζήτησε input() αλλά δεν υπήρχε άλλη τιμή. Στον έλεγχο δίνονται συγκεκριμένες τιμές. Μήπως διαβάζεις περισσότερες φορές απ' όσο ζητά η άσκηση;";
    if (t === "KeyboardInterrupt") return "Η εκτέλεση ακυρώθηκε.";
    if (t === "IndentationError" || t === "TabError") {
      if (/expected an indented block/.test(m)) return "Λείπει εσοχή: μετά από γραμμή που τελειώνει σε : (if, for, while, else…) οι επόμενες γραμμές θέλουν 4 κενά μέσα.";
      if (/unexpected indent/.test(m)) return "Περιττή εσοχή: η γραμμή έχει κενά μπροστά χωρίς λόγο. Σβήσ' τα.";
      if (/unindent does not match/.test(m)) return "Οι εσοχές δεν ταιριάζουν: οι γραμμές του ίδιου «μπλοκ» πρέπει να ξεκινούν ακριβώς στην ίδια στήλη.";
      return "Πρόβλημα με τις εσοχές (τα κενά στην αρχή της γραμμής).";
    }
    if (t === "SyntaxError") {
      if (/expected ':'/.test(m)) return "Ξέχασες την άνω-κάτω τελεία ( : ) στο τέλος του if / for / while / else.";
      if (/never closed/.test(m)) return "Άνοιξες παρένθεση ή αγκύλη που δεν έκλεισε. Μέτρα τις ( και τις ).";
      if (/unterminated string|EOL while scanning/.test(m)) return "Ένα κείμενο δεν έκλεισε: λείπουν τα εισαγωγικά στο τέλος.";
      if (/Maybe you meant '==' /.test(m) || /cannot assign to/.test(m)) return "Για σύγκριση θέλει == (δύο ίσον). Το ένα = δίνει τιμή σε μεταβλητή.";
      if (/unmatched/.test(m)) return "Υπάρχει παρένθεση ή αγκύλη που κλείνει χωρίς να έχει ανοίξει.";
      if (/Missing parentheses in call to 'print'/.test(m)) return "Στην Python 3 η print θέλει παρενθέσεις: print(\"...\")";
      if (/invalid character/.test(m)) return "Υπάρχει «περίεργος» χαρακτήρας, π.χ. ελληνικά εισαγωγικά « » ή “ ” αντί για \" \".";
      return "Λάθος σύνταξης. Κοίτα τη γραμμή που δείχνει (και την προηγούμενη): λείπει : , παρένθεση, εισαγωγικά; Δεν υπάρχουν ++ και ; στην Python.";
    }
    if (t === "NameError") {
      var nm = (m.match(/name '([^']+)'/) || [])[1] || "";
      if (/^Print|^Input|^PRINT/.test(nm)) return "Η Python ξεχωρίζει κεφαλαία-πεζά: γράψε " + nm.toLowerCase() + " με μικρά.";
      return "Το όνομα «" + nm + "» δεν υπάρχει. Μήπως λάθος γράμμα, ή χρησιμοποιείς τη μεταβλητή πριν της δώσεις τιμή; Αν ήθελες κείμενο, βάλ' το σε εισαγωγικά.";
    }
    if (t === "TypeError") {
      if (/string formatting|not all arguments converted/.test(m)) return "Έκανες πράξη (π.χ. %) σε κείμενο. Θυμήσου: το input() δίνει πάντα κείμενο (str). Μετάτρεψέ το με int() ή float(): n = int(input(...))";
      if (/can only concatenate str|unsupported operand type\(s\) for [+\-*/]+: '(int|float)' and 'str'|'str' and '(int|float)'/.test(m)) return "Ανακάτεψες κείμενο με αριθμό. Θυμήσου: το input() δίνει πάντα κείμενο (str). Μετάτρεψέ το με int() ή float() πριν κάνεις πράξεις.";
      if (/not supported between instances of 'str' and '(int|float)'|'(int|float)' and 'str'/.test(m)) return "Συγκρίνεις κείμενο με αριθμό. Μετάτρεψε την τιμή του input() με int() ή float().";
      if (/'tuple' object does not support item assignment/.test(m)) return "Οι πλειάδες (tuple) δεν αλλάζουν! Αν θες να αλλάζεις στοιχεία, χρησιμοποίησε λίστα [ ].";
      if (/'NoneType'/.test(m)) return "Κάτι είναι None. Συχνό λάθος: το lst.sort() αλλάζει τη λίστα και επιστρέφει None. Μην γράφεις x = lst.sort().";
      if (/not callable/.test(m)) return "Προσπαθείς να «καλέσεις» κάτι που δεν είναι συνάρτηση. Μήπως έδωσες σε μεταβλητή όνομα όπως sum, max, list, print;";
      return "Λάθος τύπου: η πράξη δεν γίνεται με αυτά τα είδη τιμών.";
    }
    if (t === "ValueError") {
      if (/invalid literal for int\(\) with base 10: '[\d]+[.,][\d]*'/.test(m)) return "Το int() δεν δέχεται δεκαδικά. Για αριθμούς με τελεία χρησιμοποίησε float().";
      if (/invalid literal for int|could not convert string to float/.test(m)) return "Η τιμή που δόθηκε δεν είναι αριθμός (ή είναι κενή), οπότε δεν μετατρέπεται.";
      if (/list.remove\(x\): x not in list|not in list/.test(m)) return "Ζήτησες να βγει ή να βρεθεί στοιχείο που δεν υπάρχει στη λίστα.";
      return "Λάθος τιμή για αυτή την πράξη.";
    }
    if (t === "ZeroDivisionError") return "Διαίρεση με το μηδέν! Έλεγξε με if ότι ο διαιρέτης δεν είναι 0.";
    if (t === "IndexError") return "Ζήτησες θέση που δεν υπάρχει. Οι θέσεις ξεκινούν από 0 και φτάνουν ως len(...) - 1.";
    if (t === "AttributeError") {
      if (/'tuple' object has no attribute/.test(m)) return "Οι πλειάδες δεν έχουν append/remove/sort, γιατί δεν αλλάζουν. Χρησιμοποίησε λίστα.";
      if (/'NoneType'/.test(m)) return "Κάτι είναι None. Μήπως έγραψες x = lst.sort(); Το sort() επιστρέφει None.";
      return "Αυτή η μέθοδος δεν υπάρχει για αυτόν τον τύπο. Έλεγξε την ορθογραφία (π.χ. append, όχι add).";
    }
    if (t === "KeyError") return "Το κλειδί δεν υπάρχει στο λεξικό.";
    if (t === "RecursionError") return "Η συνάρτηση καλεί τον εαυτό της ξανά και ξανά χωρίς τέλος.";
    return "";
  }

  // ======================= έλεγχος =======================
  function norm(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function numRe(x) { return new RegExp("(^|[^\\d.])" + x.replace(/[.\-]/g, "\\$&") + "(?!\\d|\\.\\d)"); }
  function matches(out, h) {
    if (h instanceof RegExp) return h.test(out);
    if (h && h.n != null) return numRe(h.n).test(out);
    return norm(out).indexOf(norm(h)) >= 0;
  }
  function label(h) { return h instanceof RegExp ? h.source.replace(/\\s\*/g, " ").replace(/\\b|\(\^\|\\s\)|\(\?!\\d\)|\^|\$/g, "").replace(/\\D\*/g, "…").replace(/\\/g, "") : h && h.n != null ? h.n : h; }

  function check(ex, code) {
    var res = { ok: true, lines: [] };
    (ex.need || []).forEach(function (nd) {
      var stripped = code.replace(/#.*$/gm, "");
      if (!nd.re.test(stripped)) { res.ok = false; res.lines.push({ c: "bad", s: "✘ " + nd.msg }); }
    });
    ex.tests.forEach(function (t, i) {
      var r = runPy(code, t.in, false, ex.setup);
      var lbl = "Τεστ " + (i + 1) + (t.in.length ? " (είσοδος: " + t.in.map(function (v) { return v === "" ? "κενό" : v; }).join(", ") + ")" : "");
      if (r.err) {
        res.ok = false;
        res.lines.push({ c: "bad", s: "✘ " + lbl + " — σφάλμα " + r.err.type + (r.err.line ? " στη γραμμή " + r.err.line : "") });
        var e = explain(r.err); if (e) res.lines.push({ c: "tip", s: "   💡 " + e });
        return;
      }
      var miss = (t.has || []).filter(function (h) { return !matches(r.out, h); });
      var extra = (t.not || []).filter(function (h) { return matches(r.out, h); });
      if (!miss.length && !extra.length) { res.lines.push({ c: "good", s: "✔ " + lbl }); return; }
      res.ok = false;
      res.lines.push({ c: "bad", s: "✘ " + lbl });
      if (miss.length) res.lines.push({ c: "tip", s: "   Περίμενα να δω: " + miss.map(function (h) { return "«" + label(h) + "»"; }).join(", ") });
      if (extra.length) res.lines.push({ c: "tip", s: "   Δεν έπρεπε να εμφανιστεί: " + extra.map(function (h) { return "«" + label(h) + "»"; }).join(", ") });
      var shown = r.out.trim().split("\n").slice(0, 8).join("\n");
      res.lines.push({ c: "dim", s: "   Το πρόγραμμά σου εμφάνισε:\n" + (shown ? shown.replace(/^/gm, "   │ ") : "   │ (τίποτα)") });
    });
    return res;
  }

  // ======================= syntax highlighting =======================
  var KW = /^(False|None|True|and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/;
  var BI = /^(print|input|int|float|str|len|range|sum|max|min|sorted|list|tuple|round|abs|type|enumerate|zip|bool|dict|set|reversed|any|all|open|isinstance)$/;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hl(code) {
    var re = /(#[^\n]*)|([rbfuRBFU]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_Ͱ-Ͽἀ-῿][\wͰ-Ͽἀ-῿]*)/g;
    var out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      if (m[1]) out += '<span class="hc">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="hs">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="hn">' + esc(m[3]) + "</span>";
      else if (KW.test(m[4])) out += '<span class="hk">' + esc(m[4]) + "</span>";
      else if (BI.test(m[4])) out += '<span class="hb">' + esc(m[4]) + "</span>";
      else out += esc(m[4]);
      last = re.lastIndex;
      if (m[0] === "") re.lastIndex++;
    }
    return out + esc(code.slice(last)) + "\n";
  }

  // ======================= UI =======================
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function parse(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(ex) { return "py:" + ex.id; }
  var SANDBOX = { id: "sandbox", title: "Ελεύθερο πεδίο", tag: "Πειραματισμός", desc: "Γράψε ό,τι θέλεις και πάτα ▶ Τρέξε. Εδώ δεν υπάρχει έλεγχος, μόνο εξερεύνηση!", ex: "", starter: '# Πειραματίσου ελεύθερα!\nname = input("Πώς σε λένε; ")\nfor i in range(3):\n    print(f"{i + 1}. Γεια σου, {name}!")\n', hint: "", tests: [] };

  var state = { lesson: null, exIdx: 0 };

  function defaultLesson() {
    var saved = store("py:lesson");
    if (saved === "sandbox" || LESSONS.some(function (l) { return l.id === saved; })) return saved;
    var t = today(), best = LESSONS[0].id;
    LESSONS.forEach(function (l) { if (parse(l.date) <= t) best = l.id; });
    return best;
  }
  function curLesson() { return LESSONS.filter(function (l) { return l.id === state.lesson; })[0]; }
  function curEx() { var l = curLesson(); return l ? l.ex[state.exIdx] || l.ex[0] : SANDBOX; }

  function paintState() {
    var el = root.el.querySelector(".py-state");
    if (!el) return;
    el.className = "py-state " + pyState;
    el.textContent = pyState === "ready" ? "🟢 Python 3.12 έτοιμη" : pyState === "loading" ? "⏳ Φορτώνει η Python… (μόνο την πρώτη φορά)" : pyState === "error" ? "🔴 Η Python δεν φόρτωσε (χρειάζεται ίντερνετ). Πάτα ▶ για νέα προσπάθεια" : "⚪ Η Python θα φορτώσει με το πρώτο ▶";
  }

  function render(el, oses, theApi) {
    api = theApi;
    if (!state.lesson) state.lesson = defaultLesson();
    var t = today();
    el.innerHTML =
      '<div class="py">' +
        '<div class="py-lessons" role="tablist">' +
          LESSONS.map(function (l) {
            var done = l.ex.filter(function (e) { return api.isDone(key(e)); }).length, soon = parse(l.date) > t;
            return '<button type="button" role="tab" data-lesson="' + l.id + '" aria-selected="' + (state.lesson === l.id) + '">' +
              '<b>Μάθημα ' + l.num + "</b><span>" + esc(l.short) + (soon ? " · 🔜" : "") + "</span><i>" + done + "/" + l.ex.length + "</i></button>";
          }).join("") +
          '<button type="button" role="tab" data-lesson="sandbox" aria-selected="' + (state.lesson === "sandbox") + '"><b>🧪 Ελεύθερο</b><span>πειραματισμός</span></button>' +
        "</div>" +
        '<div class="py-grid">' +
          '<div class="py-main">' +
            '<div class="py-task sticker"></div>' +
            '<div class="py-ed">' +
              '<div class="py-bar"><span class="py-file">🐍 askisi.py</span><span class="py-state"></span></div>' +
              '<div class="py-code"><div class="py-gut" aria-hidden="true"></div><div class="py-area"><pre class="py-hl" aria-hidden="true"></pre>' +
                '<textarea class="py-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Κώδικας Python"></textarea></div></div>' +
              '<div class="py-tools">' +
                '<button type="button" class="btn go" data-act="run">▶ Τρέξε <small>Ctrl+Enter</small></button>' +
                '<button type="button" class="btn py-checkbtn" data-act="check">✔ Έλεγχος</button>' +
                '<button type="button" class="btn check" data-act="hint">💡 Υπόδειξη</button>' +
                '<button type="button" class="btn check" data-act="reset" title="Ξαναβάζει τον αρχικό κώδικα">↺ Από την αρχή</button>' +
              "</div>" +
              '<details class="py-in"><summary>⌨️ Είσοδοι για input() <small>(προαιρετικό: μία τιμή σε κάθε γραμμή, αλλιώς θα σε ρωτήσει)</small></summary><textarea class="py-inputs" rows="3" placeholder="π.χ.\n70\n1.75"></textarea></details>' +
              '<div class="py-out" aria-live="polite"></div>' +
            "</div>" +
          "</div>" +
          '<aside class="missions sticker py-list"></aside>' +
        "</div>" +
      "</div>";
    root = { el: el, ta: el.querySelector(".py-ta"), hl: el.querySelector(".py-hl"), gut: el.querySelector(".py-gut"), out: el.querySelector(".py-out"), task: el.querySelector(".py-task"), list: el.querySelector(".py-list"), inputs: el.querySelector(".py-inputs") };
    paintState();
    renderList(); loadEx();
    bind(el);
    // ξεκίνα να φορτώνεις την Python στο παρασκήνιο
    setTimeout(function () { loadPy().catch(function () {}); }, 300);
  }

  function renderList() {
    var l = curLesson();
    if (!l) {
      root.list.innerHTML = '<div class="ms-head"><b>🧪 Ελεύθερο πεδίο</b></div><p class="py-note">Εδώ γράφεις ό,τι θέλεις. Οι ασκήσεις με έλεγχο και XP είναι στις καρτέλες των μαθημάτων.</p>';
      return;
    }
    var done = l.ex.filter(function (e) { return api.isDone(key(e)); }).length;
    root.list.innerHTML = '<div class="ms-head"><b>🎯 Μάθημα ' + l.num + '</b><span class="pill">' + done + "/" + l.ex.length + "</span></div>" +
      '<div class="py-ltitle">' + esc(l.title) + "</div>" +
      '<div class="xpbar"><i style="width:' + (done / l.ex.length * 100) + '%"></i></div>' +
      '<ol class="ms-list">' + l.ex.map(function (e, i) {
        var ok = api.isDone(key(e));
        return '<li class="ms' + (ok ? " done" : "") + (i === state.exIdx ? " open" : "") + '" data-i="' + i + '"><button type="button" class="ms-row">' +
          '<span class="ms-ico">' + (ok ? "✓" : i + 1) + '</span><span class="ms-t">' + esc(e.title) + '<small class="py-tag">' + esc(e.tag) + "</small></span>" +
          '<span class="ms-xp">' + (ok ? "" : "+" + XP) + "</span></button></li>";
      }).join("") + "</ol>";
  }

  function loadEx() {
    var e = curEx(), l = curLesson(), ok = l && api.isDone(key(e));
    root.task.innerHTML =
      '<div class="top" style="display:flex;gap:8px;flex-wrap:wrap">' + (l ? '<span class="pill">Μάθημα ' + l.num + "</span>" : "") + '<span class="pill new">' + esc(e.tag) + "</span>" +
        (l ? '<span class="pill">+' + XP + " XP</span>" : "") + (ok ? '<span class="pill ok">✓ Λύθηκε</span>' : "") + "</div>" +
      "<h3>" + esc(e.title) + "</h3><p>" + esc(e.desc) + "</p>" +
      (e.ex ? '<div class="py-exlbl">Παράδειγμα εκτέλεσης</div><pre class="py-ex">' + esc(e.ex) + "</pre>" : "") +
      '<div class="py-hint" hidden>💡 ' + esc(e.hint || "") + "</div>";
    var saved = store("py:code:" + e.id);
    setCode(saved != null ? saved : e.starter);
    root.el.querySelector(".py-checkbtn").hidden = !l;
    root.el.querySelector('[data-act="hint"]').hidden = !e.hint;
    root.el.querySelector('[data-act="hint"]').textContent = "💡 Υπόδειξη";
    root.out.innerHTML = '<div class="dim">' + (l ? "Γράψε τη λύση σου και πάτα ▶ Τρέξε για να δοκιμάσεις, και ✔ Έλεγχος όταν είσαι έτοιμος/η." : "Το αποτέλεσμα θα εμφανιστεί εδώ.") + "</div>";
    markLine(0);
  }

  function setCode(c) { root.ta.value = c; paint(); }
  var saveT;
  function paint() {
    var c = root.ta.value;
    root.hl.innerHTML = hl(c);
    var n = c.split("\n").length, g = "";
    for (var i = 1; i <= n; i++) g += '<div data-l="' + i + '">' + i + "</div>";
    root.gut.innerHTML = g;
    syncScroll();
    clearTimeout(saveT);
    saveT = setTimeout(function () { var e = curEx(); store("py:code:" + e.id, root.ta.value); }, 300);
  }
  function syncScroll() { root.hl.scrollTop = root.ta.scrollTop; root.hl.scrollLeft = root.ta.scrollLeft; root.gut.scrollTop = root.ta.scrollTop; }
  function markLine(n) {
    Array.prototype.forEach.call(root.gut.children, function (d) { d.classList.toggle("err", +d.dataset.l === n); });
  }

  function insert(text) {
    var ta = root.ta;
    ta.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      var s = ta.selectionStart; ta.setRangeText(text, s, ta.selectionEnd, "end");
    }
    paint();
  }

  function bind(el) {
    var ta = root.ta;
    ta.addEventListener("input", paint);
    ta.addEventListener("scroll", syncScroll);
    ta.addEventListener("keydown", function (e) {
      var v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
      var lineStart = v.lastIndexOf("\n", s - 1) + 1, line = v.slice(lineStart, s);
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); return; }
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          var m = v.slice(lineStart).match(/^ {1,4}/);
          if (m) { ta.setSelectionRange(lineStart, lineStart + m[0].length); insert(""); ta.setSelectionRange(Math.max(lineStart, s - m[0].length), Math.max(lineStart, s - m[0].length)); }
        } else if (s !== en && v.slice(s, en).indexOf("\n") >= 0) {
          var block = v.slice(lineStart, en), ind = block.replace(/^/gm, "    ");
          ta.setSelectionRange(lineStart, en); insert(ind); ta.setSelectionRange(lineStart, lineStart + ind.length);
        } else insert("    ");
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        var indent = (line.match(/^ */) || [""])[0];
        if (/:\s*(#.*)?$/.test(line)) indent += "    ";
        insert("\n" + indent);
        return;
      }
      if (e.key === "Backspace" && s === en && /^ +$/.test(line) && line.length % 4 === 0) {
        e.preventDefault(); ta.setSelectionRange(s - 4, s); insert(""); return;
      }
    });
    // ο «ακροατής» μπαίνει μία φορά: το el μένει ίδιο σε κάθε render
    if (el._pyBound) return;
    el._pyBound = true;
    el.addEventListener("click", function (e) {
      if (!el.querySelector(".py")) return;
      var b = e.target.closest("[data-lesson]");
      if (b) { state.lesson = b.dataset.lesson; state.exIdx = 0; store("py:lesson", state.lesson); var l = curLesson(); if (l) { var first = l.ex.findIndex(function (x) { return !api.isDone(key(x)); }); state.exIdx = first < 0 ? 0 : first; } render(el, null, api); return; }
      var li = e.target.closest(".py-list li.ms");
      if (li) { state.exIdx = +li.dataset.i; renderList(); loadEx(); root.task.scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
      var act = e.target.closest("[data-act]");
      if (!act) return;
      var a = act.dataset.act;
      if (a === "run") run();
      else if (a === "check") doCheck();
      else if (a === "hint") {
        var h = root.task.querySelector(".py-hint");
        h.hidden = !h.hidden;
        act.textContent = h.hidden ? "💡 Υπόδειξη" : "🙈 Κρύψε την υπόδειξη";
        if (!h.hidden) h.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      else if (a === "reset") { if (root.ta.value === curEx().starter || confirm("Να σβηστεί ο κώδικάς σου και να μπει ξανά ο αρχικός;")) { setCode(curEx().starter); markLine(0); } }
    });
  }

  function outHTML(lines) {
    return lines.map(function (l) { return '<div class="' + l.c + '">' + esc(l.s) + "</div>"; }).join("");
  }
  function showRun(r) {
    var html = "";
    if (r.shown.length > 20000) r.shown = r.shown.slice(0, 20000) + "\n… (η έξοδος κόπηκε, ήταν πολύ μεγάλη)";
    if (r.shown) html += '<div class="pyo">' + esc(r.shown).replace(/\u0000([^\u0001]*)\u0001/g, '<b class="pin">$1</b>') + "</div>";
    if (!r.shown && !r.err) html += '<div class="dim">(το πρόγραμμα έτρεξε χωρίς να εμφανίσει τίποτα — μήπως ξέχασες print();)</div>';
    if (r.err) {
      html += '<div class="bad">❌ ' + esc(r.err.type === "Loop" ? "Ατέρμων βρόχος" : r.err.type) + (r.err.line ? " στη γραμμή " + r.err.line : "") + (r.err.msg && r.err.type !== "Loop" ? ": " + esc(r.err.msg) : "") + "</div>";
      var ex = explain(r.err);
      if (ex) html += '<div class="tip">💡 ' + esc(ex) + "</div>";
      markLine(r.err.line);
    } else { markLine(0); html += '<div class="dim">— τέλος προγράμματος —</div>'; }
    root.out.innerHTML = html;
  }

  function withPy(label, fn) {
    root.out.innerHTML = '<div class="dim">' + label + "</div>";
    var btns = root.el.querySelectorAll(".py-tools .btn");
    Array.prototype.forEach.call(btns, function (b) { b.disabled = true; });
    var done = function () { Array.prototype.forEach.call(btns, function (b) { b.disabled = false; }); };
    loadPy().then(function () {
      setTimeout(function () { try { fn(); } finally { done(); } }, 30);
    }, function () {
      done();
      root.out.innerHTML = '<div class="bad">🔴 Δεν μπόρεσε να φορτώσει η Python. Χρειάζεται σύνδεση στο ίντερνετ την πρώτη φορά. Δοκίμασε ξανά.</div>';
    });
  }

  function run() {
    var code = root.ta.value;
    var inputs = root.inputs.value ? root.inputs.value.replace(/\r/g, "").split("\n") : [];
    if (inputs.length && inputs[inputs.length - 1] === "" && root.inputs.value.slice(-1) === "\n") inputs.pop();
    withPy(PY ? "⏳ Τρέχει…" : "⏳ Φορτώνει η Python… (μόνο την πρώτη φορά, λίγα δευτερόλεπτα)", function () {
      showRun(runPy(code, inputs, true, curEx().setup));
    });
  }

  function doCheck() {
    var e = curEx(), l = curLesson();
    if (!l) return;
    var code = root.ta.value;
    withPy(PY ? "🧪 Ελέγχω…" : "⏳ Φορτώνει η Python… (μόνο την πρώτη φορά)", function () {
      var r = check(e, code);
      var passed = r.lines.filter(function (x) { return x.c === "good"; }).length;
      var head = r.ok ? { c: "good big", s: "🎉 Σωστό! Πέρασαν όλα τα τεστ (" + e.tests.length + "/" + e.tests.length + ")" } : { c: "bad big", s: "🧪 Πέρασαν " + passed + " από " + e.tests.length + " τεστ. Συνέχισε, είσαι κοντά!" };
      root.out.innerHTML = outHTML([head].concat(r.lines));
      if (r.ok) {
        markLine(0);
        if (!api.isDone(key(e))) {
          api.award(key(e), XP, "🐍 " + e.title + " · +" + XP + " XP");
          if (l.ex.every(function (x) { return api.isDone(key(x)); })) setTimeout(function () { api.celebrate("🏆 Ολοκλήρωσες όλες τις ασκήσεις του Μαθήματος " + l.num + "!"); }, 900);
          renderList(); loadExKeepCode();
          // καρτέλα μαθήματος: ενημέρωσε τον μετρητή
          var tab = root.el.querySelector('[data-lesson="' + l.id + '"] i');
          if (tab) tab.textContent = l.ex.filter(function (x) { return api.isDone(key(x)); }).length + "/" + l.ex.length;
        }
      }
    });
  }
  function loadExKeepCode() {
    var out = root.out.innerHTML, code = root.ta.value;
    loadEx(); setCode(code); root.out.innerHTML = out;
  }

  window.PYLAB = {
    render: render,
    lessons: LESSONS,
    _test: { load: loadPy, run: function (c, i, s) { return runPy(c, i, false, s); }, check: function (ex, c) { return check(ex, c); } }
  };
})();
