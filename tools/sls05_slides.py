# Φτιάχνει τις διαφάνειες του Εργαστηρίου 5 του Μαρκοπούλου (MS-DOS και Γραμμή εντολών), σύμφωνα με τη συνάντηση 5 του σχεδίου μαθήματος.
# Ίδιο ύφος με τα Εργαστήρια 3 και 4: θεωρία σε μικρά βήματα, κάθε άσκηση του site με τη λύση της αμέσως μετά.
# Οι έξοδοι στις λύσεις είναι αυτές που βγάζει ο εξομοιωτής του lab.js (τα PID και οι ώρες αλλάζουν).
# Χρήση:  py tools\sls05_slides.py   → Desktop\ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο05_MS-DOS_και_Γραμμή_εντολών.pptx
# Μετά: tools\convert.ps1 για PDF. Το script τυπώνει στο τέλος τις γραμμές e5a… για το REFS του lab.js.
import slides_kit as K
from slides_kit import *

# Το Εργαστήριο 5 δεν έχει δικό του αρχικό αρχείο: παίρνει την 1η διαφάνεια και το πλαίσιο από την αρχική έκδοση του 4.
ORIG = os.path.join(os.path.expanduser("~"), "Desktop", "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ", "_πρωτότυπα_πριν_τον_εμπλουτισμό",
                    "ΣΛΣ_Εργαστήριο04_Χρονοδρομολόγηση_SRTF_RR_Priority_v1.pptx")
start(ORIG)
K.STEPS = 10
N_SLIDES = 28
DATE = "ΤΡΙΤΗ 10/11/2026"
NEXT = "Τρίτη 24/11 (17/11 αργία)"

def nxt(): return len(K.prs.slides) + 1      # αριθμός της επόμενης διαφάνειας

EX = {}                                       # άσκηση → [διαφάνειες θεωρίας/εκφώνησης], διαφάνεια λύσης
def mark(n, slide_no): EX.setdefault(n, [[], None])[0].append(slide_no)
def mark_sol(ns, slide_no):
    for n in ns: EX.setdefault(n, [[], None])[1] = slide_no

def quiz_solution(ns, title, rows, foot, row_h=621792):
    """λύση κουίζ: ερώτηση, σωστή απάντηση, γιατί"""
    mark_sol(ns, nxt())
    s = new(nxt(), "ΛΥΣΗ ΑΣΚΗΣΗΣ " + " · ".join(map(str, ns)), title)
    table(s, L, TOP, [3931920, 2286000, W - 6217920], [["Ερώτηση", "Σωστή απάντηση", "Γιατί"]] + rows,
          size=10.5, row_h=row_h, hl={(i + 1, 1): BLUE for i in range(len(rows))})
    footer(s, "ΘΥΜΗΣΟΥ", foot)
    return s

PROMPT = re.compile(r"^[A-Z]:\\[^>]*>")
def cmd_src(src):
    """οι γραμμές χωρίς » είναι εντολές: παίρνουν μπροστά «> », εκτός αν έχουν ήδη ολόκληρο το prompt"""
    return "\n".join(l if l.startswith("»") or not l or PROMPT.match(l) else "> " + l for l in src.strip("\n").split("\n"))

def term_solution(left, right, foot, size=9):
    """λύση ασκήσεων τερματικού: (αρ., εντολές και έξοδος, απαντήσεις) αριστερά και δεξιά.
    Χωρίς right: ο κώδικας αριστερά, οι απαντήσεις δεξιά."""
    ns = [left[0]] + ([right[0]] if right else [])
    mark_sol(ns, nxt())
    s = new(nxt(), "ΛΥΣΗ ΑΣΚΗΣ" + ("ΕΩΝ " if right else "ΗΣ ") + " · ".join(map(str, ns)), "Τι γράφεις και τι βλέπεις")
    if right:
        for (n, src, ans), x, w in ((left, COL_L, COL_W), (right, COL_R, COL_RW)):
            b = code(s, x, TOP, w, cmd_src(src), size=size, tag=f"ΑΣΚΗΣΗ {n} · ΕΝΤΟΛΕΣ ΚΑΙ ΕΞΟΔΟΣ")
            card(s, x, b + 137160, w, f"Απαντήσεις άσκησης {n}", ans, tone="gold", size=10.5)
    else:
        n, src, ans = left
        code(s, COL_L, TOP, COL_W, cmd_src(src), size=size, tag=f"ΑΣΚΗΣΗ {n} · ΕΝΤΟΛΕΣ ΚΑΙ ΕΞΟΔΟΣ")
        card(s, COL_R, TOP + 283464, COL_RW, f"Απαντήσεις άσκησης {n}", ans, tone="gold", size=11)
    footer(s, "ΘΥΜΗΣΟΥ", foot)
    return s

def quiz_slide(n, kicker, title, intro, head, rows, foot, widths=None):
    """διαφάνεια κουίζ: εκφώνηση και πίνακας ερωτήσεων (οι απαντήσεις στην επόμενη)"""
    mark(n, nxt())
    s = new(nxt(), kicker, title, lab=[n])
    y = prompt(s, L, TOP, W, intro) + 182880
    table(s, L, y, widths or [6400800, W - 6400800], [head] + rows, size=11.5, row_h=429768)
    footer(s, "ΒΟΗΘΕΙΑ", foot)
    return s

# 1 · τίτλος
for sh in K.prs.slides[0].shapes:
    if not sh.has_text_frame: continue
    t = sh.text_frame.text
    paras = sh.text_frame.paragraphs
    def put(p, text):
        p.runs[0].text = text
        for x in p.runs[1:]: x.text = ""
    if t.startswith("ΕΡΓΑΣΤΗΡΙΟ 4"): put(paras[0], f"ΕΡΓΑΣΤΗΡΙΟ 5 · ΕΝΟΤΗΤΑ 2.1.Β.3 · {DATE}")
    elif t.startswith("Αλγόριθμοι"): put(paras[0], "Η Γραμμή"); put(paras[1], "εντολών")
    elif t.startswith("Χρονοδρομολόγηση"): put(paras[0], "MS-DOS και cmd: φάκελοι, αρχεία, εργαλεία συστήματος και αρχεία .bat")
    elif t.startswith("Παιχνίδι"): put(paras[0], f"Θεωρία σε {K.STEPS} μικρά βήματα + 15 ασκήσεις με λύσεις · το έργο web με ένα .bat · {N_SLIDES} διαφάνειες")

# 2 · οι ασκήσεις (ο πίνακας μπαίνει στο τέλος)
overview = new(nxt(), "ΠΩΣ ΔΟΥΛΕΥΟΥΜΕ", "Οι 15 ασκήσεις του εργαστηρίου")
footer(overview, "ΠΩΣ", "Διαβάζεις το βήμα → λύνεις στο site την άσκηση της ετικέτας **ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ** → ελέγχεις με τη **λύση** που ακολουθεί.")

# βήμα 1: από το MS-DOS στο cmd
mark(1, nxt())
s = new(nxt(), step(1, "ΑΠΟ ΤΟ MS-DOS ΣΤΟ CMD"), "Η Γραμμή εντολών, από το 1981 ως σήμερα", lab=[1])
table(s, COL_L, TOP, [914400, COL_W - 914400], [
    ["Έτος", "Τι έγινε"],
    ["1981", "**MS-DOS** για τον IBM PC: μόνο εντολές, καθόλου ποντίκι"],
    ["1985", "**Windows 1.0**: γραφικό περιβάλλον «πάνω» στο DOS"],
    ["1995", "**Windows 95**: ακόμα με DOS από κάτω"],
    ["2001", "**Windows XP**: τέλος το DOS, μένει το **cmd.exe**"],
    ["2006", "**PowerShell**: το νέο κέλυφος των Windows"],
], mono=(0,), size=11, row_h=411480)
b = code(s, COL_R, TOP, COL_RW, '''
dir C:\\Users /b
''', size=14, tag="Η «ΓΡΑΜΜΑΤΙΚΗ» ΜΙΑΣ ΕΝΤΟΛΗΣ")
b = card(s, COL_R, b + 137160, COL_RW, "εντολή + όρισμα + παράμετροι",
         "**dir** = η εντολή · **C:\\Users** = σε ποιον φάκελο · **/b** = παράμετρος (διακόπτης): μόνο τα ονόματα.\n"
         "Βοήθεια: **dir /?** ή **help dir**. Κεφαλαία ή μικρά, το ίδιο.")
card(s, COL_R, b + 137160, COL_RW, "Πώς την ανοίγω",
     "**Win + R** → cmd → Enter, ή Έναρξη → «Γραμμή εντολών». Το παράθυρο ανοίγει στον φάκελό σου: **C:\\Users\\όνομα>**.", tone="gold")
footer(s, "ΓΙΑΤΙ ΑΚΟΜΑ;", "Αυτοματοποίηση με **.bat**, εργαλεία που δεν έχει το GUI, γρήγορη διάγνωση: ο τεχνικός ζει στη Γραμμή εντολών.")

quiz_solution([1], "Από το MS-DOS στο cmd: λύση", [
    ["Το MS-DOS κυκλοφόρησε το…", "1981", "Για τον πρώτο IBM PC. Μέχρι και τα Windows 98 «πατούσαν» πάνω του."],
    ["Στο dir /b, το /b είναι…", "παράμετρος (διακόπτης)", "Αλλάζει τι κάνει η εντολή: δείχνει **μόνο τα ονόματα**."],
    ["Πώς βλέπω τη βοήθεια μιας εντολής;", "και τα δύο", "**dir /?** ή **help dir**."],
    ["DIR και dir είναι…", "το ίδιο", "Το cmd δεν ξεχωρίζει κεφαλαία. Στο **Linux** όμως Desktop ≠ desktop!"],
    ["Το cmd.exe των σημερινών Windows είναι…", "πρόγραμμα που κρατά τις εντολές του DOS", "Από το XP δεν υπάρχει DOS από κάτω: το cmd κρατά τις εντολές για **συμβατότητα**."],
    ["Το νεότερο κέλυφος των Windows;", "PowerShell", "Εντολές (cmdlets) όπως **Get-ChildItem** (βήμα 10)."],
], "Μια εντολή = **όνομα** + **ορίσματα** + **παράμετροι** (με / στα Windows, με - στο Linux).", row_h=548640)

# βήμα 2: διαδρομές
mark(2, nxt()); mark(4, nxt())
s = new(nxt(), step(2, "ΔΙΑΔΡΟΜΕΣ"), "Πού βρίσκομαι και πώς πάω αλλού", lab=[2, 4])
y = prompt(s, L, TOP, W, "Το prompt **C:\\Users\\mathitis>** σου λέει πού βρίσκεσαι. Μια διαδρομή είναι **απόλυτη** αν ξεκινά από τη ρίζα "
           "(C:\\ ή σκέτο \\) και **σχετική** αν ξεκινά από εκεί που είσαι.", tag="Η ΙΔΕΑ") + 182880
code(s, COL_L, y, COL_W - 914400, '''
C:\\
└── Users
    └── mathitis        # εδώ ξεκινάς
        ├── Desktop
        ├── Documents
        └── Downloads
''', size=12, tag="ΤΟ ΔΕΝΤΡΟ ΤΟΥ ΕΞΟΜΟΙΩΤΗ")
table(s, COL_R - 914400, y, [3017520, COL_RW + 914400 - 3017520], [
    ["Γράφεις", "Τι κάνει"],
    ["cd Desktop", "**σχετική**: μπαίνει στο Desktop"],
    ["cd ..", "ένα επίπεδο **πάνω**"],
    ["cd ..\\Documents", "πάνω, και μετά στα Documents"],
    ["cd \\", "στη **ρίζα** του δίσκου (C:\\)"],
    ["cd C:\\Users\\mathitis\\Downloads", "**απόλυτη**: από όπου κι αν είσαι"],
    ["cd %USERPROFILE%", "πίσω στον φάκελό σου"],
], mono=(0,), size=10.5, row_h=393192)
footer(s, "ΚΟΛΠΑ", "**Tab** συμπληρώνει το όνομα, **↑** φέρνει την προηγούμενη εντολή. Όνομα με κενά σε εισαγωγικά: cd \"Program Files\"")

quiz_solution([4], "Απόλυτη ή σχετική: λύση", [
    ["C:\\Users\\mathitis\\Desktop", "Απόλυτη", "Ξεκινά από τον δίσκο **C:**."],
    ["Desktop\\SAEK", "Σχετική", "Ξεκινά από τον φάκελο που είσαι τώρα."],
    ["..\\Documents", "Σχετική", "Ένα επίπεδο πάνω από εκεί που είσαι, και μετά Documents."],
    ["\\Windows\\System32", "Απόλυτη", "Το **\\** στην αρχή = «από τη ρίζα του δίσκου»."],
    ["%USERPROFILE%\\Music", "Απόλυτη", "Η μεταβλητή γίνεται **C:\\Users\\mathitis**."],
    ["Από το Desktop: cd ..\\..", "C:\\Users", "Κάθε .. ανεβαίνει ένα επίπεδο: Desktop → mathitis → **Users**."],
], "Κοίτα μόνο την **αρχή** της διαδρομής: C:\\ ή \\ = απόλυτη · όνομα, . ή .. = σχετική.", row_h=548640)

# βήμα 3: φάκελοι
mark(2, nxt()); mark(3, nxt())
s = new(nxt(), step(3, "ΦΑΚΕΛΟΙ"), "dir, md, rd, tree, cls", lab=[2, 3])
code(s, COL_L, TOP, COL_W, '''
dir                  # τι έχει ο φάκελος
dir /b               # μόνο τα ονόματα
md Proxeiro\\a\\b      # όλη η διαδρομή μαζί
tree Proxeiro        # σαν δέντρο (/f και τα αρχεία)
rd Proxeiro          # μόνο αν είναι άδειος
rd /s /q Proxeiro    # με τα περιεχόμενα, χωρίς ερώτηση
cls                  # καθαρή οθόνη
''', size=11, tag="ΑΣΚΗΣΕΙΣ 2 ΚΑΙ 3 · CMD")
cards(s, COL_R, TOP, COL_RW, [
    ("Δύο ονόματα, μία εντολή", "**md** = **mkdir** · **rd** = **rmdir**. Στο Linux: mkdir, rmdir και rm -r."),
    ("Άσκηση 2", "Περπάτα: Desktop → Documents → C:\\ → Downloads. Τι πρόγραμμα έχουν τα Downloads; Πόσα αρχεία τα Documents;", "gold"),
    ("Άσκηση 3", "Φτιάξε το Proxeiro\\a\\b με **μία** εντολή, δες το με tree και σβήσ' το. Τι λέει το σκέτο rd;", "gold"),
])
footer(s, "ΠΡΟΣΟΧΗ", "Ό,τι σβήνεις από τη Γραμμή εντολών **δεν πάει στον Κάδο ανακύκλωσης**: χάνεται.")

term_solution(
    (2, '''
C:\\Users\\mathitis>cd Desktop
C:\\Users\\mathitis\\Desktop>cd ..\\Documents
C:\\Users\\mathitis\\Documents>dir
»06/10/2026  10:15        50 programma.txt
»06/10/2026  10:15        73 sxolio.txt
»               2 File(s)       123 bytes
C:\\Users\\mathitis\\Documents>cd \\
C:\\>cd C:\\Users\\mathitis\\Downloads
C:\\Users\\mathitis\\Downloads>dir /b
»foto.jpg
»setup.exe
''', "Downloads: **setup.exe** (και μια εικόνα) · Documents: **2** αρχεία\n"
     "Στη ρίζα το prompt γράφει **C:\\>**. Δες πώς αλλάζει το prompt σε κάθε cd."),
    (3, '''
md Proxeiro\\a\\b
tree Proxeiro
»C:\\USERS\\MATHITIS\\PROXEIRO
»└───a
»    └───b
rd Proxeiro
»The directory is not empty.
rd /s Proxeiro
»Proxeiro, Are you sure (Y/N)? y   # στα αληθινά Windows
''', "Το σκέτο rd: **The directory is not empty.**\n"
     "Το md έφτιαξε **3** φακέλους (Proxeiro, a, b) με μία εντολή."),
    "Το **/q** (quiet) στο rd /s σβήνει χωρίς ερώτηση: χρήσιμο σε .bat, επικίνδυνο στα χέρια μας.")

# βήμα 4: αρχεία
mark(5, nxt())
s = new(nxt(), step(4, "ΑΡΧΕΙΑ"), "copy, move, ren, type, del", lab=[5])
code(s, COL_L, TOP, COL_W, '''
copy ergasia.txt ergasia_old.txt   # αντίγραφο
md Archeio
move ergasia_old.txt Archeio       # αλλάζει θέση
ren Archeio\\ergasia_old.txt palia.txt
type Archeio\\palia.txt             # δείχνει το κείμενο
del Archeio\\palia.txt              # σβήνει αρχείο
''', size=10.5, tag="ΑΣΚΗΣΗ 5 · ΣΤΟ DESKTOP")
table(s, COL_R, TOP, [1188720, (COL_RW - 1188720) * 3 // 5, (COL_RW - 1188720) * 2 // 5], [
    ["Εντολή", "Τι κάνει", "Linux"],
    ["copy", "αντίγραφο: το αρχικό **μένει**", "cp"],
    ["move", "αλλάζει **θέση** (και όνομα)", "mv"],
    ["ren", "αλλάζει **μόνο όνομα**", "mv"],
    ["type", "δείχνει το περιεχόμενο", "cat"],
    ["del", "σβήνει **αρχεία**, όχι φακέλους", "rm"],
], mono=(0, 2), size=11, row_h=411480)
footer(s, "ΣΤΟ REN", "Γράφεις **μόνο το νέο όνομα**, όχι διαδρομή: ren Archeio\\a.txt b.txt (και **όχι** ...Archeio\\b.txt).")

# βήμα 5: μασκές
mark(6, nxt())
s = new(nxt(), step(5, "ΜΑΣΚΕΣ"), "Τα μπαλαντέρ * και ?", lab=[6])
y = prompt(s, L, TOP, W, "Το **\\*** ταιριάζει με **όσους χαρακτήρες θες** (και κανέναν). Το **?** ταιριάζει με **ακριβώς έναν**. "
           "Με μια μάσκα, μία εντολή δουλεύει σε πολλά αρχεία μαζί.", tag="Η ΙΔΕΑ") + 182880
table(s, COL_L, y, [1645920, 2011680, COL_W - 3657600], [
    ["Μάσκα", "Πιάνει", "Δεν πιάνει"],
    ["*.tmp", "test1.tmp, test10.tmp", "ergasia.txt"],
    ["test?.tmp", "test1.tmp, test2.tmp", "test10.tmp"],
    ["*.*", "όλα τα αρχεία", "—"],
    ["e*.txt", "ergasia.txt", "sxolio.txt"],
], mono=(0, 1, 2), size=10.5, row_h=393192)
code(s, COL_R, y, COL_RW, '''
dir *.tmp            # δες ΠΡΙΝ σβήσεις
del test?.tmp
ren *.tmp *.bak      # αλλάζει καταλήξεις
copy *.txt Backup    # πολλά σε φάκελο
''', size=11, tag="ΑΣΚΗΣΗ 6")
footer(s, "ΠΡΟΣΟΧΗ", "Το **del \\*.\\*** σβήνει όλα τα αρχεία του φακέλου. Τρέξε πρώτα **dir** με την ίδια μάσκα για να δεις τι θα σβηστεί!")

term_solution(
    (5, '''
cd Desktop
copy ergasia.txt ergasia_old.txt
»        1 file(s) copied.
md Archeio
move ergasia_old.txt Archeio
»        1 file(s) moved.
ren Archeio\\ergasia_old.txt palia.txt
type Archeio\\palia.txt
»Εργασία: Γράψε 3 λειτουργικά συστήματα για κινητά.
dir /b
»Archeio
»Chrome.lnk
»ergasia.txt
''', "Θέση αλλάζει το **move**, μόνο όνομα το **ren**.\n"
     "Το ergasia.txt **υπάρχει ακόμα**: το copy κρατά το αρχικό."),
    (6, '''
echo a > test1.tmp
echo b > test2.tmp
echo c > test10.tmp
dir test?.tmp
»09/11/2026  23:37         2 test1.tmp
»09/11/2026  23:37         2 test2.tmp
»               2 File(s)          4 bytes
del test?.tmp
ren *.tmp *.bak
dir /b
»Chrome.lnk
»ergasia.txt
»test10.bak
''', "Το dir test?.tmp έδειξε **2** αρχεία.\n"
     "Γλίτωσε το **test10.tmp**: το «10» είναι δύο χαρακτήρες.\n"
     "Το **?** ταιριάζει με ακριβώς **1** χαρακτήρα."),
    "Το **echo κείμενο > αρχείο** φτιάχνει αρχείο κειμένου. Το **>>** προσθέτει στο τέλος του.")

# βήμα 6: attrib
mark(7, nxt())
s = new(nxt(), step(6, "ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ"), "attrib: κρυφό και μόνο για ανάγνωση", lab=[7])
code(s, COL_L, TOP, COL_W, '''
attrib mystiko.txt           # δες τα χαρακτηριστικά
attrib +h +r mystiko.txt     # κρυφό + μόνο ανάγνωση
dir /a                       # δείχνει και τα κρυφά
attrib -h -r mystiko.txt     # τα βγάζεις
''', size=11, tag="ΑΣΚΗΣΗ 7")
table(s, COL_R, TOP, [731520, 1554480, COL_RW - 2286000], [
    ["", "Σημαίνει", "Τι κάνει"],
    ["A", "Archive", "άλλαξε από το τελευταίο αντίγραφο ασφαλείας"],
    ["R", "Read-only", "**δεν αλλάζει, δεν σβήνεται**"],
    ["H", "Hidden", "**δεν φαίνεται** στο dir"],
    ["S", "System", "αρχείο του ίδιου του ΛΣ"],
], mono=(0,), size=11, row_h=466344)
footer(s, "ΔΕΝ ΕΙΝΑΙ ΑΣΦΑΛΕΙΑ", "Το **+H** απλώς κρύβει: όποιος γράψει **dir /a** το βλέπει. Για προστασία υπάρχουν οι λογαριασμοί και τα δικαιώματα.")

# βήμα 7: αντίγραφα ασφαλείας
mark(8, nxt())
s = new(nxt(), step(7, "ΑΝΤΙΓΡΑΦΑ ΑΣΦΑΛΕΙΑΣ"), "xcopy και robocopy", lab=[8])
b = code(s, L, TOP, W, '''
xcopy Documents Backup\\Documents /e /i      # όλος ο φάκελος, με τους υποφακέλους
robocopy Pictures Backup\\Pictures /e        # μόνο ό,τι λείπει ή άλλαξε
robocopy Pictures Backup\\Pictures /e        # 2η φορά: όλα «Skipped»
tree Backup /f                              # δες το αντίγραφο
''', size=12, tag="ΑΣΚΗΣΗ 8 · ΑΠΟ ΤΟΝ ΦΑΚΕΛΟ ΣΟΥ (C:\\USERS\\MATHITIS)")
card(s, COL_L, b + 182880, COL_W, "xcopy",
     "Το copy αντιγράφει μόνο αρχεία. Το xcopy και **φακέλους**: **/e** με όλους τους υποφακέλους, **/i** ο προορισμός είναι φάκελος, **/y** χωρίς ερώτηση.")
card(s, COL_R, b + 182880, COL_RW, "robocopy",
     "«Robust copy»: αντιγράφει **μόνο ό,τι λείπει ή άλλαξε** και γράφει σύνοψη. Με **/mir** ο προορισμός γίνεται ίδιος με την πηγή (σβήνει και τα επιπλέον!).", tone="gold")
footer(s, "ΚΑΝΟΝΑΣ 3-2-1", "**3** αντίγραφα των δεδομένων, σε **2** διαφορετικά μέσα, το **1** σε άλλο μέρος.")

term_solution(
    (7, '''
echo kodikos > mystiko.txt
attrib +h +r mystiko.txt
attrib mystiko.txt
»A     HR        C:\\Users\\mathitis\\Desktop\\mystiko.txt
dir /a /b
»mystiko.txt              # μόνο με το /a
del mystiko.txt
»Could Not Find C:\\Users\\mathitis\\Desktop\\mystiko.txt
attrib -h -r mystiko.txt
del mystiko.txt
''', "Κρυφό = **H** · μόνο ανάγνωση = **R** · και τα κρυφά με **dir /a**.\n"
     "Όσο είναι +H, το del **δεν το βλέπει**. Όσο είναι +R: **Access is denied**."),
    (8, '''
xcopy Documents Backup\\Documents /e /i
»Documents\\sxolio.txt
»Documents\\programma.txt
»2 File(s) copied
robocopy Pictures Backup\\Pictures /e     # 2η φορά
»               Total    Copied   Skipped
»   Files :         1         0         1
tree Backup /f
»├───Documents
»│       sxolio.txt
»│       programma.txt
»└───Pictures
»        diakopes.png
''', "xcopy: **2** αρχεία · 2ο robocopy: Skipped **1**\n"
     "**/e**: και οι άδειοι υποφάκελοι (το /s μόνο όσοι έχουν αρχεία)."),
    "Το robocopy συγκρίνει πηγή και προορισμό: η 2η φορά είναι **σχεδόν ακαριαία**, γιατί δεν ξαναγράφει τίποτα.")

# άσκηση 9: ποια εντολή κάνει τι
JOBS = [("Δείχνει το περιεχόμενο ενός αρχείου κειμένου", "type", "Το type είναι το cat των Windows."),
        ("Αντιγράφει ολόκληρο φάκελο με τους υποφακέλους του", "xcopy", "Το copy παίρνει μόνο αρχεία. Και το robocopy θα έκανε."),
        ("Δείχνει τους φακέλους σαν δέντρο", "tree", "Με /f δείχνει και τα αρχεία."),
        ("Κάνει ένα αρχείο κρυφό", "attrib", "attrib +h αρχείο."),
        ("Αλλάζει όνομα σε αρχείο, όχι θέση", "ren", "Για θέση, move."),
        ("Φτιάχνει φάκελο", "md", "md = mkdir."),
        ("Σβήνει αρχεία (όχι φακέλους)", "del", "Για φακέλους, rd."),
        ("Πηγαίνει ένα αρχείο σε άλλο φάκελο", "move", "Το αρχικό δεν μένει πίσω.")]
quiz_slide(9, "ΑΣΚΗΣΗ 9 · ΜΕΤΡΙΟ", "Ποια εντολή κάνει τι;",
           "Για κάθε δουλειά διάλεξε μία από: **type · xcopy · tree · attrib · ren · md · del · move**.",
           ["Δουλειά", "Εντολή"], [[j, "___"] for j, _, _ in JOBS], "Ξαναδές τα **βήματα 3 έως 7**.", widths=[8229600, W - 8229600])
quiz_solution([9], "Ποια εντολή κάνει τι: λύση", [[j, a, why] for j, a, why in JOBS],
              "copy = αρχεία, **xcopy** = και φάκελοι · ren = όνομα, **move** = θέση · **attrib** = χαρακτηριστικά.", row_h=484632)

# βήμα 8: εργαλεία συστήματος
mark(10, nxt())
s = new(nxt(), step(8, "ΕΡΓΑΛΕΙΑ ΣΥΣΤΗΜΑΤΟΣ"), "Ό,τι δεν δείχνει εύκολα το GUI", lab=[10])
table(s, COL_L, TOP, [2743200, COL_W + 457200 - 2743200], [
    ["Εντολή", "Τι δείχνει ή κάνει"],
    ["systeminfo", "ΛΣ, έκδοση, επεξεργαστής, **RAM**, ώρα εκκίνησης"],
    ["ipconfig /all", "IP, **MAC**, DHCP, DNS"],
    ["driverquery", "οι **οδηγοί συσκευών** (drivers)"],
    ["sfc /scannow", "ελέγχει και επιδιορθώνει τα αρχεία του ΛΣ"],
    ["tasklist · taskkill", "οι διεργασίες (Εργαστήριο 2)"],
    ['... | find "λέξη"', "κρατά μόνο τις γραμμές που θες"],
], mono=(0,), size=11, row_h=438912)
cards(s, COL_R + 457200, TOP, COL_RW - 457200, [
    ("Ως διαχειριστής", "Μερικά εργαλεία (sfc) θέλουν **δεξί κλικ στη Γραμμή εντολών → Εκτέλεση ως διαχειριστής**. Ο τίτλος γράφει «Administrator:». Μόνο όταν χρειάζεται!"),
    ("Άσκηση 10", "Βρες τη RAM, τη MAC, τον οδηγό της κάρτας δικτύου και τι χρειάζεται το sfc. Κλείσε και το κολλημένο paixnidi.exe.", "gold"),
])
footer(s, "ΣΤΟ PC", "Στον υπολογιστή της σχολής δοκίμασε **systeminfo** και **ipconfig /all**: ποια RAM και ποια MAC έχει ο δικός σου;")

term_solution(
    (10, '''
systeminfo | find "Total Physical Memory"
»Total Physical Memory:     16,183 MB
ipconfig /all
»   Description . . . : Intel(R) Ethernet Connection (14) I219-LM
»   Physical Address. : 8C-04-BA-3F-21-7D
driverquery
»Module Name  Display Name                  Driver Type
»e1dexpress   Intel(R) PRO/1000 PCI Express Kernel
sfc /scannow
»You must be an administrator running a console session in order to
»use the sfc utility.
taskkill /im paixnidi.exe /f
»SUCCESS: The process "paixnidi.exe" with PID 17396 has been terminated.
''', "RAM: **16.183 MB** (περίπου 16 GB)\n"
     "MAC: **8C-04-BA-3F-21-7D** (η «ταυτότητα» της κάρτας δικτύου)\n"
     "Οδηγός της κάρτας δικτύου: **e1dexpress**\n"
     "Το sfc θέλει **δικαιώματα διαχειριστή**. Ως διαχειριστής θα έγραφε: «Windows Resource Protection did not find any integrity violations.»"),
    None, "Το **| find** κρατά μόνο τις γραμμές που περιέχουν τη λέξη: η λέξη πάει **σε εισαγωγικά**.")

# βήμα 9: αρχεία .bat
mark(11, nxt()); mark(12, nxt())
s = new(nxt(), step(9, "ΑΡΧΕΙΑ ΔΕΣΜΗΣ (.BAT)"), "Γράφεις μία φορά, τρέχει όσες θες", lab=[11, 12])
b = code(s, COL_L, TOP, COL_W, '''
@echo off
rem Στήνει τη δομή ενός έργου web
md mysite\\css
md mysite\\js
md mysite\\images
type nul > mysite\\index.html
echo Etoimo!
''', size=11, tag="SITE.BAT · ΤΟ ΣΕΝΑΡΙΟ ΤΗΣ ΗΜΕΡΑΣ")
card(s, COL_L, b + 137160, COL_W, "Πώς το γράφω",
     "Στο **Σημειωματάριο**: Αποθήκευση ως → «Όλα τα αρχεία» → **site.bat**. "
     "Ή από τη Γραμμή εντολών: echo md mysite\\css **>>** site.bat (το **^>** γράφει μέσα το σύμβολο >).", size=10.5)
table(s, COL_R, TOP, [1920240, COL_RW - 1920240], [
    ["Γράφεις", "Τι κάνει"],
    ["@echo off", "κρύβει τις εντολές, φαίνονται μόνο τα αποτελέσματα"],
    ["rem … ή :: …", "σχόλιο: δεν εκτελείται"],
    ["echo κείμενο", "εμφανίζει μήνυμα"],
    ["pause", "«Press any key to continue…»"],
    ["%1", "η 1η παράμετρος: site.bat demo → %1 = demo"],
    ["site  ή  call site.bat", "το τρέχει"],
], mono=(0,), size=10.5, row_h=420624)
footer(s, "ΠΡΟΣΟΧΗ", "Ένα .bat κάνει **ό,τι γράφει**, χωρίς ερώτηση. Μην τρέχεις .bat που δεν ξέρεις τι περιέχει!")

term_solution(
    (11, '''
echo @echo off > hello.bat
echo echo Kalimera! >> hello.bat
echo ver >> hello.bat
echo date /t >> hello.bat
type hello.bat
»@echo off
»echo Kalimera!
»ver
»date /t
hello
»Kalimera!
»Microsoft Windows [Version 10.0.22631.4317]
»Δευ 09/11/2026
''', "Το @echo off: **δεν εμφανίζει τις εντολές**, μόνο τα αποτελέσματα.\n"
     "Κατάληξη: **.bat** (ή .cmd) · έτρεξαν **3** εντολές."),
    (12, '''
echo @echo off > site.bat
echo md mysite\\css >> site.bat
echo md mysite\\js >> site.bat
echo md mysite\\images >> site.bat
echo type nul ^> mysite\\index.html >> site.bat
echo echo Etoimo! >> site.bat
site
»Etoimo!
tree mysite /f > tree.txt
type tree.txt
»│   index.html
»├───css
»├───js
»└───images
''', "Το mysite έχει **3** υποφακέλους και το **index.html**.\n"
     "2η φορά: «A subdirectory or file mysite\\css **already exists**.»"),
    "Το **> tree.txt** γράφει την έξοδο σε αρχείο αντί για την οθόνη: έτσι κρατάς το αποτέλεσμα για το παραδοτέο.")

# άσκηση 13: τι θα γίνει αν
WHAT = [("del *.* μέσα στο Desktop", "σβήνει όλα τα αρχεία του", "Μόνο αρχεία, όχι φακέλους. Στα αληθινά Windows ρωτά πρώτα «Are you sure (Y/N)?»."),
        ("rd Archeio, ενώ έχει αρχεία", "«The directory is not empty.»", "Το σκέτο rd σβήνει μόνο άδειους φακέλους: θέλει **rd /s**."),
        ("md a\\b\\c, ενώ δεν υπάρχει ούτε ο a", "φτιάχνει και τους τρεις", "Το md φτιάχνει **όλη τη διαδρομή** μαζί."),
        ("ren ergasia.txt Archeio\\nea.txt", "λάθος σύνταξης", "Στο ren γράφεις **μόνο** το νέο όνομα. Για θέση: move."),
        ("xcopy Documents Backup\\Documents (χωρίς /i)", "ρωτά «F = file, D = directory?»", "Το **/i** του λέει από πριν ότι ο προορισμός είναι φάκελος."),
        ("dir test?.tmp (υπάρχουν test1.tmp, test10.tmp)", "δείχνει μόνο το test1.tmp", "Το ? = **ακριβώς ένας** χαρακτήρας. Το «10» είναι δύο.")]
quiz_slide(13, "ΑΣΚΗΣΗ 13 · ΔΥΣΚΟΛΟ", "Τι θα γίνει αν…;",
           "Πρόβλεψε τι θα κάνει κάθε εντολή **πριν** τη δοκιμάσεις. Οι επιλογές είναι στο site.",
           ["Εντολή", "Τι θα γίνει;"], [[q, "___"] for q, _, _ in WHAT], "Ξαναδές τα **βήματα 3, 4, 5 και 7**.", widths=[7315200, W - 7315200])
quiz_solution([13], "Τι θα γίνει αν: λύση", [[q, a, why] for q, a, why in WHAT],
              "Πριν από μια επικίνδυνη εντολή, τρέξε **dir** με την ίδια διαδρομή ή μάσκα.", row_h=576072)

# βήμα 10: PowerShell
mark(14, nxt())
s = new(nxt(), step(10, "POWERSHELL"), "Το νέο κέλυφος: PowerShell", lab=[14])
table(s, COL_L, TOP, [1463040, 2286000, COL_W - 3749040 + 457200], [
    ["cmd", "PowerShell", "Linux (bash)"],
    ["dir", "Get-ChildItem", "ls"], ["cd", "Set-Location", "cd"], ["type", "Get-Content", "cat"], ["copy", "Copy-Item", "cp"],
    ["del", "Remove-Item", "rm"], ["tasklist", "Get-Process", "ps"], ["taskkill", "Stop-Process", "kill"],
], mono=(0, 1, 2), size=11, row_h=402336)
cards(s, COL_R + 457200, TOP, COL_RW - 457200, [
    ("Ρήμα-Ουσιαστικό", "**Get** = δείξε · **Set** = όρισε · **Copy** = αντίγραψε · **Remove** = σβήσε · **Stop** = σταμάτα. Τα παλιά dir, cd, copy δουλεύουν κι εδώ (aliases)."),
    ("Αντικείμενα, όχι κείμενο", "Get-Process | Sort-Object CPU: ταξινομεί τις διεργασίες κατά χρήση επεξεργαστή, χωρίς να «κόβεις» στήλες όπως με το sort /+N.", "gold"),
])
footer(s, "ΣΤΟ PC", "Πάτα **Win**, γράψε **powershell**. Το prompt γίνεται **PS C:\\Users\\…>**. Δοκίμασε Get-ChildItem και Get-Process.")

quiz_solution([14], "Από το cmd στο PowerShell: λύση", [
    ["dir", "Get-ChildItem", "Τα «παιδιά» (περιεχόμενα) ενός φακέλου."],
    ["cd", "Set-Location", "Ορίζει πού βρίσκεσαι."],
    ["type", "Get-Content", "Το περιεχόμενο ενός αρχείου."],
    ["copy", "Copy-Item", "Αντιγράφει αρχείο ή φάκελο."],
    ["del", "Remove-Item", "Σβήνει αρχείο ή φάκελο."],
    ["tasklist", "Get-Process", "Οι διεργασίες."],
    ["taskkill", "Stop-Process", "Σταματά μια διεργασία."],
], "Στο PowerShell το **Get-Help** (π.χ. Get-Help Get-Process) είναι το /? του cmd.", row_h=502920)

# άσκηση 15: για το σπίτι
mark(15, nxt())
s = new(nxt(), "ΑΣΚΗΣΗ 15 · ΓΙΑ ΤΟ ΣΠΙΤΙ", "Το backup.bat", lab=[15])
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
    ("Μπόνους", "Τι θα έκανες για να τρέχει **κάθε μέρα** μόνο του;"),
])
footer(s, "ΓΙΑΤΙ /y", "Στο 2ο τρέξιμο το xcopy θα ρωτούσε «Overwrite …? (Yes/No/All)» για κάθε αρχείο. Το **/y** απαντά «ναι» από πριν.")
term_solution(
    (15, '''
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
     "Μπόνους: **Χρονοδρομολόγηση εργασιών** (Task Scheduler) → Δημιουργία βασικής εργασίας → Καθημερινά → backup.bat."),
    None, "Ο Task Scheduler είναι κι αυτός ένας «χρονοδρομολογητής», όπως του Εργαστηρίου 3, αλλά για προγράμματα που τρέχουν σε ώρες που ορίζεις.")

# στο PC: το παραδοτέο
s = new(nxt(), "ΣΤΟ PC · 30΄", "Το έργο web στον αληθινό υπολογιστή")
b = code(s, COL_L, TOP, COL_W, '''
cd %USERPROFILE%\\Documents
md LS_Eponymo
cd LS_Eponymo
notepad site.bat     # γράψε το site.bat, Αποθήκευση
site
tree mysite /f > tree.txt
type tree.txt
''', size=11, tag="WIN + R → CMD → ENTER")
card(s, COL_L, b + 137160, COL_W, "Το site.bat σου",
     "Ξεκινά με **@echo off** και ένα **rem** με το όνομά σου. Φτιάχνει mysite με css, js, images και ένα άδειο index.html. Τελειώνει με echo Etoimo!", size=10.5)
table(s, COL_R, TOP, [457200, COL_RW - 457200], [
    ["#", "Παραδοτέο: ανέβασε στον φάκελό σου"],
    ["1", "Το **site.bat**"],
    ["2", "Το **tree.txt** με το δέντρο του mysite"],
    ["3", "Μπόνους: ένα **backup.bat** με robocopy"],
    ["4", "Μία γραμμή: τι κάνει το @echo off;"],
], mono=(0,), size=11, row_h=457200)
footer(s, "ΣΤΟ ΣΧΟΛΙΚΟ PC", "Δούλευε **μόνο** μέσα στον φάκελό σου (Documents\\LS_Eponymo). Τίποτα από rd /s ή del *.* έξω από αυτόν!")

# σύνοψη
s = new(nxt(), "ΣΥΝΟΨΗ", "Τι κρατάμε από σήμερα")
cards(s, COL_L, TOP, COL_W, [
    ("Διαδρομές", "**Απόλυτη** από τη ρίζα (C:\\...), **σχετική** από εκεί που είσαι (.., Desktop\\...)."),
    ("Φάκελοι και αρχεία", "dir · cd · md · rd · tree · copy · move · ren · type · del · μασκές **\\*** και **?**"),
    ("Αντίγραφα ασφαλείας", "**attrib** για +R / +H · **xcopy /e /i** · **robocopy** (μόνο ό,τι άλλαξε)."),
])
cards(s, COL_R, TOP, COL_RW, [
    ("Εργαλεία", "systeminfo · ipconfig /all · driverquery · sfc /scannow (διαχειριστής)", "gold"),
    (".bat και PowerShell", "Εντολές σε αρχείο, με **@echo off**. PowerShell: **Get-ChildItem**, **Get-Process**…", "gold"),
    (f"Επόμενο εργαστήριο · {NEXT}", "Τα **Windows με γραφικό περιβάλλον**: εκδόσεις 1.x–11, Εξερεύνηση αρχείων, συμπίεση, εγκατάσταση εφαρμογών.", "gold"),
])
footer(s, "ΕΡΩΤΗΣΗ", "Ποια η διαφορά copy και xcopy; Το **xcopy** αντιγράφει και **φακέλους**.")

# πίνακας ασκήσεων στη 2η διαφάνεια
NAMES = ["Από το MS-DOS στο cmd", "Περπάτημα στους φακέλους", "Φτιάξε και σβήσε φακέλους", "Απόλυτη ή σχετική;",
         "Αντιγραφή, μετακίνηση, μετονομασία", "Οι μασκές * και ?", "Κρυφό και μόνο για ανάγνωση", "xcopy και robocopy",
         "Ποια εντολή κάνει τι;", "Εργαλεία συστήματος", "Το πρώτο μου .bat", "Το έργο web με ένα .bat",
         "Τι θα γίνει αν…;", "Από το cmd στο PowerShell", "Το backup.bat"]
LEVELS = ["Εύκολο", "Εύκολο", "Εύκολο", "Εύκολο", "Μέτριο", "Μέτριο", "Μέτριο", "Μέτριο",
          "Μέτριο", "Μέτριο", "Εύκολο", "Ο στόχος", "Δύσκολο", "Εύκολο", "Για το σπίτι"]
lab_overview(overview, [(n, NAMES[n - 1], LEVELS[n - 1], f"{EX[n][0][-1]} → {EX[n][1]}") for n in range(1, 16)])
tf = box(overview, L, 5577840, W, 274320, MSO_ANCHOR.MIDDLE)
rich(tf.paragraphs[0], "Στήλη «Διαφάνεια»: **εκφώνηση → λύση**.", 11, MUTED)

finish("ΣΛΣ_Εργαστήριο05_MS-DOS_και_Γραμμή_εντολών.pptx", N_SLIDES, "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ")
print("REFS:", ", ".join(f'e5{"abcdefghijklmno"[n - 1]}: ["5", {sorted(set(EX[n][0]))}]' for n in range(1, 16)))
