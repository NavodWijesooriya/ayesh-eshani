import Invitation from "@/components/Invitation";
import { EVENTS } from "@/lib/events";

export const metadata = {
  title: "Ayesh & Eshani · Wedding Celebration · 10 January 2027",
  description: "Sharanga Banquet Hall, Hapugoda, Kandana · 6.30 PM – 10.00 PM",
  openGraph: {
    title: "Ayesh & Eshani · Wedding Celebration",
    description: "Sunday, 10 January 2027 · Sharanga Banquet Hall, Kandana",
  },
};

export default function Page() {
  return <Invitation ev={EVENTS.day2} />;
}
