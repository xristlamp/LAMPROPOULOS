# Φτιάχνει τις διαφάνειες του Εργαστηρίου 5 του Μαρκοπούλου: escape room στη Γραμμή εντολών («Αποστολή Kastro»).
# Οι εντολές της συνάντησης 5 (cmd) τις είχαν δει στα πρώτα εργαστήρια, οπότε εδώ τις χρησιμοποιούν σε μια ιστορία, σε ομάδες:
# 4 κεφάλαια στο site, κάθε κεφάλαιο δίνει ένα κομμάτι του κωδικού παράδοσης.
# Βγάζει ΔΥΟ αρχεία:
#   1. τις διαφάνειες της τάξης (ανεβαίνουν στο site) ΧΩΡΙΣ τις λύσεις των κεφαλαίων
#   2. τις λύσεις για τον εκπαιδευτή (μένουν μόνο στο Desktop: μην τις ανεβάσεις!)
# Χρήση:  py tools\sls05_slides.py   → Desktop\ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο05_MS-DOS_και_Γραμμή_εντολών.pptx (+ …_ΛΥΣΕΙΣ_εκπαιδευτή.pptx)
import sys
import slides_kit as K
from slides_kit import *
from sls_kit import *

DESK = os.path.join(os.path.expanduser("~"), "Desktop", "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ")
OUT = "ΣΛΣ_Εργαστήριο05_MS-DOS_και_Γραμμή_εντολών.pptx"
OUT_TEACHER = sys.argv[2] if len(sys.argv) > 2 else os.path.join(DESK, "ΣΛΣ_Εργαστήριο05_Kastro_ΛΥΣΕΙΣ_εκπαιδευτή.pptx")
N_SLIDES = 17

start(ORIG_4)
title_slide4("ΕΡΓΑΣΤΗΡΙΟ 5 · ΕΝΟΤΗΤΑ 2.1.Β.3 · ESCAPE ROOM", "Αποστολή", "Kastro",
             "Escape room στη Γραμμή εντολών: σώσε το παιχνίδι της Pixel Owl πριν την παράδοση",
             f"Ζέσταμα + 4 κεφάλαια σε ομάδες · ο κωδικός παράδοσης · build.bat στον αληθινό υπολογιστή · {N_SLIDES} διαφάνειες")
overview = new(nxt(), "Η ΣΗΜΕΡΙΝΗ ΔΙΑΔΡΟΜΗ", "Οι 5 ασκήσεις του εργαστηρίου")
footer(overview, "ΣΤΟ SITE", "Εργαστήριο → **Εργαστήριο 5** → **🦉 Αποστολή Kastro**. Το «↺ Ξαναστήσε τα αρχεία» φέρνει το κεφάλαιο στην αρχή του.")

# κανόνες του αγώνα
s = new(nxt(), "ΠΩΣ ΠΑΙΖΟΥΜΕ", "Κανόνες του αγώνα")
cards(s, COL_L, TOP, COL_W, [
    ("Ομάδες των 2", "Ένας γράφει τις εντολές, ο άλλος διαβάζει και κρατά σημειώσεις. **Σε κάθε κεφάλαιο αλλάζετε ρόλους.**"),
    ("Ο κωδικός παράδοσης", "Τα κεφάλαια κρύβουν **κομμάτια** του κωδικού: μπαίνουν στο 🔑 «σακίδιο» πάνω δεξιά και στο τέλος τα ενώνετε στο **χρηματοκιβώτιο**. Κάποια βγαίνουν **μόνο αν η εντολή γίνει σωστά**."),
    ("Πόντοι και χρόνος: αυτόματα", "Το παιχνίδι μετρά μόνο του χρόνο και πόντους. Κάθε στόχος έχει κουμπί **💡 −2**: δείχνει την εντολή, αλλά **κοστίζει**."),
])
table(s, COL_R, TOP, [COL_RW - 1188720, 1188720], [
    ["Πόντοι", ""], ["Κάθε κεφάλαιο", "+10"], ["Η παράδοση (σωστός κωδικός)", "+20"],
    ["Κάθε υπόδειξη", "−2"], ["Κάθε λάθος κωδικός", "−1"],
], mono=(1,), size=11.5, row_h=457200, hl={(1, 1): "1B7F4B", (2, 1): "1B7F4B", (3, 1): "B42318", (4, 1): "B42318"})
table(s, COL_R, TOP + 2560320, [COL_RW - 1188720, 1188720], [
    ["Χρόνος", ""], ["Ζέσταμα", "10΄"], ["Κεφάλαια 1 και 2", "35΄"], ["Κεφάλαια 3 και 4", "55΄"], ["Στο PC: το δικό σας build.bat", "30΄"],
], mono=(1,), size=11, row_h=356616)
footer(s, "ΝΙΚΗΤΗΣ", "Οι **περισσότεροι πόντοι**· σε ισοβαθμία, ο **καλύτερος χρόνος**. Στο τέλος δείχνετε στον εκπαιδευτή την **οθόνη της νίκης** 📸")

# θυμάσαι;
mark(1)
s = new(nxt(), "ΖΕΣΤΑΜΑ · 10΄", "Θυμάσαι; Όλη η Γραμμή εντολών σε μία σελίδα", lab=[1])
CMDS = [("dir  ·  dir /a  ·  dir *.png", "τι έχει ο φάκελος (και τα κρυφά, ή με μάσκα)"), ("cd φάκελος  ·  cd ..", "μπαίνεις σε φάκελο · ανεβαίνεις έναν"),
        ("cd %USERPROFILE%", "πίσω στον φάκελό σου (C:\\Users\\mathitis)"),
        ("tree φάκελος /f", "δέντρο, με τα αρχεία"), ("type αρχείο", "δείχνει το κείμενο"), ("md  ·  rd /s", "φτιάχνει / σβήνει φάκελο"),
        ("copy πηγή προορισμός", "αντίγραφο (και με μάσκα: *.png)"), ("move πηγή προορισμός", "αλλάζει θέση (και όνομα, αν το γράψεις)"),
        ("ren αρχείο νέο_όνομα", "αλλάζει μόνο το όνομα"), ("del αρχείο", "σβήνει αρχεία"),
        ("attrib  ±h  ±r", "κρυφό · μόνο για ανάγνωση"), ("xcopy πηγή προορ. /e /i", "ολόκληρος φάκελος"),
        ("echo κείμενο >> αρχείο", "γράφει στο τέλος αρχείου"), ("εντολή | find \"Λέξη\"", "μόνο οι γραμμές με τη λέξη (μετράνε τα κεφαλαία· με /i όχι)"),
        ("systeminfo · driverquery", "RAM, ΛΣ · οδηγοί συσκευών"), ("όνομα.bat", "τρέχει τις εντολές του αρχείου")]
NEW = {"attrib  ±h  ±r", "xcopy πηγή προορ. /e /i", "όνομα.bat"}
half = (len(CMDS) + 1) // 2
for k, part in enumerate((CMDS[:half], CMDS[half:])):
    rows = [["Γράφεις", "Τι κάνει"]] + [[c + ("  ★" if c in NEW else ""), d] for c, d in part]
    table(s, COL_L if k == 0 else COL_R, TOP, [2834640, (COL_W if k == 0 else COL_RW) - 2834640], rows, mono=(0,), size=10, row_h=448056,
          hl={(i + 1, 0): GOLD for i, (c, _) in enumerate(part) if c in NEW})
footer(s, "★ ΝΕΑ", "Τα τρία με αστεράκι τα βλέπουμε στην επόμενη διαφάνεια. Τα υπόλοιπα τα ξέρετε: **ζέσταμα στο site** (άσκηση 1).")

# τρία νέα εργαλεία
s = new(nxt(), "ΤΑ ΚΑΙΝΟΥΡΙΑ", "Τρία εργαλεία που θα χρειαστείτε")
cw = (W - 2 * 137160) // 3
for k, (t, src, d, tone) in enumerate([
        ("attrib: κρυφά και κλειδωμένα", "dir /a\nattrib mystiko.txt\nattrib -h mystiko.txt\nattrib -r rythmiseis.txt",
         "**H** = κρυφό (το dir δεν το δείχνει) · **R** = μόνο ανάγνωση (δεν αλλάζει, δεν σβήνεται). Με **−** τα βγάζεις.", "blue"),
        ("xcopy: ολόκληροι φάκελοι", "xcopy Fotografies Backup\\Fotografies /e /i",
         "Το copy παίρνει μόνο αρχεία. **/e** = και οι υποφάκελοι · **/i** = ο προορισμός είναι φάκελος.", "blue"),
        (".bat: εντολές σε αρχείο", "echo @echo off > build.bat\necho md release >> build.bat\nbuild",
         "Μία εντολή ανά γραμμή, τρέχει με το **όνομά** του. Το **^>** γράφει το σύμβολο > μέσα στο αρχείο.", "gold")]):
    x = L + k * (cw + 137160)
    b = code(s, x, TOP, cw, src, size=10.5, tag=t.split(":")[0].upper())
    card(s, x, b + 137160, cw, t, d, tone=tone, h=1554480, size=10.5)
footer(s, "ΘΥΜΗΣΟΥ", "Με **>** φτιάχνεις νέο αρχείο, με **>>** προσθέτεις στο τέλος. Ένα λάθος > σβήνει ό,τι είχε μέσα!")

# η ιστορία
s = new(nxt(), "Η ΙΣΤΟΡΙΑ", "Η Pixel Owl έχει πρόβλημα")
y = prompt(s, L, TOP, W, "Η μικρή εταιρεία παιχνιδιών **Pixel Owl** παραδίδει **αύριο** το παιχνίδι **Kastro**. Ο προγραμματιστής, ο Άρης, αρρώστησε κι έφυγε βιαστικά: "
           "τα αρχεία είναι μισοτελειωμένα και κάπου έχει κρύψει τον **κωδικό παράδοσης**. Η ομάδα σας είναι οι τεχνικοί που θα σώσουν το project, **μόνο με τη Γραμμή εντολών**.",
           tag="ΑΠΟΣΤΟΛΗ KASTRO") + 182880
code(s, COL_L, y, COL_W - 457200, '''
C:\\Users\\mathitis
├── Desktop        # εδώ άφησε ένα σημείωμα
├── Documents
│   └── PixelOwl   # το project... και κάτι ακόμα
└── Downloads      # νέα αρχεία από τους γραφίστες
''', size=11.5, tag="ΠΟΥ ΨΑΧΝΕΤΕ")
cards(s, COL_R - 457200, y, COL_RW + 457200, [
    ("Ο κωδικός παράδοσης", "4 κομμάτια, ένα από κάθε κεφάλαιο: **κομμάτι1 κομμάτι2 − κομμάτι3 κομμάτι4**, π.χ. AB-12."),
    ("Προσοχή στις παγίδες", "Αρχεία που κρύβονται, αρχεία που δεν σε αφήνουν να τα αλλάξεις, και ένα αρχείο που **δεν είναι αυτό που δείχνει**…", "gold"),
])
footer(s, "ΞΕΚΙΝΑΤΕ", "Site → Εργαστήριο 5 → **🦉 Αποστολή Kastro** → όνομα ομάδας → **▶ Ξεκινάμε!** Καλή επιτυχία!")

# τα 4 κεφάλαια (χωρίς λύσεις)
CHAPTERS = [
    (2, "ΚΕΦΑΛΑΙΟ 1 · 15΄", "Το σημείωμα",
     "Διαβάστε το σημείωμα του Άρη, βρείτε πού είναι το project και τι ζητά η εταιρεία πριν την παράδοση.",
     "**Κομμάτι 1** του κωδικού\nΠόσα αρχεία έχει ο φάκελος **src**\nΠόσα GB **RAM** θέλει το παιχνίδι",
     "type · tree … /f · cd", "Ό,τι ψάχνετε είναι γραμμένο σε αρχεία κειμένου: διαβάστε τα!"),
    (2, "ΚΕΦΑΛΑΙΟ 2 · 20΄", "Τα κρυμμένα",
     "«Το dir δεν λέει πάντα όλη την αλήθεια…». Στον φάκελο Kastro κρύβεται ένα αρχείο. Βρείτε το, διαβάστε το και κάντε ό,τι λέει.",
     "**Κομμάτι 2** του κωδικού\n**Κομμάτι 3**: πόσα αρχεία ταιριάζουν στο level?.dat\nΠοιο γράμμα του attrib το έκρυβε",
     "dir /a · attrib · type · dir μάσκα", "Το ? ταιριάζει με **ακριβώς έναν** χαρακτήρα. Μετράει!"),
    (2, "ΚΕΦΑΛΑΙΟ 3 · 25΄", "Σώσε το project",
     "Κάντε ό,τι ζητούν οι ΟΔΗΓΙΕΣ της εταιρείας: νέα sprites, τακτοποίηση σημειώσεων, release=yes στο config.ini και αντίγραφο ασφαλείας.",
     "Ποιο αρχείο **δεν** αντιγράψατε (και γιατί)\n**Κομμάτι 4**: πόσες .png έχει μετά το assets\nΤι απαντά το echo στο κλειδωμένο config.ini",
     "copy μάσκα · move · attrib −r · echo >> · xcopy /e /i", "Θέλουμε **μόνο εικόνες**. Κοιτάξτε προσεκτικά την **τελευταία** κατάληξη κάθε αρχείου."),
    (2, "ΚΕΦΑΛΑΙΟ 4 · 30΄", "Το release",
     "Ελέγξτε ότι ο υπολογιστής τρέχει το παιχνίδι και γράψτε ένα build.bat που φτιάχνει τον φάκελο παράδοσης release\\game (src, assets, config.ini) και γράφει το δέντρο του στο release.txt.",
     "Τρέχει το Kastro σε αυτό το PC;\nΠόσα αρχεία έχει το release\\game\\assets\nΚαι μετά: 🔐 **η παράδοση** με τον κωδικό",
     "systeminfo | find · driverquery | find · echo >> build.bat · xcopy · tree > αρχείο",
     "Ποια λέξη να ψάξει το find; Τρέξτε πρώτα **σκέτο** systeminfo / driverquery (είναι στα αγγλικά). Το build.bat: γραμμή-γραμμή, έλεγχος με **type**, μετά τρέξ' το."),
]
for n, kick, title, mission, find_, tools, tip in CHAPTERS:
    mark(n)
    s = new(nxt(), kick, title, lab=[n])
    y = prompt(s, L, TOP, W, mission, tag="Η ΑΠΟΣΤΟΛΗ") + 182880
    card(s, COL_L, y, COL_W, "Βρείτε και γράψτε στο site", find_, tone="gold", h=1554480, size=11.5)
    card(s, COL_R, y, COL_RW, "Εργαλεία που ίσως χρειαστείτε", tools, h=1554480, size=12)
    footer(s, "ΥΠΟΔΕΙΞΗ", tip)

# στο PC: το δικό τους build.bat
s = new(nxt(), "ΣΤΟ PC · 30΄ · ΤΟ ΠΑΡΑΔΟΤΕΟ", "Το δικό σας build.bat, στον αληθινό υπολογιστή")
b = code(s, COL_L, TOP, COL_W, '''
cd %USERPROFILE%\\Documents\\LS_Eponymo
md MyGame\\src MyGame\\assets
echo console.log("Γεια!") > MyGame\\src\\main.js
notepad build.bat        # γράψε το build.bat σου
build
tree release /f > release.txt
''', size=10.5, tag="WIN + R → CMD")
card(s, COL_L, b + 137160, COL_W, "Τι κάνει το build.bat σας",
     "**@echo off** · ένα **rem** με τα ονόματα της ομάδας · **md** release\\game · **xcopy** src και assets με /e /i · **echo** Etoimo!", size=10.5)
table(s, COL_R, TOP, [457200, COL_RW - 457200], [
    ["#", "Παραδοτέο: ανεβάστε στον φάκελό σας"],
    ["1", "Το **build.bat**"],
    ["2", "Το **release.txt** με το δέντρο του release"],
    ["3", "Στιγμιότυπο της **οθόνης νίκης** του Kastro (χρόνος και πόντοι)"],
], mono=(0,), size=11, row_h=502920)
footer(s, "ΣΤΟ ΣΧΟΛΙΚΟ PC", "Δουλεύετε **μόνο** μέσα στο Documents\\LS_Eponymo. Τίποτα από rd /s ή del *.* έξω από αυτό!")

# άσκηση 3: τι θα γίνει αν
WHAT = [("del *.* μέσα στο Desktop", "σβήνει όλα τα αρχεία του", "Μόνο αρχεία, όχι φακέλους. Στα αληθινά Windows ρωτά πρώτα «Are you sure (Y/N)?»."),
        ("rd Archeio, ενώ έχει αρχεία", "«The directory is not empty.»", "Το σκέτο rd σβήνει μόνο άδειους φακέλους: θέλει **rd /s**."),
        ("md a\\b\\c, ενώ δεν υπάρχει ούτε ο a", "φτιάχνει και τους τρεις", "Το md φτιάχνει **όλη τη διαδρομή** μαζί."),
        ("ren ergasia.txt Archeio\\nea.txt", "λάθος σύνταξης", "Στο ren γράφεις **μόνο** το νέο όνομα. Για θέση: move."),
        ("xcopy Documents Backup\\Documents (χωρίς /i)", "ρωτά «F = file, D = directory?»", "Το **/i** του λέει από πριν ότι ο προορισμός είναι φάκελος."),
        ("dir test?.tmp (υπάρχουν test1.tmp, test10.tmp)", "δείχνει μόνο το test1.tmp", "Το ? = **ακριβώς ένας** χαρακτήρας. Το «10» είναι δύο.")]
quiz_slide(3, "ΑΣΚΗΣΗ 3 · ΔΥΣΚΟΛΟ", "Τι θα γίνει αν…;",
           "Προβλέψτε τι θα κάνει κάθε εντολή **πριν** τη δοκιμάσετε. Οι επιλογές είναι στο site.",
           ["Εντολή", "Τι θα γίνει;"], [[q, "___"] for q, _, _ in WHAT], "Σκεφτείτε τι κάνατε στο Kastro: κρυφά, μάσκες, xcopy.", widths=[7315200, W - 7315200])
quiz_solution([3], "Τι θα γίνει αν: λύση", [[q, a, why] for q, a, why in WHAT],
              "Πριν από μια επικίνδυνη εντολή, τρέξε **dir** με την ίδια διαδρομή ή μάσκα.", row_h=576072)

# άσκηση 4: PowerShell (η διαφάνεια είναι και η λύση)
mark(4); mark_sol([4])
s = new(nxt(), "ΑΣΚΗΣΗ 4 · ΕΥΚΟΛΟ", "Το επόμενο κέλυφος: PowerShell", lab=[4])
table(s, COL_L, TOP, [1463040, 2286000, COL_W - 3749040 + 457200], [
    ["cmd", "PowerShell", "Linux (bash)"],
    ["dir", "Get-ChildItem", "ls"], ["cd", "Set-Location", "cd"], ["type", "Get-Content", "cat"], ["copy", "Copy-Item", "cp"],
    ["del", "Remove-Item", "rm"], ["tasklist", "Get-Process", "ps"], ["taskkill", "Stop-Process", "kill"],
], mono=(0, 1, 2), size=11, row_h=402336)
cards(s, COL_R + 457200, TOP, COL_RW - 457200, [
    ("Ρήμα-Ουσιαστικό", "**Get** = δείξε · **Set** = όρισε · **Copy** = αντίγραψε · **Remove** = σβήσε · **Stop** = σταμάτα. Τα παλιά dir, cd, copy δουλεύουν κι εδώ."),
    ("Στο PC", "Win → **powershell**. Δοκιμάστε Get-ChildItem και Get-Process | Sort-Object CPU.", "gold"),
])
footer(s, "ΒΟΗΘΕΙΑ", "Στο PowerShell το **Get-Help** (π.χ. Get-Help Get-Process) είναι το /? του cmd.")

# άσκηση 5: για το σπίτι
mark(5)
s = new(nxt(), "ΑΣΚΗΣΗ 5 · ΓΙΑ ΤΟ ΣΠΙΤΙ", "Το backup.bat", lab=[5])
y = prompt(s, L, TOP, W, "Ένα .bat που κάνει αντίγραφο ασφαλείας με ένα «κλικ»: τα **Documents** με xcopy, τις **Εικόνες** με robocopy, "
           "και στο τέλος δείχνει το δέντρο. Γράψ' το στον φάκελό σου και τρέξ' το **δύο φορές**.") + 182880
code(s, COL_L, y, COL_W, '''
@echo off
xcopy Documents Backup\\Documents /e /i /y
robocopy Pictures Backup\\Pictures /e
tree Backup /f
''', size=11.5, tag="BACKUP.BAT")
cards(s, COL_R, y, COL_RW, [
    ("Βρες", "Πόσα αρχεία έχει συνολικά ο Backup; Στο **2ο** τρέξιμο, πόσα αντέγραψε (Copied) το robocopy;", "gold"),
    ("robocopy", "Σαν το xcopy, αλλά αντιγράφει **μόνο ό,τι λείπει ή άλλαξε** και γράφει σύνοψη (Copied / Skipped)."),
])
footer(s, "ΓΙΑΤΙ /y", "Στο 2ο τρέξιμο το xcopy θα ρωτούσε «Overwrite …? (Yes/No/All)» για κάθε αρχείο. Το **/y** απαντά «ναι» από πριν.")
term_solution(
    (5, '''
backup
»Documents\\sxolio.txt
»Documents\\programma.txt
»2 File(s) copied
»               Total    Copied   Skipped
»   Files :         1         1         0
»C:\\USERS\\MATHITIS\\BACKUP
»├───Documents
»│       sxolio.txt
»│       programma.txt
»└───Pictures
»        diakopes.png
backup                                     # 2η φορά
»   Files :         1         0         1
''', "Ο Backup έχει **3** αρχεία (2 + 1).\n"
     "2ο τρέξιμο: το robocopy αντέγραψε **0** (Skipped 1), ενώ το xcopy τα ξαναγράφει όλα.\n"
     "Για να τρέχει κάθε μέρα: **Χρονοδρομολόγηση εργασιών** (Task Scheduler) → Δημιουργία βασικής εργασίας → backup.bat."),
    None, "Ο Task Scheduler είναι κι αυτός ένας «χρονοδρομολογητής», όπως του Εργαστηρίου 3, για προγράμματα που τρέχουν σε ώρες που ορίζεις.")

# σύνοψη
s = new(nxt(), "ΣΥΝΟΨΗ", "Τι κρατάμε από την αποστολή")
cards(s, COL_L, TOP, COL_W, [
    ("Διάβασε πριν πράξεις", "**type** και **tree /f** πριν από κάθε αλλαγή: οι απαντήσεις είναι συνήθως γραμμένες κάπου."),
    ("Το dir δεν λέει όλη την αλήθεια", "**dir /a** για τα κρυφά · **attrib** για H και R · οι μάσκες **\\*** και **?** μετράνε ακριβώς."),
    ("Η τελευταία κατάληξη μετράει", "Ένα «φωτογραφία.png.exe» **δεν** είναι εικόνα αλλά πρόγραμμα. Η μάσκα \\*.png δεν το πιάνει, κι αυτό σας προστατεύει."),
])
cards(s, COL_R, TOP, COL_RW, [
    ("Αντίγραφα και αυτοματισμός", "**xcopy /e /i** για φακέλους · ένα **.bat** κάνει τη δουλειά κάθε φορά ίδια, χωρίς λάθη.", "gold"),
    ("Έλεγχος απαιτήσεων", "**systeminfo | find** και **driverquery | find**: σε δευτερόλεπτα, χωρίς να ανοίξεις παράθυρο.", "gold"),
    ("Επόμενο εργαστήριο", "Τα **Windows με γραφικό περιβάλλον**: εκδόσεις, Εξερεύνηση, συμπίεση, εγκατάσταση εφαρμογών.", "gold"),
])
footer(s, "ΕΡΩΤΗΣΗ", "Ποια εντολή σάς βοήθησε περισσότερο στην αποστολή; Αυτή είναι η πρώτη που θα ψάξετε την επόμενη φορά.")

NAMES = ["Ζέσταμα: θυμάσαι;", "🦉 Αποστολή Kastro (4 κεφάλαια)", "Τι θα γίνει αν…;", "Από το cmd στο PowerShell", "Το backup.bat"]
LEVELS = ["Εύκολο", "Ο στόχος", "Δύσκολο", "Εύκολο", "Για το σπίτι"]
def where(n):   # «7–10» για το παιχνίδι (πολλές διαφάνειες, χωρίς λύση) · «12 → 13» για άσκηση με λύση
    sl = sorted(set(EX[n][0]))
    if EX[n][1] and EX[n][1] != sl[-1]: return f"{sl[-1]} → {EX[n][1]}"
    return f"{sl[0]}–{sl[-1]}" if len(sl) > 1 else f"{sl[0]}"
lab_overview(overview, [(n, NAMES[n - 1], LEVELS[n - 1], where(n)) for n in range(1, 6)])
tf = box(overview, L, 5577840, W, 274320, MSO_ANCHOR.MIDDLE)
rich(tf.paragraphs[0], "Τα κεφάλαια του Kastro δεν έχουν διαφάνεια λύσης: τη λέμε όλοι μαζί στο τέλος του αγώνα.", 11, MUTED)

finish(OUT, N_SLIDES, "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ")
ids = {1: "e5w", 2: "e5kastro", 3: "e5m", 4: "e5n", 5: "e5o"}
print("REFS:", ", ".join(f'{ids[n]}: ["5", {sorted(set(EX[n][0]))}]' for n in range(1, 6)))

# ---------- οι λύσεις για τον εκπαιδευτή (μόνο στο Desktop) ----------
start(ORIG_4)
title_slide4("ΕΡΓΑΣΤΗΡΙΟ 5 · ΑΠΟΣΤΟΛΗ KASTRO · ΜΟΝΟ ΓΙΑ ΤΟΝ ΕΚΠΑΙΔΕΥΤΗ", "Kastro:", "οι λύσεις",
             "Οι λύσεις των 4 κεφαλαίων και ο κωδικός παράδοσης: δεν ανεβαίνουν στο site",
             "Ζέσταμα · κεφάλαια 1–4 · ο κωδικός και τα συχνά λάθη · 5 διαφάνειες")
quiz_solution([1], "Ζέσταμα: λύση", [
    ["τι έχει ο φάκελος · αλλάζει φάκελο · δέντρο", "dir · cd · tree", "Με /a και τα κρυφά, με /f και τα αρχεία."],
    ["δείχνει κείμενο · αντιγράφει αρχείο", "type · copy", "Το copy δεν παίρνει φακέλους."],
    ["ολόκληρος φάκελος · άλλη θέση · άλλο όνομα", "xcopy · move · ren", "Το ren δεν αλλάζει θέση."],
    ["σβήνει αρχεία · κρυφό ή μόνο ανάγνωση", "del · attrib", "attrib +h / +r, και με − τα βγάζεις."],
], "Ζέσταμα χωρίς λάθος = **+3** πόντοι για την ομάδα.", row_h=621792)
term_solution(
    (2, '''
type Desktop\\SIMEIOMA.txt
»...Κομμάτι 1 του κωδικού: DO
tree Documents\\PixelOwl /f
»│   ├───src
»│   │       main.js · player.js · enemy.js
cd Documents\\PixelOwl\\Kastro
type docs\\ODIGIES.txt
»Απαιτήσεις: Windows 10/11, 8 GB RAM, κάρτα ήχου.
»Υ.Γ. Το dir δεν λέει πάντα όλη την αλήθεια...
''', "Κομμάτι 1: **DO** · src: **3** αρχεία · RAM: **8** GB.\n"
     "Το tree **δεν** δείχνει το κρυφό kleidi.txt: είναι το μυστήριο του κεφαλαίου 2."),
    (3, '''
dir /a
»06/10/2026  10:15      291 kleidi.txt
attrib kleidi.txt
»A     H         C:\\...\\Kastro\\kleidi.txt
type kleidi.txt
»Κομμάτι 2 του κωδικού: S
dir assets\\level?.dat
»level1.dat · level2.dat · level3.dat
»               3 File(s)
''', "Κομμάτι 2: **S** · κομμάτι 3: **3** (το level10.dat **δεν** ταιριάζει στο ?) · γράμμα: **H**.\n"
     "Συχνό λάθος: dir level*.dat → 4 → λάθος κωδικός."),
    "Όποια ομάδα «κόλλησε» στο κεφάλαιο 2, μάλλον δεν έτρεξε **dir /a**.",
    kicker="ΛΥΣΗ · ΚΕΦΑΛΑΙΑ 1 ΚΑΙ 2", names=[("ΚΕΦΑΛΑΙΟ 1", "Απαντήσεις: Κεφάλαιο 1"), ("ΚΕΦΑΛΑΙΟ 2", "Απαντήσεις: Κεφάλαιο 2")])
term_solution(
    (4, '''
copy Downloads\\sprites\\*.png Documents\\PixelOwl\\Kastro\\assets
»boss.png
»coin.png
»        2 file(s) copied.        # ΟΧΙ το dragon.png.exe
move ...\\assets\\notes.txt ...\\docs\\changelog.txt
cd Documents\\PixelOwl\\Kastro
echo release=yes >> config.ini
»Access is denied.
attrib -r config.ini
echo release=yes >> config.ini
cd %USERPROFILE%
xcopy Documents\\PixelOwl\\Kastro Backup\\Kastro /e /i
»17 File(s) copied
''', "Δεν αντιγράφεται το **dragon.png.exe**: είναι πρόγραμμα, όχι εικόνα!\n"
     "Κομμάτι 4: **5** εικόνες (3 + boss + coin) · το echo: **Access is denied**."),
    (5, '''
systeminfo | find "Total Physical Memory"
»Total Physical Memory:     16,183 MB
driverquery | find "Audio"
»IntcAzAudAdd Realtek High Definition Audio Kernel
type build.bat
»@echo off
»md release\\game
»xcopy src release\\game\\src /e /i
»xcopy assets release\\game\\assets /e /i
»copy config.ini release\\game
»tree release /f > release.txt
»echo Etoimo!
build
»Etoimo!
''', "Τρέχει: **ναι** (16 GB ≥ 8 GB, κάρτα ήχου Realtek) · release\\game\\assets: **11** αρχεία.\n"
     "🔑 Κωδικός: **DOS-35**"),
    "Στο build.bat η γραμμή του tree γράφεται με **echo tree release /f ^> release.txt >> build.bat**.",
    kicker="ΛΥΣΗ · ΚΕΦΑΛΑΙΑ 3 ΚΑΙ 4", names=[("ΚΕΦΑΛΑΙΟ 3", "Απαντήσεις: Κεφάλαιο 3"), ("ΚΕΦΑΛΑΙΟ 4", "Απαντήσεις: Κεφάλαιο 4")])
s = new(nxt(), "Ο ΚΩΔΙΚΟΣ", "DOS-35: πώς βγαίνει")
table(s, L, TOP, [1554480, 1188720, 3749040, W - 6492240], [
    ["Κομμάτι", "Τιμή", "Από πού", "Συχνό λάθος"],
    ["1", "DO", "το σημείωμα στο Desktop", "—"],
    ["2", "S", "το κρυφό kleidi.txt (dir /a)", "όποιος δεν βρήκε το κρυφό αρχείο, κολλάει εδώ"],
    ["3", "3", "dir assets\\level?.dat", "level*.dat → 4 (μετρά και το level10.dat)"],
    ["4", "5", "dir assets\\\\*.png μετά το κεφάλαιο 3", "μέτρησαν πριν την αντιγραφή → 3"],
], mono=(1,), size=11.5, row_h=640080)
footer(s, "ΓΙΑΤΙ DOS", "Από το **MS-DOS**, που ξεκίνησε όλη τη Γραμμή εντολών το 1981.")
assert len(K.prs.slides) == 5, len(K.prs.slides)
K.prs.save(OUT_TEACHER)
print("OK", OUT_TEACHER, "5 διαφάνειες (ΜΟΝΟ για τον εκπαιδευτή)")
