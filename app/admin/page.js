"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, RSVPS } from "@/lib/firebase";

const DEFAULT_TPL = {
  day1: "Dear {name},\nWith joy we invite you to our wedding on Saturday, 09 January 2027 💍\nPlease open your invitation & RSVP here:\n{link}\n\n— Ayesh & Eshani",
  day2: "Dear {name},\nWith joy we invite you to our wedding celebration on Sunday, 10 January 2027 💍\nPlease open your invitation & RSVP here:\n{link}\n\n— Ayesh & Eshani",
};

// {name} and {link} are filled in automatically. Lines with {name} are dropped when no name is typed.
function buildMessage(tpl, name, link) {
  let lines = tpl.split("\n");
  if (!name) lines = lines.filter((l) => !l.includes("{name}"));
  let msg = lines.join("\n").replaceAll("{name}", name).replaceAll("{link}", link);
  if (!tpl.includes("{link}")) msg = `${msg.trim()}\n${link}`;
  return msg;
}

const LABEL = { day1: "Day 1 · Church (09 Jan)", day2: "Day 2 · Celebration (10 Jan)" };

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = checking
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("day1");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteDay, setInviteDay] = useState("day1");
  const [tpls, setTpls] = useState(DEFAULT_TPL);
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    try { const t = JSON.parse(localStorage.getItem("ae-wa-tpl") || "null"); if (t?.day1 && t?.day2) setTpls(t); } catch {}
  }, []);
  const setTpl = (v) => {
    const next = { ...tpls, [inviteDay]: v };
    setTpls(next);
    try { localStorage.setItem("ae-wa-tpl", JSON.stringify(next)); } catch {}
  };
  const [copied, setCopied] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const snap = await getDocs(query(collection(db, RSVPS), orderBy("created_at", "desc")));
      setRows(snap.docs.map((d) => {
        const x = d.data();
        return { id: d.id, ...x, created_at: x.created_at?.toDate?.().toISOString() ?? null };
      }));
    } catch (e) {
      setErr(e.code === "permission-denied" ? "This account is not allowed to view RSVPs (check the admin email in Firestore rules)." : e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  const login = async (e) => {
    e.preventDefault(); setErr("");
    try { await signInWithEmailAndPassword(auth, email.trim(), pass); }
    catch { setErr("Wrong email or password"); }
  };

  const del = async (id) => {
    if (!confirm("Delete this response permanently?")) return;
    try { await deleteDoc(doc(db, RSVPS, id)); load(); } catch (e) { setErr(e.message); }
  };

  const moveDay = async (r, to) => {
    if (to === r.event) return;
    if (!confirm(`Move "${r.name}" to ${LABEL[to]}?`)) return;
    try {
      await updateDoc(doc(db, RSVPS, r.id), { event: to });
      setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, event: to } : x)));
    } catch (e) {
      setErr(e.code === "permission-denied" ? "Not allowed to change the day — publish the latest firestore.rules in Firebase." : e.message);
    }
  };

  const stats = useMemo(() => {
    const s = {};
    for (const d of ["day1", "day2"]) {
      const r = rows.filter((x) => x.event === d);
      s[d] = {
        total: r.length,
        yes: r.filter((x) => x.attending).length,
        no: r.filter((x) => !x.attending).length,
        guests: r.filter((x) => x.attending).reduce((a, x) => a + (x.guests || 0), 0),
      };
    }
    return s;
  }, [rows]);

  const list = rows
    .filter((r) => r.event === tab)
    .filter((r) => filter === "all" || (filter === "yes" ? r.attending : !r.attending))
    .filter((r) => !q || `${r.name} ${r.phone || ""} ${r.message || ""}`.toLowerCase().includes(q.toLowerCase()));

  const exportCsv = () => {
    const head = ["Date", "Event", "Name", "Phone", "Attending", "Guests", "Message"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.join(",")].concat(
      list.map((r) => [(r.created_at ? new Date(r.created_at).toLocaleString() : "—"), LABEL[r.event], r.name, r.phone, r.attending ? "Yes" : "No", r.guests, r.message].map(esc).join(","))
    );
    const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `rsvps-${tab}.csv`; a.click();
  };

  // invite links always point to the public wedding site, even when the admin panel is on its own domain
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ayesh-eshani-wedding.vercel.app";
  const origin =
    typeof window === "undefined" ? "" :
    ["localhost", "127.0.0.1"].includes(window.location.hostname) ? window.location.origin : SITE_URL;
  const inviteUrl = `${origin}/${inviteDay}${inviteName.trim() ? `?to=${encodeURIComponent(inviteName.trim())}` : ""}`;
  const message = buildMessage(tpls[inviteDay], inviteName.trim(), inviteUrl);
  const waText = encodeURIComponent(message);

  if (user === undefined) return <main className="admin login-wrap"><p className="a-sub">Loading…</p></main>;

  if (!user) {
    return (
      <main className="admin login-wrap">
        <form className="login" onSubmit={login}>
          <h1 className="a-title">RSVP Admin</h1>
          <p className="a-sub">Ayesh & Eshani</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" autoFocus />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" />
          {err && <p className="form-err">{err}</p>}
          <button className="primary">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="a-head">
        <div className="a-brand">
          <span className="a-logo">A&E</span>
          <div>
            <h1>RSVP Dashboard</h1>
            <p className="a-sub">Ayesh & Eshani · Wedding 2027</p>
          </div>
        </div>
        <div className="a-head-btns">
          <button onClick={() => load()} disabled={loading}>{loading ? "Loading…" : "Refresh"}</button>
          <button onClick={() => { signOut(auth); setRows([]); }}>Sign out</button>
        </div>
      </header>

      <div className="tabs">
        {["day1", "day2"].map((d) => (
          <button key={d} className={tab === d ? "on" : ""} onClick={() => setTab(d)}>
            <em className="t-full">{LABEL[d]}</em>
            <em className="t-short">{d === "day1" ? "Day 1 · 09 Jan" : "Day 2 · 10 Jan"}</em>
            <span>{stats[d].total}</span>
          </button>
        ))}
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span className="s-ico"><svg viewBox="0 0 24 24"><path d="M4 4h16v12H5.2L4 17.2z" /></svg></span>
          <small>Responses</small><b>{stats[tab].total}</b>
        </div>
        <div className="stat">
          <span className="s-ico"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
          <small>Attending</small><b>{stats[tab].yes}</b>
        </div>
        <div className="stat feature">
          <span className="s-ico"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><circle cx="17" cy="9" r="2.4" /><path d="M16 13.6c2.9 0 5 1.9 5 4.9" /></svg></span>
          <small>Total guests coming</small><b>{stats[tab].guests}</b>
        </div>
        <div className="stat">
          <span className="s-ico"><svg viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></svg></span>
          <small>Declined</small><b>{stats[tab].no}</b>
        </div>
      </div>

      {err && <p className="form-err">{err}</p>}

      <div className="toolbar">
        <input placeholder="Search name, phone, message…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="yes">Attending</option>
          <option value="no">Declined</option>
        </select>
        <button onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Day</th><th>Status</th><th>Guests</th><th>Phone</th><th>Message</th><th>Received</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td data-l="Name"><b>{r.name}</b></td>
                <td data-l="Day">
                  <select className="day-sel" value={r.event} onChange={(e) => moveDay(r, e.target.value)}>
                    <option value="day1">Day 1 · 09 Jan</option>
                    <option value="day2">Day 2 · 10 Jan</option>
                  </select>
                </td>
                <td data-l="Status"><span className={`badge ${r.attending ? "yes" : "no"}`}>{r.attending ? "Attending" : "Declined"}</span></td>
                <td data-l="Guests">{r.attending ? r.guests : "—"}</td>
                <td data-l="Phone">{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}</td>
                <td data-l="Message" className="msg">{r.message || "—"}</td>
                <td data-l="Received">{(r.created_at ? new Date(r.created_at).toLocaleString() : "—")}</td>
                <td><button className="del" onClick={() => del(r.id)} title="Delete">✕</button></td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={8} className="empty">{loading ? "Loading…" : "No responses yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="invite-gen">
        <h2>Personal invite link</h2>
        <p>Choose the day, type the guest's name — the invitation will greet them by name.</p>
        <div className="day-pick">
          {["day1", "day2"].map((d) => (
            <button key={d} type="button" className={inviteDay === d ? "on" : ""} onClick={() => setInviteDay(d)}>
              <b>{d === "day1" ? "Day 1" : "Day 2"}</b>
              <small>{d === "day1" ? "Church · Sat 09 Jan" : "Celebration · Sun 10 Jan"}</small>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <input placeholder="e.g. Mr. & Mrs. Perera" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
        </div>
        <code className="link-out">{inviteUrl}</code>
        <label className="msg-label">
          <span>WhatsApp message <em>— use <b>{"{name}"}</b> for the guest's name and <b>{"{link}"}</b> for the invitation link</em></span>
          <textarea rows={7} value={tpls[inviteDay]} onChange={(e) => setTpl(e.target.value)} />
        </label>
        <div className="msg-preview">
          <small>Preview</small>
          <p>{message}</p>
        </div>
        <div className="a-head-btns">
          <button onClick={() => { navigator.clipboard?.writeText(inviteUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? "Copied" : "Copy link"}
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(message); setCopiedMsg(true); setTimeout(() => setCopiedMsg(false), 1500); }}>
            {copiedMsg ? "Copied" : "Copy message"}
          </button>
          <button onClick={() => setTpl(DEFAULT_TPL[inviteDay])}>Reset message</button>
          <a className="primary" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer">Share on WhatsApp</a>
          <a href={inviteUrl} target="_blank" rel="noreferrer">Preview</a>
        </div>
      </section>
    </main>
  );
}
