"use client";

import { useEffect, useRef, useState } from "react";
import { Wreath, Sprig, Divider } from "./Ornaments";
import Countdown from "./Countdown";
import RsvpForm from "./RsvpForm";
import { toIntl } from "@/lib/events";

export default function Invitation({ ev }) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [guest, setGuest] = useState("");
  const [hasMusic, setHasMusic] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setGuest((p.get("to") || "").slice(0, 80));
    fetch("/music.mp3", { method: "HEAD" })
      .then((r) => setHasMusic(r.ok && (r.headers.get("content-type") || "").includes("audio")))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    if (!opened) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [opened]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    if (hasMusic && audio.current) {
      audio.current.volume = 0.5;
      audio.current.play().then(() => setPlaying(true)).catch(() => {});
    }
    setTimeout(() => setOpened(true), 1500);
  };

  const toggleMusic = () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else audio.current.play().then(() => setPlaying(true)).catch(() => {});
  };

  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    ev.calendar.title
  )}&dates=${ev.calendar.start}/${ev.calendar.end}&location=${encodeURIComponent(ev.calendar.location)}`;

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AE Wedding//EN", "BEGIN:VEVENT",
      `UID:${ev.slug}-ayesh-eshani@wedding`, `DTSTAMP:${ev.calendar.start}`,
      `DTSTART:${ev.calendar.start}`, `DTEND:${ev.calendar.end}`,
      `SUMMARY:${ev.calendar.title}`, `LOCATION:${ev.calendar.location.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${ev.slug}-ayesh-eshani.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`site theme-${ev.theme}`}>
      {hasMusic && <audio ref={audio} src="/music.mp3" loop preload="auto" />}

      {/* ===== Envelope intro ===== */}
      {!opened && (
        <div className={`envelope-screen ${opening ? "opening" : ""}`} onClick={open}>
          <div className="env-inner">
            {guest && <p className="env-to">Dear <span>{guest}</span></p>}
            <div className="envelope">
              <div className="env-back" />
              <div className="env-letter">
                <span className="script gold-text">Ayesh & Eshani</span>
              </div>
              <div className="env-front" />
              <div className="env-flap" />
              <button className="seal" aria-label="Open invitation">
                <span>A</span><i>&</i><span>E</span>
              </button>
            </div>
            <p className="env-hint">Tap to open your invitation</p>
          </div>
        </div>
      )}

      {hasMusic && opened && (
        <button className="music-btn" onClick={toggleMusic} aria-label="Toggle music">
          {playing ? "❚❚" : "♪"}
        </button>
      )}

      <nav className="topnav">
        <a href="#top" className="mono">A<span>&</span>E</a>
        <div className="links">
          <a href="#details">Details</a>
          <a href="#schedule">Schedule</a>
          <a href="#venue">Venue</a>
          <a href="#rsvp" className="pill">RSVP</a>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <header id="top" className="hero">
        <Sprig className="sprig-left" />
        <Sprig className="sprig-right" flip />
        <div className="hero-card">
          <div className="gold-icon"><Wreath size={120} /></div>
          {guest && <p className="dear">Dear {guest},</p>}
          <p className="eyebrow">{ev.eyebrow}</p>
          <h1 className="names">
            <span className="script gold-text">{ev.first.name}</span>
            <span className="amp gold-text">&</span>
            <span className="script gold-text">{ev.second.name}</span>
          </h1>
          <p className="kind">{ev.kind}</p>
          <div className="date-row">
            <span className="date-side">{ev.weekday}</span>
            <span className="date-mid">
              <small>{ev.month}</small>
              <b className="gold-text">{ev.day}</b>
            </span>
            <span className="date-side">{ev.year}</span>
          </div>
          <p className="hero-time">{ev.timeLabel}</p>
          <a href="#rsvp" className="btn">Kindly RSVP</a>
        </div>
        <a href="#details" className="scroll-cue" aria-label="Scroll"><span /></a>
      </header>

      {/* ===== Invitation wording ===== */}
      <section id="details" className="section">
        <div className="paper reveal">
          <div className="gold-icon"><Divider /></div>
          {ev.theme === "maroon" && <p className="caps">{ev.eyebrow}</p>}
          <div className="parents">
            <div>
              <h3 className="script gold-text">{ev.first.name}</h3>
              <p className="caps small">{ev.first.role}</p>
              <p className="parent-names">{ev.first.parents}</p>
            </div>
            <div className="and script gold-text">&</div>
            <div>
              <h3 className="script gold-text">{ev.second.name}</h3>
              <p className="caps small">{ev.second.role}</p>
              <p className="parent-names">{ev.second.parents}</p>
            </div>
          </div>
          <p className="caps">{ev.inviteLine}</p>
          <p className="guest-line">{guest ? guest : "you and your family"}</p>
          <p className="purpose">{ev.purpose}</p>
          <div className="gold-icon"><Divider /></div>
        </div>
      </section>

      {/* ===== Countdown ===== */}
      <section className="section countdown-sec">
        <p className="eyebrow reveal">Counting down to the day</p>
        <Countdown iso={ev.dateISO} />
        <div className="cal-btns reveal">
          <a className="btn ghost" href={gcal} target="_blank" rel="noreferrer">Add to Google Calendar</a>
          <button className="btn ghost" onClick={downloadIcs}>Apple / Outlook (.ics)</button>
        </div>
      </section>

      {/* ===== Schedule ===== */}
      <section id="schedule" className="section">
        <h2 className="sec-title reveal"><span className="script gold-text">Order of the Day</span></h2>
        <p className="sec-sub reveal">{ev.weekday}, {ev.day} {ev.month} {ev.year}</p>
        <ol className="timeline">
          {ev.schedule.map((s, i) => (
            <li key={i} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="t-time">{s.time}</span>
              <span className="t-dot" />
              <span className="t-body">
                <b>{s.title}</b>
                <small>{s.place}</small>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Venue ===== */}
      <section id="venue" className="section">
        <h2 className="sec-title reveal"><span className="script gold-text">Where</span></h2>
        <div className={`venues ${ev.venues.length > 1 ? "two" : ""}`}>
          {ev.venues.map((v) => (
            <div key={v.name} className="venue reveal">
              <p className="caps small">{v.label}</p>
              <h3>{v.name}</h3>
              <p className="addr">{v.address}</p>
              <p className="vtime">{v.time}</p>
              <div className="map">
                <iframe src={v.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={v.name} />
              </div>
              <a className="btn" href={v.link} target="_blank" rel="noreferrer">Get Directions</a>
            </div>
          ))}
        </div>
      </section>

      {/* ===== RSVP ===== */}
      <section id="rsvp" className="section">
        <h2 className="sec-title reveal"><span className="script gold-text">Will you join us?</span></h2>
        <p className="sec-sub reveal">{ev.rsvpNote}</p>
        <RsvpForm event={ev.slug} defaultName={guest} />
      </section>

      {/* ===== Contacts ===== */}
      <section className="section contacts-sec">
        <p className="eyebrow reveal">For inquiries</p>
        <div className="contacts">
          {ev.contacts.map((c) => (
            <div key={c.phone} className="contact reveal">
              <b>{c.name}</b>
              <span>{c.display}</span>
              <div className="c-actions">
                <a href={`tel:${c.phone}`}>Call</a>
                <a href={`https://wa.me/${toIntl(c.phone)}`} target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="gold-icon"><Wreath size={90} /></div>
        <p className="script gold-text big">Thank you</p>
        <p className="caps small">With love · Ayesh & Eshani · 2027</p>
      </footer>
    </div>
  );
}
