"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, RSVPS } from "@/lib/firebase";

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

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteUrl = `${origin}/${tab}${inviteName.trim() ? `?to=${encodeURIComponent(inviteName.trim())}` : ""}`;
  const waText = encodeURIComponent(
    `${inviteName.trim() ? `Dear ${inviteName.trim()},\n` : ""}With joy we invite you to our wedding ${tab === "day1" ? "on Saturday, 09 January 2027" : "celebration on Sunday, 10 January 2027"} 💍\nPlease open your invitation & RSVP here:\n${inviteUrl}\n\n— Ayesh & Eshani`
  );

  if (user === undefined) return <main className="admin login-wrap"><p className="caps small">Loading…</p></main>;

  if (!user) {
    return (
      <main className="admin login-wrap">
        <form className="login" onSubmit={login}>
          <p className="script gold-text big">Ayesh & Eshani</p>
          <p className="caps small">RSVP Admin</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" autoFocus />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" />
          {err && <p className="form-err">{err}</p>}
          <button className="btn wide">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="a-head">
        <div>
          <p className="script gold-text">Ayesh & Eshani</p>
          <h1>RSVP Dashboard</h1>
        </div>
        <div className="a-head-btns">
          <button onClick={() => load()} disabled={loading}>{loading ? "Loading…" : "↻ Refresh"}</button>
          <button onClick={() => { signOut(auth); setRows([]); }}>Sign out</button>
        </div>
      </header>

      <div className="tabs">
        {["day1", "day2"].map((d) => (
          <button key={d} className={tab === d ? "on" : ""} onClick={() => setTab(d)}>
            {LABEL[d]} <span>{stats[d].total}</span>
          </button>
        ))}
      </div>

      <div className="stat-grid">
        <div className="stat"><small>Responses</small><b>{stats[tab].total}</b></div>
        <div className="stat good"><small>Attending</small><b>{stats[tab].yes}</b></div>
        <div className="stat"><small>Total guests coming</small><b>{stats[tab].guests}</b></div>
        <div className="stat bad"><small>Declined</small><b>{stats[tab].no}</b></div>
      </div>

      {err && <p className="form-err">{err}</p>}

      <div className="toolbar">
        <input placeholder="Search name, phone, message…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="yes">Attending</option>
          <option value="no">Declined</option>
        </select>
        <button onClick={exportCsv}>⬇ Export CSV</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Status</th><th>Guests</th><th>Phone</th><th>Message</th><th>Received</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td data-l="Name"><b>{r.name}</b></td>
                <td data-l="Status"><span className={`badge ${r.attending ? "yes" : "no"}`}>{r.attending ? "Attending" : "Declined"}</span></td>
                <td data-l="Guests">{r.attending ? r.guests : "—"}</td>
                <td data-l="Phone">{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}</td>
                <td data-l="Message" className="msg">{r.message || "—"}</td>
                <td data-l="Received">{(r.created_at ? new Date(r.created_at).toLocaleString() : "—")}</td>
                <td><button className="del" onClick={() => del(r.id)} title="Delete">✕</button></td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={7} className="empty">{loading ? "Loading…" : "No responses yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="invite-gen">
        <h2>Personal invite link</h2>
        <p>Type a guest's name — the invitation will greet them by name. ({LABEL[tab]})</p>
        <div className="toolbar">
          <input placeholder="e.g. Mr. & Mrs. Perera" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
        </div>
        <code className="link-out">{inviteUrl}</code>
        <div className="a-head-btns">
          <button onClick={() => { navigator.clipboard?.writeText(inviteUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? "✓ Copied" : "Copy link"}
          </button>
          <a className="wa" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer">Share on WhatsApp</a>
          <a href={inviteUrl} target="_blank" rel="noreferrer">Preview</a>
        </div>
      </section>
    </main>
  );
}
