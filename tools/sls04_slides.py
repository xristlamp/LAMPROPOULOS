# Φτιάχνει τις διαφάνειες του Εργαστηρίου 4 του Μαρκοπούλου (Χρονοδρομολόγηση ΙΙ: Round Robin, SRTF, Priority).
# Ίδιο ύφος με το Εργαστήριο 3: θεωρία σε μικρά βήματα, κάθε άσκηση του site με τη λύση της αμέσως μετά.
# Χρήση:  py tools\sls04_slides.py   → Desktop\ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ\ΣΛΣ_Εργαστήριο04_Χρονοδρομολόγηση_SRTF_RR_Priority.pptx
# Μετά: tools\convert.ps1 για PDF. Το script τυπώνει στο τέλος τις γραμμές e4a… για το REFS του lab.js.
import slides_kit as K
from slides_kit import *

ORIG = os.path.join(os.path.expanduser("~"), "Desktop", "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ", "_πρωτότυπα_πριν_τον_εμπλουτισμό",
                    "ΣΛΣ_Εργαστήριο04_Χρονοδρομολόγηση_SRTF_RR_Priority_v1.pptx")
start(ORIG)                          # κρατά την 1η διαφάνεια και το πλαίσιο της προηγούμενης έκδοσης
K.STEPS = 10
N_SLIDES = 37
DATE = "ΤΡΙΤΗ 03/11/2026"
NEXT = "Τρίτη 10/11"

def nxt(): return len(K.prs.slides) + 1      # αριθμός της επόμενης διαφάνειας

EX = {}                                       # άσκηση → [διαφάνειες θεωρίας/εκφώνησης], διαφάνεια λύσης
def mark(n, slide_no): EX.setdefault(n, [[], None])[0].append(slide_no)
def mark_sol(ns, slide_no):
    for n in ns: EX.setdefault(n, [[], None])[1] = slide_no

# ---------- χρονοδρομολόγηση: ίδιοι κανόνες με το schedule() του lab.js ----------
# Ισοπαλία: κερδίζει όποια ήρθε πρώτη. Με διακοπή: σε ισοπαλία συνεχίζει αυτή που τρέχει.
# Round Robin: όποια φτάνει μπαίνει στην ουρά πριν από αυτήν που μόλις διακόπηκε.
PRE = ("srtf", "prio-p", "rr")

def run(procs, alg, q=None):
    """procs: [(όνομα, άφιξη, εκτέλεση, προτεραιότητα?)] → dict με cells, fin, start, wait, ctx, ev"""
    n = len(procs)
    rem, fin, st, cells, ctx, ev = [p[2] for p in procs], {}, {}, [], [], {}
    t, cur, left, done = 0, -1, 0, 0
    queue = [i for i in range(n) if procs[i][1] == 0]
    pre = alg in ("srtf", "prio-p")
    def key(i):
        if alg == "sjf": return procs[i][2]
        if alg == "srtf": return rem[i]
        if alg.startswith("prio"): return procs[i][3]
        return procs[i][1]
    def best(c): return min(c, key=lambda i: (key(i), procs[i][1], i)) if c else -1
    while done < n:
        c = [i for i in range(n) if procs[i][1] <= t and rem[i] > 0]
        fresh, waiting = False, None
        if alg == "rr":
            if cur < 0 and queue:
                cur = queue.pop(0); left = q; fresh = True
                waiting = [cur] + queue
            else: waiting = list(queue)
        elif pre:
            b = best(c)
            if cur >= 0 and rem[cur] > 0 and key(cur) <= key(b): b = cur
            fresh = b != cur; cur = b
        elif cur < 0 and c:
            cur = best(c); fresh = True
        ctx.append(dict(fresh=fresh, cand=c, cur=cur, queue=waiting, rem=rem[:]))
        cells.append(cur if cur >= 0 else None)
        if cur >= 0:
            st.setdefault(cur, t); rem[cur] -= 1; left -= 1
        t += 1
        e = ev.setdefault(t, [])
        if cur >= 0 and rem[cur] == 0: e.append(("fin", cur))
        for i in range(n):
            if procs[i][1] == t:
                e.append(("arr", i))
                if alg == "rr": queue.append(i)
        if cur >= 0 and rem[cur] == 0: fin[cur] = t; done += 1; cur = -1
        elif alg == "rr" and cur >= 0 and left == 0: e.append(("exp", cur)); queue.append(cur); cur = -1
    wait = [fin[i] - p[1] - p[2] for i, p in enumerate(procs)]
    return dict(cells=cells, fin=fin, start=st, wait=wait, ctx=ctx, ev=ev)

def segments(procs, cells):
    out = []
    for t, c in enumerate(cells):
        name = procs[c][0] if c is not None else None
        if out and out[-1][0] == name: out[-1][2] = t + 1
        else: out.append([name, t, t + 1])
    return [tuple(s) for s in out]

def num(x):
    return str(round(x)) if abs(x - round(x)) < 1e-9 else f"{x:.2f}".rstrip("0").replace(".", ",")

def avg_txt(w): return f"({' + '.join(map(str, w))}) / {len(w)} = **{num(sum(w) / len(w))}**"

def decisions(procs, alg, r):
    """οι στιγμές που κάτι αλλάζει (άφιξη, τέλος, λήξη κβάντου): [στιγμή, ουρά ή περιμένουν, τρέχει, γιατί]"""
    cells, ctx, ev, rows = r["cells"], r["ctx"], r["ev"], []
    nm = lambda i: procs[i][0]
    for t in range(len(cells)):
        events = ev.get(t, [])
        if t and not events: continue
        c, cur = ctx[t], ctx[t]["cur"]
        if alg != "rr" and alg not in PRE and t and not c["fresh"]: continue      # χωρίς διακοπή: μόνο όταν αδειάζει
        end = t
        while end < len(cells) and cells[end] == cells[t]: end += 1
        running = f"{nm(cur)} ({t}–{end})" if cur >= 0 else "— (άδειος)"
        # τι έγινε
        arr = [nm(i) for k, i in events if k == "arr"]
        fins = [nm(i) for k, i in events if k == "fin"]
        exp = [nm(i) for k, i in events if k == "exp"]
        what = []
        if fins: what.append(f"Τελείωσε η {fins[0]}")
        if arr and exp: what.append(f"Ήρθε η {', '.join(arr)} και έληξε το κβάντο της {exp[0]}: μπαίνει **πρώτα η {arr[0]}**")
        else:
            if arr: what.append("Ήρθε η " + " και η ".join(arr))
            if exp: what.append(f"Έληξε το κβάντο της {exp[0]}: πάει στο **τέλος** της ουράς")
        prev = cells[t - 1] if t else None
        preempted = prev is not None and not fins and prev != cur and alg != "rr"
        # τι αποφασίζει
        if alg == "rr":
            col = ", ".join(nm(i) for i in c["queue"]) or "—"
            dec = f"τρέχει η **{nm(cur)}**, η πρώτη της ουράς" if c["fresh"] else f"η {nm(cur)} **συνεχίζει** το κβάντο της"
        else:
            val = (lambda i: c["rem"][i]) if alg == "srtf" else (lambda i: procs[i][3])
            col = ", ".join(f"{nm(i)} ({val(i)})" for i in c["cand"]) or "—"
            word = "μικρότερη" if alg == "srtf" else "πιο σημαντική"
            others = [i for i in c["cand"] if i != cur]
            tie = [i for i in others if val(i) == val(cur)]
            if cur < 0: dec = "δεν έχει φτάσει καμία"
            elif preempted: dec = f"**διακοπή**: {nm(cur)} ({val(cur)}) < {nm(prev)} ({val(prev)})"
            elif not c["fresh"]:
                dec = (f"ισοπαλία με {nm(tie[0])}: **συνεχίζει** αυτή που τρέχει" if tie
                       else f"η {nm(cur)} ({val(cur)}) **συνεχίζει**: είναι ακόμα η {word}")
            elif not others: dec = "είναι **μόνη** της" if t == 0 or arr else "η **τελευταία** που έμεινε"
            elif tie: dec = f"ισοπαλία {nm(cur)} – {nm(tie[0])} ({val(cur)}): πάει όποια **ήρθε πρώτη**"
            else: dec = f"η **{word}**: {nm(cur)} ({val(cur)})"
        why = ". ".join(what) + " → " + dec if what else dec[0].upper() + dec[1:]
        rows.append([str(t), col, running, why])
    return rows

# ---------- Gantt ----------
PC = {"P1": (BLUE, "FFFFFF"), "P2": ("5C73E6", "FFFFFF"), "P3": ("8EA0EE", INK), "P4": ("E8C773", INK)}
BAR_H = 457200

def tick(s, x, y, text):
    tf = box(s, x - 182880, y, 365760, 201168, MSO_ANCHOR.TOP)
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    run_(tf.paragraphs[0], str(text), 9, MUTED, MONO)

run_ = K.run                                  # το run του slides_kit (το δικό μας run είναι ο χρονοδρομολογητής)

def gantt(s, x, y, w, segs, h=BAR_H):
    """γεμάτο διάγραμμα· επιστρέφει το κάτω όριο"""
    total = segs[-1][2]
    u = w / total
    for name, a, b in segs:
        fill, fg = PC.get(name, (PAPER, MUTED))
        sh = shape(s, int(x + a * u), y, int((b - a) * u), h, fill, "FFFFFF" if name else LINE)
        tf = sh.text_frame
        tf.margin_left = tf.margin_right = 0
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER
        run_(tf.paragraphs[0], name or "άδειος", 10 if name else 9, fg, MONO, bold=bool(name))
    for t in sorted({a for _, a, _ in segs} | {total}):
        tick(s, int(x + t * u), y + h + 27432, t)
    return y + h + 228600

def grid(s, x, y, w, total):
    """άδειο διάγραμμα για να το συμπληρώσει ο εκπαιδευόμενος"""
    u = w / total
    for i in range(total):
        shape(s, int(x + i * u), y, int(u), BAR_H, "FFFFFF", LINE)
    for t in range(total + 1):
        tick(s, int(x + t * u), y + BAR_H + 27432, t)
    return y + BAR_H + 228600

def has_prio(procs): return len(procs[0]) > 3

def data_table(s, x, y, procs, w=COL_W - 914400):
    head = ["Διεργασία", "Άφιξη", "Εκτέλεση"] + (["Προτερ."] if has_prio(procs) else [])
    rows = [head] + [list(p) for p in procs]
    return table(s, x, y, [w // len(head)] * len(head), rows, mono=tuple(range(len(head))), row_h=320040)

def blank_table(s, x, y, procs, pre, w=COL_RW):
    head = ["Διεργασία"] + ([] if pre else ["Αρχίζει"]) + ["Τελειώνει", "Αναμονή"]
    rows = [head] + [[p[0]] + [""] * (len(head) - 1) for p in procs]
    return table(s, x, y, [w // len(head)] * len(head), rows, mono=(0,), row_h=320040)

def exercise(n, kicker, title, text, procs, alg, foot, side=None):
    """διαφάνεια άσκησης Gantt: εκφώνηση, δεδομένα, άδειο Gantt, πίνακας και μέσος όρος"""
    mark(n, nxt())
    total = max(run(procs, alg, QUANTUM.get(n))["fin"].values())
    s = new(nxt(), kicker, title, lab=[n])
    y = prompt(s, L, TOP, W, text) + 182880
    tag = "ΔΕΔΟΜΕΝΑ" + (f" · ΚΒΑΝΤΟ = {QUANTUM[n]}" if n in QUANTUM else "") + (" · 1 = ΠΙΟ ΣΗΜΑΝΤΙΚΗ" if has_prio(procs) else "")
    label(s, COL_L, y, COL_W, tag)
    b = data_table(s, COL_L, y + 283464, procs)
    blanks = " + ".join(["___"] * len(procs))
    if side: card(s, COL_L, b + 228600, COL_W - 914400, *side)
    else: card(s, COL_L, b + 228600, COL_W - 914400, "Μέσος χρόνος αναμονής", f"( {blanks} ) / {len(procs)} = ___", tone="gold")
    label(s, COL_R - 457200, y, COL_RW, "ΔΙΑΓΡΑΜΜΑ GANTT", GOLD)
    b = grid(s, COL_R - 457200, y + 283464, COL_RW + 457200, total)
    blank_table(s, COL_R - 457200, b + 91440, procs, alg in PRE, COL_RW + 457200)
    footer(s, "ΣΤΟ SITE", foot)
    return s

SOL_L = 7040880                      # πλάτος του πίνακα «βήμα-βήμα»
SOL_X = L + SOL_L + 228600           # αριστερά της δεξιάς στήλης στις λύσεις
ALG_NAME = {"rr": "ROUND ROBIN", "srtf": "SRTF", "prio": "PRIORITY", "prio-p": "PRIORITY ΜΕ ΔΙΑΚΟΠΗ", "fcfs": "FCFS", "sjf": "SJF"}

def solution(n, title, procs, alg, lesson, foot):
    """λύση άσκησης Gantt: γεμάτο Gantt, τι αποφασίζει ο χρονοδρομολογητής σε κάθε στιγμή, αναμονές, μέσος όρος"""
    mark_sol([n], nxt())
    q = QUANTUM.get(n)
    r = run(procs, alg, q)
    pre = alg in PRE
    s = new(nxt(), f"ΛΥΣΗ ΑΣΚΗΣΗΣ {n} · {ALG_NAME[alg]}" + (f" · ΚΒΑΝΤΟ {q}" if q else "") + " · ΒΗΜΑ-ΒΗΜΑ", title + ": λύση")
    y = gantt(s, L, TOP, W, segments(procs, r["cells"])) + 91440
    label(s, L, y, SOL_L, "ΤΙ ΑΠΟΦΑΣΙΖΕΙ Ο ΧΡΟΝΟΔΡΟΜΟΛΟΓΗΤΗΣ ΚΑΘΕ ΦΟΡΑ ΠΟΥ ΚΑΤΙ ΑΛΛΑΖΕΙ" if pre else
          "ΤΙ ΑΠΟΦΑΣΙΖΕΙ Ο ΧΡΟΝΟΔΡΟΜΟΛΟΓΗΤΗΣ ΚΑΘΕ ΦΟΡΑ ΠΟΥ ΑΔΕΙΑΖΕΙ Ο ΕΠΕΞΕΡΓΑΣΤΗΣ")
    head = {"rr": "Ουρά (πρώτη →)", "srtf": "Περιμένουν (υπόλοιπο)"}.get(alg, "Περιμένουν (προτερ.)")
    rows = decisions(procs, alg, r)
    table(s, L, y + 283464, [594360, 1600200, 1051560, SOL_L - 3246120],
          [["Στιγμή", head, "Τρέχει", "Γιατί"]] + rows, mono=(0, 2), size=9.5 if len(rows) > 5 else 10, row_h=338328)
    rw = R - SOL_X
    if pre:
        label(s, SOL_X, y, rw, "ΑΝΑΜΟΝΗ = ΤΕΛΟΣ − ΑΦΙΞΗ − ΕΚΤΕΛΕΣΗ", GOLD)
        wrows = [[p[0], f"{r['fin'][i]} − {p[1]} − {p[2]}", f"**{r['wait'][i]}**"] for i, p in enumerate(procs)]
        head2 = ["Διεργ.", "Τέλος − άφ. − εκτ.", "Αναμ."]
    else:
        label(s, SOL_X, y, rw, "ΑΝΑΜΟΝΗ = ΑΡΧΙΖΕΙ − ΑΦΙΞΗ", GOLD)
        wrows = [[p[0], f"{r['start'][i]} − {p[1]}", f"**{r['wait'][i]}**"] for i, p in enumerate(procs)]
        head2 = ["Διεργ.", "Αρχίζει − άφιξη", "Αναμ."]
    b = table(s, SOL_X, y + 283464, [777240, rw - 1554480, 777240], [head2] + wrows, mono=(0, 1, 2), size=10.5, row_h=320040)
    w = r["wait"]
    card(s, SOL_X, b + 137160, rw, "Μέσος όρος",
         f"({' + '.join(map(str, w))}) / {len(w)} = {sum(w)} / {len(w)} = **{num(sum(w) / len(w))}**\n{lesson}", tone="gold", size=10.5)
    footer(s, "ΘΥΜΗΣΟΥ", foot)
    return s

def quiz_solution(ns, title, rows, foot, row_h=621792):
    """λύση κουίζ: ερώτηση, σωστή απάντηση, γιατί"""
    mark_sol(ns, nxt())
    s = new(nxt(), "ΛΥΣΗ ΑΣΚΗΣΗΣ " + " · ".join(map(str, ns)), title)
    table(s, L, TOP, [3931920, 2286000, W - 6217920], [["Ερώτηση", "Σωστή απάντηση", "Γιατί"]] + rows,
          size=10.5, row_h=row_h, hl={(i + 1, 1): BLUE for i in range(len(rows))})
    footer(s, "ΘΥΜΗΣΟΥ", foot)
    return s

WIN = {13, 14}                                # ασκήσεις στη Γραμμή εντολών των Windows

def term_solution(left, right, foot, size=9):
    """λύση δύο ασκήσεων τερματικού: (αρ., εντολές και έξοδος, απαντήσεις) αριστερά και δεξιά"""
    ns = [left[0], right[0]]
    mark_sol(ns, nxt())
    s = new(nxt(), "ΛΥΣΗ ΑΣΚΗΣΕΩΝ " + " · ".join(map(str, ns)), "Τι γράφεις και τι βλέπεις")
    for (n, src, ans), x, w in ((left, COL_L, COL_W), (right, COL_R, COL_RW)):
        pr = "> " if n in WIN else "$ "
        src = "\n".join(l if l.startswith("»") or not l else pr + l for l in src.strip("\n").split("\n"))
        b = code(s, x, TOP, w, src, size=size, tag=f"ΑΣΚΗΣΗ {n} · ΕΝΤΟΛΕΣ ({pr.strip()}) ΚΑΙ ΕΞΟΔΟΣ")
        card(s, x, b + 137160, w, f"Απαντήσεις άσκησης {n}", ans, tone="gold", size=10.5)
    footer(s, "ΘΥΜΗΣΟΥ", foot)
    return s

def questions(n, kicker, title, rows, foot):
    """διαφάνεια κουίζ: ερωτήσεις και επιλογές (οι απαντήσεις στην επόμενη)"""
    mark(n, nxt())
    s = new(nxt(), kicker, title, lab=[n])
    table(s, L, TOP, [6400800, W - 6400800], [["Ερώτηση", "Επιλογές"]] + rows, size=12, row_h=502920)
    footer(s, "ΒΟΗΘΕΙΑ", foot)
    return s

# ---------- δεδομένα (ίδια με το lab.js) ----------
POTATO = [("P1", 0, 5), ("P2", 0, 3), ("P3", 0, 1)]                                   # άσκηση 2 (παιχνίδι)
A = [("P1", 0, 4), ("P2", 0, 2), ("P3", 0, 3)]                                        # ασκήσεις 3, 10
SR1 = [("P1", 0, 6), ("P2", 2, 2)]                                                    # άσκηση 4
HOME = [("P1", 0, 7), ("P2", 2, 4), ("P3", 4, 1), ("P4", 5, 4)]                       # ασκήσεις 5, 8 (άσκηση 9 του Εργ. 3)
PR = [("P1", 0, 4, 3), ("P2", 0, 3, 1), ("P3", 0, 2, 4), ("P4", 0, 1, 2)]             # άσκηση 6
PRP = [("P1", 0, 5, 3), ("P2", 1, 2, 1), ("P3", 2, 3, 2)]                             # άσκηση 7
QUANTUM = {2: 2, 3: 2, 10: 4}
# παραδείγματα της θεωρίας (όχι ασκήσεις)
EX_RR = [("P1", 0, 3), ("P2", 0, 4), ("P3", 0, 2)]
EX_SR = [("P1", 0, 4), ("P2", 1, 1), ("P3", 2, 3)]
EX_PR = [("P1", 0, 3, 2), ("P2", 0, 2, 1), ("P3", 0, 1, 3)]
EX_PP = [("P1", 0, 4, 2), ("P2", 1, 2, 1)]

def waits_line(procs, r): return ", ".join(f"{p[0]} = {r['wait'][i]}" for i, p in enumerate(procs))

# 1 · τίτλος
for sh in K.prs.slides[0].shapes:
    if not sh.has_text_frame: continue
    t = sh.text_frame.text
    if t.startswith("ΕΡΓΑΣΤΗΡΙΟ 4"):
        sh.text_frame.paragraphs[0].runs[0].text = f"ΕΡΓΑΣΤΗΡΙΟ 4 · ΕΝΟΤΗΤΑ 2.1.Β.2 · {DATE}"
    elif t.startswith("Παιχνίδι"):
        runs = sh.text_frame.paragraphs[0].runs
        runs[0].text = f"Θεωρία σε {K.STEPS} μικρά βήματα + 16 ασκήσεις με λύσεις βήμα-βήμα · καυτή πατάτα · Excel · {N_SLIDES} διαφάνειες"
        for x in runs[1:]: x.text = ""

# 2 · οι ασκήσεις (ο πίνακας μπαίνει στο τέλος, όταν ξέρουμε τους αριθμούς των διαφανειών)
overview = new(nxt(), "ΠΩΣ ΔΟΥΛΕΥΟΥΜΕ", "Οι 16 ασκήσεις του εργαστηρίου")
footer(overview, "ΠΩΣ", "Διαβάζεις το βήμα → λύνεις στο site την άσκηση της ετικέτας **ΣΤΟ ΕΡΓΑΣΤΗΡΙΟ** → ελέγχεις με τη **λύση** που ακολουθεί.")

# βήμα 1: με ή χωρίς διακοπή + λύση άσκησης 1
mark(1, nxt())
s = new(nxt(), step(1, "ΜΕ Ή ΧΩΡΙΣ ΔΙΑΚΟΠΗ"), "Μπορεί το ΛΣ να τη σταματήσει;", lab=[1])
y = prompt(s, L, TOP, W, "Μια διεργασία κρατά τον επεξεργαστή **10 λεπτά** κι εσύ θέλεις απλώς να κουνήσεις το ποντίκι. "
           "Με FCFS ή SJF περιμένεις να τελειώσει! Γι' αυτό τα σημερινά ΛΣ χρησιμοποιούν αλγορίθμους που **διακόπτουν**.", tag="Η ΕΡΩΤΗΣΗ ΤΗΣ ΗΜΕΡΑΣ")
y += 228600
card(s, COL_L, y, COL_W, "Χωρίς διακοπή · μη προεκχωρητικοί",
     "**FCFS** · **SJF** · **Priority** (απλή μορφή)\nΌποια διεργασία ξεκινήσει, **τελειώνει**. (Εργαστήριο 3)", h=1188720)
card(s, COL_R, y, COL_RW, "Με διακοπή · προεκχωρητικοί (preemptive)",
     "**Round Robin**: σταματά όταν λήξει το **κβάντο**\n**SRTF**: σταματά αν έρθει **πιο σύντομη**\n**Priority με διακοπή**: σταματά αν έρθει **πιο σημαντική**",
     tone="gold", h=1188720)
footer(s, "ΔΙΑΚΟΠΗ", "Η διεργασία που σταματά **δεν χάνεται**: γυρνά στην ουρά και συνεχίζει αργότερα από εκεί που έμεινε.")

quiz_solution([1], "Με ή χωρίς διακοπή: λύση", [
    ["FCFS", "Χωρίς διακοπή", "Με τη σειρά άφιξης, ως το τέλος."],
    ["SJF", "Χωρίς διακοπή", "Διαλέγει τη σύντομη **μόνο** όταν αδειάσει ο επεξεργαστής."],
    ["Round Robin", "Με διακοπή", "Σταματά τη διεργασία όταν λήξει το **κβάντο** της."],
    ["SRTF", "Με διακοπή", "Είναι το SJF **με διακοπή**: σταματά αν έρθει πιο σύντομη."],
    ["Priority (απλή μορφή)", "Χωρίς διακοπή", "Η πιο σημαντική περιμένει να τελειώσει αυτή που τρέχει."],
    ["Priority με διακοπή", "Με διακοπή", "Η πιο σημαντική **σταματά** αμέσως αυτή που τρέχει."],
    ["Ο αλγόριθμος που σταματά διεργασία στη μέση λέγεται…", "προεκχωρητικός", "Preemptive: «παίρνει πίσω» τον επεξεργαστή."],
], "Χωρίς διακοπή = **μη προεκχωρητικός** · με διακοπή = **προεκχωρητικός**.", row_h=548640)

# παιχνίδι: καυτή πατάτα
mark(2, nxt())
s = new(nxt(), "ΣΤΗΝ ΤΑΞΗ · 10΄", "Παιχνίδι: η καυτή πατάτα", lab=[2])
y = prompt(s, L, TOP, W, "Ένα μπαλάκι είναι ο **επεξεργαστής**. 3 εκπαιδευόμενοι είναι **διεργασίες** με κάρτες **5, 3 και 1** δευτερολέπτων. "
           "Το **κβάντο** είναι 2 δευτερόλεπτα. Ένας μετράει δυνατά, ο εκπαιδευτής γράφει στον πίνακα.", tag="ΤΙ ΚΑΝΟΥΜΕ")
y += 228600
cw = (W - 2 * 182880) // 3
for k, (t, body) in enumerate([
        ("1 · Κρατάς το μπαλάκι 2΄΄", "Όποιος έχει το μπαλάκι «τρέχει» και αφαιρεί **2** από την κάρτα του (ή ό,τι του έμεινε)."),
        ("2 · Το δίνεις στον επόμενο", "Αν σου έμειναν δευτερόλεπτα, πας στο **τέλος της ουράς** και περιμένεις ξανά τη σειρά σου."),
        ("3 · Τελείωσες;", "Κάρτα = 0: κάθεσαι και ο εκπαιδευτής γράφει **πότε τελείωσες**.")]):
    card(s, L + k * (cw + 182880), y, cw, t, body, h=1463040)
card(s, L, y + 1463040 + 182880, W, "Για τον εκπαιδευτή",
     "Σειρά: P1 → P2 → P3 → P1 → P2 → P1. Τελειώνουν: **P3 στο 5, P2 στο 8, P1 στο 9**.", tone="gold")
footer(s, "ΜΕΤΑ", "Ζωγράφισε στο site (**άσκηση 2**) τι έγινε στο παιχνίδι. Πρώτα δες τα βήματα 2 και 3.")

# βήμα 2: Round Robin
r = run(EX_RR, "rr", 2)
mark(2, nxt()); mark(3, nxt())
s = new(nxt(), step(2, "ROUND ROBIN"), "Round Robin: εκ περιτροπής", lab=[2, 3])
y = prompt(s, L, TOP, W, "Κάθε διεργασία παίρνει τον επεξεργαστή για ένα **κβάντο** χρόνου. Αν δεν τελειώσει, πάει στο **τέλος της ουράς**. "
           "Όλες παίρνουν σειρά: είναι **δίκαιος**.", tag="Η ΙΔΕΑ")
label(s, L, y + 228600, W, "ΠΑΡΑΔΕΙΓΜΑ · P1 = 3, P2 = 4, P3 = 2 · ΟΛΕΣ ΣΤΟ 0 · ΚΒΑΝΤΟ = 2", GOLD)
b = gantt(s, L, y + 493776, W, segments(EX_RR, r["cells"]))
card(s, COL_L, b + 137160, COL_W, "Ο κύκλος",
     "P1 2 → P2 2 → P3 2 (**τελείωσε**) → P1 1 (**τελείωσε**: δεν χρειάζεται όλο το κβάντο) → P2 2 (**τελείωσε**).")
card(s, COL_R, b + 137160, COL_RW, "Ο κανόνας της ουράς",
     "Αν τη στιγμή που λήγει ένα κβάντο **φτάνει** και νέα διεργασία, μπαίνει **πρώτα η νέα** και μετά αυτή που διακόπηκε.", tone="gold")
footer(s, "ΚΑΝΟΝΑΣ", "Τρέχει πάντα η **πρώτη** της ουράς, για **το πολύ** ένα κβάντο.")

# βήμα 3: αναμονή με διακοπή
mark(2, nxt()); mark(3, nxt())
s = new(nxt(), step(3, "ΑΝΑΜΟΝΗ ΜΕ ΔΙΑΚΟΠΗ"), "Πώς μετράω την αναμονή τώρα;", lab=[2, 3])
y = prompt(s, L, TOP, W, "Με διακοπή μια διεργασία περιμένει **πολλές φορές**, σε κομμάτια. Το «αρχίζει − άφιξη» δεν φτάνει: "
           "η P1 αρχίζει στο 0, αλλά μετά περιμένει από το 2 ως το 6.", tag="ΤΟ ΠΡΟΒΛΗΜΑ")
b = gantt(s, L, y + 228600, W, segments(EX_RR, r["cells"]))
rows = [["Διεργασία", "Κομμάτια αναμονής", "Τέλος − άφιξη − εκτέλεση", "Αναμονή"]]
for i, p in enumerate(EX_RR):
    gaps, last = [], p[1]
    for name, a, e in segments(EX_RR, r["cells"]):
        if name == p[0]:
            if a > last: gaps.append((last, a))
            last = e
    rows.append([p[0], " + ".join(f"({a}–{e}) {e - a}" for a, e in gaps) or "0",
                 f"{r['fin'][i]} − {p[1]} − {p[2]}", f"**{r['wait'][i]}**"])
table(s, L, b + 91440, [1188720, 4206240, 3474720, W - 8869680], rows, mono=(0, 1, 2, 3), size=11, row_h=338328)
footer(s, "ΤΥΠΟΣ", "Αναμονή = **τέλος − άφιξη − εκτέλεση**: όλη η ώρα στο σύστημα μείον την ώρα που έτρεχε. "
       f"Μέσος όρος {avg_txt(r['wait'])}.")

# άσκηση 2 + λύση
exercise(2, "ΑΣΚΗΣΗ 2 · ΕΥΚΟΛΟ", "Η καυτή πατάτα",
         "Ζωγράφισε το παιχνίδι: κάρτες **5, 3 και 1**, όλες στο 0, κβάντο **2**. Σειρά P1 → P2 → P3 και ξανά από την αρχή, μόνο όσες δεν τελείωσαν.",
         POTATO, "rr", "Με διακοπή ο πίνακας **δεν** έχει «Αρχίζει»: συμπληρώνεις μόνο **τέλος** και **αναμονή**.")
solution(2, "Η καυτή πατάτα", POTATO, "rr",
         "Η P3 χρειάζεται μόνο 1, αλλά περιμένει 4: πρώτα παίρνουν σειρά οι P1 και P2.",
         "Αν μια διεργασία τελειώσει **πριν** λήξει το κβάντο, ο επεξεργαστής πάει **αμέσως** στην επόμενη (η P3 στο 4–5).")
exercise(3, "ΑΣΚΗΣΗ 3 · ΕΥΚΟΛΟ", "Round Robin με κβάντο 2",
         "Όλες φτάνουν στο **0**, με σειρά P1, P2, P3. Κβάντο = **2**: κάθε διεργασία τρέχει το πολύ 2 κουτάκια και, αν δεν τελειώσει, πηγαίνει στο τέλος της ουράς.",
         A, "rr", "P1 στο 0–2, P2 στο 2–4 (και **τελειώνει**), P3 στο 4–6… και συνεχίζεις κυκλικά.")
solution(3, "Round Robin με κβάντο 2", A, "rr",
         "Η P2 (2) χωράει σε ένα κβάντο: τελειώνει με την πρώτη της σειρά.",
         "Αναμονή P3 = 9 − 0 − 3 = **6**: περίμενε 0–4 και 6–8. Ο τύπος βγάζει το ίδιο με τα κομμάτια.")

# βήμα 4: πόσο κβάντο
r1, r5 = run(EX_RR, "rr", 1), run(EX_RR, "rr", 5)
mark(10, nxt())
s = new(nxt(), step(4, "ΠΟΣΟ ΚΒΑΝΤΟ;"), "Μικρό ή μεγάλο κβάντο;", lab=[10])
y = TOP
for rr_, q, x, w in ((r1, 1, COL_L, COL_W), (r5, 5, COL_R, COL_RW)):
    segs = segments(EX_RR, rr_["cells"])
    label(s, x, y, w, f"ΤΟ ΙΔΙΟ ΠΑΡΑΔΕΙΓΜΑ · ΚΒΑΝΤΟ = {q} · {len(segs) - 1} ΕΝΑΛΛΑΓΕΣ", GOLD)
    gantt(s, x, y + 265176, w, segs)
y += 265176 + BAR_H + 365760
card(s, COL_L, y, COL_W, "Πολύ μικρό κβάντο",
     "Κάθε αλλαγή διεργασίας (**εναλλαγή**, context switch) θέλει χρόνο: το ΛΣ σώζει πού έμεινε η μία και φορτώνει την άλλη. "
     f"Πολλές εναλλαγές = **χαμένος χρόνος**. Μέσος όρος εδώ: {num(sum(r1['wait']) / 3)}.", h=1280160)
card(s, COL_R, y, COL_RW, "Πολύ μεγάλο κβάντο",
     "Καμία δεν χρειάζεται δεύτερη σειρά: ο Round Robin γίνεται **FCFS** (και ξαναβλέπουμε το φαινόμενο συνοδείας). "
     f"Μέσος όρος εδώ: {num(sum(r5['wait']) / 3)}.", tone="gold", h=1280160)
footer(s, "ΣΤΗΝ ΠΡΑΞΗ", "Το κβάντο είναι λίγα χιλιοστά του δευτερολέπτου (π.χ. **10–100 ms**): αρκετό για να μη χάνεται χρόνος, μικρό για να «πετάει» το ποντίκι.")

# βήμα 5: SRTF
r = run(EX_SR, "srtf")
mark(4, nxt()); mark(5, nxt())
s = new(nxt(), step(5, "SRTF"), "SRTF: όποια είναι πιο κοντά στο τέλος", lab=[4, 5])
y = prompt(s, L, TOP, W, "Είναι το **SJF με διακοπή**. Κάθε φορά που **φτάνει** νέα διεργασία, το ΛΣ κοιτάζει πόσος χρόνος **λείπει** από την καθεμία "
           "(υπόλοιπος χρόνος). Τρέχει όποια έχει τον **μικρότερο υπόλοιπο**.", tag="Η ΙΔΕΑ")
label(s, L, y + 228600, W, "ΠΑΡΑΔΕΙΓΜΑ · P1 (ΑΦΙΞΗ 0, ΕΚΤΕΛΕΣΗ 4) · P2 (1, 1) · P3 (2, 3)", GOLD)
b = gantt(s, L, y + 493776, W, segments(EX_SR, r["cells"]))
card(s, COL_L, b + 137160, COL_W, "Τι έγινε στο 1;",
     "Ήρθε η P2 (θέλει **1**). Στην P1 λείπουν ακόμα **3**. 1 < 3, άρα η P1 **σταματά** και τρέχει η P2.")
card(s, COL_R, b + 137160, COL_RW, "Ισοπαλία στο 2",
     "P1 και P3 θέλουν από **3**: πάει όποια **ήρθε πρώτη** (P1). Αν μία ήδη τρέχει, **συνεχίζει** αυτή.", tone="gold")
footer(s, "ΑΝΑΜΟΝΕΣ", f"{waits_line(EX_SR, r)} → μέσος όρος {avg_txt(r['wait'])}. Τύπος: **τέλος − άφιξη − εκτέλεση**.")

exercise(4, "ΑΣΚΗΣΗ 4 · ΕΥΚΟΛΟ", "SRTF: το πρώτο παράδειγμα",
         "Η P1 ξεκινά μόνη της. Στο **2** φτάνει η P2, που χρειάζεται μόνο **2**. Στην P1 λείπουν ακόμα **4**. Ποια συνεχίζει;",
         SR1, "srtf", "Το SRTF τρέχει όποια έχει τον **μικρότερο υπόλοιπο**: 2 < 4.")
solution(4, "SRTF: το πρώτο παράδειγμα", SR1, "srtf",
         "Με SJF (χωρίς διακοπή) η P2 θα περίμενε ως το 6: αναμονή 4 αντί για **0**.",
         "Η P1 κόβεται σε **δύο κομμάτια** (0–2 και 4–8). Περίμενε μόνο 2–4, άρα αναμονή **2**.")
exercise(5, "ΑΣΚΗΣΗ 5 · ΜΕΤΡΙΟ", "SRTF με 4 διεργασίες",
         "Κάθε φορά που φτάνει νέα διεργασία (στο **2**, στο **4**, στο **5**), σύγκρινε τον **υπόλοιπο** χρόνο όλων. Τρέχει η μικρότερη. "
         "Τα ίδια δεδομένα έλυσες με SJF στην άσκηση 9 του Εργαστηρίου 3.",
         HOME, "srtf", "Κράτα σε χαρτί τον υπόλοιπο χρόνο κάθε διεργασίας. Σε **ισοπαλία** συνεχίζει αυτή που ήδη τρέχει.")
solution(5, "SRTF με 4 διεργασίες", HOME, "srtf",
         "Με SJF ήταν **4**. Η διακοπή της μεγάλης P1 βοήθησε όλες τις μικρές.",
         "Στο 5 τελειώνει η P3 και φτάνει η P4: περιμένουν P1 (5), P2 (2), P4 (4). Τρέχει η **P2**, γιατί της λείπουν μόνο 2.")

# βήμα 6: Priority
r = run(EX_PR, "prio")
mark(6, nxt())
s = new(nxt(), step(6, "PRIORITY"), "Priority: πρώτα η πιο σημαντική", lab=[6])
y = prompt(s, L, TOP, W, "Κάθε διεργασία έχει έναν **αριθμό προτεραιότητας**. Όταν ελευθερωθεί ο επεξεργαστής, παίρνει η **πιο σημαντική** από όσες περιμένουν.", tag="Η ΙΔΕΑ")
label(s, L, y + 228600, W, "ΠΑΡΑΔΕΙΓΜΑ · ΟΛΕΣ ΣΤΟ 0 · P1 (ΕΚΤΕΛΕΣΗ 3, ΠΡΟΤΕΡ. 2) · P2 (2, 1) · P3 (1, 3)", GOLD)
b = gantt(s, L, y + 493776, W, segments(EX_PR, r["cells"]))
card(s, COL_L, b + 137160, COL_W, "Ο αριθμός",
     "Στις ασκήσεις μας **1 = πιο σημαντική**, όπως στο Linux. Στα Windows ισχύει το **ανάποδο** (βήμα 9).")
card(s, COL_R, b + 137160, COL_RW, "Χωρίς διακοπή",
     f"Όποια ξεκινήσει **τελειώνει**, ακόμα κι αν έρθει πιο σημαντική.\nΑναμονή = αρχίζει − άφιξη: {waits_line(EX_PR, r)} → **{num(sum(r['wait']) / 3)}**", tone="gold")
footer(s, "ΚΑΝΟΝΑΣ", "Όταν φτάνουν όλες μαζί: ταξινόμησε κατά **προτεραιότητα** (1, 2, 3 …) και μετά λύνεις όπως στο FCFS.")

exercise(6, "ΑΣΚΗΣΗ 6 · ΜΕΤΡΙΟ", "Priority χωρίς διακοπή",
         "Όλες φτάνουν στο **0**. Τρέχουν με σειρά προτεραιότητας (**1 = πιο σημαντική**). Καμία δεν διακόπτεται.",
         PR, "prio", "Πρώτα η 1, μετά η 2 … Αναμονή = **αρχίζει − άφιξη**.")
solution(6, "Priority χωρίς διακοπή", PR, "prio",
         "Η P3 είναι η λιγότερο σημαντική (4): περιμένει **8** για να τρέξει μόλις 2.",
         "Η σειρά βγαίνει από τη στήλη **Προτερ.** (P2 → P4 → P1 → P3), **όχι** από τον χρόνο εκτέλεσης.")

# βήμα 7: Priority με διακοπή, λιμοκτονία, γήρανση
r = run(EX_PP, "prio-p")
mark(7, nxt())
s = new(nxt(), step(7, "PRIORITY ΜΕ ΔΙΑΚΟΠΗ"), "Όταν έρχεται πιο σημαντική", lab=[7])
y = prompt(s, L, TOP, W, "Αν φτάσει **πιο σημαντική** διεργασία, αυτή που τρέχει **σταματά αμέσως** και γυρνά στην ουρά.", tag="Η ΙΔΕΑ")
label(s, L, y + 228600, W, "ΠΑΡΑΔΕΙΓΜΑ · P1 (ΑΦΙΞΗ 0, ΕΚΤΕΛΕΣΗ 4, ΠΡΟΤΕΡ. 2) · P2 (1, 2, 1)", GOLD)
b = gantt(s, L, y + 493776, W, segments(EX_PP, r["cells"]))
card(s, COL_L, b + 137160, COL_W, "Τι έγινε στο 1;",
     f"Ήρθε η P2 με προτεραιότητα **1**, πιο σημαντική από την P1 (**2**): η P1 σταματά και συνεχίζει στο 3.\n{waits_line(EX_PP, r)} → **{num(sum(r['wait']) / 2)}**")
card(s, COL_R, b + 137160, COL_RW, "Λιμοκτονία και γήρανση",
     "Αν έρχονται συνέχεια σημαντικές, μια ασήμαντη μπορεί να **μην τρέξει ποτέ** (λιμοκτονία). "
     "Λύση: η **γήρανση** (aging). Όσο περιμένει, η προτεραιότητά της **ανεβαίνει** σιγά σιγά.", tone="gold")
footer(s, "ΘΥΜΗΣΟΥ", "Με διακοπή η αναμονή είναι πάλι **τέλος − άφιξη − εκτέλεση**.")

exercise(7, "ΑΣΚΗΣΗ 7 · Ο ΣΤΟΧΟΣ", "Priority με διακοπή",
         "Αν φτάσει πιο σημαντική διεργασία, η τρέχουσα **σταματά** και περιμένει να ξανάρθει η σειρά της. Αναμονή = τέλος − άφιξη − εκτέλεση.",
         PRP, "prio-p", "Στο 1 φτάνει η P2 (**1**), πιο σημαντική από την P1 (**3**). Στο 2 φτάνει η P3 (**2**): είναι πιο σημαντική από την P2;")
solution(7, "Priority με διακοπή", PRP, "prio-p",
         "Η P1 (3) είναι η λιγότερο σημαντική: σταματά στο 1 και ξαναπαίρνει τον επεξεργαστή μόνο στο **6**.",
         "Στο 2 η P3 (2) **δεν** διακόπτει την P2 (1): διακόπτει μόνο η **πιο** σημαντική.")

# άσκηση 8: ποιος κερδίζει
mark(8, nxt())
s = new(nxt(), "ΑΣΚΗΣΗ 8 · ΔΥΣΚΟΛΟ", "Ποιος κερδίζει;", lab=[8])
y = prompt(s, L, TOP, W, "Τα δεδομένα της **άσκησης 5** με **τέσσερις** αλγορίθμους. Λύσε τους στο χαρτί ή στο Excel και γράψε τον μέσο χρόνο αναμονής του καθενός.") + 182880
label(s, COL_L, y, COL_W, "ΔΕΔΟΜΕΝΑ")
b = data_table(s, COL_L, y + 283464, HOME)
card(s, COL_L, b + 228600, COL_W - 914400, "Έχεις ήδη λύσει τα δύο",
     "**SJF**: άσκηση 9 του Εργαστηρίου 3 · **SRTF**: άσκηση 5.", tone="gold")
label(s, COL_R, y, COL_RW, "ΜΕΣΟΣ ΧΡΟΝΟΣ ΑΝΑΜΟΝΗΣ", GOLD)
table(s, COL_R, y + 283464, [COL_RW // 2] * 2, [["Αλγόριθμος", "Μέσος όρος"], ["FCFS", "___"], ["SJF", "___"], ["SRTF", "___"],
      ["Round Robin (κβάντο 2)", "___"], ["Ποιος κερδίζει;", "___"]], size=11.5, row_h=393192)
footer(s, "ROUND ROBIN", "Όποια φτάνει μπαίνει στην ουρά **πριν** από αυτήν που μόλις διακόπηκε (βήμα 2).")

mark_sol([8], nxt())
s = new(nxt(), "ΛΥΣΗ ΑΣΚΗΣΗΣ 8 · 4 ΑΛΓΟΡΙΘΜΟΙ · ΙΔΙΑ ΔΕΔΟΜΕΝΑ", "Ποιος κερδίζει: λύση")
y = TOP
avgs = {}
for alg, q, nm_ in (("fcfs", None, "FCFS"), ("sjf", None, "SJF"), ("srtf", None, "SRTF"), ("rr", 2, "ROUND ROBIN (ΚΒΑΝΤΟ 2)")):
    rr_ = run(HOME, alg, q)
    avgs[nm_] = sum(rr_["wait"]) / 4
    label(s, L, y, W, f"{nm_} · ΑΝΑΜΟΝΕΣ {', '.join(map(str, rr_['wait']))} · ΜΕΣΟΣ ΟΡΟΣ {num(avgs[nm_])}", BLUE if alg == "srtf" else GOLD)
    y = gantt(s, L, y + 228600, W, segments(HOME, rr_["cells"]), h=320040) + 27432
card(s, COL_L, y + 45720, COL_W, "Νικητής: SRTF (3)",
     "Θέλει όμως να **ξέρει από πριν** πόσο θα κρατήσει κάθε διεργασία. Στην πράξη το ΛΣ μόνο το **μαντεύει**.")
card(s, COL_R, y + 45720, COL_RW, "Και ο Round Robin (5);",
     "Δεν κερδίζει σε αναμονή, αλλά **καμία** διεργασία δεν κρατά τον επεξεργαστή για πολύ: γι' αυτό τον θέλουν τα ΛΣ.", tone="gold")
footer(s, "ΣΕΙΡΑ", "SRTF **3** < SJF **4** < FCFS **4,75** < Round Robin **5**.")

# άσκηση 9: κουίζ επανάληψης
REVIEW = [
    ("Ποιος αλγόριθμος εξυπηρετεί με σειρά άφιξης;", "FCFS · SJF · Round Robin · SRTF", "FCFS", "Πρώτος ήρθε, πρώτος εξυπηρετείται, όπως η ουρά στο ταμείο."),
    ("Ποιος δίνει τον μικρότερο μέσο χρόνο αναμονής χωρίς διακοπή;", "FCFS · SJF · Round Robin · SRTF", "SJF", "Οι σύντομες μπαίνουν μπροστά. (Με διακοπή κερδίζει το SRTF.)"),
    ("Τι είναι το κβάντο χρόνου;", "ο χρόνος κάθε σειράς στον RR · η συνολική εκτέλεση · η αναμονή", "ο χρόνος κάθε σειράς στον RR", "Το **πολύ** τόσο κρατά τον επεξεργαστή μια διεργασία κάθε φορά."),
    ("Ποιοι αλγόριθμοι διακόπτουν;", "FCFS και SJF · RR, SRTF, Priority με διακοπή · μόνο ο RR", "RR, SRTF, Priority με διακοπή", "Είναι οι **προεκχωρητικοί** του βήματος 1."),
    ("Τι είναι η λιμοκτονία;", "δεν παίρνει ποτέ επεξεργαστή · άδειος επεξεργαστής · γεμάτη μνήμη", "δεν παίρνει ποτέ επεξεργαστή", "Συμβαίνει στο SJF, στο SRTF και στο Priority."),
    ("Ποια λύση υπάρχει για τη λιμοκτονία;", "η γήρανση (aging) · μεγαλύτερο κβάντο · περισσότερη RAM", "η γήρανση (aging)", "Όσο περιμένει, η προτεραιότητα **ανεβαίνει**."),
    ("Τι γίνεται με πολύ μεγάλο κβάντο στον Round Robin;", "γίνεται σαν FCFS · γίνεται σαν SJF · πολλές εναλλαγές", "γίνεται σαν FCFS", "Καμία δεν χρειάζεται δεύτερη σειρά (άσκηση 10)."),
]
questions(9, "ΑΣΚΗΣΗ 9 · ΜΕΤΡΙΟ", "Κουίζ επανάληψης", [[q, o] for q, o, _, _ in REVIEW],
          "Οι ερωτήσεις του κουίζ. Αν κολλήσεις, ξαναδές τα **βήματα 1–7**.")
quiz_solution([9], "Κουίζ επανάληψης: λύση", [[q, a, why] for q, _, a, why in REVIEW],
              "Το **τεστ** έχει ερωτήσεις σαν αυτές και ένα Gantt με διακοπή.", row_h=548640)

# άσκηση 10: για το σπίτι
exercise(10, "ΑΣΚΗΣΗ 10 · ΓΙΑ ΤΟ ΣΠΙΤΙ", "Πολύ μεγάλο κβάντο",
         "Τα δεδομένα της **άσκησης 3**, αλλά με κβάντο **4**. Λύσε το και σύγκρινε με το FCFS: τι παρατηρείς;",
         A, "rr", "Με κβάντο 4 **καμία** διεργασία δεν χρειάζεται δεύτερη σειρά.")
solution(10, "Πολύ μεγάλο κβάντο", A, "rr",
         "Ίδιο ακριβώς με το **FCFS**. Με κβάντο 2 (άσκηση 3) ήταν 4.",
         "Αν το κβάντο είναι ≥ από τη μεγαλύτερη εκτέλεση, ο Round Robin **γίνεται FCFS**.")

# βήμα 8: nice / renice στο Linux
mark(11, nxt()); mark(12, nxt())
s = new(nxt(), step(8, "NICE ΣΤΟ LINUX"), "Προτεραιότητα στο Linux", lab=[11, 12])
b1 = code(s, COL_L, TOP, COL_W, '''
nice -n 10 gedit &      # ξεκίνα με nice 10
ps -o pid,ni,comm       # δες τη στήλη NI
ps -l                   # PRI = 80 + NI
nice -n -5 firefox &    # αρνητικό: μόνο ο root
''', size=10.5, tag="ΑΣΚΗΣΗ 11 · BASH")
b2 = code(s, COL_R, TOP, COL_RW, '''
pgrep paixnidi          # βρες το PID
renice -n 15 -p 2413    # νέο nice: 15
top                     # PR = 20 + NI
renice -n 0 -p 2413     # πίσω στο 0;
''', size=10.5, tag="ΑΣΚΗΣΗ 12 · BASH")
y = max(b1, b2) + 182880
card(s, COL_L, y, COL_W, "Η κλίμακα nice",
     "Από **−20** (πιο σημαντική) έως **19** (πιο «ευγενική»: αφήνει τις άλλες να περάσουν). Κανονικά **0**.\n"
     "Είναι το **Priority** των ασκήσεων, σε αληθινό σύστημα.", h=1280160)
card(s, COL_R, y, COL_RW, "Ποιος μπορεί τι",
     "Ο απλός χρήστης μπορεί μόνο να **ανεβάσει** το nice (να γίνει πιο ευγενικός). "
     "Αρνητικό nice ή επιστροφή προς τα κάτω: μόνο ο **root**. Αλλιώς: **Permission denied**.", tone="gold", h=1280160)
footer(s, "ΣΤΟ SITE", "Το PID του paixnidi στον δικό σου εξομοιωτή θα είναι άλλο: βάλε **αυτό που σου δείχνει το pgrep**.")
term_solution(
    (11, '''
nice -n 10 gedit &
»[1] 3196
ps -o pid,ni,comm
»    PID  NI COMMAND
»   3075   0 bash
»   3196  10 gedit
ps -l                        # μόνο οι στήλες μας
»    PID  PRI  NI CMD
»   3196   90  10 gedit
nice -n -5 firefox &
»nice: cannot set niceness: Permission denied
''', "Το NI του gedit: **10** · το PRI: 80 + 10 = **90**\n"
     "Αρνητικό nice δίνει μόνο ο **root** (διαχειριστής). Ο απλός χρήστης παίρνει **Permission denied**."),
    (12, '''
pgrep paixnidi
»2413
renice -n 15 -p 2413
»2413 (process ID) old priority 0, new priority 15
top
»    PID USER      PR  NI ... %CPU COMMAND
»   2413 mathitis  35  15 ... 99.7 paixnidi
»   2075 mathitis  39  19 ...  0.3 tracker-miner
renice -n 0 -p 2413
»renice: failed to set priority for 2413 … Permission denied
''', "PR του paixnidi μετά το renice: 20 + 15 = **35**\n"
     "Ήδη με NI **19**: το **tracker-miner** (ψάχνει αρχεία στο παρασκήνιο, δεν βιάζεται).\n"
     "Πίσω στο 0 **δεν** σε αφήνει: χαμηλότερο nice δίνει μόνο ο **root** (sudo)."),
    "Στο Linux **μικρότερος** αριθμός = **πιο σημαντική**. Το nice αλλάζει το NI, και το PR/PRI ακολουθεί.")

# βήμα 9: Windows
mark(13, nxt()); mark(14, nxt())
s = new(nxt(), step(9, "ΣΤΑ WINDOWS"), "Προτεραιότητα στα Windows", lab=[13, 14])
b = code(s, COL_L, TOP, COL_W, '''
start /low notepad
start /high calc
wmic process where name="notepad.exe" get name,priority
wmic process get name,processid,priority
''', size=9.5, tag="ΑΣΚΗΣΕΙΣ 13 ΚΑΙ 14 · CMD")
card(s, COL_L, b + 182880, COL_W, "Ασκήσεις 13 και 14",
     "Ποια προτεραιότητα έχει το Σημειωματάριο (/low) και ποια η Αριθμομηχανή (/high);\n"
     "Ποια έχει το **csrss.exe** και ποια το **explorer.exe**; Τι γίνεται αν πας να αλλάξεις το **lsass.exe**;", tone="gold")
table(s, COL_R, TOP, [1188720, (COL_RW - 1188720) // 2, (COL_RW - 1188720) // 2], [
    ["", "Windows", "Linux"],
    ["Κλίμακα", "4 … 24", "nice −20 … 19"],
    ["Κανονική", "**8** (Normal)", "**0**"],
    ["Πιο σημαντική", "**μεγαλύτερος** αριθμός", "**μικρότερος** αριθμός"],
    ["Ξεκίνα με", "start /low · /high", "nice -n 10"],
    ["Άλλαξε", "wmic … setpriority", "renice"],
    ["Δεν επιτρέπεται", "ReturnValue = 2", "Permission denied"],
], mono=(), size=10.5, row_h=429768)
footer(s, "ΠΡΟΣΟΧΗ", "Οι δύο κλίμακες είναι **ανάποδες**! Στα Windows ο **μεγάλος** αριθμός είναι ο σημαντικός, στο Linux ο **μικρός**.")
term_solution(
    (13, '''
start /low notepad
start /high calc
wmic process where name="notepad.exe" get name,priority
»Name         Priority
»notepad.exe  4
wmic process where name="CalculatorApp.exe" get name,priority
»Name               Priority
»CalculatorApp.exe  13
''', "Σημειωματάριο (/low): **4** · Αριθμομηχανή (/high): **13**\n"
     "Στα Windows μεγαλύτερος αριθμός = **πιο σημαντική**.\n"
     "Η Αριθμομηχανή λέγεται **CalculatorApp.exe** στη λίστα διεργασιών."),
    (14, '''
wmic process get name,processid,priority
»Name            Priority  ProcessId
»csrss.exe       13        1448
»explorer.exe    8         6172
»chrome.exe      8         6672      # … και άλλες
wmic process where name="csrss.exe" get name,priority
»Name       Priority
»csrss.exe  13
»csrss.exe  13
wmic process where name="lsass.exe" call setpriority "high priority"
»Method execution failed: Access denied.
»        ReturnValue = 2;
''', "csrss.exe: **13** (διεργασία του ΛΣ: δεν πρέπει να «κολλήσει» ποτέ) · explorer.exe: **8** (κανονική)\n"
     "lsass.exe: **ReturnValue = 2** (Access denied). Κρίσιμες διεργασίες του ΛΣ δεν αλλάζουν χωρίς διαχειριστή."),
    "**ReturnValue = 0** σημαίνει ότι η αλλαγή έγινε. Οτιδήποτε άλλο είναι **λάθος** (το 2 = δεν έχεις δικαίωμα).")

# βήμα 10: η ουρά των έτοιμων
mark(15, nxt()); mark(16, nxt())
s = new(nxt(), step(10, "Η ΟΥΡΑ ΤΩΝ ΕΤΟΙΜΩΝ"), "Πάγωσε και ταξινόμησε", lab=[15, 16])
b1 = code(s, COL_L, TOP, COL_W, '''
killall -STOP firefox   # νάρκωση σε όλες
top                     # Tasks: … N stopped
killall -CONT firefox   # αφύπνιση
''', size=10.5, tag="ΑΣΚΗΣΗ 15 · BASH")
b2 = code(s, COL_R, TOP, COL_RW, '''
ps -eo pid,ni,comm
ps -eo pid,ni,comm | sort -k2 -n | head -3
ps -eo pid,ni,comm | sort -k2 -nr | head -3
''', size=10, tag="ΑΣΚΗΣΗ 16 · BASH")
y = max(b1, b2) + 182880
card(s, COL_L, y, COL_W, "Μόνο οι έτοιμες παίζουν",
     "Ο χρονοδρομολογητής διαλέγει **μόνο** ανάμεσα σε όσες είναι **έτοιμες**. Μια παγωμένη (κατάσταση **T**) μένει στη μνήμη "
     "αλλά δεν παίρνει επεξεργαστή μέχρι το **-CONT**.\n**Βρες:** πόσες «stopped» δείχνει το top και ποιο σήμα τις πάγωσε.", h=1463040)
card(s, COL_R, y, COL_RW, "Ταξινόμηση κατά NI",
     "**-k2 -n**: 2η στήλη (NI), από το μικρότερο (πιο σημαντική).\n**-r**: ανάποδα, από το μεγαλύτερο (πιο ευγενική).\n"
     "**Βρες:** την πιο σημαντική διεργασία, το NI της και την πιο «ευγενική».", tone="gold", h=1463040)
footer(s, "ΘΥΜΗΣΟΥ", "Το **-STOP / -CONT** το είδαμε στο Εργαστήριο 2 (νάρκωση και αφύπνιση). Τώρα το βλέπουμε από τη μεριά του χρονοδρομολογητή.")
term_solution(
    (15, '''
killall -STOP firefox
top
»Tasks: 214 total,   1 running, 206 sleeping,
»       6 stopped,   0 zombie
killall -CONT firefox
''', "Το top γράφει **6 stopped**: όσες firefox πάγωσες.\n"
     "Τις πάγωσε το σήμα **SIGSTOP** (-STOP, αριθμός 19). Τις ξύπνησε το **SIGCONT**.\n"
     "Όσο είναι παγωμένες **δεν** διεκδικούν τον επεξεργαστή: η ουρά των Έτοιμων μικραίνει."),
    (16, '''
ps -eo pid,ni,comm | sort -k2 -n | head -3
»    397 -20 kworker/0:1H
»      1   0 systemd
»      2   0 kthreadd
ps -eo pid,ni,comm | sort -k2 -nr | head -3
»   3244  19 tracker-miner
»   4285   0 ps
»   3923   0 bash
''', "Πιο σημαντική: **kworker** (νήμα του πυρήνα) με NI **−20**.\n"
     "Πιο «ευγενική»: **tracker-miner** με NI **19**.\n"
     "Ο πυρήνας δίνει στον εαυτό του την **υψηλότερη** προτεραιότητα, οι δουλειές παρασκηνίου τη **χαμηλότερη**."),
    "Στο **sort**: -k2 = 2η στήλη · -n = αριθμητικά (αλλιώς το «-20» δεν μπαίνει σωστά) · -r = ανάποδα.")

# Excel + παραδοτέο
s = new(nxt(), "ΣΤΟ PC · 25΄", "Σύγκριση στο Excel και παραδοτέο")
b = code(s, COL_L, TOP, COL_W, '''
A1: Διεργασία  B1: Άφιξη  C1: Εκτέλεση  D1: Τέλος
E2: =D2-B2-C2            # αναμονή (σύρε κάτω)
E6: =AVERAGE(E2:E5)      # μέσος όρος
''', size=10.5, tag="XRONODROMOLOGISI.XLSX · ΝΕΟ ΦΥΛΛΟ «ΣΥΓΚΡΙΣΗ»")
cards(s, COL_L, b + 182880, COL_W, [
    ("4 λωρίδες χρόνου 0 … 16", "Μία γραμμή για **FCFS, SJF, SRTF, Round Robin** με τα δεδομένα της άσκησης 5. Χρωμάτισε τα κελιά όπως στο Εργαστήριο 3."),
    ("Γράφημα", "Επίλεξε τους 4 μέσους όρους → **Εισαγωγή → Γράφημα στηλών**. Ποια στήλη είναι η πιο χαμηλή;", "gold"),
])
table(s, COL_R, TOP, [457200, COL_RW - 457200], [
    ["#", "Παραδοτέο: απάντησε στο φύλλο εργασίας"],
    ["1", "Άσκηση 3 (Round Robin): μέσος χρόνος αναμονής"],
    ["2", "Άσκηση 5 (SRTF): μέσος χρόνος αναμονής"],
    ["3", "Άσκηση 6 (Priority): ποια διεργασία έτρεξε τελευταία;"],
    ["4", "Άσκηση 8: ποιος αλγόριθμος κέρδισε και με πόσο;"],
    ["5", "Γιατί τα Windows χρειάζονται αλγόριθμο με διακοπή;"],
    ["6", "Τι είναι η γήρανση και τι πρόβλημα λύνει;"],
], mono=(0,), size=11, row_h=457200)
footer(s, "ΑΝΕΒΑΣΕ", "το **Xronodromologisi.xlsx** με το φύλλο «Σύγκριση» και το γράφημα. Οι σωστοί μέσοι όροι είναι στη λύση της άσκησης 8.")

# σύνοψη
s = new(nxt(), "ΣΥΝΟΨΗ", "Τι κρατάμε από σήμερα")
cards(s, COL_L, TOP, COL_W, [
    ("Round Robin", "Ένα **κβάντο** στην καθεμία, κυκλικά. **Δίκαιος**. Πολύ μεγάλο κβάντο = FCFS."),
    ("SRTF", "Το SJF **με διακοπή**: τρέχει ο μικρότερος **υπόλοιπος** χρόνος. Μικρότερη μέση αναμονή."),
    ("Priority", "Πρώτα η **πιο σημαντική**, με ή χωρίς διακοπή. Κίνδυνος **λιμοκτονίας**, λύση η **γήρανση**."),
])
cards(s, COL_R, TOP, COL_RW, [
    ("Αναμονή με διακοπή", "**Τέλος − άφιξη − εκτέλεση**.\nΧωρίς διακοπή αρκεί το αρχίζει − άφιξη.", "gold"),
    ("Στο αληθινό ΛΣ", "Linux: **nice** −20 … 19 (μικρό = σημαντικό). Windows: **4 … 24** (μεγάλο = σημαντικό).", "gold"),
    (f"Επόμενο εργαστήριο · {NEXT}", "Πάμε στα **Windows**: MS-DOS και Γραμμή εντολών (cmd).", "gold"),
])
footer(s, "ΕΡΩΤΗΣΗ", "Ποια η διαφορά SJF και SRTF; Το SRTF **διακόπτει** όταν έρθει πιο σύντομη.")

# πίνακας ασκήσεων στη 2η διαφάνεια
NAMES = ["Με ή χωρίς διακοπή;", "Η καυτή πατάτα", "Round Robin με κβάντο 2", "SRTF: το πρώτο παράδειγμα",
         "SRTF με 4 διεργασίες", "Priority χωρίς διακοπή", "Priority με διακοπή", "Ποιος κερδίζει;",
         "Κουίζ επανάληψης", "Πολύ μεγάλο κβάντο", "nice: η ευγενική διεργασία", "renice: χαμήλωσε το «φορτηγό»",
         "start με προτεραιότητα", "Οι προτεραιότητες του συστήματος", "Πάγωσε μια ολόκληρη ουρά", "Ταξινόμησε κατά προτεραιότητα"]
LEVELS = ["Εύκολο", "Εύκολο", "Εύκολο", "Εύκολο", "Μέτριο", "Μέτριο", "Ο στόχος", "Δύσκολο",
          "Μέτριο", "Για το σπίτι", "Εύκολο", "Μέτριο", "Εύκολο", "Μέτριο", "Μέτριο", "Δύσκολο"]
lab_overview(overview, [(n, NAMES[n - 1], LEVELS[n - 1], f"{EX[n][0][-1]} → {EX[n][1]}") for n in range(1, 17)])
tf = box(overview, L, 5577840, W, 274320, MSO_ANCHOR.MIDDLE)
rich(tf.paragraphs[0], "Στήλη «Διαφάνεια»: **εκφώνηση → λύση**.", 11, MUTED)

finish("ΣΛΣ_Εργαστήριο04_Χρονοδρομολόγηση_SRTF_RR_Priority.pptx", N_SLIDES, "ΣΑΕΚ ΜΑΡΚΟΠΟΥΛΟΥ")
print("REFS:", ", ".join(f'e4{"abcdefghijklmnop"[n - 1]}: ["4", {sorted(set(EX[n][0]))}]' for n in range(1, 17)))
