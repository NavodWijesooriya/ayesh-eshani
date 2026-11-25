import { Wreath, Divider } from "@/components/Ornaments";

// The root URL is intentionally private: guests only reach an invitation
// through the personal link they were sent (/day1?to=… or /day2?to=…).
export const metadata = {
  title: "Ayesh & Eshani",
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <main className="site theme-ivory landing">
      <div className="gold-icon"><Wreath size={120} /></div>
      <h1 className="names">
        <span className="script gold-text">Ayesh</span>
        <span className="amp gold-text">&</span>
        <span className="script gold-text">Eshani</span>
      </h1>
      <div className="gold-icon"><Divider /></div>
      <p className="eyebrow">This invitation is private</p>
      <p className="private-note">Please open the personal invitation link that was shared with you.</p>
    </main>
  );
}
