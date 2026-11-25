"use client";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, RSVPS } from "@/lib/firebase";

export default function RsvpForm({ event, defaultName }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [err, setErr] = useState("");
  const [prev, setPrev] = useState(null);

  useEffect(() => { if (defaultName && !name) setName(defaultName); }, [defaultName]); // eslint-disable-line
  useEffect(() => {
    try { const s = localStorage.getItem(`rsvp-${event}`); if (s) setPrev(JSON.parse(s)); } catch {}
  }, [event]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Please enter your name.");
    if (attending === null) return setErr("Please let us know if you can attend.");
    setErr(""); setState("sending");
    try {
      await addDoc(collection(db, RSVPS), {
        event,
        name: name.trim().slice(0, 80),
        phone: phone.trim().slice(0, 20) || null,
        attending,
        guests: attending ? guests : 0,
        message: message.trim().slice(0, 500) || null,
        created_at: serverTimestamp(),
      });
      const rec = { name, attending };
      try { localStorage.setItem(`rsvp-${event}`, JSON.stringify(rec)); } catch {}
      setPrev(rec); setState("done");
    } catch (e2) {
      console.error(e2); setErr("Could not send your RSVP. Please try again."); setState("error");
    }
  };

  if (prev && state !== "editing") {
    return (
      <div className="paper rsvp-done reveal in">
        <p className="script gold-text big">Thank you, {prev.name}!</p>
        <p>{prev.attending ? "We can't wait to celebrate with you." : "You will be missed — thank you for letting us know."}</p>
        <button className="link-btn" onClick={() => { setPrev(null); setState("editing"); }}>Update my response</button>
      </div>
    );
  }

  return (
    <form className="paper rsvp reveal" onSubmit={submit}>
      <label>Full Name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} />
      </label>
      <label>Phone <em>(optional)</em>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" inputMode="tel" maxLength={20} />
      </label>
      <div className="choice">
        <button type="button" className={attending === true ? "on" : ""} onClick={() => setAttending(true)}>
          <b>Joyfully Accepts</b><small>I'll be there</small>
        </button>
        <button type="button" className={attending === false ? "on" : ""} onClick={() => setAttending(false)}>
          <b>Regretfully Declines</b><small>Celebrating in spirit</small>
        </button>
      </div>
      {attending && (
        <label>Number of guests (including you)
          <div className="stepper">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
            <span>{guests}</span>
            <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))}>+</button>
          </div>
        </label>
      )}
      <label>Wishes for the couple <em>(optional)</em>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500} placeholder="Leave a little note…" />
      </label>
      {err && <p className="form-err">{err}</p>}
      <button className="btn wide" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
