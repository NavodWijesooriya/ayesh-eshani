import Link from "next/link";
import { Wreath, Divider } from "@/components/Ornaments";

export default function Home() {
  return (
    <main className="site theme-ivory landing">
      <div className="gold-icon"><Wreath size={130} /></div>
      <p className="eyebrow">You are invited</p>
      <h1 className="names">
        <span className="script gold-text">Ayesh</span>
        <span className="amp gold-text">&</span>
        <span className="script gold-text">Eshani</span>
      </h1>
      <div className="gold-icon"><Divider /></div>
      <div className="landing-cards">
        <Link href="/day1" className="l-card ivory">
          <small>Saturday · 09 January 2027</small>
          <b>Holy Matrimony</b>
          <span>St. Anthony's Church, Kadalana</span>
        </Link>
        <Link href="/day2" className="l-card maroon">
          <small>Sunday · 10 January 2027</small>
          <b>Wedding Celebration</b>
          <span>Sharanga Banquet Hall, Kandana</span>
        </Link>
      </div>
    </main>
  );
}
