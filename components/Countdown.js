"use client";
import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    done: ms === 0,
    Days: Math.floor(ms / 864e5),
    Hours: Math.floor((ms / 36e5) % 24),
    Minutes: Math.floor((ms / 6e4) % 60),
    Seconds: Math.floor((ms / 1e3) % 60),
  };
}

export default function Countdown({ iso }) {
  const [t, setT] = useState(null);
  useEffect(() => {
    setT(diff(iso));
    const id = setInterval(() => setT(diff(iso)), 1000);
    return () => clearInterval(id);
  }, [iso]);

  if (t?.done) return <p className="count-done script gold-text">Today we say “I do”</p>;
  return (
    <div className="countdown reveal">
      {["Days", "Hours", "Minutes", "Seconds"].map((k) => (
        <div key={k} className="cd-box">
          <b className="gold-text">{t ? String(t[k]).padStart(2, "0") : "--"}</b>
          <small>{k}</small>
        </div>
      ))}
    </div>
  );
}
