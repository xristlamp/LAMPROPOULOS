/*
  ΕΡΓΑΣΤΗΡΙΟ ΛΣ — ασκήσεις ανά εργαστήριο (κουίζ, αποστολές στο τερματικό, διαγράμματα Gantt)
  και ελεύθερος εξομοιωτής Γραμμής εντολών (Windows) και Τερματικού (Linux) με αποστολές.
  Όλα τρέχουν μέσα στον browser: τίποτα δεν αγγίζει τον πραγματικό υπολογιστή του μαθητή.

  Νέο εργαστήριο ή άσκηση: δες τη λίστα LESSONS πιο κάτω (οδηγίες ακριβώς από πάνω της).
  Αποστολές του ελεύθερου τερματικού: λίστες MISSIONS.windows / MISSIONS.linux.
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
      procs: win ? winProcs() : lnxProcs(), ran: {}, flags: {}, hist: [], hi: 0, log: [], busy: false, color: null, after: missionCheck };
    banner(s);
    return s;
  }

  function key(m) { return "lab:" + m.id; }

  function finish(s, view) {
    if (view && s === current) { view.line.style.visibility = ""; view.ps.innerHTML = promptHTML(s); applyColor(s); root.scr.scrollTop = root.scr.scrollHeight; }
    if (s.after) s.after(s);
  }

  // έλεγχος αποστολών (ελεύθερο τερματικό)
  function missionCheck(s) {
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
    if (!root || !current || !root.list) return;
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

  // το «παράθυρο» του τερματικού (ίδιο στο ελεύθερο τερματικό και στις ασκήσεις)
  function vtHTML(s) {
    return '<div class="vt ' + (s.win ? "vt-win" : "vt-lnx") + '">' +
      '<div class="vt-bar">' + (s.win
        ? '<span class="vt-ttl">▣ C:\\WINDOWS\\system32\\cmd.exe</span><span class="vt-ctl">─ ☐ ✕</span>'
        : '<span class="vt-dots"><i></i><i></i><i></i></span><span class="vt-ttl">' + USER + "@saek-pc: ~</span>") + "</div>" +
      '<div class="vt-scr"><div class="vt-log"></div><div class="vt-line"><span class="vt-ps"></span><input class="vt-in" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" aria-label="Γράψε εντολή"></div></div>' +
      '<div class="vt-chips">' + CHIPS[s.os].map(function (c) { return '<button type="button" data-run="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") +
        '<span class="vt-keys">↑↓ ιστορικό · Tab συμπλήρωση</span></div>' +
    "</div>";
  }

  function bindVT(el) {
    root = {
      el: el, log: el.querySelector(".vt-log"), scr: el.querySelector(".vt-scr"), inp: el.querySelector(".vt-in"), ps: el.querySelector(".vt-ps"),
      line: el.querySelector(".vt-line"), list: el.querySelector(".ms-list"), count: el.querySelector("#lab-count"), bar: el.querySelector("#lab-bar")
    };
    root.log.innerHTML = current.log.join("");
    root.ps.innerHTML = promptHTML(current);
    root.line.style.visibility = current.busy ? "hidden" : "";
    applyColor(current);
    root.scr.scrollTop = root.scr.scrollHeight;
    var view = root;

    root.scr.addEventListener("click", function () {
      if (window.getSelection && String(window.getSelection())) return;
      try { view.inp.focus({ preventScroll: true }); } catch (e) { view.inp.focus(); }
    });
    root.inp.addEventListener("keydown", function (e) {
      var s = current;
      if (e.key === "c" && e.ctrlKey && !String(window.getSelection())) {
        e.preventDefault();
        if (s.busy) { s.busy = false; clearTimeout(s.timer); print(s, "^C"); finish(s, view); return; }
        echoPrompt(s, view.inp.value + "^C"); view.inp.value = ""; return;
      }
      if (e.key === "l" && e.ctrlKey) { e.preventDefault(); s.log = []; view.log.innerHTML = ""; return; }
      if (s.busy) { e.preventDefault(); return; }
      if (e.key === "Enter") { var v = view.inp.value; view.inp.value = ""; runLine(s, v, view); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (s.hi > 0) { s.hi--; view.inp.value = s.hist[s.hi] || ""; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (s.hi < s.hist.length) { s.hi++; view.inp.value = s.hist[s.hi] || ""; } }
      else if (e.key === "Tab") { e.preventDefault(); complete(s); }
    });
    el.querySelectorAll("[data-run]").forEach(function (b) {
      b.addEventListener("click", function () { if (current.busy) return; runLine(current, b.dataset.run, view); });
    });
    return view;
  }

  // βάζει μια εντολή-βοήθεια στη γραμμή του τερματικού
  function fillCmd(c) {
    if (!root) return;
    root.inp.value = c.indexOf("<PID>") >= 0 ? c.replace("<PID>", "") : c;
    try { root.inp.focus({ preventScroll: true }); } catch (x) { root.inp.focus(); }
  }

  // ελεύθερο τερματικό με τις 12 + 12 αποστολές
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
        '<div class="lab-grid">' + vtHTML(current) +
          '<aside class="missions sticker"><div class="ms-head"><b>🎯 Αποστολές</b><span class="pill" id="lab-count"></span></div>' +
            '<div class="xpbar"><i id="lab-bar"></i></div><ol class="ms-list"></ol>' +
            '<button type="button" class="ms-reset">↺ ξεκίνα τις αποστολές από την αρχή</button></aside>' +
        "</div>" +
      "</div>";

    bindVT(el);
    renderMissions();

    el.querySelectorAll("[data-os]").forEach(function (b) {
      b.addEventListener("click", function () { store("labOS", b.dataset.os); mount(el, oses); });
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
      if (code) { fillCmd(code.dataset.cmd); return; }
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

  // ================= ΧΡΟΝΟΔΡΟΜΟΛΟΓΗΣΗ (για τις ασκήσεις Gantt) =================
  // procs: [[όνομα, άφιξη, εκτέλεση, προτεραιότητα?], ...]
  // alg: fcfs | sjf | srtf | rr | prio | prio-p   (στο rr και το κβάντο q)
  // Συμβάσεις: σε ισοπαλία κερδίζει όποια ήρθε πρώτη (και μετά η μικρότερη Pi).
  // Στους αλγορίθμους με διακοπή, σε ισοπαλία συνεχίζει αυτή που ήδη τρέχει.
  // Στο Round Robin όποια φτάνει μπαίνει στην ουρά πριν από αυτήν που μόλις διακόπηκε.
  function schedule(procs, alg, q) {
    var n = procs.length, rem = procs.map(function (p) { return p[2]; }), fin = [], st = [], cells = [], ctx = [];
    var t = 0, cur = -1, left = 0, queue = [], done = 0, pre = alg === "srtf" || alg === "prio-p";
    function arrived(i) { return procs[i][1] <= t && rem[i] > 0; }
    function key(i) { return alg === "sjf" ? procs[i][2] : alg === "srtf" ? rem[i] : /^prio/.test(alg) ? procs[i][3] : procs[i][1]; }
    function best(c) { return c.reduce(function (b, i) { return b < 0 || key(i) < key(b) || (key(i) === key(b) && (procs[i][1] < procs[b][1] || (procs[i][1] === procs[b][1] && i < b))) ? i : b; }, -1); }
    for (var i = 0; i < n; i++) if (procs[i][1] === 0) queue.push(i);
    while (done < n && t < 500) {
      var c = [];
      for (i = 0; i < n; i++) if (arrived(i)) c.push(i);
      var fresh = false, snap = null;
      if (alg === "rr") {
        if (cur < 0 && queue.length) { cur = queue.shift(); left = q; fresh = true; snap = [cur].concat(queue); }
      } else if (pre) {
        var b = best(c);
        if (cur >= 0 && rem[cur] > 0 && key(cur) <= key(b)) b = cur;
        fresh = b !== cur; cur = b;
      } else if (cur < 0 && c.length) { cur = best(c); fresh = true; }
      ctx.push({ fresh: fresh, cand: c, cur: cur, queue: snap, rem: rem.slice() });
      cells.push(cur >= 0 ? cur : null);
      if (cur >= 0) {
        if (st[cur] == null) st[cur] = t;
        rem[cur]--; left--;
      }
      t++;
      if (alg === "rr") for (i = 0; i < n; i++) if (procs[i][1] === t) queue.push(i);
      if (cur >= 0 && rem[cur] === 0) { fin[cur] = t; done++; cur = -1; }
      else if (alg === "rr" && cur >= 0 && left === 0) { queue.push(cur); cur = -1; }
    }
    var wait = procs.map(function (p, i) { return fin[i] - p[1] - p[2]; });
    return { cells: cells, start: st, fin: fin, wait: wait, avg: wait.reduce(function (a, b) { return a + b; }, 0) / n, ctx: ctx };
  }

  // ================= ΑΣΚΗΣΕΙΣ ΑΝΑ ΕΡΓΑΣΤΗΡΙΟ =================
  /*
    Κάθε εργαστήριο (LESSONS) έχει λίστα ασκήσεων ex. Κοινά πεδία: id (μοναδικό), tag, title, desc, hint.
    Τρία είδη (type):
      "quiz"  — opts: [επιλογές για όλες], items: [{ q: ερώτηση, a: σωστή επιλογή, opts?: δικές της επιλογές, why?: εξήγηση }]
                ή αριθμητική ερώτηση: { q, num: 4.75 }
      "term"  — os: "windows" | "linux", steps: [{ t: τι κάνει, hint: [εντολές], check: function (s) {...} }],
                asks: [{ q: ερώτηση, a: [σωστές απαντήσεις: κείμενο ή /regex/] ή function (s) { return [...] } }]
      "gantt" — alg: fcfs | sjf | srtf | rr | prio | prio-p, q: κβάντο (για rr),
                procs: [["P1", άφιξη, εκτέλεση, προτεραιότητα?], ...]   (η λύση βγαίνει αυτόματα)
  */
  var EX_XP = 20;
  var PCOL = ["#4d7cfe", "#10b981", "#ffd23f", "#ff6b9d", "#a78bfa", "#ff9f43"];

  // βοηθοί για τους ελέγχους των βημάτων
  function H(s, re) { return s.hist.some(function (l) { return re.test(l); }); }
  function count(s, name) { return s.procs.list.filter(function (p) { return p.name.toLowerCase() === name; }).length; }
  function pids(s, name) { return s.procs.list.filter(function (p) { return p.name.toLowerCase() === name; }).map(function (p) { return p.pid; }); }
  function node(s, rel) { return at(s, s.home.concat(rel)); }
  function inDir(s, rel) { return isInside(s.cwd, s.home.concat(rel)); }
  function isDir(s, rel) { var r = node(s, rel); return !!(r && r.n.t === "d"); }
  function fileHas(s, rel, txt) { var r = node(s, rel); return !!(r && r.n.t === "f" && r.n.x.toLowerCase().indexOf(txt) >= 0); }

  var LESSONS = [
    {
      id: "e1", num: 1, title: "Τι είναι το Λειτουργικό Σύστημα", short: "Τι είναι το ΛΣ", date: "2026-10-06",
      ex: [
        { id: "e1a", type: "quiz", tag: "Ζέσταμα", title: "Ποια αρμοδιότητα δουλεύει;",
          desc: "Για κάθε σενάριο διάλεξε ποια από τις 6 δουλειές του ΛΣ είναι υπεύθυνη.",
          hint: "Οι 6 δουλειές: διεργασίες & CPU, μνήμη, αρχεία, συσκευές, ασφάλεια, διεπαφή. Ρώτα τον εαυτό σου: ποιον «πόρο» χρησιμοποιεί κάθε σενάριο;",
          opts: ["Διεργασίες & CPU", "Κύρια μνήμη (RAM)", "Αρχεία & φάκελοι", "Συσκευές Ε/Ε", "Ασφάλεια & χρήστες", "Διεπαφή χρήστη"],
          items: [
            { q: "Συνδέεις ποντίκι USB και σε 3 δευτερόλεπτα δουλεύει.", a: "Συσκευές Ε/Ε", why: "Το ΛΣ βρήκε και φόρτωσε τον οδηγό (driver) της συσκευής." },
            { q: "Ακούς Spotify ενώ γράφεις στο Word.", a: "Διεργασίες & CPU", why: "Το ΛΣ μοιράζει τον επεξεργαστή στις δύο διεργασίες, με γρήγορη εναλλαγή." },
            { q: "Ο αδερφός σου δεν βλέπει τα αρχεία του λογαριασμού σου.", a: "Ασφάλεια & χρήστες", why: "Κάθε λογαριασμός έχει δικά του δικαιώματα πρόσβασης." },
            { q: "Ανοίγεις 40 καρτέλες και ο υπολογιστής «σέρνεται».", a: "Κύρια μνήμη (RAM)", why: "Κάθε καρτέλα θέλει χώρο στη μνήμη και κάποτε η RAM δεν φτάνει." },
            { q: "Αποθηκεύεις την εργασία σου στον φάκελο Έγγραφα.", a: "Αρχεία & φάκελοι", why: "Το ΛΣ οργανώνει τον δίσκο σε σύστημα αρχείων (π.χ. NTFS)." },
            { q: "Κάνεις διπλό κλικ σε ένα εικονίδιο και ανοίγει παράθυρο.", a: "Διεπαφή χρήστη", why: "Τα παράθυρα και τα εικονίδια είναι το γραφικό κέλυφος (GUI)." }
          ] },
        { id: "e1b", type: "quiz", tag: "Άσκηση", title: "Πυρήνας ή κέλυφος;",
          desc: "Για κάθε περιγραφή διάλεξε αν αφορά τον πυρήνα (kernel) ή το κέλυφος (shell) του ΛΣ.",
          hint: "Ο πυρήνας είναι η «καρδιά» που μιλά απευθείας με το υλικό. Το κέλυφος είναι αυτό που βλέπει και χρησιμοποιεί ο χρήστης: γραφικό (GUI) ή γραμμή εντολών (CLI).",
          opts: ["Πυρήνας (kernel)", "Κέλυφος (shell)"],
          items: [
            { q: "Φορτώνεται πρώτος και μένει πάντα στη μνήμη.", a: "Πυρήνας (kernel)" },
            { q: "Η Γραμμή εντολών (cmd) των Windows.", a: "Κέλυφος (shell)" },
            { q: "Έχει πλήρη πρόσβαση στο υλικό.", a: "Πυρήνας (kernel)" },
            { q: "Τα παράθυρα, τα εικονίδια και η γραμμή εργασιών.", a: "Κέλυφος (shell)" },
            { q: "Το bash στο τερματικό του Linux.", a: "Κέλυφος (shell)" },
            { q: "Εξυπηρετεί τις κλήσεις συστήματος των εφαρμογών.", a: "Πυρήνας (kernel)", why: "Οι κλήσεις συστήματος είναι ο μόνος «νόμιμος» τρόπος μιας εφαρμογής να ζητήσει κάτι από τον πυρήνα." }
          ] },
        { id: "e1c", type: "term", os: "windows", tag: "Εργαστήριο 1", title: "Η κάρτα συστήματος",
          desc: "Η κάρτα συστήματος του εργαστηρίου, αλλά αυτή τη φορά από τη Γραμμή εντολών. Τρέξε τις εντολές, βρες τα στοιχεία στην έξοδο και γράψε τα στα κουτάκια.",
          steps: [
            { t: "Δες όλα τα στοιχεία του ΛΣ και του υλικού", hint: ["systeminfo"], check: function (s) { return s.ran.systeminfo; } },
            { t: "Δες την έκδοση των Windows", hint: ["ver"], check: function (s) { return s.ran.ver; } },
            { t: "Δες το όνομα του υπολογιστή", hint: ["hostname"], check: function (s) { return s.ran.hostname; } }
          ],
          asks: [
            { q: "Όνομα υπολογιστή (Host Name)", a: ["SAEK-PC07"] },
            { q: "Λειτουργικό σύστημα (OS Name)", a: [/windows\s*11/] },
            { q: "Build του ΛΣ (ο αριθμός μετά το «Build»)", a: ["22631"] },
            { q: "Συνολική μνήμη RAM σε MB", a: [/^16[.,]?183(\s*mb)?$/] },
            { q: "Τύπος συστήματος (System Type)", a: [/^x64/] }
          ] },
        { id: "e1d", type: "term", os: "windows", tag: "Εργαστήριο 2", title: "Ίδια δουλειά, δύο κελύφη",
          desc: "Στο εργαστήριο έφτιαξες με το ποντίκι τον φάκελο gui_test και μέσα το hello.txt. Κάνε τώρα την ίδια δουλειά μόνο με εντολές: στα Έγγραφα (Documents) φτιάξε τον φάκελο cli_test με το αρχείο hello.txt που γράφει hello.",
          steps: [
            { t: "Πήγαινε στον φάκελο Documents", hint: ["cd Documents"], check: function (s) { return inDir(s, ["Documents"]); } },
            { t: "Φτιάξε τον φάκελο cli_test", hint: ["mkdir cli_test"], check: function (s) { return isDir(s, ["Documents", "cli_test"]); } },
            { t: "Μπες μέσα και φτιάξε το hello.txt που γράφει hello", hint: ["cd cli_test", "echo hello > hello.txt"], check: function (s) { return fileHas(s, ["Documents", "cli_test", "hello.txt"], "hello"); } },
            { t: "Δες τι έχει ο φάκελος και τι γράφει το αρχείο", hint: ["dir", "type hello.txt"], check: function (s) { return fileHas(s, ["Documents", "cli_test", "hello.txt"], "hello") && H(s, /^dir\b/i) && H(s, /^type\s+.*hello\.txt/i); } }
          ] },
        { id: "e1e", type: "term", os: "linux", tag: "Εργαστήριο 3", title: "Πρώτη γνωριμία με το Linux",
          desc: "Όπως στο jslinux: δοκίμασε τις βασικές εντολές του Linux και γράψε τι βρήκες. Σε κάθε εντολή σκέψου ποια είναι η αντίστοιχη των Windows.",
          steps: [
            { t: "Δες το όνομα και την έκδοση του πυρήνα", hint: ["uname -a"], check: function (s) { return H(s, /^uname\s+-\w*a/); } },
            { t: "Δες ποια διανομή Linux είναι", hint: ["cat /etc/os-release"], check: function (s) { return s.ran.osrelease; } },
            { t: "Βρες με ποιον χρήστη είσαι συνδεδεμένος/η", hint: ["whoami"], check: function (s) { return s.ran.whoami; } },
            { t: "Βρες σε ποιον φάκελο βρίσκεσαι", hint: ["pwd"], check: function (s) { return s.ran.pwd; } }
          ],
          asks: [
            { q: "Διανομή (NAME)", a: [/ubuntu/] },
            { q: "Έκδοση πυρήνα (ο αριθμός μετά το saek-pc)", a: [/^6\.8\.0/] },
            { q: "Χρήστης", a: ["mathitis"] },
            { q: "Ο φάκελός σου (η απάντηση του pwd)", a: [/^\/home\/mathitis\/?$/] },
            { q: "Η αντίστοιχη εντολή του uname -a στα Windows", a: ["ver", "winver", "systeminfo"] }
          ] },
        { id: "e1f", type: "quiz", tag: "Άσκηση", title: "Εμπορικό ή ΕΛ/ΛΑΚ;",
          desc: "Για κάθε λογισμικό διάλεξε αν είναι εμπορικό (με άδεια χρήσης) ή Ελεύθερο Λογισμικό / Λογισμικό Ανοιχτού Κώδικα.",
          hint: "ΕΛ/ΛΑΚ: τον κώδικα τον βλέπεις, τον αλλάζεις και τον μοιράζεσαι, και συνήθως είναι δωρεάν. Εμπορικό: κλειστός κώδικας και συνήθως πληρώνεις άδεια.",
          opts: ["Εμπορικό", "ΕΛ/ΛΑΚ"],
          items: [
            { q: "Windows 11", a: "Εμπορικό" }, { q: "Ubuntu", a: "ΕΛ/ΛΑΚ" }, { q: "macOS", a: "Εμπορικό" }, { q: "Firefox", a: "ΕΛ/ΛΑΚ" },
            { q: "Microsoft Office", a: "Εμπορικό" }, { q: "7-Zip", a: "ΕΛ/ΛΑΚ" }, { q: "LibreOffice", a: "ΕΛ/ΛΑΚ" }, { q: "Adobe Photoshop", a: "Εμπορικό" }
          ] },
        { id: "e1g", type: "quiz", tag: "Ο στόχος", title: "Ποιο ΛΣ θα πρότεινες;",
          desc: "Για κάθε περίπτωση διάλεξε το ΛΣ που ταιριάζει καλύτερα. Στην τάξη μετράει η αιτιολόγηση· εδώ ελέγχεται η πιο συνηθισμένη επιλογή.",
          hint: "Σκέψου τρία πράγματα: πόσο κοστίζει, ποιο λογισμικό χρειάζεται η δουλειά, πόσο σταθερό και ασφαλές πρέπει να είναι.",
          opts: ["Windows", "macOS", "Linux"],
          items: [
            { q: "Εργαστήριο με παλιούς υπολογιστές και μηδέν budget", a: "Linux", why: "Δωρεάν και ελαφρύ (π.χ. Linux Mint, Lubuntu): τρέχει και σε παλιό υλικό." },
            { q: "Γραφίστας που δουλεύει με Final Cut", a: "macOS", why: "Το Final Cut υπάρχει μόνο σε macOS." },
            { q: "Web server για το site μιας εταιρείας", a: "Linux", why: "Σταθερό, δωρεάν, και το πιο διαδεδομένο σε web servers." },
            { q: "Λογιστήριο με ελληνικό λογιστικό πρόγραμμα", a: "Windows", why: "Τα περισσότερα ελληνικά λογιστικά προγράμματα τρέχουν μόνο σε Windows." },
            { q: "Developer που φτιάχνει παιχνίδια με DirectX", a: "Windows", why: "Το DirectX είναι της Microsoft και υπάρχει μόνο στα Windows." }
          ] },
        { id: "e1h", type: "quiz", tag: "Για το σπίτι", title: "Πέντε γενιές σε 80 χρόνια",
          desc: "Αντιστοίχισε κάθε περιγραφή με τη γενιά υπολογιστών και ΛΣ που ανήκει.",
          hint: "Λυχνίες (1945) → τρανζίστορ (1955) → ολοκληρωμένα κυκλώματα (1965) → προσωπικοί υπολογιστές (1980) → κινητά & cloud (2007).",
          opts: ["1η", "2η", "3η", "4η", "5η"],
          items: [
            { q: "Λυχνίες κενού, χωρίς ΛΣ: προγραμματισμός με διακόπτες και καλώδια", a: "1η" },
            { q: "Τρανζίστορ και ομαδική επεξεργασία (batch) με διάτρητες κάρτες", a: "2η" },
            { q: "Ολοκληρωμένα κυκλώματα, πολυπρογραμματισμός και το UNIX (1969)", a: "3η" },
            { q: "Προσωπικοί υπολογιστές: MS-DOS, Windows, Linux (1991) και το γραφικό περιβάλλον", a: "4η" },
            { q: "Κινητά και cloud: iOS, Android, εικονικές μηχανές", a: "5η" }
          ] }
      ]
    },
    {
      id: "e2", num: 2, title: "Κατηγορίες ΛΣ και διεργασίες", short: "Διεργασίες", date: "2026-10-13",
      ex: [
        { id: "e2a", type: "quiz", tag: "Ζέσταμα", title: "Σε ποια κατηγορία ανήκει;",
          desc: "Για κάθε σύστημα διάλεξε την κύρια κατηγορία ΛΣ που του ταιριάζει.",
          hint: "Ψάξε τη λέξη-κλειδί: «αυστηρό χρονικό όριο» → πραγματικού χρόνου, «πολλοί υπολογιστές» → κατανεμημένο, «μέσα σε συσκευή» → ενσωματωμένο, «εργασίες στη σειρά χωρίς χρήστη» → ομαδική επεξεργασία, «κβάντο και εναλλαγή» → καταμερισμός χρόνου.",
          opts: ["Ομαδικής επεξεργασίας", "Καταμερισμού χρόνου", "Πραγματικού χρόνου", "Κατανεμημένο", "Ενσωματωμένο"],
          items: [
            { q: "Ο ελεγκτής του αερόσακου ενός αυτοκινήτου", a: "Πραγματικού χρόνου", why: "Αργή απάντηση = λάθος απάντηση." },
            { q: "Το Netflix που σερβίρει ταινίες από χιλιάδες servers", a: "Κατανεμημένο" },
            { q: "Ο υπολογιστής του εργαστηρίου με Windows 11", a: "Καταμερισμού χρόνου" },
            { q: "Η νυχτερινή μισθοδοσία μιας τράπεζας", a: "Ομαδικής επεξεργασίας", why: "Οι εργασίες τρέχουν η μία μετά την άλλη, χωρίς να επεμβαίνει χρήστης." },
            { q: "Μια έξυπνη τηλεόραση (smart TV)", a: "Ενσωματωμένο" },
            { q: "Το ABS που δεν αφήνει τους τροχούς να μπλοκάρουν στο φρενάρισμα", a: "Πραγματικού χρόνου" }
          ] },
        { id: "e2b", type: "quiz", tag: "Άσκηση", title: "Πρόγραμμα ή διεργασία;",
          desc: "Πρόγραμμα = αρχείο στον δίσκο. Διεργασία = πρόγραμμα σε εκτέλεση, στη μνήμη. Διάλεξε για καθένα.",
          hint: "Θυμήσου τη συνταγή: η συνταγή στο βιβλίο είναι το πρόγραμμα, κάθε μαγείρεμα είναι μια διεργασία.",
          opts: ["Πρόγραμμα", "Διεργασία"],
          items: [
            { q: "Το αρχείο notepad.exe στον φάκελο C:\\Windows\\System32", a: "Πρόγραμμα" },
            { q: "Ένα ανοιχτό Σημειωματάριο με PID 4120", a: "Διεργασία" },
            { q: "Το setup.exe στα Downloads, που δεν το έχεις τρέξει ακόμα", a: "Πρόγραμμα" },
            { q: "Μια γραμμή στη Διαχείριση εργασιών με κατάσταση «Εκτελείται»", a: "Διεργασία" },
            { q: "Η συνταγή στο βιβλίο μαγειρικής", a: "Πρόγραμμα" },
            { q: "Ο μάγειρας που μαγειρεύει τη συνταγή αυτή τη στιγμή", a: "Διεργασία" },
            { q: "Ανοίγεις 3 φορές το Σημειωματάριο. Τι έχεις;", opts: ["1 πρόγραμμα, 1 διεργασία", "1 πρόγραμμα, 3 διεργασίες", "3 προγράμματα, 3 διεργασίες"], a: "1 πρόγραμμα, 3 διεργασίες" }
          ] },
        { id: "e2c", type: "term", os: "windows", tag: "Εργαστήριο 1", title: "1 πρόγραμμα, 3 διεργασίες",
          desc: "Άνοιξε το Σημειωματάριο τρεις φορές και δες ότι κάθε φορά γεννιέται νέα διεργασία με δικό της PID. Μετά κλείσε μία από τις τρεις με το PID της.",
          steps: [
            { t: "Άνοιξε 3 φορές το Σημειωματάριο", hint: ["start notepad"], check: function (s) {
                var n = count(s, "notepad.exe");
                s.npMax = Math.max(s.npMax || 0, n);
                s.npPids = (s.npPids || []).concat(pids(s, "notepad.exe").filter(function (p) { return (s.npPids || []).indexOf(p) < 0; }));
                return s.npMax >= 3;
              } },
            { t: "Δες μόνο τις διεργασίες notepad.exe", hint: ['tasklist /fi "imagename eq notepad.exe"'], check: function (s) { return H(s, /^tasklist\b.*notepad/i); } },
            { t: "Κλείσε ένα Σημειωματάριο με το PID του", hint: ["taskkill /pid <PID>"], check: function (s) { return s.npMax >= 3 && count(s, "notepad.exe") < s.npMax && H(s, /^taskkill\b.*\/pid/i); } }
          ],
          asks: [
            { q: "Το PID ενός από τα Σημειωματάρια", a: function (s) { return (s.npPids || []).map(String); } },
            { q: "Τα PID τους είναι ίδια ή διαφορετικά;", a: [/^διαφορετικ/] },
            { q: "Πόσα προγράμματα έτρεξες; (αριθμός)", a: ["1", "ενα"] }
          ] },
        { id: "e2d", type: "term", os: "windows", tag: "Εργαστήριο 2", title: "Πόσα chrome;",
          desc: "Ο browser είναι ένα πρόγραμμα, αλλά ανοίγει πολλές διεργασίες (για καρτέλες, πρόσθετα, γραφικά). Μέτρησέ τες και βρες ποια «τρώει» την περισσότερη μνήμη.",
          steps: [
            { t: "Δες όλες τις διεργασίες", hint: ["tasklist"], check: function (s) { return s.ran.tasklist; } },
            { t: "Μέτρησε τις διεργασίες chrome.exe", hint: ['tasklist | find /c "chrome"'], check: function (s) { return s.flags.countChrome; } },
            { t: "Δες μόνο τις chrome.exe, μαζί με τη μνήμη τους", hint: ['tasklist /fi "imagename eq chrome.exe"'], check: function (s) { return H(s, /^tasklist\b.*\/fi.*chrome/i); } }
          ],
          asks: [
            { q: "Πόσες διεργασίες chrome.exe τρέχουν;", a: function (s) { return [String(count(s, "chrome.exe"))]; } },
            { q: "Το PID της chrome.exe με την περισσότερη μνήμη (Mem Usage)", a: function (s) {
                var top = s.procs.list.filter(function (p) { return p.name === "chrome.exe"; }).sort(function (a, b) { return b.mem - a.mem; })[0];
                return top ? [String(top.pid)] : [];
              } }
          ] },
        { id: "e2e", type: "term", os: "windows", tag: "Εργαστήριο 3", title: "Ποιος κόλλησε;",
          desc: "Ένα παιχνίδι έχει κολλήσει (Not Responding). Βρες το από τη Γραμμή εντολών και τερμάτισέ το. Προσοχή: μια διεργασία που δεν «ακούει» κλείνει μόνο αναγκαστικά.",
          steps: [
            { t: "Βρες ποια διεργασία δεν αποκρίνεται", hint: ['tasklist /fi "status eq not responding"', "tasklist /v"], check: function (s) { return s.flags.foundStuck; } },
            { t: "Τερμάτισέ την αναγκαστικά", hint: ["taskkill /im paixnidi.exe /f"], check: function (s) { return !procNamed(s, "paixnidi.exe"); } }
          ],
          asks: [
            { q: "Το όνομα της διεργασίας που κόλλησε", a: ["paixnidi.exe", "paixnidi"] },
            { q: "Ποια παράμετρος του taskkill κλείνει αναγκαστικά;", a: ["/f", "f"] }
          ] },
        { id: "e2f", type: "quiz", tag: "Άσκηση", title: "Ακολούθησε τη διεργασία",
          desc: "Ο υπολογιστής έχει 1 πυρήνα. Ανοίγεις το Word, γράφεις, πατάς «Αποθήκευση» και μετά το κλείνεις. Σε ποια κατάσταση είναι η διεργασία του Word μετά από κάθε γεγονός;",
          hint: "Νέα → Έτοιμη (μπαίνει στην ουρά) → Εκτελούμενη (τη διάλεξε ο scheduler). Λήξη κβάντου: πίσω στις Έτοιμες. Αναμονή για δίσκο: Μπλοκαρισμένη. Τέλος Ε/Ε: πάλι Έτοιμη.",
          opts: ["Νέα", "Έτοιμη", "Εκτελούμενη", "Μπλοκαρισμένη", "Τερματισμένη"],
          items: [
            { q: "Διπλό κλικ στο Word: η διεργασία δημιουργείται και μπαίνει στην ουρά", a: "Έτοιμη" },
            { q: "Ο scheduler τη διαλέγει", a: "Εκτελούμενη" },
            { q: "Λήγει το κβάντο της και σειρά παίρνει το Spotify", a: "Έτοιμη" },
            { q: "Ο scheduler τη διαλέγει ξανά", a: "Εκτελούμενη" },
            { q: "Πατάς «Αποθήκευση» και περιμένει τον δίσκο", a: "Μπλοκαρισμένη" },
            { q: "Ο δίσκος τελείωσε την εγγραφή", a: "Έτοιμη", why: "Δεν παίρνει αμέσως τον επεξεργαστή: πηγαίνει πρώτα στην ουρά των Έτοιμων." },
            { q: "Κλείνεις το Word", a: "Τερματισμένη" }
          ] },
        { id: "e2g", type: "term", os: "linux", tag: "Ο στόχος", title: "Κυνήγι διεργασιών στο Linux",
          desc: "Ό,τι έκανες στα Windows, τώρα στο τερματικό του Linux: δες όλες τις διεργασίες, μέτρησε τις firefox, βρες ποια «τρώει» τον επεξεργαστή και σταμάτησέ τη. Κάνε τα βήματα με τη σειρά!",
          steps: [
            { t: "Δες όλες τις διεργασίες του συστήματος", hint: ["ps aux"], check: function (s) { return s.ran.psall; } },
            { t: "Μέτρησε τις διεργασίες firefox", hint: ["ps aux | grep -c firefox", "pgrep -c firefox"], check: function (s) { return s.flags.countFirefox; } },
            { t: "Βρες ποια διεργασία έχει τη μεγαλύτερη χρήση CPU", hint: ["top"], check: function (s) { return s.ran.top; } },
            { t: "Ζήτα της πρώτα «ευγενικά» να κλείσει (απλό kill)", hint: ["killall paixnidi", "kill <PID>"], check: function (s) { return s.flags.triedTerm; } },
            { t: "Τερμάτισέ την αναγκαστικά", hint: ["killall -9 paixnidi", "kill -9 <PID>"], check: function (s) { return !procNamed(s, "paixnidi"); } }
          ],
          asks: [
            { q: "Πόσες διεργασίες firefox τρέχουν;", a: function (s) { return [String(count(s, "firefox"))]; } },
            { q: "Ποια διεργασία «τρώει» τον επεξεργαστή;", a: ["paixnidi", "./paixnidi"] },
            { q: "Ποιο σήμα στέλνει το kill -9;", a: [/^(sig)?kill$/, "9"] }
          ] },
        { id: "e2h", type: "quiz", tag: "Πρόκληση", title: "Ποιες μεταβάσεις γίνονται;",
          desc: "Με βάση το διάγραμμα καταστάσεων, διάλεξε αν κάθε μετάβαση μπορεί να γίνει ή είναι αδύνατη.",
          hint: "Τον επεξεργαστή τον δίνει μόνο ο scheduler, και μόνο σε διεργασίες που είναι Έτοιμες. Για να μπλοκαριστεί μια διεργασία πρέπει να ζητήσει κάτι, άρα να εκτελείται.",
          opts: ["Γίνεται", "Αδύνατη"],
          items: [
            { q: "Έτοιμη → Εκτελούμενη", a: "Γίνεται" },
            { q: "Μπλοκαρισμένη → Εκτελούμενη", a: "Αδύνατη", why: "Όταν έρθει η Ε/Ε πηγαίνει πρώτα στις Έτοιμες. Τον επεξεργαστή τον δίνει μόνο ο scheduler." },
            { q: "Εκτελούμενη → Μπλοκαρισμένη", a: "Γίνεται" },
            { q: "Έτοιμη → Μπλοκαρισμένη", a: "Αδύνατη", why: "Για να μπλοκαριστεί πρέπει να ζητήσει κάτι (π.χ. δίσκο), άρα να εκτελείται." },
            { q: "Εκτελούμενη → Έτοιμη", a: "Γίνεται", why: "Συμβαίνει όταν λήξει το κβάντο της." },
            { q: "Νέα → Εκτελούμενη", a: "Αδύνατη", why: "Κάθε νέα διεργασία μπαίνει πρώτα στην ουρά των Έτοιμων." },
            { q: "Σε επεξεργαστή με 4 πυρήνες, πόσες διεργασίες μπορούν να είναι Εκτελούμενες την ίδια στιγμή;", opts: ["1", "4", "όσες θέλουν"], a: "4", why: "Μία σε κάθε πυρήνα." }
          ] }
      ]
    },
    {
      id: "e3", num: 3, title: "Χρονοδρομολόγηση Ι: FCFS και SJF", short: "FCFS · SJF", date: "2026-10-20",
      ex: [
        { id: "e3a", type: "quiz", tag: "Ζέσταμα", title: "Οι λέξεις που θα χρειαστούμε",
          desc: "Αντιστοίχισε κάθε ορισμό με τον όρο του.",
          hint: "Άφιξη = πότε ήρθε. Εκτέλεση = πόσο χρειάζεται. Αναμονή = πόσο περίμενε χωρίς να τρέχει.",
          opts: ["Χρονοδρομολογητής", "Χρόνος άφιξης", "Χρόνος εκτέλεσης", "Χρόνος αναμονής", "Διάγραμμα Gantt"],
          items: [
            { q: "Το κομμάτι του ΛΣ που αποφασίζει ποια διεργασία παίρνει τον επεξεργαστή", a: "Χρονοδρομολογητής" },
            { q: "Πότε έφτασε η διεργασία στην ουρά", a: "Χρόνος άφιξης" },
            { q: "Πόση ώρα χρειάζεται τον επεξεργαστή για να τελειώσει", a: "Χρόνος εκτέλεσης" },
            { q: "Πόση ώρα περίμενε στην ουρά χωρίς να τρέχει", a: "Χρόνος αναμονής" },
            { q: "Μια λωρίδα χρόνου που δείχνει ποια διεργασία έτρεξε πότε", a: "Διάγραμμα Gantt" },
            { q: "«Μη προεκχωρητικός» αλγόριθμος σημαίνει ότι…", opts: ["όποια διεργασία ξεκινήσει, τελειώνει", "το ΛΣ μπορεί να τη διακόψει στη μέση"], a: "όποια διεργασία ξεκινήσει, τελειώνει" }
          ] },
        { id: "e3b", type: "gantt", alg: "fcfs", tag: "Άσκηση Α1", title: "FCFS με 3 διεργασίες",
          desc: "Όλες φτάνουν στο 0 και τρέχουν με τη σειρά P1 → P2 → P3. Χρωμάτισε το Gantt, συμπλήρωσε πότε αρχίζει και πότε τελειώνει κάθε διεργασία, την αναμονή της και τον μέσο χρόνο αναμονής.",
          hint: "Η P1 πιάνει τα πρώτα 5 κουτάκια και μετά έρχεται η P2. Αναμονή = αρχίζει − άφιξη. Μέσος όρος = άθροισμα αναμονών / 3.",
          procs: [["P1", 0, 5], ["P2", 0, 3], ["P3", 0, 2]] },
        { id: "e3c", type: "gantt", alg: "sjf", tag: "Άσκηση Α2", title: "Τα ίδια δεδομένα με SJF",
          desc: "Τα ίδια δεδομένα, αλλά τώρα τρέχει πρώτη η πιο σύντομη. Βάλε τις διεργασίες σε σειρά από τη μικρότερη εκτέλεση στη μεγαλύτερη.",
          hint: "Ταξινόμησε κατά χρόνο εκτέλεσης, η μικρότερη πρώτη. Μετά σύγκρινε τον μέσο όρο με αυτόν της Α1.",
          procs: [["P1", 0, 5], ["P2", 0, 3], ["P3", 0, 2]] },
        { id: "e3d", type: "gantt", alg: "fcfs", tag: "Άσκηση", title: "Το φαινόμενο συνοδείας",
          desc: "Μια μεγάλη διεργασία μπαίνει πρώτη στην ουρά. Κάνε το FCFS και δες πόσο περιμένουν οι μικρές πίσω της, σαν αυτοκίνητα πίσω από φορτηγό σε στενό δρόμο. Συμβουλή: σύρε το ποντίκι για να χρωματίσεις πολλά κουτάκια μαζί.",
          hint: "Η P1 πιάνει 24 κουτάκια. Με SJF ο μέσος όρος εδώ θα ήταν μόλις 3. Πόσος βγαίνει με FCFS;",
          procs: [["P1", 0, 24], ["P2", 0, 3], ["P3", 0, 3]] },
        { id: "e3e", type: "gantt", alg: "fcfs", tag: "Εργαστήριο Β1", title: "FCFS με διαφορετικές αφίξεις",
          desc: "Τώρα οι διεργασίες δεν φτάνουν όλες μαζί. Με FCFS τρέχουν με τη σειρά άφιξης. Προσοχή: αναμονή = πότε άρχισε μείον πότε ήρθε.",
          hint: "Η P2 ήρθε στο 1, αλλά ξεκινά όταν τελειώσει η P1. Η αναμονή της είναι «αρχίζει − 1».",
          procs: [["P1", 0, 4], ["P2", 1, 3], ["P3", 2, 1], ["P4", 3, 2]] },
        { id: "e3f", type: "gantt", alg: "sjf", tag: "Ο στόχος", title: "SJF με διαφορετικές αφίξεις",
          desc: "Τα ίδια δεδομένα με SJF. Κάθε φορά που ελευθερώνεται ο επεξεργαστής, διαλέγεις τη μικρότερη από όσες έχουν ήδη φτάσει.",
          hint: "Στο 0 έχει φτάσει μόνο η P1, άρα ξεκινά αυτή και δεν διακόπτεται. Στο 4 περιμένουν οι P2 (3), P3 (1) και P4 (2): ποια είναι η μικρότερη;",
          procs: [["P1", 0, 4], ["P2", 1, 3], ["P3", 2, 1], ["P4", 3, 2]] },
        { id: "e3g", type: "quiz", tag: "Άσκηση", title: "Έλεγξε τον εαυτό σου",
          desc: "Γρήγορες ερωτήσεις για ό,τι έκανες σήμερα.",
          hint: "Ξαναδές τις ασκήσεις Α1, Α2 και Γ1: τι άλλαξε στους μέσους όρους και ποιος περίμενε περισσότερο;",
          opts: ["FCFS", "SJF"],
          items: [
            { q: "Ποιος αλγόριθμος δίνει μικρότερο μέσο χρόνο αναμονής;", a: "SJF" },
            { q: "Σε ποιον αλγόριθμο εμφανίζεται το φαινόμενο συνοδείας;", a: "FCFS" },
            { q: "Σε ποιον αλγόριθμο μια μεγάλη διεργασία κινδυνεύει να περιμένει για πάντα (λιμοκτονία);", a: "SJF" },
            { q: "Στην άσκηση «SJF με διαφορετικές αφίξεις», ποια διεργασία περίμενε περισσότερο;", opts: ["P1", "P2", "P3", "P4"], a: "P2" },
            { q: "Τι δείχνει ένα διάγραμμα Gantt;", opts: ["ποια διεργασία έτρεξε πότε", "πόση μνήμη έχει κάθε διεργασία", "πόσα προγράμματα υπάρχουν στον δίσκο"], a: "ποια διεργασία έτρεξε πότε" },
            { q: "Πώς βρίσκω την αναμονή όταν δεν υπάρχει διακοπή;", opts: ["αρχίζει − άφιξη", "τελειώνει − αρχίζει", "εκτέλεση − άφιξη"], a: "αρχίζει − άφιξη" }
          ] },
        { id: "e3h", type: "gantt", alg: "sjf", tag: "Πρόκληση", title: "Ο επεξεργαστής κάθεται",
          desc: "SJF, αλλά υπάρχει στιγμή που δεν έχει φτάσει καμία διεργασία. Τότε ο επεξεργαστής μένει άδειος: άφησε εκείνα τα κουτάκια λευκά.",
          hint: "Στο 3 τελειώνει η P1 και η επόμενη φτάνει στο 5. Στο 5 έχει φτάσει μόνο η P2: ξεκινά, ακόμα κι αν είναι μεγάλη, και δεν διακόπτεται.",
          procs: [["P1", 0, 3], ["P2", 5, 4], ["P3", 6, 1], ["P4", 6, 2]] },
        { id: "e3i", type: "gantt", alg: "sjf", tag: "Για το σπίτι", title: "SJF με 4 διεργασίες",
          desc: "Δεδομένα που θα ξαναδούμε στο Εργαστήριο 4. Λύσε τα με SJF (χωρίς διακοπή).",
          hint: "Η P1 ξεκινά στο 0 και, αφού το SJF δεν διακόπτει, κρατά ως το 7. Στο 7 περιμένουν οι P2 (4), P3 (1) και P4 (4). Σε ισοπαλία κερδίζει όποια ήρθε πρώτη.",
          procs: [["P1", 0, 7], ["P2", 2, 4], ["P3", 4, 1], ["P4", 5, 4]] }
      ]
    },
    {
      id: "e4", num: 4, title: "Χρονοδρομολόγηση ΙΙ: Round Robin, SRTF, Priority", short: "RR · SRTF · Priority", date: "2026-10-27",
      ex: [
        { id: "e4a", type: "quiz", tag: "Ζέσταμα", title: "Με ή χωρίς διακοπή;",
          desc: "Για κάθε αλγόριθμο διάλεξε αν μπορεί να διακόψει μια διεργασία στη μέση (προεκχωρητικός) ή όχι.",
          hint: "Χωρίς διακοπή: όποια ξεκινήσει, τελειώνει. Με διακοπή: ο Round Robin σταματά στη λήξη του κβάντου, το SRTF όταν έρθει πιο σύντομη, το Priority όταν έρθει πιο σημαντική.",
          opts: ["Χωρίς διακοπή", "Με διακοπή"],
          items: [
            { q: "FCFS", a: "Χωρίς διακοπή" }, { q: "SJF", a: "Χωρίς διακοπή" }, { q: "Round Robin", a: "Με διακοπή" },
            { q: "SRTF", a: "Με διακοπή" }, { q: "Priority (απλή μορφή)", a: "Χωρίς διακοπή" }, { q: "Priority με διακοπή", a: "Με διακοπή" },
            { q: "Ο αλγόριθμος που μπορεί να σταματήσει μια διεργασία στη μέση λέγεται…", opts: ["προεκχωρητικός", "μη προεκχωρητικός"], a: "προεκχωρητικός" }
          ] },
        { id: "e4b", type: "gantt", alg: "rr", q: 2, tag: "Παιχνίδι", title: "Η καυτή πατάτα",
          desc: "Το παιχνίδι της τάξης: το μπαλάκι είναι ο επεξεργαστής, οι κάρτες έχουν 5, 3 και 1 δευτερόλεπτα και κάθε παίκτης κρατά το μπαλάκι 2 δευτερόλεπτα (κβάντο). Ζωγράφισε τι έγινε.",
          hint: "Σειρά P1 → P2 → P3 και ξανά από την αρχή, μόνο όσες δεν τελείωσαν. Με διακοπή η αναμονή είναι τέλος − άφιξη − εκτέλεση.",
          procs: [["P1", 0, 5], ["P2", 0, 3], ["P3", 0, 1]] },
        { id: "e4c", type: "gantt", alg: "rr", q: 2, tag: "Άσκηση Α1", title: "Round Robin με κβάντο 2",
          desc: "Όλες φτάνουν στο 0, με σειρά P1, P2, P3. Κβάντο = 2: κάθε διεργασία τρέχει το πολύ 2 κουτάκια και, αν δεν τελειώσει, πηγαίνει στο τέλος της ουράς.",
          hint: "P1 στο 0–2, P2 στο 2–4 (και τελειώνει), P3 στο 4–6… και συνεχίζεις κυκλικά με όσες έμειναν.",
          procs: [["P1", 0, 4], ["P2", 0, 2], ["P3", 0, 3]] },
        { id: "e4d", type: "gantt", alg: "srtf", tag: "Άσκηση", title: "SRTF: το πρώτο παράδειγμα",
          desc: "Η P1 ξεκινά μόνη της. Στο 2 φτάνει η P2, που χρειάζεται μόνο 2. Στην P1 λείπουν ακόμα 4. Ποια συνεχίζει;",
          hint: "Το SRTF τρέχει όποια έχει τον μικρότερο υπόλοιπο χρόνο: 2 < 4, άρα η P1 σταματά και συνεχίζει μετά.",
          procs: [["P1", 0, 6], ["P2", 2, 2]] },
        { id: "e4e", type: "gantt", alg: "srtf", tag: "Εργαστήριο Β1", title: "SRTF με 4 διεργασίες",
          desc: "Κάθε φορά που φτάνει νέα διεργασία, σύγκρινε τον υπόλοιπο χρόνο όλων. Τρέχει η μικρότερη. Αναμονή = τέλος − άφιξη − εκτέλεση.",
          hint: "Κράτα σε χαρτί τον υπόλοιπο χρόνο κάθε διεργασίας και ενημέρωσέ τον σε κάθε άφιξη (στο 2, στο 4, στο 5). Σε ισοπαλία συνεχίζει αυτή που ήδη τρέχει.",
          procs: [["P1", 0, 7], ["P2", 2, 4], ["P3", 4, 1], ["P4", 5, 4]] },
        { id: "e4f", type: "gantt", alg: "prio", tag: "Εργαστήριο Β2", title: "Priority χωρίς διακοπή",
          desc: "Όλες φτάνουν στο 0. Τρέχουν με σειρά προτεραιότητας (1 = πιο σημαντική). Καμία δεν διακόπτεται.",
          hint: "Ταξινόμησε κατά προτεραιότητα: πρώτα η 1, μετά η 2, κ.ο.κ. Αναμονή = αρχίζει − άφιξη.",
          procs: [["P1", 0, 4, 3], ["P2", 0, 3, 1], ["P3", 0, 2, 4], ["P4", 0, 1, 2]] },
        { id: "e4g", type: "gantt", alg: "prio-p", tag: "Ο στόχος", title: "Priority με διακοπή",
          desc: "Αν φτάσει πιο σημαντική διεργασία, η τρέχουσα σταματά και περιμένει να ξανάρθει η σειρά της. Αναμονή = τέλος − άφιξη − εκτέλεση.",
          hint: "Στο 1 φτάνει η P2 με προτεραιότητα 1, πιο σημαντική από την P1 (3): η P1 σταματά. Στο 2 φτάνει η P3 (2): είναι πιο σημαντική από την P2;",
          procs: [["P1", 0, 5, 3], ["P2", 1, 2, 1], ["P3", 2, 3, 2]] },
        { id: "e4h", type: "quiz", tag: "Άσκηση", title: "Ποιος κερδίζει;",
          desc: "Τα δεδομένα της Β1 (P1: άφιξη 0, εκτέλεση 7 · P2: 2, 4 · P3: 4, 1 · P4: 5, 4) με τέσσερις αλγορίθμους. Λύσε τους στο χαρτί ή στο Excel και γράψε τον μέσο χρόνο αναμονής του καθενός.",
          hint: "Το SRTF το έλυσες στη Β1 και το SJF στην άσκηση «Για το σπίτι» του Εργαστηρίου 3. Στο Round Robin όποια φτάνει μπαίνει στο τέλος της ουράς, πριν από αυτήν που μόλις διακόπηκε.",
          items: [
            { q: "FCFS", num: 4.75 }, { q: "SJF", num: 4 }, { q: "SRTF", num: 3 }, { q: "Round Robin (κβάντο 2)", num: 5 },
            { q: "Ποιος έχει τον μικρότερο μέσο χρόνο αναμονής;", opts: ["FCFS", "SJF", "SRTF", "Round Robin"], a: "SRTF" }
          ] },
        { id: "e4i", type: "quiz", tag: "Κουίζ", title: "Κουίζ επανάληψης",
          desc: "Οι ερωτήσεις του τέλους του εργαστηρίου, για επανάληψη πριν το τεστ.",
          hint: "Αν κολλήσεις, ξαναδές τη σύνοψη στο τέλος των σημειώσεων των Εργαστηρίων 3 και 4.",
          opts: ["FCFS", "SJF", "Round Robin", "SRTF"],
          items: [
            { q: "Ποιος αλγόριθμος εξυπηρετεί με σειρά άφιξης;", a: "FCFS" },
            { q: "Ποιος δίνει τον μικρότερο μέσο χρόνο αναμονής χωρίς διακοπή;", a: "SJF" },
            { q: "Τι είναι το κβάντο χρόνου;", opts: ["ο χρόνος που παίρνει κάθε φορά μια διεργασία στον Round Robin", "ο συνολικός χρόνος εκτέλεσης μιας διεργασίας", "ο χρόνος που περιμένει μια διεργασία στην ουρά"], a: "ο χρόνος που παίρνει κάθε φορά μια διεργασία στον Round Robin" },
            { q: "Ποιοι αλγόριθμοι διακόπτουν;", opts: ["FCFS και SJF", "Round Robin, SRTF και Priority με διακοπή", "μόνο ο Round Robin"], a: "Round Robin, SRTF και Priority με διακοπή" },
            { q: "Τι είναι η λιμοκτονία;", opts: ["μια διεργασία δεν παίρνει ποτέ τον επεξεργαστή", "ο επεξεργαστής μένει άδειος", "μια διεργασία γεμίζει όλη τη μνήμη"], a: "μια διεργασία δεν παίρνει ποτέ τον επεξεργαστή" },
            { q: "Ποια λύση υπάρχει για τη λιμοκτονία;", opts: ["η γήρανση (aging)", "μεγαλύτερο κβάντο", "περισσότερη RAM"], a: "η γήρανση (aging)" },
            { q: "Τι γίνεται με πολύ μεγάλο κβάντο στον Round Robin;", opts: ["γίνεται σαν FCFS", "γίνεται σαν SJF", "χάνεται χρόνος σε εναλλαγές"], a: "γίνεται σαν FCFS" }
          ] },
        { id: "e4j", type: "gantt", alg: "rr", q: 4, tag: "Για το σπίτι", title: "Πολύ μεγάλο κβάντο",
          desc: "Τα δεδομένα της Α1, αλλά με κβάντο 4. Λύσε το και σύγκρινε με το FCFS: τι παρατηρείς;",
          hint: "Με κβάντο 4 καμία διεργασία δεν χρειάζεται δεύτερη σειρά. Πολύ μεγάλο κβάντο = FCFS.",
          procs: [["P1", 0, 4], ["P2", 0, 2], ["P3", 0, 3]] }
      ]
    }
  ];

  var ALG = { fcfs: "FCFS", sjf: "SJF", srtf: "SRTF", rr: "Round Robin", prio: "Priority", "prio-p": "Priority με διακοπή" };
  function preemptive(e) { return e.alg === "srtf" || e.alg === "rr" || e.alg === "prio-p"; }

  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function parseDate(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function norm(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function exKey(e) { return "sls:" + e.id; }
  function isDone(e) { return api.isDone(exKey(e)); }
  function work(e, v) {
    if (v !== undefined) { store("sls:w:" + e.id, JSON.stringify(v)); return v; }
    try { return JSON.parse(store("sls:w:" + e.id)) || {}; } catch (x) { return {}; }
  }
  // αριθμός με κόμμα ή τελεία (ή κλάσμα 13/3). Με 2 δεκαδικά γίνεται δεκτή η στρογγυλοποίηση.
  function numOk(v, target) {
    var s = String(v == null ? "" : v).trim().replace(/\s/g, "").replace(",", "."), x, frac = /^(-?\d+)\/(\d+)$/.exec(s);
    if (frac) x = +frac[1] / +frac[2];
    else if (/^-?\d+(\.\d+)?$/.test(s)) x = +s;
    else return false;
    if (frac || Math.abs(target - Math.round(target)) < 1e-9) return Math.abs(x - target) < 1e-6;
    var d = (s.split(".")[1] || "").length;
    return d > 0 && Math.abs(x - target) <= 0.5 * Math.pow(10, -d) + 1e-9;
  }

  var L = { lesson: null, idx: 0, el: null, oses: null, ex: null, brush: 0 }, exSims = {};
  function curLesson() { return LESSONS.filter(function (l) { return l.id === L.lesson; })[0]; }
  function defaultLesson() {
    var saved = store("sls:lesson");
    if (saved === "free" || LESSONS.some(function (l) { return l.id === saved; })) return saved;
    var t = today(), best = LESSONS[0].id;
    LESSONS.forEach(function (l) { if (parseDate(l.date) <= t) best = l.id; });
    return best;
  }
  function firstOpen(l) { var i = l.ex.findIndex(function (x) { return !isDone(x); }); return i < 0 ? 0 : i; }
  function typeLabel(e) { return e.type === "quiz" ? "❓ κουίζ" : e.type === "gantt" ? "📊 Gantt" : e.os === "linux" ? "🐧 bash" : "🪟 cmd"; }
  function lessonDone(l) { return l.ex.filter(isDone).length; }

  function render(el, oses, theApi) {
    api = theApi; L.el = el; L.oses = oses;
    if (!L.lesson) { L.lesson = defaultLesson(); var l0 = curLesson(); if (l0) L.idx = firstOpen(l0); }
    var t = today(), freeDone = MISSIONS.windows.concat(MISSIONS.linux).filter(function (m) { return api.isDone(key(m)); }).length;
    el.innerHTML =
      '<div class="sl">' +
        '<div class="py-lessons" role="tablist">' +
          LESSONS.map(function (l) {
            return '<button type="button" role="tab" data-lesson="' + l.id + '" aria-selected="' + (L.lesson === l.id) + '">' +
              "<b>Εργαστήριο " + l.num + "</b><span>" + esc(l.short) + (parseDate(l.date) > t ? " · 🔜" : "") + "</span><i>" + lessonDone(l) + "/" + l.ex.length + "</i></button>";
          }).join("") +
          '<button type="button" role="tab" data-lesson="free" aria-selected="' + (L.lesson === "free") + '"><b>🧪 Ελεύθερο</b><span>τερματικό & αποστολές</span><i>' + freeDone + "/" + (MISSIONS.windows.length + MISSIONS.linux.length) + "</i></button>" +
        "</div>" +
        '<div class="sl-body"></div>' +
      "</div>";
    el.querySelector(".py-lessons").addEventListener("click", function (e) {
      var b = e.target.closest("[data-lesson]");
      if (!b) return;
      L.lesson = b.dataset.lesson; store("sls:lesson", L.lesson);
      var l = curLesson(); L.idx = l ? firstOpen(l) : 0;
      render(el, oses, api);
    });
    showLesson();
  }

  function showLesson() {
    var body = L.el.querySelector(".sl-body"), l = curLesson();
    L.ex = null;
    if (!l) { mount(body, L.oses); return; }
    body.innerHTML = '<div class="py-grid"><div class="py-main"><div class="py-task sticker"></div><div class="sl-work"></div></div><aside class="missions sticker py-list"></aside></div>';
    body.querySelector(".py-list").addEventListener("click", function (e) {
      var li = e.target.closest("li.ms");
      if (!li) return;
      L.idx = +li.dataset.i; renderList(); loadEx();
      body.querySelector(".py-task").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    renderList(); loadEx();
  }

  function renderList() {
    var l = curLesson(), box = L.el.querySelector(".py-list");
    if (!l || !box) return;
    var done = lessonDone(l);
    box.innerHTML = '<div class="ms-head"><b>🎯 Εργαστήριο ' + l.num + '</b><span class="pill">' + done + "/" + l.ex.length + "</span></div>" +
      '<div class="py-ltitle">' + esc(l.title) + "</div>" +
      '<div class="xpbar"><i style="width:' + (done / l.ex.length * 100) + '%"></i></div>' +
      '<ol class="ms-list">' + l.ex.map(function (e, i) {
        var ok = isDone(e);
        return '<li class="ms' + (ok ? " done" : "") + (i === L.idx ? " open" : "") + '" data-i="' + i + '"><button type="button" class="ms-row">' +
          '<span class="ms-ico">' + (ok ? "✓" : i + 1) + '</span><span class="ms-t">' + esc(e.title) + '<small class="py-tag">' + esc(e.tag) + " · " + typeLabel(e) + "</small></span>" +
          '<span class="ms-xp">' + (ok ? "" : "+" + EX_XP) + "</span></button></li>";
      }).join("") + "</ol>";
    var tab = L.el.querySelector('[data-lesson="' + l.id + '"] i');
    if (tab) tab.textContent = done + "/" + l.ex.length;
  }

  function paintTask() {
    var e = L.ex, l = curLesson(), task = L.el.querySelector(".py-task");
    if (!e || !task) return;
    task.innerHTML =
      '<div class="top" style="display:flex;gap:8px;flex-wrap:wrap"><span class="pill">Εργαστήριο ' + l.num + '</span><span class="pill new">' + esc(e.tag) + "</span>" +
        (e.type === "gantt" ? '<span class="pill warn">' + ALG[e.alg] + (e.alg === "rr" ? " · κβάντο " + e.q : "") + "</span>" : "") +
        '<span class="pill">+' + EX_XP + " XP</span>" + (isDone(e) ? '<span class="pill ok">✓ Λύθηκε</span>' : "") + "</div>" +
      "<h3>" + esc(e.title) + "</h3><p>" + esc(e.desc) + "</p>";
  }

  function loadEx() {
    var l = curLesson(), e = l.ex[L.idx] || l.ex[0], box = L.el.querySelector(".sl-work");
    L.ex = e;
    paintTask();
    if (e.type === "quiz") quizView(box, e);
    else if (e.type === "gantt") ganttView(box, e);
    else termView(box, e);
  }

  // όταν λυθεί μια άσκηση
  function solved(e) {
    if (isDone(e)) return;
    api.award(exKey(e), EX_XP, "🎯 " + e.title + " · +" + EX_XP + " XP");
    var l = LESSONS.filter(function (x) { return x.ex.indexOf(e) >= 0; })[0];
    if (l && l.ex.every(isDone)) setTimeout(function () { api.celebrate("🏆 Ολοκλήρωσες όλες τις ασκήσεις του Εργαστηρίου " + l.num + "!"); }, 900);
    if (L.ex === e) { renderList(); paintTask(); }
  }

  function toolsHTML(e, check) {
    return '<div class="sl-hint" hidden>💡 ' + esc(e.hint || "") + "</div>" +
      '<div class="sl-tools">' + (check ? '<button type="button" class="btn py-checkbtn" data-act="check">✔ Έλεγχος</button>' : "") +
        (e.hint ? '<button type="button" class="btn check" data-act="hint">💡 Υπόδειξη</button>' : "") +
        '<button type="button" class="btn check" data-act="reset" title="Σβήνει τις απαντήσεις σου">↺ Από την αρχή</button></div>' +
      '<div class="sl-out" aria-live="polite"></div>';
  }
  function toggleHint(card, btn) {
    var h = card.querySelector(".sl-hint");
    h.hidden = !h.hidden;
    btn.textContent = h.hidden ? "💡 Υπόδειξη" : "🙈 Κρύψε την υπόδειξη";
  }
  function outHTML(lines) { return lines.map(function (x) { return '<div class="' + x.c + '">' + esc(x.s) + "</div>"; }).join(""); }

  // ---------- κουίζ ----------
  var GR = "αβγδεζηθικλμνξοπ";
  function quizView(box, e) {
    var w = work(e), sel = w.sel || [];
    box.innerHTML = '<div class="sticker sl-card"><ol class="sl-quiz">' + e.items.map(function (it, i) {
      var opts = it.opts || e.opts;
      return '<li data-i="' + i + '"><div class="sl-q"><b>' + GR[i] + ".</b> " + esc(it.q) + "</div>" +
        (it.num != null
          ? '<div class="sl-ask"><span>Μέσος χρόνος αναμονής =</span><input class="sl-in" data-num inputmode="decimal" autocomplete="off" value="' + esc(sel[i] || "") + '" aria-label="' + esc(it.q) + '"></div>'
          : '<div class="sl-opts">' + opts.map(function (o) { return '<button type="button" class="sl-opt" data-o="' + esc(o) + '" aria-pressed="' + (sel[i] === o) + '">' + esc(o) + "</button>"; }).join("") + "</div>") +
        '<div class="sl-why" hidden></div></li>';
    }).join("") + "</ol>" + toolsHTML(e, true) + "</div>";
    var card = box.firstChild, out = card.querySelector(".sl-out");
    function save() { w.sel = sel; work(e, w); }
    card.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-o]");
      if (b) {
        var li = b.closest("li"), i = +li.dataset.i;
        sel[i] = b.dataset.o; save();
        li.querySelectorAll("[data-o]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        li.classList.remove("ok", "bad");
        return;
      }
      var a = ev.target.closest("[data-act]");
      if (!a) return;
      if (a.dataset.act === "hint") toggleHint(card, a);
      else if (a.dataset.act === "reset") { if (!sel.length || confirm("Να σβηστούν οι απαντήσεις σου;")) { w.sel = []; work(e, w); quizView(box, e); } }
      else if (a.dataset.act === "check") {
        var right = 0, empty = 0;
        e.items.forEach(function (it, i) {
          var li = card.querySelector('li[data-i="' + i + '"]'), v = sel[i];
          var ok = it.num != null ? numOk(v, it.num) : v === it.a;
          if (v == null || v === "") empty++;
          if (ok) right++;
          li.classList.toggle("ok", ok);
          li.classList.toggle("bad", !ok && v != null && v !== "");
          var why = li.querySelector(".sl-why");
          why.hidden = !(ok && it.why);
          if (ok && it.why) why.textContent = "✓ " + it.why;
        });
        var n = e.items.length, lines;
        if (right === n) lines = [{ c: "good big", s: "🎉 Σωστό! Όλες οι απαντήσεις είναι σωστές (" + n + "/" + n + ")" }];
        else {
          lines = [{ c: "bad big", s: "🧪 Σωστές " + right + " από " + n + ". Συνέχισε, είσαι κοντά!" }];
          if (empty) lines.push({ c: "tip", s: "Δεν απάντησες σε " + (empty === 1 ? "1 ερώτηση" : empty + " ερωτήσεις") + "." });
          if (n - right - empty > 0) lines.push({ c: "tip", s: "Όσες έχουν κόκκινο περίγραμμα θέλουν άλλη απάντηση." + (e.hint ? " Αν κολλήσεις, πάτα 💡 Υπόδειξη." : "") });
        }
        out.innerHTML = outHTML(lines);
        if (right === n) solved(e);
      }
    });
    card.addEventListener("input", function (ev) {
      var inp = ev.target.closest("[data-num]");
      if (!inp) return;
      var li = inp.closest("li");
      sel[+li.dataset.i] = inp.value; save();
      li.classList.remove("ok", "bad");
    });
  }

  // ---------- διάγραμμα Gantt ----------
  var gDrag = null;
  document.addEventListener("pointerup", function () { gDrag = null; });
  document.addEventListener("pointercancel", function () { gDrag = null; });

  function ganttView(box, e) {
    var P = e.procs, n = P.length, sol = schedule(P, e.alg, e.q), T = sol.cells.length, pre = preemptive(e), hasPrio = /^prio/.test(e.alg);
    var w = work(e);
    if (!w.g || w.g.length !== T) w.g = sol.cells.map(function () { return null; });
    w.v = w.v || {};
    if (L.brush >= n) L.brush = 0;
    var cols = "grid-template-columns:repeat(" + T + ",minmax(30px,1fr))";
    function pname(i) { return '<span class="sl-p" style="--pc:' + PCOL[i] + '"><i></i>' + esc(P[i][0]) + "</span>"; }
    function inp(f, label) { return '<input class="sl-in" data-f="' + f + '" inputmode="decimal" autocomplete="off" value="' + esc(w.v[f] || "") + '" aria-label="' + esc(label) + '">'; }
    var axis = "";
    for (var t = 0; t < T; t++) axis += "<span>" + t + "</span>";
    axis += '<span class="end">' + T + "</span>";

    box.innerHTML = '<div class="sticker sl-card">' +
      '<div class="sl-lbl">Δεδομένα' + (e.alg === "rr" ? ' <span class="pill warn">κβάντο = ' + e.q + "</span>" : "") + (hasPrio ? ' <span class="pill">προτεραιότητα 1 = πιο σημαντική</span>' : "") + "</div>" +
      '<div class="sl-scroll"><table class="sl-tab"><thead><tr><th>Διεργασία</th><th>Άφιξη</th><th>Εκτέλεση</th>' + (hasPrio ? "<th>Προτερ.</th>" : "") + "</tr></thead><tbody>" +
        P.map(function (p, i) { return "<tr><td>" + pname(i) + "</td><td>" + p[1] + "</td><td>" + p[2] + "</td>" + (hasPrio ? "<td>" + p[3] + "</td>" : "") + "</tr>"; }).join("") +
      "</tbody></table></div>" +
      '<div class="sl-lbl">Διάγραμμα Gantt <small>διάλεξε διεργασία και πάτα τα κουτάκια (με το ποντίκι μπορείς και να σύρεις)</small></div>' +
      '<div class="sl-brush" role="group" aria-label="Διεργασία για χρωμάτισμα">' +
        P.map(function (p, i) { return '<button type="button" data-b="' + i + '" style="--pc:' + PCOL[i] + '" aria-pressed="' + (L.brush === i) + '">' + esc(p[0]) + "</button>"; }).join("") +
        '<button type="button" class="sl-eraser" data-b="-1" aria-pressed="' + (L.brush === -1) + '">⌫ Σβήστρα</button>' +
        '<button type="button" class="sl-clear" data-act="clear">✕ Άδειασμα</button>' +
      "</div>" +
      '<div class="sl-gwrap"><div class="sl-gin" style="min-width:' + (T * 30) + 'px">' +
        '<div class="sl-gantt" style="' + cols + '">' + sol.cells.map(function (c, t) { return '<div class="sl-c" data-t="' + t + '" role="button" aria-label="Κουτάκι ' + t + "→" + (t + 1) + '"></div>'; }).join("") + "</div>" +
        '<div class="sl-axis" style="' + cols + '">' + axis + "</div>" +
      "</div></div>" +
      '<div class="sl-lbl">Πίνακας χρόνων</div>' +
      '<div class="sl-scroll"><table class="sl-tab"><thead><tr><th>Διεργασία</th>' + (pre ? "" : "<th>Αρχίζει</th>") + "<th>Τελειώνει</th><th>Αναμονή<small>" + (pre ? "τέλος − άφιξη − εκτέλεση" : "αρχίζει − άφιξη") + "</small></th></tr></thead><tbody>" +
        P.map(function (p, i) {
          return "<tr><td>" + pname(i) + "</td>" + (pre ? "" : "<td>" + inp(i + "s", p[0] + " αρχίζει") + "</td>") + "<td>" + inp(i + "f", p[0] + " τελειώνει") + "</td><td>" + inp(i + "w", p[0] + " αναμονή") + "</td></tr>";
        }).join("") +
      "</tbody></table></div>" +
      '<div class="sl-ask sl-avg"><span><b>Μέσος χρόνος αναμονής</b> =</span>' + inp("avg", "Μέσος χρόνος αναμονής") + "</div>" +
      toolsHTML(e, true) + "</div>";

    var card = box.firstChild, g = card.querySelector(".sl-gantt"), out = card.querySelector(".sl-out"), skipClick = false;
    function save() { work(e, w); }
    function paint(t) {
      var c = g.children[t], v = w.g[t];
      c.style.background = v == null ? "" : PCOL[v];
      c.textContent = v == null ? "" : P[v][0];
      c.classList.toggle("on", v != null);
    }
    function set(t, v) { if (w.g[t] === v) return; w.g[t] = v; paint(t); g.children[t].classList.remove("bad"); save(); }
    function pick(t) { var b = L.brush; return b >= 0 && w.g[t] !== b ? b : null; }
    for (var k = 0; k < T; k++) paint(k);

    g.addEventListener("pointerdown", function (ev) {
      var c = ev.target.closest(".sl-c");
      skipClick = ev.pointerType === "mouse";
      if (!c || !skipClick) return;
      ev.preventDefault();
      var t = +c.dataset.t;
      gDrag = { g: g, v: pick(t) };
      set(t, gDrag.v);
    });
    g.addEventListener("pointerover", function (ev) {
      var c = ev.target.closest(".sl-c");
      if (c && gDrag && gDrag.g === g && (ev.buttons & 1)) set(+c.dataset.t, gDrag.v);
    });
    g.addEventListener("click", function (ev) {
      if (skipClick) { skipClick = false; return; }
      var c = ev.target.closest(".sl-c");
      if (c) { var t = +c.dataset.t; set(t, pick(t)); }
    });
    card.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-b]");
      if (b) {
        L.brush = +b.dataset.b;
        card.querySelectorAll("[data-b]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        return;
      }
      var a = ev.target.closest("[data-act]");
      if (!a) return;
      if (a.dataset.act === "hint") toggleHint(card, a);
      else if (a.dataset.act === "clear") { for (var t = 0; t < T; t++) set(t, null); }
      else if (a.dataset.act === "reset") {
        if (confirm("Να σβηστούν το Gantt και ο πίνακας;")) { work(e, {}); ganttView(box, e); }
      }
      else if (a.dataset.act === "check") out.innerHTML = outHTML(checkGantt(e, sol, w, card));
    });
    card.addEventListener("input", function (ev) {
      var i = ev.target.closest("[data-f]");
      if (!i) return;
      w.v[i.dataset.f] = i.value; save();
      i.classList.remove("ok", "bad");
    });
  }

  function checkGantt(e, sol, w, card) {
    var P = e.procs, pre = preemptive(e), lines = [], ok = true;
    var cells = card.querySelectorAll(".sl-c");
    cells.forEach(function (c) { c.classList.remove("bad"); });
    var bad = -1;
    for (var t = 0; t < sol.cells.length; t++) if (w.g[t] !== sol.cells[t]) { bad = t; break; }
    if (bad >= 0) {
      ok = false;
      cells[bad].classList.add("bad");
      lines.push({ c: "bad", s: "✘ Gantt: το κουτάκι " + bad + "→" + (bad + 1) + " δεν είναι σωστό (" + (w.g[bad] == null ? "είναι άδειο" : "έβαλες " + P[w.g[bad]][0]) + ")." });
      lines.push({ c: "tip", s: "💡 " + whyAt(e, sol, bad) });
    } else lines.push({ c: "good", s: "✔ Το διάγραμμα Gantt είναι σωστό." });

    var fields = pre ? [["f", "τέλος", sol.fin], ["w", "αναμονή", sol.wait]] : [["s", "αρχίζει", sol.start], ["f", "τέλος", sol.fin], ["w", "αναμονή", sol.wait]];
    var empty = 0, wrong = [], wrongKinds = {};
    P.forEach(function (p, i) {
      fields.forEach(function (f) {
        var el = card.querySelector('[data-f="' + i + f[0] + '"]'), v = w.v[i + f[0]];
        el.classList.remove("ok", "bad");
        if (v == null || String(v).trim() === "") { empty++; return; }
        if (numOk(v, f[2][i])) el.classList.add("ok");
        else { el.classList.add("bad"); wrong.push(p[0] + " " + f[1]); wrongKinds[f[0]] = 1; }
      });
    });
    if (empty || wrong.length) ok = false;
    if (empty) lines.push({ c: "bad", s: "✘ Συμπλήρωσε όλο τον πίνακα (λείπουν " + empty + " κουτάκια)." });
    if (wrong.length) {
      lines.push({ c: "bad", s: "✘ Λάθος στον πίνακα: " + wrong.slice(0, 4).join(", ") + (wrong.length > 4 ? " και άλλα " + (wrong.length - 4) : "") + "." });
      if (wrongKinds.s) lines.push({ c: "tip", s: "💡 Αρχίζει = η στιγμή που η διεργασία εμφανίζεται πρώτη φορά στο Gantt." });
      if (wrongKinds.f) lines.push({ c: "tip", s: "💡 Τελειώνει = η στιγμή που κλείνει το τελευταίο της κουτάκι στο Gantt." });
      if (wrongKinds.w) lines.push({ c: "tip", s: "💡 Αναμονή = " + (pre ? "τέλος − άφιξη − εκτέλεση." : "αρχίζει − άφιξη.") });
    }
    if (!empty && !wrong.length) lines.push({ c: "good", s: "✔ Ο πίνακας είναι σωστός." });

    var avgEl = card.querySelector('[data-f="avg"]'), av = w.v.avg;
    avgEl.classList.remove("ok", "bad");
    if (av == null || String(av).trim() === "") { ok = false; lines.push({ c: "bad", s: "✘ Λείπει ο μέσος χρόνος αναμονής." }); }
    else if (numOk(av, sol.avg)) { avgEl.classList.add("ok"); lines.push({ c: "good", s: "✔ Ο μέσος όρος είναι σωστός." }); }
    else {
      ok = false; avgEl.classList.add("bad");
      lines.push({ c: "bad", s: "✘ Ο μέσος όρος δεν είναι σωστός." });
      lines.push({ c: "tip", s: "💡 Πρόσθεσε τις αναμονές και διαίρεσε με το πλήθος των διεργασιών (" + P.length + "). Αν δεν βγαίνει ακριβής, γράψε 2 δεκαδικά (π.χ. 4,33)." });
    }
    lines.unshift(ok ? { c: "good big", s: "🎉 Σωστό! Gantt, πίνακας και μέσος όρος, όλα σωστά." } : { c: "bad big", s: "🧪 Σχεδόν! Δες τι χρειάζεται διόρθωση:" });
    if (ok) solved(e);
    return lines;
  }

  // εξήγηση για το πρώτο λάθος κουτάκι
  function whyAt(e, sol, t) {
    var P = e.procs, cx = sol.ctx[t], when = "Τη στιγμή " + t;
    function nm(i) { return P[i][0]; }
    if (cx.cur < 0) return when + " δεν περιμένει καμία διεργασία: όσες ήρθαν έχουν τελειώσει και η επόμενη δεν έχει φτάσει. Ο επεξεργαστής μένει άδειος, άφησε το κουτάκι λευκό.";
    if (e.alg === "rr") {
      if (!cx.fresh) return "Η " + nm(cx.cur) + " πήρε τον επεξεργαστή και τον κρατά μέχρι να λήξει το κβάντο (" + e.q + ") ή να τελειώσει.";
      return when + " η ουρά είναι: " + cx.queue.map(nm).join(" → ") + ". Τον επεξεργαστή τον παίρνει η πρώτη της ουράς. Όποια δεν τελειώνει στο κβάντο της πάει στο τέλος της ουράς, πίσω από όσες ήρθαν στο μεταξύ.";
    }
    if (e.alg === "srtf" || e.alg === "prio-p") {
      var lst = cx.cand.map(function (i) { return nm(i) + " (" + (e.alg === "srtf" ? "υπόλοιπο " + cx.rem[i] : "προτεραιότητα " + P[i][3]) + ")"; }).join(", ");
      return when + " έχουν φτάσει και δεν έχουν τελειώσει: " + lst + ". " + (e.alg === "srtf"
        ? "Το SRTF τρέχει όποια έχει τον μικρότερο υπόλοιπο χρόνο (σε ισοπαλία συνεχίζει αυτή που ήδη τρέχει)."
        : "Τρέχει η πιο σημαντική (μικρότερος αριθμός). Αν φτάσει πιο σημαντική, η τρέχουσα σταματά.");
    }
    if (!cx.fresh) return when + " τρέχει η " + nm(cx.cur) + " και το " + ALG[e.alg] + " δεν διακόπτει: συνεχίζει μέχρι να τελειώσει.";
    var desc = { fcfs: function (i) { return "άφιξη " + P[i][1]; }, sjf: function (i) { return "εκτέλεση " + P[i][2]; }, prio: function (i) { return "προτεραιότητα " + P[i][3]; } }[e.alg];
    var rule = { fcfs: "Το FCFS διαλέγει όποια ήρθε πρώτη.", sjf: "Το SJF διαλέγει αυτή με τη μικρότερη εκτέλεση (σε ισοπαλία, όποια ήρθε πρώτη).", prio: "Διαλέγεις την πιο σημαντική (μικρότερος αριθμός)." }[e.alg];
    return when + " ο επεξεργαστής είναι ελεύθερος. Έχουν φτάσει και περιμένουν: " + cx.cand.map(function (i) { return nm(i) + " (" + desc(i) + ")"; }).join(", ") + ". " + rule;
  }

  // ---------- αποστολές στο τερματικό ----------
  function exSim(e, keep) {
    var s = newSim(e.os);
    s.stepOk = keep || [];
    s.after = function (s) { termAfter(e, s); };
    return s;
  }
  function askOk(e, s, i, v) {
    var a = e.asks[i].a, list = typeof a === "function" ? a(s) : a, val = norm(v);
    if (!val) return false;
    return list.some(function (x) {
      if (x instanceof RegExp) return x.test(val);
      var y = norm(x);
      return y === val || y.replace(/[\s.,]/g, "") === val.replace(/[\s.,]/g, "");
    });
  }
  function termAfter(e, s) {
    var newly = [];
    e.steps.forEach(function (st, i) { if (!s.stepOk[i] && st.check(s)) { s.stepOk[i] = true; newly.push(i); } });
    newly.forEach(function (i) { print(s, G("✔ Βήμα " + (i + 1) + ": " + e.steps[i].t)); });
    if (newly.length && L.ex === e && s === current) paintSteps(e, s);
    termTry(e, s);
  }
  function termTry(e, s) {
    if (isDone(e) || !e.steps.every(function (st, i) { return s.stepOk[i]; })) return;
    var ans = work(e).a || [];
    if (!(e.asks || []).every(function (q, i) { return askOk(e, s, i, ans[i]); })) {
      if (!s.askNag) { s.askNag = 1; print(s, T("Έκανες όλα τα βήματα! Συμπλήρωσε τώρα και τις απαντήσεις στα κουτάκια πάνω από το τερματικό.")); }
      return;
    }
    print(s, G("🏆 Η άσκηση «" + e.title + "» ολοκληρώθηκε! +" + EX_XP + " XP"));
    solved(e);
  }
  function paintSteps(e, s) {
    var ol = L.el.querySelector(".sl-st");
    if (!ol) return;
    var all = isDone(e);
    ol.innerHTML = e.steps.map(function (st, i) {
      var ok = all || s.stepOk[i];
      return '<li class="' + (ok ? "ok" : "") + '"><span class="sl-dot">' + (ok ? "✓" : i + 1) + '</span><span class="sl-stt"><span class="sl-tx">' + esc(st.t) + "</span>" +
        '<button type="button" class="ms-hint" data-h aria-label="Βοήθεια για το βήμα ' + (i + 1) + '">💡</button>' +
        '<span class="ms-help" hidden>Δοκίμασε' + (st.hint.length > 1 ? " (μία-μία)" : "") + ": " + st.hint.map(function (h) { return '<code data-cmd="' + esc(h) + '">' + esc(h) + "</code>"; }).join(" ") + "</span></span></li>";
    }).join("");
  }
  function termView(box, e) {
    var s = exSims[e.id] || (exSims[e.id] = exSim(e)), w = work(e), ans = w.a || [], done = isDone(e);
    current = s;
    box.innerHTML = '<div class="sticker sl-card"><div class="sl-lbl">Βήματα <small>' + (e.os === "linux" ? "στο τερματικό Linux" : "στη Γραμμή εντολών των Windows") + "</small></div><ol class=\"sl-st\"></ol>" +
      (e.asks ? '<div class="sl-lbl">Βρες και γράψε <small>η απάντηση βρίσκεται στην έξοδο των εντολών</small></div><div class="sl-asks">' + e.asks.map(function (q, i) {
        var ok = askOk(e, s, i, ans[i]) || (done && ans[i]);
        return '<label class="sl-ask"><span>' + esc(q.q) + '</span><input class="sl-in sl-wide' + (ok ? " ok" : "") + '" data-ask="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(ans[i] || "") + '"><b class="sl-mark">' + (ok ? "✓" : "") + "</b></label>";
      }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="sl-term">' + vtHTML(s) + "</div>" +
      '<div class="sl-tools"><button type="button" class="btn check" data-act="restart" title="Ο υπολογιστής ξεκινά από την αρχή· τα βήματα που έκανες μένουν">↺ Επανεκκίνηση υπολογιστή</button></div>';
    paintSteps(e, s);
    bindVT(box.querySelector(".sl-term"));
    var card = box.firstChild;
    card.addEventListener("click", function (ev) {
      var code = ev.target.closest("[data-cmd]");
      if (code) { fillCmd(code.dataset.cmd); return; }
      var h = ev.target.closest("[data-h]");
      if (h) { var help = h.parentNode.querySelector(".ms-help"); help.hidden = !help.hidden; }
    });
    card.addEventListener("input", function (ev) {
      var inp = ev.target.closest("[data-ask]");
      if (!inp) return;
      var i = +inp.dataset.ask, wk = work(e), sim = exSims[e.id];
      wk.a = wk.a || []; wk.a[i] = inp.value; work(e, wk);
      var ok = askOk(e, sim, i, inp.value);
      inp.classList.toggle("ok", ok);
      inp.parentNode.querySelector(".sl-mark").textContent = ok ? "✓" : "";
      if (ok) termTry(e, sim);
    });
    box.querySelector('[data-act="restart"]').addEventListener("click", function () {
      clearTimeout(s.timer);
      exSims[e.id] = exSim(e, s.stepOk.slice());
      termView(box, e);
    });
  }

  window.LAB = {
    render: render,
    missions: MISSIONS,
    lessons: LESSONS,
    _test: { newSim: newSim, run: function (s, line) { current = s; runLine(s, line, null); }, setApi: function (a) { api = a; }, schedule: schedule, numOk: numOk, askOk: askOk }
  };
})();
