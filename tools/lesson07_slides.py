# Φτιάχνει τις διαφάνειες του Μαθήματος 7 (Αναδρομή και βιβλιοθήκες), σταδιακή έκδοση.
# Χρήση:  py tools\lesson07_slides.py   → Desktop\ΣΑΕΚ_GLYFADA\Μάθημα07_Αναδρομή_και_βιβλιοθήκες.pptx
# Χρειάζεται matplotlib (pip install matplotlib): τα γραφήματα των διαφανειών βγαίνουν από τον ίδιο κώδικα που δείχνουν.
# Μετά: tools\convert.ps1 για PDF. Αν αλλάξει η σειρά των διαφανειών, διόρθωσε το REFS στο pylab.js.
import tempfile
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import slides_kit as K
from slides_kit import *

start("python-05-arxeia.pptx")       # παίρνει την 1η διαφάνεια και το θέμα από το Μάθημα 5
K.STEPS = 14
title_slide("ΜΑΘΗΜΑ 7 ΑΠΟ 15 · ΥΠΟΕΝΟΤΗΤΑ 2.3.Γ.3",
            "Αναδρομή και βιβλιοθήκες",
            "Συναρτήσεις που καλούν τον εαυτό τους — και κώδικας που έγραψαν άλλοι",
            "Θεωρία σε 14 μικρά βήματα + 18 ασκήσεις στο εργαστήριο          Διάρκεια: 4 ώρες (3η–6η)          24 διαφάνειες",
            "Προγραμματισμός Εφαρμογών Διαδικτύου & Παιχνιδιών (Python, Pygame) · Γ΄ εξάμηνο · Δευτέρα 16/11/2026")

TMP = tempfile.mkdtemp()
def chart(name, draw, w_in=5.0, h_in=3.1):
    """Σχεδιάζει ένα γράφημα με matplotlib και επιστρέφει το PNG του."""
    plt.rcParams.update({"font.family": "Segoe UI", "font.size": 10, "axes.spines.top": False, "axes.spines.right": False})
    fig = plt.figure(figsize=(w_in, h_in), dpi=200)
    draw()
    fig.tight_layout()
    path = os.path.join(TMP, name)
    fig.savefig(path)
    plt.close(fig)
    return path

def picture(s, path, x, y, w):
    pic = s.shapes.add_picture(path, x, y, width=w)
    pic.line.color.rgb = rgb(LINE); pic.line.width = 9525
    return y + pic.height

# 2 · στόχοι
s = new(2, "ΣΤΟΧΟΙ", "Τι θα ξέρεις στο τέλος")
goals = [
    "Να γράφεις **αναδρομικές** συναρτήσεις: παραγοντικό, Fibonacci, δυαδική αναζήτηση.",
    "Να χρησιμοποιείς έτοιμες βιβλιοθήκες με **import**: math, random, datetime.",
    "Να φτιάχνεις **δικά σου modules** και να ξέρεις τι κάνει το **if __name__ == \"__main__\"**.",
    "Να εγκαθιστάς πακέτα με **pip** και να κάνεις πράξεις με **NumPy** και γραφήματα με **Matplotlib**.",
    "Να **σχεδιάζεις** ένα πρόγραμμα σε μικρά υποπρογράμματα (τμηματικός προγραμματισμός).",
]
y = 1481328
for i, g in enumerate(goals, 1):
    shape(s, L, y, 457200, 237744, PAPER, LINE)
    tf = box(s, L, y, 457200, 237744, MSO_ANCHOR.MIDDLE)
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    run(tf.paragraphs[0], str(i), 8.5, BLUE, MONO)
    tf = box(s, 1152144, y - 18288, 10341864, 274320, MSO_ANCHOR.MIDDLE)
    rich(tf.paragraphs[0], g, 13, INK, SANS)
    y += 384048
y += 182880
card(s, L, y, 5303520, "Πώς δουλεύουμε",
     "Η θεωρία είναι χωρισμένη σε **14 μικρά βήματα**. Κάθε βήμα έχει πάνω δεξιά την ετικέτα **ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ** "
     "με τον αριθμό της άσκησης στο site.\n**Διαβάζεις τη διαφάνεια → λύνεις την άσκηση → πας στο επόμενο βήμα.**", h=1600200)
card(s, COL_R - 91440, y, COL_RW + 91440, "Από το εύκολο στο δύσκολο",
     "Ασκήσεις **1–8**: εύκολες, μία ιδέα τη φορά.\n"
     "Ασκήσεις **9–14**: μέτριες, modules, NumPy, γραφήματα.\n"
     "Ασκήσεις **15–17**: δύσκολες, όλα μαζί. Η **18** είναι για το σπίτι.", tone="gold", h=1600200)
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ", "Το NumPy και το Matplotlib φορτώνουν **μόνα τους** με το import (την πρώτη φορά θέλει λίγα δευτερόλεπτα).")

# 3 · ζέσταμα
s = new(3, "ΖΕΣΤΑΜΑ", "Θυμάσαι από το Μάθημα 6;")
y = prompt(s, L, TOP, W, "Πέντε γρήγορες ερωτήσεις, 5 λεπτά. Τι εμφανίζει κάθε γραμμή; Πρώτα σκέψου, μετά δες τη λύση.")
label(s, L, y + 182880, 3000000, "ΛΥΣΗ", GOLD)
code(s, L, y + 457200, 3108960, '''
def f(x, y=2):
    return x * y

def g(x):
    print(x + 1)
''', size=10.5)
table(s, L + 3291840, y + 457200, [2194560, 1188720, 1645920], [
    ["Κλήση", "Εμφανίζει", "Γιατί"],
    ["print(f(3))", "6", "y = 2 (προεπιλογή)"],
    ["print(f(3, 10))", "30", "y = 10"],
    ["print(f(y=1, x=5))", "5", "ονομαστικά"],
    ["print(f(f(2)))", "8", "f(4) → 8"],
    ["print(g(1))", "2 · None", "**g χωρίς return**"],
], mono=(0, 1), hl={(5, 1): "B42318"})
card(s, 9052560, y + 457200, 2441448, "Σήμερα",
     "Μια συνάρτηση μπορεί να καλέσει **άλλη** συνάρτηση — ακόμα και **τον εαυτό της**!", tone="gold", h=1737360)
footer(s, "ΣΥΝΔΕΣΗ", "Το **f(f(2))** είναι ήδη μια συνάρτηση μέσα σε συνάρτηση. Η αναδρομή πάει ένα βήμα παραπέρα.")

# 4 · το σχέδιο
s = new(4, "ΤΟ ΣΧΕΔΙΟ", "Δύο ιδέες για τη σημερινή μέρα")
b1 = code(s, COL_L, TOP, COL_W, '''
def countdown(n):
    if n == 0:
        print("Φύγαμε!")
    else:
        print(n)
        countdown(n - 1)    # καλεί τον εαυτό της!
''', size=10.5, tag="1 · ΑΝΑΔΡΟΜΗ")
b2 = code(s, COL_R, TOP, COL_RW, '''
import numpy as np
import matplotlib.pyplot as plt

grades = np.array([12, 9, 17, 15])
plt.bar(["Α", "Β", "Γ", "Δ"], grades)
plt.show()
''', size=10.5, tag="2 · ΒΙΒΛΙΟΘΗΚΕΣ")
y = max(b1, b2) + 228600
card(s, COL_L, y, COL_W, "Αναδρομή", "Λύνεις ένα πρόβλημα λύνοντας ένα **μικρότερο ίδιο** πρόβλημα, μέχρι να φτάσεις σε κάτι **πολύ απλό**.", h=1188720)
card(s, COL_R, y, COL_RW, "Βιβλιοθήκες", "Δεν γράφεις τα πάντα από την αρχή: **import** και χρησιμοποιείς κώδικα που γράφτηκε και δοκιμάστηκε από άλλους.", tone="gold", h=1188720)
footer(s, "ΤΑ ΒΗΜΑΤΑ", "**1–5**: αναδρομή. **6–10**: import, δικά μας modules, pip. **11–13**: NumPy, Matplotlib. **14**: σχεδιάζω σε υποπρογράμματα.")

# 5 · βήμα 1
s = new(5, step(1, "ΑΝΑΔΡΟΜΗ"), "Μια συνάρτηση που καλεί τον εαυτό της", lab=[1])
code(s, COL_L, TOP, COL_W, '''
def countdown(n):
    if n == 0:                 # η βάση: σταματάω
        print("Φύγαμε!")
    else:
        print(n)
        countdown(n - 1)       # το ίδιο, με μικρότερο n

countdown(3)
»3
»2
»1
»Φύγαμε!
''')
cards(s, COL_R, TOP, COL_RW, [
    ("Αναδρομή", "Η συνάρτηση **καλεί τον εαυτό της** με ένα **μικρότερο** πρόβλημα: countdown(3) → countdown(2) → countdown(1) → countdown(0)."),
    ("Η βάση", "Η περίπτωση που λύνεται **χωρίς** νέα κλήση: εδώ το **n == 0**. Εκεί η αναδρομή **σταματά**."),
    ("Χωρίς βάση", "Η συνάρτηση καλεί τον εαυτό της για πάντα → **RecursionError**. Κάθε αναδρομή χρειάζεται **βάση** και **μικραίνει** προς αυτήν.", "gold"),
])
footer(s, "ΙΔΙΟ ΜΕ", "Ένα while που μετράει αντίστροφα. Η αναδρομή δεν κάνει κάτι **νέο** — σκέφτεται το πρόβλημα **αλλιώς**.")

# 6 · βήμα 2
s = new(6, step(2, "ΠΑΡΑΓΟΝΤΙΚΟ"), "Το παραγοντικό, αναδρομικά", lab=[2])
b = code(s, COL_L, TOP, COL_W, '''
def factorial(n):
    if n <= 1:                         # βάση
        return 1
    return n * factorial(n - 1)        # αναδρομικό βήμα

print(factorial(5))
»120
''', tag="ΑΝΑΔΡΟΜΙΚΑ")
code(s, COL_L, b + 182880, COL_W, '''
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result = result * i
    return result
''', bar=GOLD, tag="ΤΟ ΙΔΙΟ ΜΕ for", tag_color=GOLD)
label(s, COL_R, TOP, COL_RW, "Ο ΟΡΙΣΜΟΣ ΑΠΟ ΤΑ ΜΑΘΗΜΑΤΙΚΑ")
table(s, COL_R, TOP + 283464, [2011680, 3246120], [
    ["Τι", "Πώς γράφεται"],
    ["5!", "5 · 4 · 3 · 2 · 1 = 120"],
    ["5! με λόγια", "5 · **4!**"],
    ["γενικά", "n! = n · **(n − 1)!**"],
    ["βάση", "1! = 1  (και 0! = 1)"],
], mono=(0,))
card(s, COL_R, 3474720, COL_RW, "Η συνταγή",
     "1. Ποια είναι η **πιο απλή** περίπτωση; → **return** την απάντηση.\n"
     "2. Αλλιώς: λύσε το **μικρότερο** πρόβλημα με κλήση στον εαυτό σου και **χτίσε** πάνω του.", tone="gold")
footer(s, "ΓΙΑΤΙ return", "Το **factorial(n - 1)** πρέπει να **δώσει πίσω** τιμή για να πολλαπλασιαστεί με το n. Χωρίς return → None.")

# 7 · βήμα 3
s = new(7, step(3, "ΣΤΟΙΒΑ"), "Πώς τρέχει μια αναδρομή", lab=[3])
label(s, COL_L, TOP, COL_W, "factorial(4): ΚΑΤΕΒΑΙΝΕΙ ↓ ΚΑΙ ΜΕΤΑ ΑΝΕΒΑΙΝΕΙ ↑")
table(s, COL_L, TOP + 283464, [1554480, 2286000, 1554480], [
    ["Κλήση", "Περιμένει…", "Δίνει πίσω"],
    ["factorial(4)", "4 * factorial(3)", "4 * 6 = **24**"],
    ["factorial(3)", "3 * factorial(2)", "3 * 2 = **6**"],
    ["factorial(2)", "2 * factorial(1)", "2 * 1 = **2**"],
    ["factorial(1)", "— βάση —", "**1**"],
], mono=(0, 1, 2), row_h=393192)
code(s, COL_L, 3657600, COL_W, '''
def forever(n):
    return forever(n + 1)    # δεν μικραίνει, δεν σταματά

forever(1)
»RecursionError: maximum recursion depth exceeded
''', bar=GOLD, size=10, tag="ΧΩΡΙΣ ΒΑΣΗ", tag_color=GOLD)
cards(s, COL_R, TOP, COL_RW, [
    ("Κατεβαίνει", "Κάθε κλήση **περιμένει** την επόμενη πριν τελειώσει. Οι κλήσεις «στοιβάζονται» η μία πάνω στην άλλη: η **στοίβα κλήσεων**."),
    ("Ανεβαίνει", "Μόλις φτάσει στη **βάση**, οι τιμές γυρίζουν πίσω μία-μία: 1 → 2 → 6 → 24."),
    ("Δικές της μεταβλητές", "Κάθε κλήση έχει το **δικό της n** (τοπική μεταβλητή, Μάθημα 6). Γι' αυτό δεν «μπερδεύονται»."),
    ("Όριο ~1000", "Η Python επιτρέπει περίπου **1000** κλήσεις τη μία μέσα στην άλλη. Μετά → RecursionError.", "gold"),
])
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ", "Άσκηση 3: **sum_to(n)** = n + sum_to(n − 1). Ποια είναι η βάση;")

# 8 · άσκηση στο χαρτί Α
s = new(8, "ΑΣΚΗΣΗ ΣΤΟ ΧΑΡΤΙ Α", "Τι υπολογίζει; Τι εμφανίζει;")
b = code(s, COL_L, TOP, 4206240, '''
def f(n):
    if n == 0:
        return 0
    return n % 10 + f(n // 10)

print(f(472))
''', tag="Α")
code(s, COL_L, b + 182880, 4206240, '''
def g(n):
    if n > 0:
        g(n - 1)
        print(n)

g(3)
''', tag="Β")
x2 = L + 4206240 + 274320
y = prompt(s, x2, TOP, R - x2, "Γράψε τον πίνακα των κλήσεων, όπως στο βήμα 3. Τι **υπολογίζει** το f; Με ποια **σειρά** εμφανίζει το g;")
label(s, x2, y + 182880, 3000000, "ΛΥΣΗ", GOLD)
table(s, x2, y + 457200, [1371600, 2103120, R - x2 - 3474720], [
    ["Κλήση", "Υπολογίζει", "Δίνει"],
    ["f(472)", "2 + f(47)", "13"],
    ["f(47)", "7 + f(4)", "11"],
    ["f(4)", "4 + f(0)", "4"],
    ["f(0)", "βάση", "0"],
], mono=(0, 1, 2))
card(s, x2, 4480560, R - x2, "Οι απαντήσεις",
     "**Α**: το **άθροισμα των ψηφίων** (Μάθημα 1, τώρα αναδρομικά) → **13**.\n"
     "**Β**: **1 2 3**! Το print είναι **μετά** την κλήση: τρέχει στο «ανέβασμα».", tone="gold")
footer(s, "ΔΟΚΙΜΑΣΕ", "Στο Β άλλαξε σειρά: πρώτα **print(n)** και μετά **g(n - 1)**. Τι εμφανίζει τώρα;")

# 9 · βήμα 4
s = new(9, step(4, "FIBONACCI"), "Δύο αναδρομικές κλήσεις: Fibonacci", lab=[4])
code(s, COL_L, TOP, COL_W, '''
def fib(n):
    if n <= 1:                        # fib(0) = 0, fib(1) = 1
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(10):
    print(fib(i), end=" ")
»0 1 1 2 3 5 8 13 21 34
''', size=10.5)
label(s, COL_L, 3291840, COL_W, "ΠΟΣΕΣ ΚΛΗΣΕΙΣ ΚΑΝΕΙ")
table(s, COL_L, 3575304, [2011680, 3383280], [
    ["Κλήση", "Συνολικές κλήσεις του fib"],
    ["fib(10)", "177"],
    ["fib(20)", "21.891"],
    ["fib(30)", "**2.692.537**"],
], mono=(0, 1), hl={(3, 1): "B42318"})
cards(s, COL_R, TOP, COL_RW, [
    ("Κάθε αριθμός", "είναι το **άθροισμα των δύο προηγούμενων**: 0, 1, 1, 2, 3, 5, 8, … Ο ορισμός είναι ήδη αναδρομικός!"),
    ("Δύο κλήσεις", "Το fib(n) καλεί **και** το fib(n − 1) **και** το fib(n − 2). Τα ίδια νούμερα υπολογίζονται **ξανά και ξανά**."),
    ("Αναδρομή ή βρόχος;", "Ο βρόχος είναι συνήθως **πιο γρήγορος**. Η αναδρομή κάνει τον κώδικα **πιο απλό** όταν το πρόβλημα «σπάει» σε μικρότερα ίδια: φάκελοι μέσα σε φακέλους, δέντρα, δυαδική αναζήτηση.", "gold"),
])
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ", "Μη δοκιμάσεις fib(30): θα αργήσει τόσο που ο έλεγχος θα το δει σαν **ατέρμονα βρόχο**.")

# 10 · βήμα 5
s = new(10, step(5, "ΔΥΑΔΙΚΗ ΑΝΑΖΗΤΗΣΗ"), "Ψάχνω στο μισό, κάθε φορά", lab=[15])
code(s, COL_L, TOP, COL_W, '''
def search(lst, x, lo, hi):
    if lo > hi:
        return -1                              # δεν υπάρχει
    mid = (lo + hi) // 2
    if lst[mid] == x:
        return mid                             # βρέθηκε!
    elif x < lst[mid]:
        return search(lst, x, lo, mid - 1)     # αριστερό μισό
    else:
        return search(lst, x, mid + 1, hi)     # δεξί μισό

nums = [3, 8, 12, 17, 21, 30, 42]
print(search(nums, 30, 0, len(nums) - 1))
»5
''', size=10)
label(s, COL_R, TOP, COL_RW, "ΨΑΧΝΩ ΤΟ 30")
table(s, COL_R, TOP + 283464, [822960, 822960, 822960, 1188720, 1600200], [
    ["lo", "hi", "mid", "lst[mid]", "Άρα"],
    ["0", "6", "3", "17", "30 > 17 → δεξιά"],
    ["4", "6", "5", "30", "**βρέθηκε: 5**"],
], mono=(0, 1, 2, 3))
cards(s, COL_R, 2834640, COL_RW, [
    ("Ταξινομημένη λίστα", "Δουλεύει **μόνο** αν η λίστα είναι ταξινομημένη. Κοιτάς τη **μέση** και πετάς το μισό που δεν σε ενδιαφέρει."),
    ("Πόσο γρήγορη", "Σε **1.000.000** στοιχεία, η γραμμική αναζήτηση κάνει ως 1.000.000 συγκρίσεις· η δυαδική **περίπου 20**."),
    ("Η βάση", "Δύο βάσεις: **βρέθηκε** (return mid) ή **δεν έμεινε τίποτα** (lo > hi → return −1).", "gold"),
])
footer(s, "ΣΤΗΝ ΠΡΑΞΗ", "Έτσι ψάχνεις λέξη σε λεξικό: ανοίγεις στη μέση, και πας μπροστά ή πίσω.")

# 11 · βήμα 6
s = new(11, step(6, "IMPORT"), "Έτοιμα εργαλεία: import math", lab=[5, 6])
b = code(s, COL_L, TOP, COL_W, '''
import math

print(math.sqrt(16))
print(math.pi)
print(math.ceil(4.1), math.floor(4.9))
»4.0
»3.141592653589793
»5 4
''', tag="ΟΛΟ ΤΟ MODULE")
code(s, COL_L, b + 182880, COL_W, '''
from math import sqrt, pi
print(sqrt(2) * pi)

import math as m
print(m.factorial(5))
»4.442882938158366
»120
''', tag="ΜΟΝΟ ΟΣΑ ΘΕΛΩ · ΜΕ ΠΑΡΑΤΣΟΥΚΛΙ")
label(s, COL_R, TOP, COL_RW, "ΤΡΕΙΣ ΤΡΟΠΟΙ")
table(s, COL_R, TOP + 283464, [2560320, 2697480], [
    ["Γράφω", "Μετά χρησιμοποιώ"],
    ["import math", "math.sqrt(2)"],
    ["from math import sqrt", "sqrt(2)"],
    ["import math as m", "m.sqrt(2)"],
], mono=(0, 1))
cards(s, COL_R, 3154680, COL_RW, [
    ("Module", "Ένα αρχείο .py με έτοιμες συναρτήσεις. Το **math** έρχεται **μαζί** με την Python: δεν θέλει εγκατάσταση."),
    ("Τα import στην αρχή", "Γράφε όλα τα import στις **πρώτες γραμμές** του προγράμματος. Έτσι φαίνεται αμέσως τι χρησιμοποιεί.", "gold"),
])
footer(s, "ΧΡΗΣΙΜΑ ΤΟΥ math", "**sqrt** ρίζα · **pi** · **ceil / floor** στρογγύλεμα πάνω / κάτω · **gcd** ΜΚΔ · **factorial** · **sin, cos** τριγωνομετρία.")

# 12 · βήμα 7
s = new(12, step(7, "RANDOM · DATETIME"), "Τυχαίοι αριθμοί και ημερομηνίες", lab=[7, 8])
b = code(s, COL_L, TOP, COL_W, '''
import random

print(random.randint(1, 6))           # ακέραιος από 1 έως 6
print(random.choice(["Α", "Β", "Γ"])) # ένα στοιχείο της λίστας
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)                 # ανακάτεμα
print(cards)
»4
»Γ
»[3, 1, 5, 2, 4]
''', size=10, tag="RANDOM · ΑΣΚΗΣΗ 7")
code(s, COL_L, b + 182880, COL_W, '''
from datetime import date

today = date(2026, 11, 16)
xmas = date(2026, 12, 25)
print((xmas - today).days)            # πόσες μέρες
print(xmas.weekday())                 # 0 = Δευτέρα
»39
»4
''', size=10, tag="DATETIME · ΑΣΚΗΣΗ 8")
cards(s, COL_R, TOP, COL_RW, [
    ("random", "Κάθε φορά βγαίνει **άλλο** αποτέλεσμα. Ζάρια, κάρτες, εχθροί σε τυχαίες θέσεις: το θέλει **κάθε παιχνίδι**."),
    ("date(έτος, μήνας, μέρα)", "Μια ημερομηνία. **date.today()** δίνει τη σημερινή."),
    ("Αφαίρεση ημερομηνιών", "**xmas − today** δίνει διάρκεια· το **.days** λέει πόσες μέρες. Η Python ξέρει πόσες μέρες έχει κάθε μήνας!"),
    ("weekday()", "**0** = Δευτέρα, … **6** = Κυριακή. Με μια λίστα ονομάτων: **days[xmas.weekday()]** → \"Παρασκευή\".", "gold"),
])
footer(s, "ΘΥΜΗΣΟΥ", "Το **random** το είδες στο «Μάντεψε τον αριθμό» του Μαθήματος 2. Τώρα ξέρεις τι είναι το import του.")

# 13 · βήμα 8
s = new(13, step(8, "ΔΙΚΟ ΜΟΥ MODULE"), "Γράφω το δικό μου module", lab=[9])
b1 = code(s, COL_L, TOP, COL_W, '''
def average(grades):
    """Ο μέσος όρος μιας λίστας."""
    return sum(grades) / len(grades)

def passed(grades, limit=10):
    """Οι βαθμοί από limit και πάνω."""
    result = []
    for g in grades:
        if g >= limit:
            result.append(g)
    return result
''', size=10, tag="ΑΡΧΕΙΟ grades_tools.py")
code(s, COL_L, b1 + 182880, COL_W, '''
import grades_tools

g = [12, 8, 17, 15]
print(grades_tools.average(g))
print(grades_tools.passed(g))
»13.0
»[12, 17, 15]
''', size=10, tag="ΑΡΧΕΙΟ main.py · ΣΤΟΝ ΙΔΙΟ ΦΑΚΕΛΟ")
cards(s, COL_R, TOP, COL_RW, [
    ("Κάθε .py είναι module", "Το **grades_tools.py** που έγραψες είναι module, όπως το math. Το φέρνεις με **import grades_tools** (χωρίς .py)."),
    ("Στον ίδιο φάκελο", "Η Python ψάχνει πρώτα στον φάκελο του προγράμματος. Στο VS Code: **File → Open Folder** και τα δύο αρχεία μέσα."),
    ("Γιατί;", "Οι συναρτήσεις σου γράφονται **μία φορά** και τις χρησιμοποιούν **πολλά** προγράμματα. Και το main.py μένει μικρό και καθαρό.", "gold"),
])
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ", "Στην άσκηση 9 το **grades_tools.py** υπάρχει ήδη: εσύ γράφεις μόνο το main.py.")

# 14 · βήμα 9
s = new(14, step(9, "__MAIN__"), "if __name__ == \"__main__\":", lab=[10])
code(s, COL_L, TOP, COL_W, '''
# temperature.py
def c_to_f(c):
    return c * 9 / 5 + 32

def main():
    print(c_to_f(25))       # δοκιμή

if __name__ == "__main__":
    main()
''')
label(s, COL_R, TOP, COL_RW, "ΤΙ ΓΙΝΕΤΑΙ ΚΑΘΕ ΦΟΡΑ")
table(s, COL_R, TOP + 283464, [2286000, 1554480, 1417320], [
    ["Πώς το τρέχω", "__name__", "Τρέχει main;"],
    ["py temperature.py", "\"__main__\"", "**ναι** → 77.0"],
    ["import temperature", "\"temperature\"", "όχι"],
], mono=(0, 1))
cards(s, COL_R, 2834640, COL_RW, [
    ("__name__", "Μια μεταβλητή που φτιάχνει η ίδια η Python. Είναι **\"__main__\"** μόνο στο αρχείο που **τρέχεις**."),
    ("Το πρόβλημα που λύνει", "Χωρίς το if, ένα **import temperature** θα έτρεχε και τη δοκιμή, και θα έβλεπες ένα «77.0» από το πουθενά."),
    ("Η συνήθεια", "Κάθε πρόγραμμα: **συναρτήσεις** πάνω, μια **main()**, και τελευταίες γραμμές αυτό το if.", "gold"),
])
footer(s, "ΔΙΑΒΑΣΕ ΤΟ ΕΤΣΙ", "«Αν αυτό το αρχείο είναι αυτό που **τρέχει ο χρήστης** — όχι import από άλλο — κάλεσε τη main.»")

# 15 · βήμα 10
s = new(15, step(10, "ΠΑΚΕΤΑ · PIP · VENV"), "Πακέτα και εγκατάσταση βιβλιοθηκών")
b = code(s, COL_L, TOP, COL_W, '''
»game/
»├── main.py
»└── tools/              ← πακέτο
»    ├── __init__.py
»    ├── grades.py
»    └── files.py
''', bar=GOLD, size=10.5, tag="ΕΝΑ ΠΑΚΕΤΟ ΕΙΝΑΙ ΦΑΚΕΛΟΣ ΜΕ MODULES", tag_color=GOLD)
code(s, COL_L, b + 182880, COL_W, '''
from tools.grades import average
from tools import files
''', size=10.5, tag="ΣΤΟ main.py")
code(s, COL_R, TOP, COL_RW, '''
»> py -m venv .venv
»> .venv\\Scripts\\activate
»(.venv) > pip install numpy matplotlib
»(.venv) > pip list
»(.venv) > py main.py
''', size=10.5, tag="ΣΤΟ ΤΕΡΜΑΤΙΚΟ ΤΟΥ VS CODE")
cards(s, COL_R, 2880360, COL_RW, [
    ("__init__.py", "Λέει στην Python «αυτός ο φάκελος είναι **πακέτο**». Μπορεί να είναι και **άδειο**."),
    ("pip install όνομα", "Κατεβάζει μια βιβλιοθήκη από το **PyPI** (pypi.org, πάνω από 500.000 πακέτα) και την εγκαθιστά."),
    ("venv", "Ένα ξεχωριστό «κουτί» βιβλιοθηκών **για κάθε project**. Έτσι δύο projects δεν μπερδεύουν τις εκδόσεις τους.", "gold"),
])
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ ΤΟΥ SITE", "Δεν χρειάζεται pip: το NumPy και το Matplotlib φορτώνουν **μόνα τους** όταν γράψεις import.")

# 16 · βήμα 11
s = new(16, step(11, "NUMPY"), "NumPy: πράξεις σε όλο τον πίνακα", lab=[11, 12])
code(s, COL_L, TOP, COL_W, '''
import numpy as np

prices = np.array([2.5, 10, 4.2])
print(prices * 1.24)               # σε ΟΛΑ μαζί, χωρίς for
»[ 3.1   12.4    5.208]

grades = np.array([12, 8.5, 17, 9, 15])
print(grades.mean(), grades.max())
»12.3 17.0
print(grades[grades >= 10])         # μόνο όσοι πέρασαν
»[12. 17. 15.]
print((grades >= 10).sum())         # πόσοι πέρασαν
»3
''', size=10)
label(s, COL_R, TOP, COL_RW, "ΛΙΣΤΑ Ή ARRAY;")
table(s, COL_R, TOP + 283464, [1737360, 1737360, 1783080], [
    ["Πράξη", "Λίστα", "np.array"],
    ["[1, 2] * 2", "[1, 2, 1, 2]", "[2 4]"],
    ["+ 10", "TypeError", "[11 12]"],
    ["μέσος όρος", "sum / len", ".mean()"],
], mono=(0, 1, 2))
cards(s, COL_R, 2743200, COL_RW, [
    ("import numpy as np", "Το **np** είναι το «παρατσούκλι» που χρησιμοποιούν όλοι. Το **np.array(λίστα)** φτιάχνει πίνακα NumPy."),
    ("Όλα μαζί", "Μια πράξη σε array γίνεται σε **κάθε** στοιχείο. Και είναι **πολύ** πιο γρήγορη από ένα for, γραμμένη σε C από κάτω."),
    ("grades >= 10", "Δίνει πίνακα με True/False. Μέσα σε **[ ]** κρατά τα True· το **.sum()** μετράει πόσα True.", "gold"),
])
footer(s, "ΠΟΥ ΤΟ ΒΡΙΣΚΕΙΣ", "Πάνω στο NumPy στηρίζονται το pandas, το Matplotlib και σχεδόν όλη η τεχνητή νοημοσύνη στην Python.")

# 17 · βήμα 12
DAYS = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"]
TEMPS = [18, 21, 25, 23, 19, 16, 20]
def draw_line():
    plt.plot(DAYS, TEMPS, marker="o", color="#" + BLUE)
    plt.title("Θερμοκρασίες εβδομάδας")
    plt.ylabel("°C")
s = new(17, step(12, "MATPLOTLIB"), "Γράφημα γραμμής", lab=[13])
code(s, COL_L, TOP, COL_W, '''
import matplotlib.pyplot as plt

days = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"]
temps = [18, 21, 25, 23, 19, 16, 20]

plt.plot(days, temps, marker="o")
plt.title("Θερμοκρασίες εβδομάδας")
plt.ylabel("°C")
plt.show()
''', size=10)
cards(s, COL_L, 3474720, COL_W, [
    ("plt.plot(x, y)", "Ενώνει τα σημεία με γραμμή. Το **marker=\"o\"** βάζει κουκκίδα σε κάθε σημείο."),
    ("plt.show()", "Ανοίγει το παράθυρο με το γράφημα. Χωρίς αυτό, στον υπολογιστή σου **δεν** θα δεις τίποτα.", "gold"),
])
picture(s, chart("line.png", draw_line), COL_R, TOP, COL_RW)
footer(s, "ΤΙΤΛΟΙ", "**plt.title** τίτλος · **plt.xlabel / plt.ylabel** ονόματα αξόνων · **plt.grid()** πλέγμα.")

# 18 · βήμα 13
NAMES = ["Άννα", "Νίκος", "Ελένη", "Μαρία"]
GRADES = [17, 9, 15, 18]
def draw_bar():
    plt.bar(NAMES, GRADES, color="#" + BLUE)
    plt.axhline(10, color="#B42318", linestyle="--")
    plt.title("Βαθμοί")
s = new(18, step(13, "MATPLOTLIB"), "Γράφημα ράβδων και αποθήκευση", lab=[14])
code(s, COL_L, TOP, COL_W, '''
import matplotlib.pyplot as plt

names = ["Άννα", "Νίκος", "Ελένη", "Μαρία"]
grades = [17, 9, 15, 18]

plt.bar(names, grades)
plt.axhline(10, color="red", linestyle="--")   # η βάση
plt.title("Βαθμοί")
plt.savefig("grades.png")                       # σε αρχείο εικόνας
plt.show()
''', size=10)
cards(s, COL_L, 3657600, COL_W, [
    ("plt.bar(ονόματα, τιμές)", "Μία **ράβδος** για κάθε στοιχείο. Για οριζόντιες: **plt.barh**."),
    ("plt.savefig(\"όνομα.png\")", "Σώζει το γράφημα σε **εικόνα**, για εργασία ή ιστοσελίδα. Γράψ' το **πριν** το show.", "gold"),
])
picture(s, chart("bar.png", draw_bar), COL_R, TOP, COL_RW)
footer(s, "ΚΑΙ ΑΛΛΑ", "**plt.pie** πίτα · **plt.scatter** σημεία · **plt.hist** ιστόγραμμα. Ίδια λογική: δεδομένα → γράφημα → show.")

# 19 · γνωστές βιβλιοθήκες
s = new(19, "ΒΙΒΛΙΟΘΗΚΕΣ", "Ποια βιβλιοθήκη για ποια δουλειά")
table(s, L, TOP, [2743200, 2286000, 2834640], [
    ["Θέλω να…", "Βιβλιοθήκη", "Μια γεύση"],
    ["κάνω πράξεις σε πίνακες", "numpy", "np.array([1, 2]) * 2"],
    ["διαβάσω / αναλύσω δεδομένα", "pandas", 'pd.read_csv("grades.csv")'],
    ["φτιάξω γραφήματα", "matplotlib", "plt.plot(x, y)"],
    ["μιλήσω με ένα site / API", "requests", "requests.get(url).json()"],
    ["φτιάξω ιστοσελίδα (backend)", "flask · django", '@app.route("/")'],
    ["γράψω παιχνίδι 2D", "pygame", "Μαθήματα 14–15"],
    ["δουλέψω με Excel", "openpyxl", "Μάθημα 13"],
    ["επεξεργαστώ εικόνες", "pillow", 'Image.open("a.png")'],
    ["τεχνητή νοημοσύνη", "scikit-learn · pytorch", "model.fit(X, y)"],
], mono=(1, 2), row_h=365760, size=10)
cards(s, 8869680, TOP, R - 8869680, [
    ("Έρχονται μαζί", "**math, random, datetime, csv, os, json, sqlite3**: χωρίς pip, μόνο import."),
    ("Θέλουν pip", "Όλες οι άλλες του πίνακα: **pip install όνομα**."),
    ("Πώς διαλέγω", "Ψάξε στο **pypi.org** και στην τεκμηρίωση. Προτίμησε ό,τι είναι **γνωστό** και **συντηρείται**.", "gold"),
])
footer(s, "Η ΔΥΝΑΜΗ ΤΗΣ PYTHON", "Η γλώσσα είναι απλή· η δύναμή της είναι οι **χιλιάδες βιβλιοθήκες** για σχεδόν κάθε δουλειά.")

# 20 · βήμα 14
s = new(20, step(14, "ΤΜΗΜΑΤΙΚΟΣ"), "Σχεδιάζω το πρόγραμμα σε υποπρογράμματα", lab=[16, 17])
def node(x, y, w, h, title, sub, tone):
    shape(s, x, y, w, h, BLUE_BG if tone == "blue" else GOLD_BG, None, MSO_SHAPE.ROUNDED_RECTANGLE)
    tf = box(s, x + 91440, y + 64008, w - 182880, h - 128016, MSO_ANCHOR.MIDDLE)
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    run(tf.paragraphs[0], title, 11, INK, MONO, bold=True)
    p = tf.add_paragraph(); p.alignment = PP_ALIGN.CENTER
    run(p, sub, 9.5, TEXT, SANS)
def link(x1, y1, x2, y2):
    ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, x1, y1, x2, y2)
    ln.line.color.rgb = rgb(MUTED); ln.line.width = 12700
top_w, kid_w, kid_h = 2743200, 1737360, 731520
top_x = COL_L + (6583680 - top_w) // 2
node(top_x, TOP, top_w, kid_h, "main()", "το πρόγραμμα βαθμολογιών", "gold")
kids = [("load_grades()", "διαβάζει το CSV"), ("summary()", "μέσος όρος, πέρασαν"), ("draw_chart()", "γράφημα ράβδων")]
ky = TOP + kid_h + 640080
for i, (t, sub) in enumerate(kids):
    kx = COL_L + i * (kid_w + 182880)
    link(top_x + top_w // 2, TOP + kid_h, kx + kid_w // 2, ky)
    node(kx, ky, kid_w, kid_h, t, sub, "blue")
code(s, COL_L, ky + kid_h + 320040, 5577840, '''
def main():
    names, grades = load_grades("grades.csv")
    summary(names, grades)
    draw_chart(names, grades)
''', size=10.5, tag="ΤΟ main() ΔΙΑΒΑΖΕΤΑΙ ΣΑΝ ΠΕΡΙΛΗΨΗ")
cards(s, 6583680, TOP, R - 6583680, [
    ("Από πάνω προς τα κάτω", "Ξεκινάς από το **μεγάλο** πρόβλημα και το σπας σε **μικρότερα**. Αν ένα κομμάτι είναι ακόμα μεγάλο, το ξανασπάς."),
    ("Ένα υποπρόγραμμα, μία δουλειά", "Κάθε συνάρτηση **δοκιμάζεται χωριστά**. Αν κάτι χαλάσει, ξέρεις πού να ψάξεις."),
    ("Και σε ομάδα", "Ο καθένας γράφει **μία** συνάρτηση. Αρκεί να έχετε συμφωνήσει **τι παίρνει** και **τι επιστρέφει**."),
    ("Τμηματικός προγραμματισμός", "Αυτό ακριβώς ζητά ο οδηγός σπουδών: προγράμματα από **υποπρογράμματα**, και αυτά σε **modules**.", "gold"),
])
footer(s, "ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ", "Άσκηση **16**: ο κατάλογος του Μαθήματος 5 σε υποπρογράμματα. Άσκηση **17**: αυτό το σχέδιο, ολόκληρο.")

# 21 · οι ασκήσεις
s = new(21, "ΕΡΓΑΣΤΗΡΙΟ", "Οι 18 ασκήσεις, βήμα-βήμα")
lab_overview(s, [
    (1, "Αντίστροφη μέτρηση", "Εύκολο", "5"), (2, "Παραγοντικό", "Εύκολο", "6"),
    (3, "Άθροισμα 1 έως n", "Εύκολο", "7"), (4, "Fibonacci", "Εύκολο", "9"),
    (5, "Κύκλος με math", "Εύκολο", "11"), (6, "Πόσα λεωφορεία;", "Εύκολο", "11"),
    (7, "Δύο ζάρια", "Εύκολο", "12"), (8, "Μέρες ως την προθεσμία", "Εύκολο", "12"),
    (9, "Το δικό μου module", "Μέτριο", "13"), (10, "Η main() και το __name__", "Μέτριο", "14"),
    (11, "NumPy: τιμές με ΦΠΑ", "Μέτριο", "16"), (12, "NumPy: βαθμοί τάξης", "Μέτριο", "16"),
    (13, "Γράφημα γραμμής", "Μέτριο", "17"), (14, "Γράφημα ράβδων", "Μέτριο", "18"),
    (15, "Δυαδική αναζήτηση", "Δύσκολο", "10"), (16, "Κατάλογος σε υποπρογράμματα", "Δύσκολο", "20, 22"),
    (17, "Γράφημα βαθμών από CSV", "Ο στόχος", "20, 23"), (18, "Πύργοι του Ανόι", "Για το σπίτι", "5–7"),
])
footer(s, "ΣΤΟ SITE", "Εργαστήριο → **Μάθημα 7**. Στα γραφήματα, το ▶ Τρέξε δείχνει την εικόνα κάτω από τον κώδικα.")

# 22 · δύσκολο
s = new(22, "ΕΡΓΑΣΤΗΡΙΟ · ΔΥΣΚΟΛΟ", "Ο κατάλογος σε υποπρογράμματα", lab=[16])
code(s, L, TOP, 6035040, '''
import csv

def load_phone(filename):
    phone = {}
    try:
        with open(filename, newline="", encoding="utf-8") as f:
            for row in csv.reader(f):
                phone[row[0]] = row[1]
    except FileNotFoundError:
        pass                        # 1η φορά: κενός κατάλογος
    return phone

def save_phone(filename, phone):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        csv.writer(f).writerows(phone.items())

def main():
    phone = load_phone("phone.csv")
    while True:
        choice = input("\\n1.Προσθήκη 2.Όλοι 0.Έξοδος: ")
        if choice == "1":
            name = input("Όνομα: ")
            phone[name] = input("Τηλέφωνο: ")
        elif choice == "2":
            for name in sorted(phone):
                print(f"{name}: {phone[name]}")
        elif choice == "0":
            save_phone("phone.csv", phone)
            break

if __name__ == "__main__":
    main()
''', bar=GOLD, size=8, tag="ΛΥΣΗ · ΔΟΚΙΜΑΣΕ ΠΡΩΤΑ ΜΟΝΟΣ/Η ΣΟΥ", tag_color=GOLD, h=FOOT_Y - 137160 - TOP - 283464)
cards(s, 6876288, TOP + 283464, 4617720, [
    ("Ίδιος κώδικας, άλλη μορφή", "Ό,τι έκανε ο κατάλογος του Μαθήματος 5, τώρα σε **δύο** συναρτήσεις + **main**."),
    ("load_phone επιστρέφει", "Δεν αλλάζει καθολική μεταβλητή: **επιστρέφει** το λεξικό (Μάθημα 6, βήμα 8)."),
    ("Επόμενο βήμα", "Οι δύο συναρτήσεις πάνε σε αρχείο **phone_tools.py** και το main.py γράφει **import phone_tools**.", "gold"),
])
footer(s, "ΑΠΟ ΠΟΙΑ ΒΗΜΑΤΑ", "**9** __main__ · **14** υποπρογράμματα · Μάθημα 5: **csv**, **FileNotFoundError**.")

# 23 · ο στόχος
CSV_NAMES = ["Άννα", "Νίκος", "Μαρία", "Γιώργος", "Ελένη"]
CSV_GRADES = [17, 9, 18.5, 11, 7.5]
def draw_goal():
    plt.bar(CSV_NAMES, CSV_GRADES, color="#" + BLUE)
    plt.axhline(10, color="#B42318", linestyle="--")
    plt.title("Βαθμολογίες τμήματος")
    plt.ylim(0, 20)
s = new(23, "ΕΡΓΑΣΤΗΡΙΟ · Ο ΣΤΟΧΟΣ", "Γράφημα βαθμολογιών από CSV", lab=[17])
code(s, L, TOP, 6035040, '''
import csv
import matplotlib.pyplot as plt

def load_grades(filename):
    names, grades = [], []
    with open(filename, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)                       # επικεφαλίδα
        for row in reader:
            names.append(row[0])
            grades.append(float(row[1]))
    return names, grades
def summary(names, grades):
    passed = 0
    for g in grades:
        if g >= 10:
            passed = passed + 1
    print(f"Μέσος όρος: {sum(grades) / len(grades):.2f}")
    print("Πέρασαν:", passed, "από", len(grades))
def draw_chart(names, grades):
    plt.bar(names, grades)
    plt.axhline(10, color="red", linestyle="--")
    plt.title("Βαθμολογίες τμήματος")
    plt.show()
def main():
    names, grades = load_grades("grades.csv")
    summary(names, grades)
    draw_chart(names, grades)

if __name__ == "__main__":
    main()
''', bar=GOLD, size=8, tag="ΛΥΣΗ · ΔΟΚΙΜΑΣΕ ΠΡΩΤΑ ΜΟΝΟΣ/Η ΣΟΥ", tag_color=GOLD, h=FOOT_Y - 137160 - TOP - 283464)
b = picture(s, chart("goal.png", draw_goal, 4.6, 2.6), 6876288, TOP + 283464, 4617720)
code(s, 6876288, b + 137160, 4617720, '''
»Μέσος όρος: 12.60
»Πέρασαν: 3 από 5
''', size=10)
card(s, 6876288, b + 777240, 4617720, "Το main() στο τέλος",
     "Διαβάζεται σαν **περίληψη**: φόρτωσε → σύνοψη → γράφημα. Κάθε βήμα είναι μια **δική του** συνάρτηση.", tone="gold")
footer(s, "ΑΠΟ ΠΟΙΑ ΒΗΜΑΤΑ", "**13** bar, axhline · **14** τρία υποπρογράμματα + main · Μάθημα 5: **csv.reader**.")

# 24 · σύνοψη
s = new(24, "ΣΥΝΟΨΗ", "Τι κρατάμε")
table(s, L, TOP, [2834640, 4114800], [
    ["Θέλω να…", "Γράφω"],
    ["γράψω αναδρομή", "βάση: return … · αλλιώς: f(μικρότερο)"],
    ["φέρω ένα module", "import math · from math import sqrt"],
    ["δώσω παρατσούκλι", "import numpy as np"],
    ["τυχαίο ακέραιο", "random.randint(1, 6)"],
    ["μέρες ανάμεσα σε ημερομηνίες", "(d2 - d1).days"],
    ["τρέξω κώδικα μόνο αν τρέχει το αρχείο", 'if __name__ == "__main__":'],
    ["εγκαταστήσω βιβλιοθήκη", "pip install numpy"],
    ["πράξη σε όλο τον πίνακα", "np.array(λ) * 2 · a[a >= 10]"],
    ["γράφημα", "plt.plot · plt.bar · plt.show()"],
], mono=(1,), row_h=374904, size=10)
cards(s, 7790688, TOP, 3703320, [
    ("Μικρά κομμάτια", "Η **αναδρομή** σπάει το πρόβλημα σε μικρότερα ίδια. Τα **modules** σπάνε το πρόγραμμα σε αρχεία."),
    ("Επόμενη φορά · Δευ 23/11", "**Συμβολοσειρές**: split, join, replace, f-strings με στοίχιση, και τα ελληνικά σε UTF-8.", "gold"),
])
footer(s, "ΓΙΑ ΤΟ ΣΠΙΤΙ", "Άσκηση **18** στο εργαστήριο: οι Πύργοι του Ανόι, η πιο διάσημη αναδρομή (βήματα 1–3).")

finish("Μάθημα07_Αναδρομή_και_βιβλιοθήκες.pptx", 24)
