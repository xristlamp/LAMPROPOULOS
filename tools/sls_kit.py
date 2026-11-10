# Κοινά για τις διαφάνειες των εργαστηρίων του Μαρκοπούλου από το 5 και μετά (πάνω στο slides_kit):
# ποια άσκηση είναι σε ποια διαφάνεια, 1η διαφάνεια, λύσεις κουίζ και τερματικού, πίνακας ασκήσεων, γραμμές για το REFS του lab.js.
# Χρήση σε ένα slsNN_slides.py:   from slides_kit import *;  from sls_kit import *;  start(ORIG) …
import os, re
import slides_kit as K
from slides_kit import *

# Τα εργαστήρια χωρίς δικό τους αρχικό αρχείο παίρνουν την 1η διαφάνεια και το πλαίσιο από την αρχική έκδοση του 4.
ORIG_4 = os.path.join(os.path.expanduser("~"), "Desktop", "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ", "_πρωτότυπα_πριν_τον_εμπλουτισμό",
                      "ΣΛΣ_Εργαστήριο04_Χρονοδρομολόγηση_SRTF_RR_Priority_v1.pptx")

EX = {}                                       # άσκηση → [διαφάνειες θεωρίας/εκφώνησης], διαφάνεια λύσης
def nxt(): return len(K.prs.slides) + 1      # αριθμός της επόμενης διαφάνειας
def mark(*ns):
    for n in ns: EX.setdefault(n, [[], None])[0].append(nxt())
def mark_sol(ns):
    for n in ns: EX.setdefault(n, [[], None])[1] = nxt()

def title_slide4(top, line1, line2, sub, meta):
    """ξαναγράφει την 1η διαφάνεια (από το πρότυπο του Εργαστηρίου 4)"""
    def put(p, text):
        p.runs[0].text = text
        for x in p.runs[1:]: x.text = ""
    for sh in K.prs.slides[0].shapes:
        if not sh.has_text_frame: continue
        t, ps = sh.text_frame.text, sh.text_frame.paragraphs
        if t.startswith("ΕΡΓΑΣΤΗΡΙΟ 4"): put(ps[0], top)
        elif t.startswith("Αλγόριθμοι"): put(ps[0], line1); put(ps[1], line2)
        elif t.startswith("Χρονοδρομολόγηση"): put(ps[0], sub)
        elif t.startswith("Παιχνίδι"): put(ps[0], meta)

def quiz_solution(ns, title, rows, foot, row_h=621792):
    """λύση κουίζ: ερώτηση, σωστή απάντηση, γιατί"""
    mark_sol(ns)
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
    mark_sol(ns)
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
    mark(n)
    s = new(nxt(), kicker, title, lab=[n])
    y = prompt(s, L, TOP, W, intro) + 182880
    table(s, L, y, widths or [6400800, W - 6400800], [head] + rows, size=11.5, row_h=429768)
    footer(s, "ΒΟΗΘΕΙΑ", foot)
    return s

def overview_slide(count):
    s = new(nxt(), "ΠΩΣ ΔΟΥΛΕΥΟΥΜΕ", f"Οι {count} ασκήσεις του εργαστηρίου")
    footer(s, "ΠΩΣ", "Διαβάζεις το βήμα → λύνεις στο site την άσκηση της ετικέτας **ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ** → ελέγχεις με τη **λύση** που ακολουθεί.")
    return s

def fill_overview(s, names, levels):
    lab_overview(s, [(n, names[n - 1], levels[n - 1], f"{EX[n][0][-1]} → {EX[n][1]}") for n in range(1, len(names) + 1)])
    tf = box(s, L, 5577840, W, 274320, MSO_ANCHOR.MIDDLE)
    rich(tf.paragraphs[0], "Στήλη «Διαφάνεια»: **εκφώνηση → λύση**.", 11, MUTED)

def print_refs(lab, count):
    letters = "abcdefghijklmnopqrstuvwxyz"
    print("REFS:", ", ".join(f'e{lab}{letters[n - 1]}: ["{lab}", {sorted(set(EX[n][0]))}]' for n in range(1, count + 1)))
