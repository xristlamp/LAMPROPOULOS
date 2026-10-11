/*
  ΕΡΓΑΣΤΗΡΙΟ — εξομοιωτής Γραμμής εντολών (Windows) και Τερματικού (Linux) με αποστολές.
  Όλα τρέχουν μέσα στον browser: τίποτα δεν αγγίζει τον πραγματικό υπολογιστή του μαθητή.

  Για να προσθέσεις αποστολή, δες τις λίστες MISSIONS.windows / MISSIONS.linux πιο κάτω.
  Κάθε αποστολή: id (μοναδικό), ico, title, desc, hint (η εντολή-βοήθεια), check (πότε θεωρείται ολοκληρωμένη).
*/
(function () {
  "use strict";

  var XP = 15;
  var USER = "mathitis";

  // ================= βοηθητικά =================
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rep(ch, n) { return n > 0 ? new Array(n + 1).join(ch) : ""; }
  function pad(s, n) { s = String(s); return s.length >= n ? s : s + rep(" ", n - s.length); }
  function lpad(s, n) { s = String(s); return s.length >= n ? s : rep(" ", n - s.length) + s; }
  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function unq(s) { return s && s.length > 1 && /^(".*"|'.*')$/.test(s) ? s.slice(1, -1) : s; }
  function tokens(s) { return s.match(/"[^"]*"|'[^']*'|\S+/g) || []; }
  function bytes(s) { try { return new Blob([s]).size; } catch (e) { return s.length; } }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function has(args, f) { f = f.toLowerCase(); return args.some(function (a) { return a.toLowerCase() === f; }); }
  function glob(p) { return new RegExp("^" + p.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i"); }

  var NOW = function () { return new Date(); };
  var BOOT = new Date(Date.now() - (2 * 60 + 14) * 60000);
  var OLD = new Date(2026, 9, 6, 10, 15);
  var EN_M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var EN_D = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var GR_D = ["Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ"];
  function wdate(d) { return two(d.getDate()) + "/" + two(d.getMonth() + 1) + "/" + d.getFullYear() + "  " + two(d.getHours()) + ":" + two(d.getMinutes()); }
  function ldate(d) { return EN_M[d.getMonth()] + " " + lpad(d.getDate(), 2) + " " + two(d.getHours()) + ":" + two(d.getMinutes()); }
  function hms(d) { return two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds()); }
  function upFor() { var m = Math.floor((Date.now() - BOOT) / 60000); return Math.floor(m / 60) + ":" + two(m % 60); }

  // γραμμές εξόδου: string | {c: κλάση, s: κείμενο} | {h: html, s: κείμενο}
  function E(s) { return { c: "e", s: s }; }      // σφάλμα
  function T(s) { return { c: "t", s: "💡 " + s }; } // tip στα ελληνικά
  function G(s) { return { c: "g", s: s }; }      // επιτυχία
  function plain(it) { return typeof it === "string" ? it : it.s; }

  // ================= σύστημα αρχείων =================
  function D(c) { return { t: "d", c: c || {}, m: OLD }; }
  function F(x, sz) { return { t: "f", x: x || "", sz: sz, m: OLD }; }
  function fsize(n) { return n.t === "d" ? 4096 : n.sz != null ? n.sz : bytes(n.x); }

  function winFS() {
    return D({
      "Program Files": D({ "Google": D({ "Chrome": D({ "chrome.exe": F("", 2874368) }) }), "Microsoft VS Code": D({ "Code.exe": F("", 158392320) }) }),
      "Users": D({
        "mathitis": D({
          "Desktop": D({ "ergasia.txt": F("Εργασία: Γράψε 3 λειτουργικά συστήματα για κινητά.\n"), "Chrome.lnk": F("", 2312) }),
          "Documents": D({ "sxolio.txt": F("Το ΛΣ είναι ο «μεσάζων» ανάμεσα στον χρήστη, τις εφαρμογές και το υλικό.\n"), "programma.txt": F("Τρίτη 16:25-18:50  Σύγχρονα Λειτουργικά Συστήματα\n") }),
          "Downloads": D({ "setup.exe": F("", 4194304), "foto.jpg": F("", 245760) }),
          "Music": D(), "Pictures": D({ "diakopes.png": F("", 1048576) })
        }),
        "Public": D()
      }),
      "Windows": D({ "System32": D({ "cmd.exe": F("", 323584), "notepad.exe": F("", 360448), "calc.exe": F("", 28672), "taskmgr.exe": F("", 1527808) }), "explorer.exe": F("", 5517312) })
    });
  }

  var OS_RELEASE = 'PRETTY_NAME="Ubuntu 24.04.1 LTS"\nNAME="Ubuntu"\nVERSION_ID="24.04"\nVERSION="24.04.1 LTS (Noble Numbat)"\nVERSION_CODENAME=noble\nID=ubuntu\nID_LIKE=debian\nHOME_URL="https://www.ubuntu.com/"\n';
  function lnxFS() {
    return D({
      "bin": D({ "bash": F("", 1446024), "ls": F("", 142312), "cat": F("", 39432), "ps": F("", 137688) }),
      "etc": D({ "os-release": F(OS_RELEASE), "hostname": F("saek-pc\n"), "passwd": F("root:x:0:0:root:/root:/bin/bash\nmathitis:x:1000:1000:Mathitis:/home/mathitis:/bin/bash\n") }),
      "home": D({ "mathitis": D({
        ".bashrc": F("# ~/.bashrc\nalias ll='ls -l'\n"),
        "Desktop": D({ "ergasia.txt": F("Εργασία: Γράψε 3 διανομές Linux.\n") }),
        "Documents": D({ "sxolio.txt": F("Το ΛΣ είναι ο «μεσάζων» ανάμεσα στον χρήστη, τις εφαρμογές και το υλικό.\n"), "programma.txt": F("Τρίτη 16:25-18:50  Σύγχρονα Λειτουργικά Συστήματα\n") }),
        "Downloads": D({ "eikona.png": F("", 245760) }), "Music": D(), "Pictures": D()
      }) }),
      "proc": D({ "cpuinfo": F("processor\t: 0\nvendor_id\t: GenuineIntel\nmodel name\t: 11th Gen Intel(R) Core(TM) i5-11500 @ 2.70GHz\ncpu cores\t: 6\n"), "version": F("Linux version 6.8.0-45-generic (gcc 13.2.0) #45-Ubuntu SMP PREEMPT_DYNAMIC\n") }),
      "root": D(), "tmp": D(), "usr": D({ "bin": D(), "share": D() }),
      "var": D({ "log": D({ "syslog": F("Oct  6 10:15:01 saek-pc systemd[1]: Started Daily apt download activities.\n") }) })
    });
  }

  function child(node, name, ci) {
    if (!node || node.t !== "d") return null;
    if (Object.prototype.hasOwnProperty.call(node.c, name)) return { k: name, n: node.c[name] };
    if (ci) { var l = name.toLowerCase(); for (var k in node.c) if (k.toLowerCase() === l) return { k: k, n: node.c[k] }; }
    return null;
  }
  function at(s, arr) {
    var n = s.root, real = [];
    for (var i = 0; i < arr.length; i++) { var r = child(n, arr[i], s.win); if (!r) return null; n = r.n; real.push(r.k); }
    return { n: n, p: real };
  }
  function resolve(s, p) {
    var base, parts;
    p = unq(p);
    if (s.win) {
      p = p.replace(/\//g, "\\");
      if (/^[a-z]:\\?/i.test(p)) { base = []; p = p.replace(/^[a-z]:\\?/i, ""); }
      else if (p[0] === "\\") { base = []; p = p.slice(1); }
      else base = s.cwd.slice();
      parts = p.split("\\");
    } else {
      if (p === "~" || p.indexOf("~/") === 0) { base = s.home.slice(); p = p.slice(1).replace(/^\//, ""); }
      else if (p[0] === "/") { base = []; p = p.slice(1); }
      else base = s.cwd.slice();
      parts = p.split("/");
    }
    parts.forEach(function (x) { if (!x || x === ".") return; if (x === "..") { base.pop(); return; } base.push(x); });
    return base;
  }
  function canWrite(s, arr) {
    if (!s.win && arr[0] === "tmp") return true;
    for (var i = 0; i < s.home.length; i++) if (!arr[i] || arr[i].toLowerCase() !== s.home[i].toLowerCase()) return false;
    return true;
  }
  function findDirs(s, name) {
    var hits = [], low = name.toLowerCase();
    (function walk(n, path) {
      if (path.length > 6 || path[0] === "root" || path[0] === "proc") return;
      Object.keys(n.c).forEach(function (k) {
        var c = n.c[k];
        if (c.t !== "d") return;
        if (s.win ? k.toLowerCase() === low : k === name) hits.push(path.concat(k));
        walk(c, path.concat(k));
      });
    })(s.root, []);
    // πρώτα όσα είναι μέσα στο «σπίτι» του χρήστη
    return hits.sort(function (a, b) { return (isInside(b, s.home) ? 1 : 0) - (isInside(a, s.home) ? 1 : 0) || a.length - b.length; });
  }
  function cdHelp(s, p) {
    var name = unq(p).replace(/[\\/]+$/, "").split(/[\\/]/).pop();
    var where = s.win ? pathStr(s, s.cwd) : "/" + s.cwd.join("/");
    var hits = name && name !== ".." ? findDirs(s, name) : [];
    if (hits.length) {
      var full = s.win ? pathStr(s, hits[0]) : (isInside(hits[0], s.home) ? "~/" + hits[0].slice(s.home.length).join("/") : "/" + hits[0].join("/"));
      return T("Εδώ (" + where + ") δεν υπάρχει φάκελος «" + name + "». Βρίσκεται στο " + (s.win ? full : full.replace(/^~/, "/home/" + USER)) + " → δοκίμασε: cd " + (/\s/.test(full) ? '"' + full + '"' : full));
    }
    return T("Δεν υπάρχει φάκελος «" + name + "» εδώ (" + where + "). Γράψε " + (s.win ? "dir" : "ls") + " για να δεις τι υπάρχει." + (s.win ? " Για να γυρίσεις στον φάκελό σου: cd %USERPROFILE%" : " Για να γυρίσεις στο σπίτι σου: cd"));
  }
  function pathStr(s, arr) { return s.win ? "C:\\" + arr.join("\\") : "/" + arr.join("/"); }
  function parentOf(s, arr) { var r = at(s, arr.slice(0, -1)); return r && r.n.t === "d" ? r : null; }
  function isInside(a, b) { // είναι ο a μέσα στον b (ή ίδιος);
    if (b.length > a.length) return false;
    for (var i = 0; i < b.length; i++) if (a[i].toLowerCase() !== b[i].toLowerCase()) return false;
    return true;
  }

  // ================= διεργασίες =================
  function winProcs() {
    var list = [], pid = 4;
    function P(name, mem, sess, extra) {
      var p = { pid: pid, name: name, mem: mem, sess: sess, status: "Running" };
      for (var k in extra) p[k] = extra[k];
      list.push(p); pid += 4 * rnd(20, 260);
    }
    P("System", 144, 0, { crit: 1 }); P("Registry", 86420, 0, { crit: 1 }); P("smss.exe", 1280, 0, { crit: 1 });
    P("csrss.exe", 6012, 0, { crit: 1 }); P("wininit.exe", 7036, 0, { crit: 1 }); P("csrss.exe", 7744, 1, { crit: 1 });
    P("services.exe", 11320, 0, { crit: 1 }); P("lsass.exe", 25008, 0, { crit: 1 });
    for (var i = 0; i < 5; i++) P("svchost.exe", rnd(6000, 32000), 0, { crit: 1 });
    P("explorer.exe", 182344, 1); P("SearchHost.exe", 98112, 1);
    for (i = 0; i < 12; i++) P("chrome.exe", i === 0 ? 312540 : rnd(28000, 240000), 1);
    for (i = 0; i < 3; i++) P("Code.exe", rnd(60000, 210000), 1);
    P("Spotify.exe", 156200, 1); P("Spotify.exe", 48300, 1); P("Discord.exe", 214880, 1);
    P("paixnidi.exe", 1845320, 1, { status: "Not Responding", stuck: 1 });
    P("cmd.exe", 5120, 1, { self: 1 }); P("conhost.exe", 18240, 1, { self: 1 });
    return { list: list, next: pid };
  }
  function lnxProcs() {
    var list = [], pid = 1;
    function P(user, name, cmd, cpu, mem, rss, extra) {
      var p = { pid: pid, user: user, name: name, cmd: cmd, cpu: cpu, mem: mem, rss: rss, vsz: Math.round(rss * 2.7) + 1024, stat: "S", tty: "?", start: "08:01", time: "0:0" + rnd(0, 9) };
      for (var k in extra) p[k] = extra[k];
      list.push(p); pid = pid < 3 ? pid + 1 : pid + rnd(3, 400);
    }
    P("root", "systemd", "/sbin/init splash", 0.0, 0.1, 13120, { stat: "Ss", crit: 1 });
    P("root", "kthreadd", "[kthreadd]", 0.0, 0.0, 0, { crit: 1 });
    P("root", "systemd-journal", "/usr/lib/systemd/systemd-journald", 0.0, 0.2, 31220, { stat: "Ss", crit: 1 });
    P("root", "NetworkManager", "/usr/sbin/NetworkManager --no-daemon", 0.0, 0.1, 21300, { stat: "Ssl", crit: 1 });
    P(USER, "systemd", "/usr/lib/systemd/systemd --user", 0.0, 0.1, 12900, { stat: "Ss" });
    P(USER, "gnome-shell", "/usr/bin/gnome-shell", 2.1, 2.4, 389120, { stat: "Ssl" });
    P(USER, "firefox", "/usr/lib/firefox/firefox", 4.8, 3.1, 502340, { stat: "Sl" });
    for (var i = 0; i < 5; i++) P(USER, "firefox", "/usr/lib/firefox/firefox -contentproc -childID " + (i + 1) + " tab", +(Math.random() * 2).toFixed(1), +(0.6 + Math.random() * 1.4).toFixed(1), rnd(90000, 230000), { stat: "Sl" });
    for (i = 0; i < 3; i++) P(USER, "code", "/usr/share/code/code" + (i ? " --type=renderer" : ""), +(Math.random() * 1.5).toFixed(1), +(0.5 + Math.random()).toFixed(1), rnd(80000, 180000), { stat: "Sl" });
    P(USER, "spotify", "/snap/spotify/80/usr/share/spotify/spotify", 0.9, 1.2, 196400, { stat: "Sl" });
    P(USER, "paixnidi", "./paixnidi --level 7", 99.7, 11.4, 1845320, { stat: "R", stuck: 1, start: "09:42", time: "41:07" });
    P(USER, "bash", "bash", 0.0, 0.0, 5400, { stat: "Ss", tty: "pts/0", self: 1, start: "10:12" });
    return { list: list, next: pid };
  }
  function launch(s, name, extra) {
    var p = s.win
      ? { pid: s.procs.next, name: name, mem: rnd(12000, 90000), sess: 1, status: "Running" }
      : { pid: s.procs.next, user: USER, name: name, cmd: "/usr/bin/" + name, cpu: +(Math.random() * 3).toFixed(1), mem: +(0.3 + Math.random()).toFixed(1), rss: rnd(40000, 160000), stat: "Sl", tty: "pts/0", start: hms(NOW()).slice(0, 5), time: "0:00" };
    if (!s.win) p.vsz = p.rss * 3;
    for (var k in extra) p[k] = extra[k];
    s.procs.list.push(p); s.procs.next += s.win ? 4 * rnd(20, 200) : rnd(2, 60);
    return p;
  }
  function kill(s, p) { s.procs.list = s.procs.list.filter(function (x) { return x !== p; }); }
  function procNamed(s, n) { return s.procs.list.some(function (p) { return p.name.toLowerCase() === n; }); }

  // ================= WINDOWS =================
  var WIN_HELP = [
    ["CD", "Δείχνει ή αλλάζει τον τρέχοντα φάκελο", "cd Desktop  ·  cd ..  ·  cd \\"],
    ["CLS", "Καθαρίζει την οθόνη", "cls"],
    ["COLOR", "Αλλάζει χρώματα (φόντο + γράμματα)", "color 0a"],
    ["COPY", "Αντιγράφει αρχείο", "copy ergasia.txt antigrafo.txt"],
    ["DATE", "Δείχνει την ημερομηνία", "date /t"],
    ["DEL", "Διαγράφει αρχείο", "del hello.txt"],
    ["DIR", "Δείχνει τα αρχεία και τους φακέλους", "dir  ·  dir /b"],
    ["ECHO", "Εμφανίζει μήνυμα (με > το γράφει σε αρχείο)", "echo Γεια > hello.txt"],
    ["HOSTNAME", "Το όνομα του υπολογιστή", "hostname"],
    ["IPCONFIG", "Ρυθμίσεις δικτύου (διεύθυνση IP)", "ipconfig"],
    ["MKDIR", "Δημιουργεί φάκελο (ή MD)", "mkdir SAEK"],
    ["MOVE", "Μετακινεί αρχείο", "move hello.txt ..\\Documents"],
    ["PING", "Ελέγχει αν απαντά ένας υπολογιστής στο δίκτυο", "ping google.com"],
    ["REN", "Μετονομάζει αρχείο", "ren hello.txt geia.txt"],
    ["RMDIR", "Διαγράφει φάκελο (ή RD, /S με τα περιεχόμενα)", "rd SAEK"],
    ["START", "Ξεκινά πρόγραμμα", "start notepad"],
    ["SYSTEMINFO", "Πληροφορίες για το ΛΣ και το υλικό", "systeminfo"],
    ["TASKKILL", "Τερματίζει διεργασία (/IM όνομα ή /PID αριθμός, /F αναγκαστικά)", "taskkill /im notepad.exe"],
    ["TASKLIST", "Δείχνει τις διεργασίες που τρέχουν (/V, /FI φίλτρο)", "tasklist"],
    ["TIME", "Δείχνει την ώρα", "time /t"],
    ["TREE", "Δείχνει τους φακέλους σαν δέντρο (/F και αρχεία)", "tree"],
    ["TYPE", "Δείχνει το περιεχόμενο αρχείου κειμένου", "type ergasia.txt"],
    ["VER", "Η έκδοση των Windows", "ver"],
    ["WHOAMI", "Ποιος χρήστης είσαι", "whoami"]
  ];
  var WIN_CROSS = { ls: "dir", clear: "cls", pwd: "cd", ps: "tasklist", top: "tasklist", kill: "taskkill", killall: "taskkill /im", cat: "type", rm: "del", mv: "move ή ren", cp: "copy", ifconfig: "ipconfig", ip: "ipconfig", uname: "ver", free: "systeminfo", man: "help", touch: "echo. > αρχείο.txt", sudo: "(δεν υπάρχει στα Windows)", grep: "find ή findstr", nano: "notepad", df: "dir" };
  var WIN_APPS = { notepad: "notepad.exe", calc: "CalculatorApp.exe", mspaint: "mspaint.exe", chrome: "chrome.exe", explorer: "explorer.exe", code: "Code.exe", taskmgr: "Taskmgr.exe", cmd: "cmd.exe", winver: "winver.exe" };
  var CMD_COLORS = ["#0c0c0c","#0037da","#13a10e","#3a96dd","#c50f1f","#881798","#c19c00","#cccccc","#767676","#3b78ff","#16c60c","#61d6d6","#e74856","#b4009e","#f9f1a5","#f2f2f2"];

  function winApp(s, key) {
    var name = WIN_APPS[key];
    var p = launch(s, name);
    var out = [T("Άνοιξε το " + name + " (PID " + p.pid + "). Δες το με: tasklist /fi \"imagename eq " + name + "\"")];
    if (key === "explorer" && s.flags.noExplorer) { s.flags.noExplorer = 0; out.unshift(G("Η γραμμή εργασιών και η Επιφάνεια εργασίας επέστρεψαν! 😌")); }
    return out;
  }

  function winDirRows(s, r, bare) {
    var out = [];
    var isDir = r.n.t === "d";
    var names = isDir ? Object.keys(r.n.c).sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; }) : [r.p[r.p.length - 1]];
    var holder = isDir ? r.n : at(s, r.p.slice(0, -1)).n;
    if (bare) return names;
    out.push(" Volume in drive C is Windows", " Volume Serial Number is 4E2A-91B7", "", " Directory of " + pathStr(s, isDir ? r.p : r.p.slice(0, -1)), "");
    var nf = 0, nd = 0, tot = 0;
    if (isDir && r.p.length) { out.push(wdate(r.n.m) + "    <DIR>          ."); out.push(wdate(r.n.m) + "    <DIR>          .."); nd += 2; }
    names.forEach(function (k) {
      var n = holder.c[k];
      if (n.t === "d") { nd++; out.push(wdate(n.m) + "    <DIR>          " + k); }
      else { nf++; tot += fsize(n); out.push(wdate(n.m) + lpad(commas(fsize(n)), 18) + " " + k); }
    });
    out.push(lpad(nf, 16) + " File(s) " + lpad(commas(tot), 14) + " bytes");
    out.push(lpad(nd, 16) + " Dir(s)  187,402,240,000 bytes free");
    return out;
  }

  function winTasklist(s, args) {
    var verbose = has(args, "/v"), list = s.procs.list.slice(), filtered = false;
    for (var i = 0; i < args.length; i++) {
      if (args[i].toLowerCase() !== "/fi") continue;
      var f = unq(args[i + 1] || ""), m = f.match(/^\s*(\w+)\s+(eq|ne|gt|lt|ge|le)\s+(.+?)\s*$/i);
      if (!m) return [E("ERROR: The search filter cannot be recognized."), T("Παράδειγμα: tasklist /fi \"imagename eq chrome.exe\"")];
      var key = m[1].toLowerCase(), op = m[2].toLowerCase(), val = m[3].toLowerCase();
      filtered = true;
      list = list.filter(function (p) {
        var v = key === "imagename" ? p.name.toLowerCase() : key === "pid" ? p.pid : key === "status" ? p.status.toLowerCase() : key === "memusage" ? p.mem : key === "session" ? p.sess : null;
        if (v === null) return false;
        if (typeof v === "number") { var nv = +val; return op === "eq" ? v === nv : op === "ne" ? v !== nv : op === "gt" ? v > nv : op === "lt" ? v < nv : op === "ge" ? v >= nv : v <= nv; }
        var eq = glob(val).test(v);
        return op === "ne" ? !eq : eq;
      });
      if (key === "status" && /not ?responding/.test(val) && list.some(function (p) { return p.stuck; })) s.flags.foundStuck = 1;
    }
    if (filtered && !list.length) return ["INFO: No tasks are running which match the specified criteria."];
    if (verbose && list.some(function (p) { return p.stuck; })) s.flags.foundStuck = 1;
    var out = ["", "Image Name                     PID Session Name        Session#    Mem Usage" + (verbose ? " Status" : ""),
      "========================= ======== ================ =========== ============" + (verbose ? " ===============" : "")];
    list.forEach(function (p) {
      var row = pad(p.name, 25) + " " + lpad(p.pid, 8) + " " + pad(p.sess ? "Console" : "Services", 16) + " " + lpad(p.sess, 11) + " " + lpad(commas(p.mem) + " K", 12) + (verbose ? " " + p.status : "");
      out.push(p.stuck && verbose ? { c: "w", s: row } : row);
    });
    return out;
  }

  function winTaskkill(s, args) {
    var force = has(args, "/f"), ims = [], pids = [];
    for (var i = 0; i < args.length; i++) {
      var a = args[i].toLowerCase();
      if (a === "/im" && args[i + 1]) ims.push(unq(args[++i]).toLowerCase());
      else if (a === "/pid" && args[i + 1]) pids.push(+unq(args[++i]));
    }
    if (!ims.length && !pids.length) return [E("ERROR: Invalid syntax. Neither /FI nor /PID nor /IM were specified."), E('Type "TASKKILL /?" for usage.'), T("Παράδειγμα: taskkill /im notepad.exe  ή  taskkill /pid 1234")];
    var out = [];
    function one(p) {
      if (p.crit) { out.push(E('ERROR: The process "' + p.name + '" with PID ' + p.pid + " could not be terminated."), E("Reason: Access is denied.")); return; }
      if (p.self) { out.push(E('ERROR: The process "' + p.name + '" with PID ' + p.pid + " could not be terminated."), E("Reason: Access is denied."), T("Θα έκλεινες το ίδιο το παράθυρο που γράφεις! 😅")); return; }
      if (p.stuck && !force) { out.push(E('ERROR: The process "' + p.name + '" with PID ' + p.pid + " could not be terminated."), E("Reason: This process can only be terminated forcefully (with /F option)."), T("Η διεργασία έχει κολλήσει και δεν «ακούει». Πρόσθεσε το /f στο τέλος.")); return; }
      kill(s, p);
      out.push(G(force ? 'SUCCESS: The process "' + p.name + '" with PID ' + p.pid + " has been terminated." : 'SUCCESS: Sent termination signal to the process "' + p.name + '" with PID ' + p.pid + "."));
      if (p.name === "explorer.exe" && !procNamed(s, "explorer.exe")) { s.flags.noExplorer = 1; out.push(T("😱 Η γραμμή εργασιών και η Επιφάνεια εργασίας εξαφανίστηκαν! Γράψε: start explorer")); }
    }
    ims.forEach(function (im) {
      var re = glob(im), found = s.procs.list.filter(function (p) { return re.test(p.name); });
      if (!found.length) { out.push(E('ERROR: The process "' + im + '" not found.')); if (!/\.exe$/.test(im) && !/\*/.test(im)) out.push(T("Χρειάζεται ολόκληρο το όνομα, π.χ. " + im + ".exe")); return; }
      found.forEach(one);
    });
    pids.forEach(function (pid) {
      var p = s.procs.list.filter(function (x) { return x.pid === pid; })[0];
      if (!p) out.push(E('ERROR: The process "' + pid + '" not found.')); else one(p);
    });
    return out;
  }

  function winTree(s, r, files) {
    var out = ["Folder PATH listing for volume Windows", "Volume serial number is 4E2A-91B7", pathStr(s, r.p).toUpperCase()];
    (function walk(n, pre, depth) {
      var keys = Object.keys(n.c).filter(function (k) { return files || n.c[k].t === "d"; });
      var dirs = keys.filter(function (k) { return n.c[k].t === "d"; }), fl = keys.filter(function (k) { return n.c[k].t !== "d"; });
      fl.forEach(function (k) { out.push(pre + (dirs.length ? "│   " : "    ") + k); });
      if (fl.length) out.push(pre + (dirs.length ? "│" : ""));
      dirs.forEach(function (k, i) {
        var last = i === dirs.length - 1;
        out.push(pre + (last ? "└───" : "├───") + k);
        if (depth < 4) walk(n.c[k], pre + (last ? "    " : "│   "), depth + 1);
      });
    })(r.n, "", 0);
    if (out.length === 3) out.push("No subfolders exist");
    return out;
  }

  function ping(s, args) {
    var host = args.filter(function (a) { return !/^[-/]/.test(a) && !/^\d+$/.test(a); })[0];
    if (!host) return s.win ? ["", "Usage: ping [-n count] target_name"] : [E("ping: usage error: Destination address required")];
    var known = /^(localhost|127\.0\.0\.1)$/i.test(host), ok = known || /\./.test(host);
    if (!ok) return s.win ? ["Ping request could not find host " + host + ". Please check the name and try again."] : [E("ping: " + host + ": Name or service not known")];
    var h = 0; for (var i = 0; i < host.length; i++) h = (h * 31 + host.charCodeAt(i)) >>> 0;
    var ip = known ? "127.0.0.1" : /^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : (142 + h % 70) + "." + (h >>> 8 & 255) + "." + (h >>> 16 & 255) + "." + (1 + (h >>> 24) % 250);
    var times = [], out = [];
    for (i = 0; i < 4; i++) times.push(known ? 0 : rnd(9, 28));
    if (s.win) {
      out.push("", "Pinging " + host + (known || host === ip ? "" : " [" + ip + "]") + " with 32 bytes of data:");
      times.forEach(function (t) { out.push("Reply from " + ip + ": bytes=32 time" + (t ? "=" + t : "<1") + "ms TTL=" + (known ? 128 : 117)); });
      var mn = Math.min.apply(0, times), mx = Math.max.apply(0, times), av = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / 4);
      out.push("", "Ping statistics for " + ip + ":", "    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),", "Approximate round trip times in milli-seconds:", "    Minimum = " + mn + "ms, Maximum = " + mx + "ms, Average = " + av + "ms");
    } else {
      out.push("PING " + host + " (" + ip + ") 56(84) bytes of data.");
      times.forEach(function (t, i) { out.push("64 bytes from " + ip + ": icmp_seq=" + (i + 1) + " ttl=" + (known ? 64 : 117) + " time=" + (t ? t + "." + rnd(0, 9) : "0.0" + rnd(3, 9)) + " ms"); });
      out.push("", "--- " + host + " ping statistics ---", "4 packets transmitted, 4 received, 0% packet loss, time 3004ms");
      out.push(T("Στο αληθινό Linux το ping συνεχίζει για πάντα, μέχρι να πατήσεις Ctrl+C."));
    }
    return { out: out, delay: 550 };
  }

  var WIN = {
    help: function (s, a) {
      if (a[0]) {
        var h = WIN_HELP.filter(function (x) { return x[0].toLowerCase() === a[0].toLowerCase(); })[0];
        return h ? [h[0] + " — " + h[1], "", "Παράδειγμα:  " + h[2]] : ["This command is not supported by the help utility."];
      }
      var out = ["For more information on a specific command, type HELP command-name"];
      WIN_HELP.forEach(function (h) { out.push(pad(h[0], 12) + h[1]); });
      out.push(T("Εδώ φαίνονται οι εντολές του εξομοιωτή. Τα αληθινά Windows έχουν πολύ περισσότερες."));
      return out;
    },
    cls: function () { return { clear: true }; },
    ver: function () { return ["", "Microsoft Windows [Version 10.0.22631.4317]"]; },
    hostname: function () { return ["SAEK-PC07"]; },
    whoami: function () { return ["saek-pc07\\" + USER]; },
    systeminfo: function (s) {
      var used = s.procs.list.reduce(function (t, p) { return t + p.mem; }, 0);
      var avail = Math.max(1200, Math.round(16183 - used / 1024 - 2900));
      var b = BOOT;
      return ["", "Host Name:                 SAEK-PC07", "OS Name:                   Microsoft Windows 11 Pro", "OS Version:                10.0.22631 N/A Build 22631",
        "OS Manufacturer:           Microsoft Corporation", "OS Configuration:          Standalone Workstation", "OS Build Type:             Multiprocessor Free",
        "Registered Owner:          " + USER, "System Boot Time:          " + two(b.getDate()) + "/" + two(b.getMonth() + 1) + "/" + b.getFullYear() + ", " + hms(b),
        "System Manufacturer:       Dell Inc.", "System Model:              OptiPlex 7090", "System Type:               x64-based PC",
        "Processor(s):              1 Processor(s) Installed.", "                           [01]: Intel64 Family 6 Model 167 Stepping 1 GenuineIntel ~2701 Mhz",
        "BIOS Version:              Dell Inc. 1.21.0, 03/12/2025", "Windows Directory:         C:\\Windows", "System Directory:          C:\\Windows\\system32",
        "System Locale:             el;Greek", "Time Zone:                 (UTC+02:00) Athens, Bucharest",
        "Total Physical Memory:     16,183 MB", "Available Physical Memory: " + commas(avail) + " MB",
        "Network Card(s):           1 NIC(s) Installed.", "                           [01]: Intel(R) Ethernet Connection (14) I219-LM",
        "                                 Connection Name: Ethernet", "                                 IP address(es)", "                                 [01]: 192.168.1.107"];
    },
    date: function (s, a) {
      var d = NOW(), txt = GR_D[d.getDay()] + " " + two(d.getDate()) + "/" + two(d.getMonth() + 1) + "/" + d.getFullYear();
      return has(a, "/t") ? [txt] : ["The current date is: " + txt, T("Στα αληθινά Windows θα σου ζητούσε νέα ημερομηνία. Γράψε date /t για να τη δεις μόνο.")];
    },
    time: function (s, a) {
      var d = NOW();
      return has(a, "/t") ? [two(d.getHours()) + ":" + two(d.getMinutes())] : ["The current time is: " + hms(d) + ",00", T("Γράψε time /t για να δεις μόνο την ώρα.")];
    },
    echo: function (s, a, seg) { var t = seg.replace(/^echo\.?\s?/i, ""); return [/^echo\.$/i.test(seg.trim()) ? "" : t === "" ? "ECHO is on." : t]; },
    color: function (s, a) {
      var c = (a[0] || "").toLowerCase();
      if (!c) { s.color = null; return []; }
      if (!/^[0-9a-f]{1,2}$/.test(c)) return [T("Δύο δεκαεξαδικά ψηφία: φόντο + γράμματα, π.χ. color 0a (μαύρο + πράσινο) ή color 1f (μπλε + άσπρο)")];
      if (c.length === 1) c = "0" + c;
      if (c[0] === c[1]) return [T("Ίδιο χρώμα σε φόντο και γράμματα; Δεν θα φαινόταν τίποτα! 😄")];
      s.color = [CMD_COLORS[parseInt(c[0], 16)], CMD_COLORS[parseInt(c[1], 16)]];
      return [];
    },
    title: function () { return []; },
    dir: function (s, a) {
      var p = a.filter(function (x) { return x[0] !== "/"; })[0];
      var r = at(s, p ? resolve(s, p) : s.cwd);
      if (!r) return ["File Not Found"];
      return winDirRows(s, r, has(a, "/b"));
    },
    cd: function (s, a) {
      var p = a.filter(function (x) { return x.toLowerCase() !== "/d"; }).join(" ");
      if (!p) return [pathStr(s, s.cwd)];
      var r = at(s, resolve(s, p));
      if (!r) return [E("The system cannot find the path specified."), p.trim() === "~" ? T("Το ~ υπάρχει μόνο στο Linux. Στα Windows γράψε: cd %USERPROFILE%") : cdHelp(s, p)];
      if (r.n.t !== "d") return [E("The directory name is invalid.")];
      s.cwd = r.p; return [];
    },
    mkdir: function (s, a) {
      var out = [];
      if (!a.length) return [E("The syntax of the command is incorrect.")];
      a.forEach(function (p) {
        var arr = resolve(s, p);
        if (at(s, arr)) { out.push(E("A subdirectory or file " + unq(p) + " already exists.")); return; }
        if (!canWrite(s, arr)) { out.push(E("Access is denied."), T("Εδώ δεν έχεις δικαίωμα. Φτιάξε φακέλους μέσα στον δικό σου φάκελο (C:\\Users\\" + USER + ").")); return; }
        var n = s.root;
        arr.forEach(function (x) { var r = child(n, x, true); if (!r) { n.c[x] = D(); n.c[x].m = NOW(); n = n.c[x]; } else n = r.n; });
      });
      return out;
    },
    rmdir: function (s, a) {
      var sub = has(a, "/s"), ps = a.filter(function (x) { return x[0] !== "/"; }), out = [];
      if (!ps.length) return [E("The syntax of the command is incorrect.")];
      ps.forEach(function (p) {
        var arr = resolve(s, p), r = at(s, arr);
        if (!r) { out.push(E("The system cannot find the file specified.")); return; }
        if (r.n.t !== "d") { out.push(E("The directory name is invalid.")); return; }
        if (!canWrite(s, r.p) || r.p.length <= s.home.length) { out.push(E("Access is denied.")); return; }
        if (isInside(s.cwd, r.p)) { out.push(E("The process cannot access the file because it is being used by another process."), T("Βγες πρώτα από τον φάκελο με cd ..")); return; }
        if (Object.keys(r.n.c).length && !sub) { out.push(E("The directory is not empty."), T("Για να σβήσεις και τα περιεχόμενα: rd /s " + unq(p))); return; }
        delete parentOf(s, r.p).n.c[r.p[r.p.length - 1]];
      });
      return out;
    },
    type: function (s, a) {
      if (!a[0]) return [E("The syntax of the command is incorrect.")];
      var r = at(s, resolve(s, a[0]));
      if (!r) return [E("The system cannot find the file specified.")];
      if (r.n.t === "d") return [E("Access is denied.")];
      if (!r.n.x && r.n.sz) return ["MZ\u0090\u0003\u0004\u00ff\u00ff\u00b8@\u000e\u001f\u00ba\u000e\u00b4\t\u00cd!\u00b8\u0001L\u00cd!This program cannot be run in DOS mode.", T("Αυτό είναι πρόγραμμα ή εικόνα (δυαδικό αρχείο), όχι κείμενο. Γι' αυτό βλέπεις «κινέζικα».")];
      return r.n.x.replace(/\n$/, "").split("\n");
    },
    del: function (s, a) {
      var ps = a.filter(function (x) { return x[0] !== "/"; }), out = [];
      if (!ps.length) return [E("The syntax of the command is incorrect.")];
      ps.forEach(function (p) {
        var arr = resolve(s, p), name = arr.pop(), par = at(s, arr);
        if (!par || par.n.t !== "d") { out.push(E("The system cannot find the path specified.")); return; }
        var re = glob(name), keys = Object.keys(par.n.c).filter(function (k) { return re.test(k); });
        if (!keys.length) { out.push(E("Could Not Find " + pathStr(s, par.p.concat(name)))); return; }
        if (!canWrite(s, par.p)) { out.push(E("Access is denied.")); return; }
        keys.forEach(function (k) { if (par.n.c[k].t === "d") out.push(T(k + " είναι φάκελος. Για φακέλους χρησιμοποίησε: rd " + k)); else delete par.n.c[k]; });
      });
      return out;
    },
    ren: function (s, a) {
      if (a.length < 2) return [E("The syntax of the command is incorrect.")];
      var r = at(s, resolve(s, a[0]));
      if (!r) return [E("The system cannot find the file specified.")];
      var par = parentOf(s, r.p), nn = unq(a[1]);
      if (/[\\/]/.test(nn)) return [E("The syntax of the command is incorrect."), T("Στο ren γράφεις μόνο το νέο όνομα, όχι διαδρομή.")];
      if (child(par.n, nn, true)) return [E("A duplicate file name exists, or the file cannot be found.")];
      if (!canWrite(s, par.p)) return [E("Access is denied.")];
      par.n.c[nn] = r.n; delete par.n.c[r.p[r.p.length - 1]]; return [];
    },
    copy: function (s, a) { return winCopyMove(s, a, false); },
    move: function (s, a) { return winCopyMove(s, a, true); },
    tree: function (s, a) {
      var p = a.filter(function (x) { return x[0] !== "/"; })[0], r = at(s, p ? resolve(s, p) : s.cwd);
      if (!r || r.n.t !== "d") return [E("Invalid path - " + (p || ""))];
      return winTree(s, r, has(a, "/f"));
    },
    tasklist: function (s, a) { return winTasklist(s, a); },
    taskkill: function (s, a) { return winTaskkill(s, a); },
    ipconfig: function (s, a) {
      var all = has(a, "/all");
      var out = ["", "Windows IP Configuration", ""];
      if (all) out.push("   Host Name . . . . . . . . . . . . : SAEK-PC07", "   Primary Dns Suffix  . . . . . . . : ", "   Node Type . . . . . . . . . . . . : Hybrid", "");
      out.push("Ethernet adapter Ethernet:", "", "   Connection-specific DNS Suffix  . : saek.local");
      if (all) out.push("   Description . . . . . . . . . . . : Intel(R) Ethernet Connection (14) I219-LM", "   Physical Address. . . . . . . . . : 8C-04-BA-3F-21-7D", "   DHCP Enabled. . . . . . . . . . . : Yes");
      out.push("   IPv4 Address. . . . . . . . . . . : 192.168.1.107", "   Subnet Mask . . . . . . . . . . . : 255.255.255.0", "   Default Gateway . . . . . . . . . : 192.168.1.1");
      if (all) out.push("   DNS Servers . . . . . . . . . . . : 192.168.1.1");
      return out;
    },
    ping: function (s, a) { return ping(s, a); },
    start: function (s, a) {
      var k = (unq(a[0] || "") || "cmd").toLowerCase().replace(/\.exe$/, "");
      if (!WIN_APPS[k]) return [E("Windows cannot find '" + a[0] + "'. Make sure you typed the name correctly, and then try again.")];
      return winApp(s, k);
    },
    exit: function () { return [T("Στον εξομοιωτή το παράθυρο δεν κλείνει 😉 Στα αληθινά Windows το exit κλείνει τη Γραμμή εντολών.")]; }
  };
  WIN.chdir = WIN.cd; WIN.md = WIN.mkdir; WIN.rd = WIN.rmdir; WIN.erase = WIN.del; WIN.rename = WIN.ren;
  Object.keys(WIN_APPS).forEach(function (k) { if (!WIN[k]) WIN[k] = function (s) { return winApp(s, k); }; });

  function winCopyMove(s, a, mv) {
    var ps = a.filter(function (x) { return x[0] !== "/"; });
    if (ps.length < 2) return [E("The syntax of the command is incorrect.")];
    var r = at(s, resolve(s, ps[0]));
    if (!r) return [E("The system cannot find the file specified.")];
    if (r.n.t === "d" && !mv) return [E("The system cannot find the file specified."), T("Το copy αντιγράφει αρχεία. Για φακέλους στα αληθινά Windows υπάρχει το xcopy / robocopy.")];
    var dArr = resolve(s, ps[1]), d = at(s, dArr), par, name;
    if (d && d.n.t === "d") { par = d; name = r.p[r.p.length - 1]; }
    else { par = parentOf(s, dArr); name = dArr[dArr.length - 1]; if (!par) return [E("The system cannot find the path specified.")]; }
    if (!canWrite(s, par.p) || (mv && !canWrite(s, r.p))) return [E("Access is denied.")];
    var copy = r.n.t === "d" ? r.n : { t: "f", x: r.n.x, sz: r.n.sz, m: NOW() };
    par.n.c[name] = copy;
    if (mv) delete parentOf(s, r.p).n.c[r.p[r.p.length - 1]];
    return ["        1 file(s) " + (mv ? "moved." : "copied.")];
  }

  // ================= LINUX =================
  var LNX_HELP = [
    ["cat", "Δείχνει το περιεχόμενο αρχείου", "cat /etc/os-release"],
    ["cd", "Αλλάζει φάκελο (σκέτο cd = πίσω στο σπίτι σου)", "cd Desktop  ·  cd ..  ·  cd ~"],
    ["clear", "Καθαρίζει την οθόνη", "clear"],
    ["cp", "Αντιγράφει αρχείο", "cp ergasia.txt antigrafo.txt"],
    ["date", "Ημερομηνία και ώρα", "date"],
    ["df", "Χώρος στους δίσκους", "df -h"],
    ["echo", "Εμφανίζει μήνυμα (με > το γράφει σε αρχείο)", "echo Γεια > hello.txt"],
    ["free", "Μνήμη RAM", "free -h"],
    ["grep", "Ψάχνει γραμμές με μια λέξη (συνήθως μετά από |)", "ps aux | grep firefox"],
    ["history", "Οι εντολές που έγραψες", "history"],
    ["ip", "Ρυθμίσεις δικτύου", "ip a"],
    ["kill", "Στέλνει σήμα σε διεργασία (-9 = αναγκαστικά)", "kill 1234  ·  kill -9 1234"],
    ["killall", "Τερματίζει διεργασίες με βάση το όνομα", "killall firefox"],
    ["ls", "Δείχνει αρχεία και φακέλους (-l λεπτομέρειες, -a και κρυφά)", "ls -la"],
    ["lscpu", "Πληροφορίες επεξεργαστή", "lscpu"],
    ["man", "Εγχειρίδιο εντολής", "man ls"],
    ["mkdir", "Δημιουργεί φάκελο", "mkdir saek"],
    ["mv", "Μετακινεί ή μετονομάζει", "mv hello.txt geia.txt"],
    ["ping", "Ελέγχει αν απαντά ένας υπολογιστής", "ping google.com"],
    ["ps", "Δείχνει διεργασίες (aux = όλες)", "ps aux"],
    ["pwd", "Σε ποιον φάκελο βρίσκεσαι", "pwd"],
    ["rm", "Διαγράφει αρχείο (-r και φάκελο)", "rm hello.txt"],
    ["rmdir", "Διαγράφει άδειο φάκελο", "rmdir saek"],
    ["top", "Διεργασίες ταξινομημένες κατά CPU", "top"],
    ["touch", "Δημιουργεί άδειο αρχείο", "touch notes.txt"],
    ["uname", "Πληροφορίες πυρήνα / ΛΣ", "uname -a"],
    ["uptime", "Πόση ώρα είναι ανοιχτός ο υπολογιστής", "uptime"],
    ["whoami", "Ποιος χρήστης είσαι", "whoami"]
  ];
  var LNX_CROSS = { dir: "ls", cls: "clear", tasklist: "ps aux", taskkill: "kill ή killall", type: "cat", ipconfig: "ip a", ver: "uname -a", systeminfo: "uname -a  και  lscpu", del: "rm", erase: "rm", copy: "cp", ren: "mv", move: "mv", md: "mkdir", rd: "rmdir", notepad: "gedit ή nano", start: "όνομα-προγράμματος &", findstr: "grep", find: "grep" };
  var LNX_APPS = { firefox: 1, gedit: 1, code: 1, nautilus: 1, "gnome-calculator": 1, libreoffice: 1 };

  function perms(n) { return n.t === "d" ? "drwxr-xr-x" : n.sz && !n.x ? "-rwxr-xr-x" : "-rw-r--r--"; }
  function lsName(k, n) {
    if (n.t === "d") return { h: '<b class="ld">' + esc(k) + "</b>", s: k };
    if (n.sz && !n.x && /\.(png|jpg)$/i.test(k)) return { h: '<b class="lp">' + esc(k) + "</b>", s: k };
    if (n.sz && !n.x) return { h: '<b class="lx">' + esc(k) + "</b>", s: k };
    return { h: esc(k), s: k };
  }

  function lnxLs(s, a) {
    var flags = a.filter(function (x) { return x[0] === "-"; }).join("");
    var long = /l/.test(flags), all = /a/.test(flags);
    var ps = a.filter(function (x) { return x[0] !== "-"; });
    if (!ps.length) ps = ["."];
    var out = [];
    ps.forEach(function (p, idx) {
      var arr = resolve(s, p), r = at(s, arr);
      if (!r) { out.push(E("ls: cannot access '" + unq(p) + "': No such file or directory")); return; }
      if (r.p[0] === "root") { out.push(E("ls: cannot open directory '" + unq(p) + "': Permission denied")); return; }
      var entries;
      if (r.n.t === "d") {
        entries = Object.keys(r.n.c).filter(function (k) { return all || k[0] !== "."; }).sort(function (x, y) { return x.replace(/^\./, "").toLowerCase() < y.replace(/^\./, "").toLowerCase() ? -1 : 1; })
          .map(function (k) { return [k, r.n.c[k]]; });
        if (all) entries = [[".", r.n], ["..", r.n]].concat(entries);
      } else entries = [[unq(p), r.n]];
      if (ps.length > 1) { if (idx) out.push(""); out.push(unq(p) + ":"); }
      if (long) {
        var tot = entries.reduce(function (t, e) { return t + Math.ceil(fsize(e[1]) / 4096) * 4; }, 0);
        if (r.n.t === "d") out.push("total " + tot);
        entries.forEach(function (e) {
          var n = e[1], nm = lsName(e[0], n);
          var pre = perms(n) + " " + (n.t === "d" ? 2 : 1) + " " + USER + " " + USER + " " + lpad(fsize(n), 7) + " " + ldate(n.m) + " ";
          out.push({ h: esc(pre) + nm.h, s: pre + nm.s });
        });
      } else if (entries.length) {
        var parts = entries.map(function (e) { return lsName(e[0], e[1]); });
        out.push({ h: parts.map(function (x) { return x.h; }).join("  "), s: parts.map(function (x) { return x.s; }).join("  ") });
      }
    });
    return out;
  }

  function psRow(p) { return pad(p.user.length > 8 ? p.user.slice(0, 7) + "+" : p.user, 8) + lpad(p.pid, 8) + " " + lpad(p.cpu.toFixed(1), 4) + " " + lpad(p.mem.toFixed(1), 4) + " " + lpad(p.vsz, 7) + " " + lpad(p.rss, 6) + " " + pad(p.tty, 8) + " " + pad(p.stat, 4) + " " + pad(p.start, 5) + " " + lpad(p.time, 6) + " " + p.cmd; }
  function lnxPs(s, a, seg) {
    var opt = a.join(" ").replace(/-/g, "");
    var me = { pid: s.procs.next, user: USER, name: "ps", cmd: seg.trim(), cpu: 0, mem: 0.0, rss: 4400, vsz: 13900, stat: "R+", tty: "pts/0", start: hms(NOW()).slice(0, 5), time: "0:00" };
    var list = s.procs.list.concat([me]);
    if (/aux|ax|au/.test(opt)) {
      s.ran.psall = 1;
      return ["USER         PID %CPU %MEM     VSZ    RSS TTY      STAT START   TIME COMMAND"].concat(list.map(function (p) { return p.stuck ? { c: "w", s: psRow(p) } : psRow(p); }));
    }
    if (/ef/.test(opt)) {
      s.ran.psall = 1;
      return ["UID          PID    PPID  C STIME TTY          TIME CMD"].concat(list.map(function (p) { return pad(p.user, 8) + lpad(p.pid, 8) + lpad(p.pid < 3 ? 0 : 1, 8) + lpad(Math.round(p.cpu), 3) + " " + pad(p.start, 5) + " " + pad(p.tty, 8) + " 00:" + two(+p.time.split(":")[0] % 60) + ":" + p.time.split(":")[1] + " " + p.cmd; }));
    }
    var only = /e|A/.test(opt) ? list : list.filter(function (p) { return p.tty === "pts/0"; });
    if (only.length > 3) s.ran.psall = 1;
    return ["    PID TTY          TIME CMD"].concat(only.map(function (p) { return lpad(p.pid, 7) + " " + pad(p.tty, 8) + " 00:00:0" + rnd(0, 9) + " " + p.name; }));
  }

  function lnxTop(s) {
    s.ran.top = 1;
    var list = s.procs.list.slice().sort(function (x, y) { return y.cpu - x.cpu; });
    var cpu = Math.min(99, list.reduce(function (t, p) { return t + p.cpu; }, 0) / 12 + 2).toFixed(1);
    var used = list.reduce(function (t, p) { return t + p.rss; }, 0) / 1024 + 1800;
    var out = ["top - " + hms(NOW()) + " up " + lpad(upFor(), 5) + ",  1 user,  load average: " + (cpu / 25).toFixed(2) + ", 0.98, 0.87",
      "Tasks: 214 total,   " + list.filter(function (p) { return p.stat[0] === "R"; }).length + " running, 212 sleeping,   0 stopped,   0 zombie",
      "%Cpu(s): " + lpad(cpu, 4) + " us,  3.1 sy,  0.0 ni, " + (96.9 - cpu).toFixed(1) + " id,  0.0 wa,  0.0 hi,  0.0 si",
      "MiB Mem :  15803.6 total, " + lpad((15803.6 - used - 3371.6).toFixed(1), 8) + " free, " + lpad(used.toFixed(1), 8) + " used,   3371.6 buff/cache",
      "MiB Swap:   2048.0 total,   2048.0 free,      0.0 used. " + lpad((15803.6 - used).toFixed(1), 8) + " avail Mem", "",
      "    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND"];
    list.slice(0, 14).forEach(function (p) {
      var row = lpad(p.pid, 7) + " " + pad(p.user, 9) + " 20   0 " + lpad(p.vsz, 7) + " " + lpad(p.rss, 6) + " " + lpad(Math.round(p.rss / 4), 6) + " " + p.stat[0] + " " + lpad(p.cpu.toFixed(1), 5) + " " + lpad(p.mem.toFixed(1), 5) + " " + lpad(p.time + ".00", 9) + " " + p.name;
      out.push(p.stuck ? { c: "w", s: row } : row);
    });
    out.push(T("Στιγμιότυπο του top. Στο αληθινό top η λίστα ανανεώνεται συνέχεια και βγαίνεις πατώντας q."));
    return out;
  }

  function lnxKillProc(s, p, sig, out) {
    if (p.user === "root" || p.crit) { out.push(E("bash: kill: (" + p.pid + ") - Operation not permitted")); return false; }
    if (p.self) { out.push(T("Αυτό είναι το ίδιο το τερματικό (bash) που γράφεις! Δεν θα το κλείσουμε 😅")); return false; }
    if (p.stuck && sig !== 9) { s.flags.triedTerm = 1; out.push(T("Η διεργασία " + p.pid + " (" + p.name + ") αγνόησε το σήμα SIGTERM, έχει κολλήσει! Δοκίμασε αναγκαστικά: kill -9 " + p.pid)); return false; }
    kill(s, p); return true;
  }
  function sigOf(a) { var m = a.filter(function (x) { return /^-(\d+|KILL|SIGKILL|TERM|SIGTERM)$/i.test(x); })[0]; if (!m) return 15; m = m.slice(1).toUpperCase(); return /KILL/.test(m) ? 9 : /TERM/.test(m) ? 15 : +m; }

  function lnxReadFile(s, p) {
    var r = at(s, resolve(s, p));
    if (!r) return { err: "No such file or directory" };
    if (r.p[0] === "root") return { err: "Permission denied" };
    if (r.n.t === "d") return { err: "Is a directory" };
    return { lines: r.n.x.replace(/\n$/, "").split("\n"), n: r.n };
  }

  var LNX = {
    help: function () {
      var out = ["GNU bash, version 5.2.21(1)-release (x86_64-pc-linux-gnu)", "Εντολές του εξομοιωτή:", ""];
      LNX_HELP.forEach(function (h) { out.push(pad(h[0], 10) + h[1]); });
      out.push(T("Για κάθε εντολή: man <εντολή>, π.χ. man ls"));
      return out;
    },
    man: function (s, a) {
      if (!a[0]) return ["What manual page do you want?", "For example, try 'man man'."];
      var h = LNX_HELP.filter(function (x) { return x[0] === a[0]; })[0];
      if (!h) return [E("No manual entry for " + a[0])];
      return [a[0].toUpperCase() + "(1)                    User Commands                    " + a[0].toUpperCase() + "(1)", "", "NAME", "       " + h[0] + " - " + h[1], "", "EXAMPLE", "       " + h[2], "", T("Στο αληθινό Linux το man ανοίγει ολόκληρο εγχειρίδιο. Βγαίνεις πατώντας q.")];
    },
    clear: function () { return { clear: true }; },
    uname: function (s, a) {
      var f = a.join("");
      if (/a/.test(f)) return ["Linux saek-pc 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC Fri Aug 30 12:02:04 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux"];
      if (/r/.test(f)) return ["6.8.0-45-generic"];
      if (/m/.test(f)) return ["x86_64"];
      if (/n/.test(f)) return ["saek-pc"];
      return ["Linux"];
    },
    hostname: function () { return ["saek-pc"]; },
    whoami: function () { return [USER]; },
    id: function () { return ["uid=1000(mathitis) gid=1000(mathitis) groups=1000(mathitis),24(cdrom),27(plugdev),100(users)"]; },
    date: function () { var d = NOW(); return [EN_D[d.getDay()] + " " + EN_M[d.getMonth()] + " " + lpad(d.getDate(), 2) + " " + hms(d) + " EEST " + d.getFullYear()]; },
    echo: function (s, a, seg) {
      var t = seg.replace(/^echo\s?/, "").replace(/\s+-e\s/, " ");
      t = (t.match(/"[^"]*"|'[^']*'|\S+/g) || []).map(unq).join(" ");
      t = t.replace(/\$USER\b/g, USER).replace(/\$HOME\b/g, "/home/" + USER).replace(/\$SHELL\b/g, "/bin/bash").replace(/\$PWD\b/g, "/" + s.cwd.join("/")).replace(/\$HOSTNAME\b/g, "saek-pc");
      return [t];
    },
    pwd: function (s) { return ["/" + s.cwd.join("/")]; },
    ls: function (s, a) { return lnxLs(s, a); },
    ll: function (s, a) { return lnxLs(s, ["-l"].concat(a)); },
    cd: function (s, a) {
      var p = a[0];
      if (!p || p === "~") { s.cwd = s.home.slice(); return []; }
      var r = at(s, resolve(s, p));
      if (!r) return [E("bash: cd: " + unq(p) + ": No such file or directory"), cdHelp(s, p)];
      if (r.n.t !== "d") return [E("bash: cd: " + unq(p) + ": Not a directory")];
      if (r.p[0] === "root") return [E("bash: cd: " + unq(p) + ": Permission denied")];
      s.cwd = r.p; return [];
    },
    mkdir: function (s, a) {
      var pFlag = has(a, "-p"), out = [];
      var ps = a.filter(function (x) { return x[0] !== "-"; });
      if (!ps.length) return [E("mkdir: missing operand"), "Try 'mkdir --help' for more information."];
      ps.forEach(function (p) {
        var arr = resolve(s, p), name = unq(p);
        if (at(s, arr)) { if (!pFlag) out.push(E("mkdir: cannot create directory '" + name + "': File exists")); return; }
        if (!canWrite(s, arr)) { out.push(E("mkdir: cannot create directory '" + name + "': Permission denied"), T("Εδώ μόνο ο διαχειριστής (root) γράφει. Φτιάξε φακέλους μέσα στο ~ (το σπίτι σου).")); return; }
        var par = parentOf(s, arr);
        if (!par && !pFlag) { out.push(E("mkdir: cannot create directory '" + name + "': No such file or directory"), T("Ο γονικός φάκελος δεν υπάρχει. Με mkdir -p φτιάχνονται όλοι μαζί.")); return; }
        var n = s.root;
        arr.forEach(function (x) { var r = child(n, x); if (!r) { n.c[x] = D(); n.c[x].m = NOW(); n = n.c[x]; } else n = r.n; });
      });
      return out;
    },
    rmdir: function (s, a) {
      var out = [];
      a.forEach(function (p) {
        var r = at(s, resolve(s, p)), name = unq(p);
        if (!r) { out.push(E("rmdir: failed to remove '" + name + "': No such file or directory")); return; }
        if (r.n.t !== "d") { out.push(E("rmdir: failed to remove '" + name + "': Not a directory")); return; }
        if (!canWrite(s, r.p) || r.p.length <= s.home.length) { out.push(E("rmdir: failed to remove '" + name + "': Permission denied")); return; }
        if (Object.keys(r.n.c).length) { out.push(E("rmdir: failed to remove '" + name + "': Directory not empty"), T("Για φάκελο με περιεχόμενα: rm -r " + name)); return; }
        delete parentOf(s, r.p).n.c[r.p[r.p.length - 1]];
      });
      return out;
    },
    touch: function (s, a) {
      var out = [];
      a.filter(function (x) { return x[0] !== "-"; }).forEach(function (p) {
        var arr = resolve(s, p), r = at(s, arr), name = unq(p);
        if (r) { r.n.m = NOW(); return; }
        var par = parentOf(s, arr);
        if (!par) { out.push(E("touch: cannot touch '" + name + "': No such file or directory")); return; }
        if (!canWrite(s, arr)) { out.push(E("touch: cannot touch '" + name + "': Permission denied")); return; }
        par.n.c[arr[arr.length - 1]] = F(""); par.n.c[arr[arr.length - 1]].m = NOW();
      });
      if (!a.length) out.push(E("touch: missing file operand"));
      return out;
    },
    rm: function (s, a) {
      var rec = a.some(function (x) { return /^-\w*r/i.test(x); }), force = a.some(function (x) { return /^-\w*f/.test(x); }), out = [];
      var ps = a.filter(function (x) { return x[0] !== "-"; });
      if (!ps.length) return [E("rm: missing operand")];
      ps.forEach(function (p) {
        var arr = resolve(s, p), name = arr.pop(), par = at(s, arr);
        var keys = par && par.n.t === "d" ? Object.keys(par.n.c).filter(function (k) { return glob(name).test(k) && (name[0] === "." || k[0] !== "."); }) : [];
        if (!keys.length) { if (!force) out.push(E("rm: cannot remove '" + unq(p) + "': No such file or directory")); return; }
        if (!canWrite(s, par.p.concat("x"))) { out.push(E("rm: cannot remove '" + unq(p) + "': Permission denied")); return; }
        keys.forEach(function (k) {
          var n = par.n.c[k];
          if (n.t === "d" && !rec) { out.push(E("rm: cannot remove '" + k + "': Is a directory"), T("Για φακέλους: rm -r " + k)); return; }
          if (n.t === "d" && isInside(s.cwd, par.p.concat(k))) { out.push(T("Είσαι μέσα σε αυτόν τον φάκελο! Βγες πρώτα με cd ..")); return; }
          if (par.p.concat(k).length <= s.home.length) { out.push(E("rm: cannot remove '" + k + "': Permission denied")); return; }
          delete par.n.c[k];
        });
      });
      return out;
    },
    cat: function (s, a) {
      if (!a.length) return [T("Γράψε και ένα αρχείο, π.χ. cat /etc/os-release")];
      var out = [];
      a.forEach(function (p) {
        var r = lnxReadFile(s, p);
        if (r.err) { out.push(E("cat: " + unq(p) + ": " + r.err)); return; }
        if (/os-release$/.test(p)) s.ran.osrelease = 1;
        if (!r.n.x && r.n.sz) { out.push("\u007fELF\u0002\u0001\u0001\u0000\u0000\u0000\u0000\u0000\u0003\u0000>\u0000\u0001\u0000\u0000\u0000\u00a0", T("Αυτό είναι πρόγραμμα ή εικόνα (δυαδικό αρχείο), όχι κείμενο.")); return; }
        out = out.concat(r.lines);
      });
      return out;
    },
    cp: function (s, a) { return lnxCpMv(s, a, false); },
    mv: function (s, a) { return lnxCpMv(s, a, true); },
    nano: function () { return [T("Ο εξομοιωτής δεν έχει επεξεργαστή κειμένου. Γράψε σε αρχείο έτσι: echo \"κείμενο\" > αρχείο.txt")]; },
    ps: function (s, a, seg) { return lnxPs(s, a, seg); },
    top: function (s) { return lnxTop(s); },
    htop: function (s) { return lnxTop(s); },
    kill: function (s, a) {
      if (has(a, "-l")) return [" 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP", " 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1", "11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM"];
      var sig = sigOf(a), pids = a.filter(function (x) { return /^\d+$/.test(x); }), out = [];
      if (!pids.length) return [E("kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]"), T("Βρες πρώτα το PID με ps aux και μετά: kill <PID>")];
      pids.forEach(function (x) {
        var p = s.procs.list.filter(function (q) { return q.pid === +x; })[0];
        if (!p) { out.push(E("bash: kill: (" + x + ") - No such process")); return; }
        if (lnxKillProc(s, p, sig, out)) out.push(T("Η διεργασία " + p.pid + " (" + p.name + ") τερματίστηκε. Επιβεβαίωσε με ps aux."));
      });
      return out;
    },
    killall: function (s, a) {
      var sig = sigOf(a), names = a.filter(function (x) { return x[0] !== "-"; }), out = [];
      if (!names.length) return [E("Usage: killall [OPTION]... [--] NAME..."), T("Παράδειγμα: killall firefox")];
      names.forEach(function (n) {
        var found = s.procs.list.filter(function (p) { return p.name === n; });
        if (!found.length) { out.push(n + ": no process found"); return; }
        var killed = 0;
        found.forEach(function (p) {
          var tmp = [];
          if (lnxKillProc(s, p, sig, tmp)) killed++;
          else if (p.user === "root") out.push(E("killall: " + n + "(" + p.pid + "): Operation not permitted"));
          else out = out.concat(tmp);
        });
        if (killed) out.push(T(killed === 1 ? "Η διεργασία «" + n + "» τερματίστηκε." : killed + " διεργασίες «" + n + "» τερματίστηκαν."));
      });
      return out;
    },
    pkill: function (s, a) {
      var sig = sigOf(a), pat = a.filter(function (x) { return x[0] !== "-"; })[0], out = [];
      if (!pat) return [E("pkill: no matching criteria specified")];
      s.procs.list.filter(function (p) { return p.name.indexOf(pat) >= 0; }).forEach(function (p) { lnxKillProc(s, p, sig, out); });
      return out.filter(function (o) { return o.c !== "e"; });
    },
    pgrep: function (s, a) {
      var pat = a.filter(function (x) { return x[0] !== "-"; })[0];
      if (!pat) return [E("pgrep: no matching criteria specified")];
      var m = s.procs.list.filter(function (p) { return p.name.indexOf(pat) >= 0; });
      if (/firefox/.test(pat)) s.flags.countFirefox = 1;
      return has(a, "-c") ? [String(m.length)] : m.map(function (p) { return String(p.pid); });
    },
    free: function (s, a) {
      var used = s.procs.list.reduce(function (t, p) { return t + p.rss; }, 0) + 1843200, tot = 16182936, cache = 3452518, free = tot - used - cache;
      if (has(a, "-h") || has(a, "--human")) {
        var g = function (k) { return k > 1048576 ? (k / 1048576).toFixed(1) + "Gi" : Math.round(k / 1024) + "Mi"; };
        return ["               total        used        free      shared  buff/cache   available", "Mem:" + lpad(g(tot), 16) + lpad(g(used), 12) + lpad(g(free), 12) + lpad("312Mi", 12) + lpad(g(cache), 12) + lpad(g(tot - used), 12), "Swap:" + lpad("2.0Gi", 15) + lpad("0B", 12) + lpad("2.0Gi", 12)];
      }
      return ["               total        used        free      shared  buff/cache   available", "Mem:" + lpad(tot, 16) + lpad(used, 12) + lpad(free, 12) + lpad(319488, 12) + lpad(cache, 12) + lpad(tot - used, 12), "Swap:" + lpad(2097148, 15) + lpad(0, 12) + lpad(2097148, 12), T("Οι αριθμοί είναι σε KiB. Δοκίμασε free -h για πιο «ανθρώπινη» μορφή.")];
    },
    df: function (s, a) {
      if (has(a, "-h")) return ["Filesystem      Size  Used Avail Use% Mounted on", "tmpfs           1.6G  2.1M  1.6G   1% /run", "/dev/nvme0n1p2  468G  121G  324G  28% /", "tmpfs           7.8G     0  7.8G   0% /dev/shm", "/dev/nvme0n1p1  1.1G  6.1M  1.1G   1% /boot/efi"];
      return ["Filesystem     1K-blocks      Used Available Use% Mounted on", "tmpfs            1618296      2148   1616148   1% /run", "/dev/nvme0n1p2 490617784 126877236 338738320  28% /", "tmpfs            8091468         0   8091468   0% /dev/shm", "/dev/nvme0n1p1    1098632      6220   1092412   1% /boot/efi", T("Δοκίμασε df -h για μεγέθη σε G/M.")];
    },
    lscpu: function () { return ["Architecture:             x86_64", "  CPU op-mode(s):         32-bit, 64-bit", "  Byte Order:             Little Endian", "CPU(s):                   12", "  On-line CPU(s) list:    0-11", "Vendor ID:                GenuineIntel", "  Model name:             11th Gen Intel(R) Core(TM) i5-11500 @ 2.70GHz", "    Thread(s) per core:   2", "    Core(s) per socket:   6", "    Socket(s):            1", "    CPU max MHz:          4600.0000", "Caches (sum of all):", "  L3:                     12 MiB (1 instance)"]; },
    nproc: function () { return ["12"]; },
    uptime: function () { return [" " + hms(NOW()) + " up " + lpad(upFor(), 5) + ",  1 user,  load average: 1.12, 0.98, 0.87"]; },
    ip: function (s, a) {
      if (!a.length) return ["Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }", T("Δοκίμασε: ip a")];
      return ["1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000", "    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00", "    inet 127.0.0.1/8 scope host lo",
        "2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000", "    link/ether 8c:04:ba:3f:21:7d brd ff:ff:ff:ff:ff:ff", "    inet 192.168.1.107/24 brd 192.168.1.255 scope global dynamic noprefixroute enp3s0", "       valid_lft 85912sec preferred_lft 85912sec"];
    },
    ifconfig: function () { return ["Command 'ifconfig' not found, but can be installed with:", "", "sudo apt install net-tools", "", T("Τα νέα Linux χρησιμοποιούν το ip a αντί για ifconfig.")]; },
    ping: function (s, a) { return ping(s, a); },
    history: function (s) { return s.hist.map(function (h, i) { return lpad(i + 1, 5) + "  " + h; }); },
    which: function (s, a) { return a.filter(function (x) { return LNX[x]; }).map(function (x) { return "/usr/bin/" + x; }); },
    sudo: function () { return ["[sudo] password for " + USER + ": ", E(USER + " is not in the sudoers file.  This incident will be reported."), T("Το sudo δίνει δικαιώματα διαχειριστή. Στο εργαστήριο δεν τα έχεις 😉")]; },
    apt: function () { return [E("E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)"), E("E: Unable to acquire the dpkg frontend lock, are you root?"), T("Για εγκατάσταση προγραμμάτων χρειάζεται sudo, δηλαδή δικαιώματα διαχειριστή.")]; },
    exit: function () { return [T("Στον εξομοιωτή το τερματικό δεν κλείνει 😉 Στο αληθινό Linux το exit κλείνει το τερματικό.")]; },
    grep: function (s, a) { var f = a.filter(function (x) { return x[0] !== "-"; }); if (f.length < 2) return [E("Usage: grep [OPTION]... PATTERNS [FILE]..."), T("Συνήθως: εντολή | grep λέξη")]; var r = lnxReadFile(s, f[1]); if (r.err) return [E("grep: " + unq(f[1]) + ": " + r.err)]; return FILTERS.grep(s, a.filter(function (x) { return x !== f[1]; }), r.lines); },
    wc: function (s, a) { var f = a.filter(function (x) { return x[0] !== "-"; })[0]; if (!f) return []; var r = lnxReadFile(s, f); if (r.err) return [E("wc: " + unq(f) + ": " + r.err)]; return [r.lines.length + " " + unq(f)]; },
    head: function (s, a) { var f = a.filter(function (x) { return x[0] !== "-" && !/^\d+$/.test(x); })[0]; var r = f && lnxReadFile(s, f); if (!r || r.err) return [E("head: cannot open '" + (f || "") + "' for reading: No such file or directory")]; return FILTERS.head(s, a, r.lines); },
    tail: function (s, a) { var f = a.filter(function (x) { return x[0] !== "-" && !/^\d+$/.test(x); })[0]; var r = f && lnxReadFile(s, f); if (!r || r.err) return [E("tail: cannot open '" + (f || "") + "' for reading: No such file or directory")]; return FILTERS.tail(s, a, r.lines); }
  };
  Object.keys(LNX_APPS).forEach(function (k) {
    LNX[k] = function (s, a, seg) {
      var p = launch(s, k), bg = /&\s*$/.test(seg);
      return bg ? ["[1] " + p.pid] : [T("Άνοιξε το " + k + " (PID " + p.pid + "). Στο αληθινό τερματικό βάλε & στο τέλος (" + k + " &), αλλιώς το τερματικό «περιμένει» μέχρι να κλείσει.")];
    };
  });

  function lnxCpMv(s, a, mv) {
    var ps = a.filter(function (x) { return x[0] !== "-"; }), cmd = mv ? "mv" : "cp";
    if (ps.length < 2) return [E(cmd + ": missing destination file operand after '" + (ps[0] || "") + "'")];
    var r = at(s, resolve(s, ps[0]));
    if (!r) return [E(cmd + ": cannot stat '" + unq(ps[0]) + "': No such file or directory")];
    if (r.n.t === "d" && !mv && !a.some(function (x) { return /^-\w*r/i.test(x); })) return [E("cp: -r not specified; omitting directory '" + unq(ps[0]) + "'")];
    var dArr = resolve(s, ps[1]), d = at(s, dArr), par, name;
    if (d && d.n.t === "d") { par = d; name = r.p[r.p.length - 1]; }
    else { par = parentOf(s, dArr); name = dArr[dArr.length - 1]; if (!par) return [E(cmd + ": cannot create regular file '" + unq(ps[1]) + "': No such file or directory")]; }
    if (!canWrite(s, par.p.concat(name)) || (mv && !canWrite(s, r.p))) return [E(cmd + ": cannot " + (mv ? "move" : "create") + " '" + unq(ps[1]) + "': Permission denied")];
    par.n.c[name] = r.n.t === "d" ? (mv ? r.n : JSON.parse(JSON.stringify(r.n))) : { t: "f", x: r.n.x, sz: r.n.sz, m: NOW() };
    if (mv) delete parentOf(s, r.p).n.c[r.p[r.p.length - 1]];
    return [];
  }

  // ================= φίλτρα για pipes ( | ) =================
  var FILTERS = {
    // Windows
    find: function (s, a, lines) {
      var q = a.filter(function (x) { return x[0] === '"'; })[0];
      if (!q) return [E("FIND: Parameter format not correct"), T("Η λέξη θέλει εισαγωγικά: find \"chrome\"")];
      var ci = has(a, "/i"), inv = has(a, "/v"), cnt = has(a, "/c"), w = unq(q);
      var m = lines.filter(function (l) { var hit = ci ? l.toLowerCase().indexOf(w.toLowerCase()) >= 0 : l.indexOf(w) >= 0; return inv ? !hit : hit; });
      return cnt ? [String(m.length)] : m;
    },
    findstr: function (s, a, lines) {
      var ci = has(a, "/i"), w = a.filter(function (x) { return x[0] !== "/"; }).map(unq)[0] || "";
      return lines.filter(function (l) { return ci ? l.toLowerCase().indexOf(w.toLowerCase()) >= 0 : l.indexOf(w) >= 0; });
    },
    more: function (s, a, lines) { return lines; },
    sort: function (s, a, lines) { var r = lines.slice().sort(function (x, y) { return x.toLowerCase() < y.toLowerCase() ? -1 : 1; }); return has(a, "-r") || has(a, "/r") ? r.reverse() : r; },
    // Linux
    grep: function (s, a, lines) {
      var fl = a.filter(function (x) { return /^-[a-z]+$/i.test(x); }).join("");
      var w = a.filter(function (x) { return !/^-[a-z]+$/i.test(x); }).map(unq)[0];
      if (w == null) return [E("Usage: grep [OPTION]... PATTERNS [FILE]...")];
      var ci = /i/.test(fl), inv = /v/.test(fl), cnt = /c/.test(fl), num = /n/.test(fl), re;
      try { re = new RegExp(w, ci ? "i" : ""); } catch (e) { re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ci ? "i" : ""); }
      var m = [];
      lines.forEach(function (l, i) { if (re.test(l) !== inv) m.push(num ? (i + 1) + ":" + l : l); });
      return cnt ? [String(m.length)] : m;
    },
    wc: function (s, a, lines) { return has(a, "-l") ? [String(lines.length)] : [lpad(lines.length, 7) + lpad(lines.join(" ").split(/\s+/).filter(Boolean).length, 8) + lpad(lines.join("\n").length + 1, 8)]; },
    head: function (s, a, lines) { var n = 10, i = a.indexOf("-n"); if (i >= 0) n = +a[i + 1]; else { var m = a.filter(function (x) { return /^-\d+$/.test(x); })[0]; if (m) n = -m; } return lines.slice(0, n); },
    tail: function (s, a, lines) { var n = 10, i = a.indexOf("-n"); if (i >= 0) n = +a[i + 1]; else { var m = a.filter(function (x) { return /^-\d+$/.test(x); })[0]; if (m) n = -m; } return lines.slice(-n); },
    less: function (s, a, lines) { return lines; },
    uniq: function (s, a, lines) { return lines.filter(function (l, i) { return l !== lines[i - 1]; }); }
  };
  var WIN_FILTERS = { find: 1, findstr: 1, more: 1, sort: 1 };
  var LNX_FILTERS = { grep: 1, wc: 1, head: 1, tail: 1, less: 1, more: 1, sort: 1, uniq: 1 };

  // ================= ΑΠΟΣΤΟΛΕΣ =================
  function home(s) { return s.home; }
  var MISSIONS = {
    windows: [
      { id: "w1", ico: "🪪", title: "Ταυτότητα υπολογιστή", desc: "Μάθε ποιο Λειτουργικό Σύστημα και ποια έκδοση έχει ο υπολογιστής.", hint: ["systeminfo", "ver"], check: function (s) { return s.ran.systeminfo || s.ran.ver; } },
      { id: "w2", ico: "👤", title: "Ποιος είμαι;", desc: "Βρες με ποιον λογαριασμό χρήστη είσαι συνδεδεμένος/η.", hint: ["whoami"], check: function (s) { return s.ran.whoami; } },
      { id: "w3", ico: "📂", title: "Τι έχει ο φάκελός μου;", desc: "Δες τα αρχεία και τους φακέλους του τρέχοντος φακέλου.", hint: ["dir"], check: function (s) { return s.ran.dir; } },
      { id: "w4", ico: "🚶", title: "Πήγαινε στην Επιφάνεια εργασίας", desc: "Μπες στον φάκελο Desktop.", hint: ["cd Desktop"], check: function (s) { return /^desktop$/i.test(s.cwd[s.cwd.length - 1] || ""); } },
      { id: "w5", ico: "📁", title: "Φτιάξε τον φάκελο SAEK", desc: "Δημιούργησε φάκελο με όνομα SAEK μέσα στο Desktop.", hint: ["mkdir SAEK"], check: function (s) { var r = at(s, home(s).concat("Desktop", "SAEK")); return r && r.n.t === "d"; } },
      { id: "w6", ico: "✍️", title: "Γράψε ένα αρχείο", desc: "Μέσα στον φάκελο SAEK φτιάξε το αρχείο hello.txt που να γράφει «Γεια».", hint: ["cd SAEK", "echo Γεια > hello.txt", "type hello.txt"], check: function (s) { var r = at(s, home(s).concat("Desktop", "SAEK", "hello.txt")); return r && r.n.t === "f" && r.n.x.trim(); } },
      { id: "w7", ico: "📋", title: "Όλες οι διεργασίες", desc: "Δες τη λίστα με όλες τις διεργασίες που τρέχουν τώρα.", hint: ["tasklist"], check: function (s) { return s.ran.tasklist; } },
      { id: "w8", ico: "🔢", title: "Πόσα chrome;", desc: "Μέτρησε πόσες διεργασίες chrome.exe τρέχουν. (Ένα πρόγραμμα, πολλές διεργασίες!)", hint: ['tasklist | find /c "chrome"'], check: function (s) { return s.flags.countChrome; } },
      { id: "w9", ico: "🥶", title: "Ποιος κόλλησε;", desc: "Βρες ποια διεργασία δεν αποκρίνεται (Not Responding).", hint: ['tasklist /fi "status eq not responding"', "tasklist /v"], check: function (s) { return s.flags.foundStuck; } },
      { id: "w10", ico: "💀", title: "Τερμάτισε το κολλημένο", desc: "Κλείσε αναγκαστικά τη διεργασία που κόλλησε.", hint: ["taskkill /im paixnidi.exe /f"], check: function (s) { return !procNamed(s, "paixnidi.exe"); } },
      { id: "w11", ico: "📝", title: "Άνοιξε το Σημειωματάριο", desc: "Ξεκίνα το Σημειωματάριο από τη γραμμή εντολών.", hint: ["start notepad"], check: function (s) { return procNamed(s, "notepad.exe"); } },
      { id: "w12", ico: "🌐", title: "Η διεύθυνσή μου στο δίκτυο", desc: "Βρες την IPv4 διεύθυνση του υπολογιστή.", hint: ["ipconfig"], check: function (s) { return s.ran.ipconfig; } }
    ],
    linux: [
      { id: "l1", ico: "🐧", title: "Ποιο ΛΣ τρέχει;", desc: "Μάθε ποιος πυρήνας και ποια διανομή Linux τρέχει.", hint: ["uname -a", "cat /etc/os-release"], check: function (s) { return s.ran.uname || s.ran.osrelease; } },
      { id: "l2", ico: "👤", title: "Ποιος είμαι;", desc: "Βρες με ποιον χρήστη είσαι συνδεδεμένος/η.", hint: ["whoami"], check: function (s) { return s.ran.whoami || s.ran.id; } },
      { id: "l3", ico: "📍", title: "Πού βρίσκομαι;", desc: "Εμφάνισε ολόκληρη τη διαδρομή του φακέλου που βρίσκεσαι.", hint: ["pwd"], check: function (s) { return s.ran.pwd; } },
      { id: "l4", ico: "📂", title: "Τι έχει εδώ;", desc: "Δες τα αρχεία και τους φακέλους. Μπόνους: δες και τα κρυφά!", hint: ["ls", "ls -la"], check: function (s) { return s.ran.ls || s.ran.ll; } },
      { id: "l5", ico: "📁", title: "Φτιάξε τον φάκελο saek", desc: "Δημιούργησε φάκελο με όνομα saek μέσα στο Desktop.", hint: ["cd Desktop", "mkdir saek"], check: function (s) { var r = at(s, home(s).concat("Desktop", "saek")); return r && r.n.t === "d"; } },
      { id: "l6", ico: "✍️", title: "Γράψε ένα αρχείο", desc: "Μέσα στο saek φτιάξε το αρχείο hello.txt που να γράφει «Γεια».", hint: ["cd saek", "echo Γεια > hello.txt", "cat hello.txt"], check: function (s) { var r = at(s, home(s).concat("Desktop", "saek", "hello.txt")); return r && r.n.t === "f" && r.n.x.trim(); } },
      { id: "l7", ico: "📋", title: "Όλες οι διεργασίες", desc: "Δες όλες τις διεργασίες του συστήματος, όχι μόνο του τερματικού σου.", hint: ["ps aux"], check: function (s) { return s.ran.psall; } },
      { id: "l8", ico: "🔢", title: "Πόσα firefox;", desc: "Μέτρησε πόσες διεργασίες firefox τρέχουν.", hint: ["ps aux | grep -c firefox", "pgrep -c firefox"], check: function (s) { return s.flags.countFirefox; } },
      { id: "l9", ico: "🔥", title: "Ποιος «τρώει» τον επεξεργαστή;", desc: "Βρες ποια διεργασία έχει τη μεγαλύτερη χρήση CPU.", hint: ["top"], check: function (s) { return s.ran.top; } },
      { id: "l10", ico: "💀", title: "Σκότωσε το κολλημένο", desc: "Το «paixnidi» έχει κολλήσει στο 99% CPU. Τερμάτισέ το! (Ένα απλό kill δεν φτάνει…)", hint: ["killall -9 paixnidi", "kill -9 <PID>"], check: function (s) { return !procNamed(s, "paixnidi"); } },
      { id: "l11", ico: "🧠", title: "Πόση μνήμη RAM;", desc: "Δες πόση μνήμη έχει ο υπολογιστής και πόση είναι ελεύθερη.", hint: ["free -h"], check: function (s) { return s.ran.free; } },
      { id: "l12", ico: "💾", title: "Πόσος χώρος στον δίσκο;", desc: "Δες πόσος χώρος υπάρχει στους δίσκους.", hint: ["df -h"], check: function (s) { return s.ran.df; } }
    ]
  };

  // ================= μηχανή εκτέλεσης =================
  function splitPipe(line) {
    var out = [], cur = "", q = null;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (q) { if (ch === q) q = null; cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === "|") { out.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  }

  function findRedir(line) {
    var q = null;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (q) { if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === ">") {
        var app = line[i + 1] === ">", rest = line.slice(i + (app ? 2 : 1)).trim();
        return { cmd: line.slice(0, i).trim(), app: app, file: unq((rest.match(/^"[^"]*"|^'[^']*'|^\S+/) || [""])[0]) };
      }
    }
    return null;
  }

  function exec(s, seg) {
    var tk = tokens(seg), name = (tk[0] || "").toLowerCase(), args = tk.slice(1);
    if (s.win) {
      var mm = seg.match(/^(cd|chdir)([\\.].*)$/i);
      if (mm) { name = "cd"; args = [mm[2]]; }
      if (/^echo\./i.test(seg)) name = "echo";
      name = name.replace(/\.exe$/, "");
      if (/^[a-z]:$/i.test(name)) return name.toUpperCase() === "C:" ? [] : [E("The system cannot find the drive specified.")];
      if (args[0] === "/?") {
        var h = WIN_HELP.filter(function (x) { return x[0].toLowerCase() === name || (name === "md" && x[0] === "MKDIR") || (name === "rd" && x[0] === "RMDIR"); })[0];
        if (h) return [h[0] + " — " + h[1], "", "Παράδειγμα:  " + h[2]];
      }
    } else if (args[0] === "--help") {
      var lh = LNX_HELP.filter(function (x) { return x[0] === name; })[0];
      if (lh) return ["Usage: " + lh[2], lh[1]];
    }
    var table = s.win ? WIN : LNX;
    if (!name) return [];
    if (!Object.prototype.hasOwnProperty.call(table, name)) {
      var cross = (s.win ? WIN_CROSS : LNX_CROSS)[name];
      var out = s.win ? [E("'" + tk[0] + "' is not recognized as an internal or external command,"), E("operable program or batch file.")] : [E(tk[0] + ": command not found")];
      out.push(cross ? T("Αυτή είναι εντολή " + (s.win ? "Linux" : "Windows") + "! Εδώ η αντίστοιχη είναι: " + cross) : T("Γράψε " + (s.win ? "help" : "help") + " για να δεις τις εντολές που υπάρχουν."));
      return out;
    }
    s.ran[name] = 1;
    return table[name](s, args, seg) || [];
  }

  function runLine(s, raw, view) {
    var lineTxt = raw.trim();
    echoPrompt(s, raw);
    if (!lineTxt) return finish(s, view);
    if (s.hist[s.hist.length - 1] !== lineTxt) s.hist.push(lineTxt);
    s.hi = s.hist.length;
    // ανακατεύθυνση σε αρχείο: εντολή > αρχείο  /  εντολή >> αρχείο
    var redir = findRedir(lineTxt);
    if (redir) {
      if (!redir.file) { print(s, E(s.win ? "The syntax of the command is incorrect." : "bash: syntax error near unexpected token `newline'")); return finish(s, view); }
      lineTxt = redir.cmd;
    }

    if (s.win) lineTxt = lineTxt.replace(/%USERPROFILE%/gi, "C:\\Users\\" + USER).replace(/%HOMEPATH%/gi, "\\Users\\" + USER).replace(/%USERNAME%/gi, USER).replace(/%COMPUTERNAME%/gi, "SAEK-PC07").replace(/%CD%/gi, pathStr(s, s.cwd));
    var segs = splitPipe(lineTxt), low = lineTxt.toLowerCase();
    if (s.win && /^tasklist/.test(low) && /\|\s*find(str)?\b/.test(low) && /chrome/.test(low)) s.flags.countChrome = 1;
    if (!s.win && /^ps\b/.test(low) && /\|\s*grep\b/.test(low) && /firefox/.test(low)) s.flags.countFirefox = 1;
    if (!s.win && /^ps\b/.test(low) && /\|/.test(low)) s.ran.psall = 1;

    var res = exec(s, segs[0]);
    if (res && res.clear) { s.log = []; if (view) view.log.innerHTML = ""; return finish(s, view); }
    var delay = res && res.delay, out = Array.isArray(res) ? res : (res && res.out) || [];

    for (var i = 1; i < segs.length; i++) {
      var tk = tokens(segs[i]), fname = (tk[0] || "").toLowerCase();
      var ok = (s.win ? WIN_FILTERS : LNX_FILTERS)[fname];
      if (!ok) {
        out = s.win ? [E("'" + (tk[0] || "") + "' is not recognized as an internal or external command,"), E("operable program or batch file."), T("Μετά το | μπαίνει φίλτρο, π.χ. find, findstr, sort, more")] : [E((tk[0] || "") + ": command not found"), T("Μετά το | μπαίνει φίλτρο, π.χ. grep, wc -l, head, sort")];
        break;
      }
      var errs = out.filter(function (o) { return o.c === "e" || o.c === "t"; });
      out = errs.concat(FILTERS[fname](s, tk.slice(1), out.filter(function (o) { return o.c !== "e" && o.c !== "t"; }).map(plain)));
      delay = 0;
    }

    if (redir) {
      var arr = resolve(s, redir.file), par = parentOf(s, arr), msgs = out.filter(function (o) { return o.c === "e" || o.c === "t"; });
      var text = out.filter(function (o) { return o.c !== "e" && o.c !== "t"; }).map(plain).join("\n");
      if (!par) out = msgs.concat([E(s.win ? "The system cannot find the path specified." : "bash: " + redir.file + ": No such file or directory")]);
      else if (!canWrite(s, arr)) out = msgs.concat([E(s.win ? "Access is denied." : "bash: " + redir.file + ": Permission denied")]);
      else {
        var key = arr[arr.length - 1], ex = child(par.n, key, s.win);
        if (ex && ex.n.t === "d") out = [E(s.win ? "Access is denied." : "bash: " + redir.file + ": Is a directory")];
        else {
          var prev = ex && redir.app ? ex.n.x : "";
          if (ex) delete par.n.c[ex.k];
          par.n.c[ex ? ex.k : key] = { t: "f", x: prev + (text ? text + "\n" : ""), m: NOW() };
          out = msgs;
        }
      }
      delay = 0;
    }

    if (delay && out.length) {
      s.busy = true; if (view) view.line.style.visibility = "hidden";
      var idx = 0;
      (function step() {
        if (!s.busy) return;
        print(s, out[idx++]);
        if (idx < out.length) s.timer = setTimeout(step, /^(Reply|64 bytes)/.test(plain(out[idx])) ? delay : 40);
        else { s.busy = false; finish(s, view); }
      })();
      return;
    }
    out.forEach(function (o) { print(s, o); });
    finish(s, view);
  }

  // ================= προβολή =================
  var current = null, sims = {}, api = null, root = null;

  function promptHTML(s) {
    if (s.win) return esc("C:\\" + s.cwd.join("\\") + ">");
    var p = "/" + s.cwd.join("/"), h = "/" + s.home.join("/");
    if (p.indexOf(h) === 0) p = "~" + p.slice(h.length);
    return '<b class="pu">' + USER + "@saek-pc</b>:<b class=\"pp\">" + esc(p) + "</b>$";
  }
  function itemHTML(it) {
    if (typeof it === "string") return esc(it);
    if (it.h) return it.h;
    return '<span class="' + it.c + '">' + esc(it.s) + "</span>";
  }
  function print(s, it) {
    var html = "<div>" + (plain(it) === "" ? "&nbsp;" : itemHTML(it)) + "</div>";
    s.log.push(html);
    if (s.log.length > 700) s.log.splice(0, 200);
    if (s === current && root) { root.log.insertAdjacentHTML("beforeend", html); root.scr.scrollTop = root.scr.scrollHeight; }
  }
  function echoPrompt(s, raw) { print(s, { h: promptHTML(s) + (s.win ? "" : " ") + esc(raw), s: raw }); }

  function banner(s) {
    if (s.win) {
      ["Microsoft Windows [Version 10.0.22631.4317]", "(c) Microsoft Corporation. All rights reserved.", ""].forEach(function (l) { print(s, l); });
      print(s, T("Εξομοιωτής Γραμμής εντολών: γράψε εντολές και πάτα Enter. Ξεκίνα με help."));
    } else {
      ["Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-45-generic x86_64)", "", " * Documentation:  https://help.ubuntu.com", ""].forEach(function (l) { print(s, l); });
      print(s, T("Εξομοιωτής τερματικού Linux: γράψε εντολές και πάτα Enter. Ξεκίνα με help."));
    }
    print(s, "");
  }

  function newSim(os) {
    var win = os === "windows";
    var s = { os: os, win: win, root: win ? winFS() : lnxFS(), cwd: win ? ["Users", USER] : ["home", USER], home: win ? ["Users", USER] : ["home", USER],
      procs: win ? winProcs() : lnxProcs(), ran: {}, flags: {}, hist: [], hi: 0, log: [], busy: false, color: null };
    banner(s);
    return s;
  }

  function key(m) { return "lab:" + m.id; }

  function finish(s, view) {
    if (view && s === current) { view.line.style.visibility = ""; view.ps.innerHTML = promptHTML(s); applyColor(s); root.scr.scrollTop = root.scr.scrollHeight; }
    // έλεγχος αποστολών
    var ms = MISSIONS[s.os], newly = [];
    ms.forEach(function (m) { if (!api.isDone(key(m)) && m.check(s)) newly.push(m); });
    newly.forEach(function (m) {
      print(s, G("✔ Αποστολή «" + m.title + "» ολοκληρώθηκε! +" + XP + " XP"));
      api.award(key(m), XP, "🎯 " + m.title + " · +" + XP + " XP");
    });
    if (newly.length) {
      if (ms.every(function (m) { return api.isDone(key(m)); })) {
        print(s, G("🏆 Ολοκλήρωσες ΟΛΕΣ τις αποστολές " + (s.win ? "Windows" : "Linux") + "! Είσαι πλέον " + (s.win ? "μάγος της Γραμμής εντολών" : "Linux ninja") + "!"));
        setTimeout(function () { api.celebrate("🏆 Όλες οι αποστολές " + (s.win ? "Windows" : "Linux") + "!"); }, 900);
      }
      selected[s.os] = null;
      renderMissions();
    }
  }

  function applyColor(s) {
    if (!root) return;
    root.scr.style.background = s.color ? s.color[0] : "";
    root.scr.style.color = s.color ? s.color[1] : "";
  }

  var selected = {};
  function renderMissions() {
    if (!root || !current) return;
    var ms = MISSIONS[current.os], done = ms.filter(function (m) { return api.isDone(key(m)); }).length;
    var sel = selected[current.os];
    if (sel == null) { sel = ms.findIndex ? ms.findIndex(function (m) { return !api.isDone(key(m)); }) : 0; }
    root.count.textContent = done + "/" + ms.length;
    root.bar.style.width = (done / ms.length * 100) + "%";
    root.list.innerHTML = ms.map(function (m, i) {
      var ok = api.isDone(key(m)), open = i === sel;
      return '<li class="ms' + (ok ? " done" : "") + (open ? " open" : "") + '" data-i="' + i + '">' +
        '<button type="button" class="ms-row"><span class="ms-ico">' + (ok ? "✓" : m.ico) + '</span><span class="ms-t">' + esc(m.title) + '</span><span class="ms-xp">' + (ok ? "" : "+" + XP) + "</span></button>" +
        (open ? '<div class="ms-body"><p>' + esc(m.desc) + "</p>" +
          '<button type="button" class="ms-hint">💡 Θέλω βοήθεια</button>' +
          '<div class="ms-help" hidden>Δοκίμασε' + (m.hint.length > 1 ? " (μία-μία)" : "") + ":<br>" + m.hint.map(function (h) { return '<code data-cmd="' + esc(h) + '">' + esc(h) + "</code>"; }).join(" ") + "</div></div>" : "") +
        "</li>";
    }).join("");
  }

  var CHIPS = { windows: ["help", "cls", "dir", "cd ..", "tasklist", "systeminfo"], linux: ["help", "clear", "ls", "pwd", "cd ..", "ps aux"] };

  function mount(el, oses) {
    var os = oses.indexOf(store("labOS")) >= 0 ? store("labOS") : oses[0];
    if (!sims[os]) sims[os] = newSim(os);
    current = sims[os];
    var win = current.win;
    el.innerHTML =
      '<div class="lab">' +
        '<div class="lab-head">' +
          (oses.length > 1 ? '<div class="osw" role="tablist">' + oses.map(function (o) {
            return '<button type="button" role="tab" data-os="' + o + '" aria-selected="' + (o === os) + '">' + (o === "windows" ? "🪟 Windows" : "🐧 Linux") + "</button>";
          }).join("") + "</div>" : "") +
          '<span class="lab-sub">' + (win ? "Γραμμή εντολών (cmd)" : "Τερματικό (bash)") + " · εξομοιωτής για εξάσκηση</span>" +
          '<button type="button" class="btn check lab-reset" title="Ξεκινά ο υπολογιστής από την αρχή (οι αποστολές που έκανες μένουν)">↺ Επανεκκίνηση</button>' +
        "</div>" +
        '<div class="lab-grid">' +
          '<div class="vt ' + (win ? "vt-win" : "vt-lnx") + '">' +
            '<div class="vt-bar">' + (win
              ? '<span class="vt-ttl">▣ C:\\WINDOWS\\system32\\cmd.exe</span><span class="vt-ctl">─ ☐ ✕</span>'
              : '<span class="vt-dots"><i></i><i></i><i></i></span><span class="vt-ttl">' + USER + "@saek-pc: ~</span>") + "</div>" +
            '<div class="vt-scr"><div class="vt-log"></div><div class="vt-line"><span class="vt-ps"></span><input class="vt-in" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" aria-label="Γράψε εντολή"></div></div>' +
            '<div class="vt-chips">' + CHIPS[os].map(function (c) { return '<button type="button" data-run="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") +
              '<span class="vt-keys">↑↓ ιστορικό · Tab συμπλήρωση</span></div>' +
          "</div>" +
          '<aside class="missions sticker"><div class="ms-head"><b>🎯 Αποστολές</b><span class="pill" id="lab-count"></span></div>' +
            '<div class="xpbar"><i id="lab-bar"></i></div><ol class="ms-list"></ol>' +
            '<button type="button" class="ms-reset">↺ ξεκίνα τις αποστολές από την αρχή</button></aside>' +
        "</div>" +
      "</div>";

    root = {
      el: el, log: el.querySelector(".vt-log"), scr: el.querySelector(".vt-scr"), inp: el.querySelector(".vt-in"), ps: el.querySelector(".vt-ps"),
      line: el.querySelector(".vt-line"), list: el.querySelector(".ms-list"), count: el.querySelector("#lab-count"), bar: el.querySelector("#lab-bar")
    };
    root.log.innerHTML = current.log.join("");
    root.ps.innerHTML = promptHTML(current);
    root.line.style.visibility = current.busy ? "hidden" : "";
    applyColor(current);
    root.scr.scrollTop = root.scr.scrollHeight;
    renderMissions();
    var view = root;

    root.scr.addEventListener("click", function () {
      if (window.getSelection && String(window.getSelection())) return;
      try { root.inp.focus({ preventScroll: true }); } catch (e) { root.inp.focus(); }
    });
    root.inp.addEventListener("keydown", function (e) {
      var s = current;
      if (e.key === "c" && e.ctrlKey && !String(window.getSelection())) {
        e.preventDefault();
        if (s.busy) { s.busy = false; clearTimeout(s.timer); print(s, "^C"); finish(s, view); return; }
        echoPrompt(s, root.inp.value + "^C"); root.inp.value = ""; return;
      }
      if (e.key === "l" && e.ctrlKey) { e.preventDefault(); s.log = []; root.log.innerHTML = ""; return; }
      if (s.busy) { e.preventDefault(); return; }
      if (e.key === "Enter") { var v = root.inp.value; root.inp.value = ""; runLine(s, v, view); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (s.hi > 0) { s.hi--; root.inp.value = s.hist[s.hi] || ""; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (s.hi < s.hist.length) { s.hi++; root.inp.value = s.hist[s.hi] || ""; } }
      else if (e.key === "Tab") { e.preventDefault(); complete(s); }
    });
    el.querySelectorAll("[data-os]").forEach(function (b) {
      b.addEventListener("click", function () { store("labOS", b.dataset.os); mount(el, oses); });
    });
    el.querySelectorAll("[data-run]").forEach(function (b) {
      b.addEventListener("click", function () { if (current.busy) return; runLine(current, b.dataset.run, view); });
    });
    el.querySelector(".lab-reset").addEventListener("click", function () {
      clearTimeout(current.timer); sims[current.os] = newSim(current.os); mount(el, oses);
    });
    el.querySelector(".ms-reset").addEventListener("click", function () {
      if (!confirm("Να ξεκινήσουν οι αποστολές " + (current.win ? "Windows" : "Linux") + " από την αρχή; (Τα XP τους θα αφαιρεθούν)")) return;
      api.unaward(MISSIONS[current.os].map(key));
      clearTimeout(current.timer); sims[current.os] = newSim(current.os); selected[current.os] = null; mount(el, oses);
    });
    root.list.addEventListener("click", function (e) {
      var code = e.target.closest("[data-cmd]");
      if (code) {
        var c = code.dataset.cmd;
        root.inp.value = c.indexOf("<PID>") >= 0 ? c.replace("<PID>", "") : c;
        try { root.inp.focus({ preventScroll: true }); } catch (x) { root.inp.focus(); }
        return;
      }
      if (e.target.closest(".ms-hint")) { var h = e.target.closest("li").querySelector(".ms-help"); h.hidden = !h.hidden; return; }
      var li = e.target.closest("li.ms");
      if (li && e.target.closest(".ms-row")) { var i = +li.dataset.i; selected[current.os] = selected[current.os] === i ? -1 : i; renderMissions(); }
    });
  }

  function complete(s) {
    var v = root.inp.value, m = v.match(/^(.*?)(\S*)$/), before = m[1], word = m[2];
    var cands;
    if (!before.trim()) cands = Object.keys(s.win ? WIN : LNX);
    else {
      var base = word.replace(/[^\\/]*$/, ""), part = word.slice(base.length);
      var r = at(s, base ? resolve(s, base) : s.cwd);
      cands = r && r.n.t === "d" ? Object.keys(r.n.c).map(function (k) { return base + k + (r.n.c[k].t === "d" ? (s.win ? "\\" : "/") : ""); }) : [];
      word = base + part;
    }
    var hits = cands.filter(function (c) { return s.win ? c.toLowerCase().indexOf(word.toLowerCase()) === 0 : c.indexOf(word) === 0; });
    if (hits.length === 1) root.inp.value = before + (/\s/.test(hits[0]) ? '"' + hits[0] + '"' : hits[0]);
    else if (hits.length > 1) {
      var pre = hits.reduce(function (a, b) { var i = 0; while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++; return a.slice(0, i); });
      if (pre.length > word.length) root.inp.value = before + pre;
      else { echoPrompt(s, v); print(s, hits.join("  ")); }
    }
  }

  window.LAB = {
    render: function (el, oses, theApi) { api = theApi; mount(el, oses); },
    missions: MISSIONS,
    _test: { newSim: newSim, run: function (s, line) { current = s; runLine(s, line, null); }, setApi: function (a) { api = a; } }
  };
})();
