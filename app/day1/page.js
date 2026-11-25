import Invitation from "@/components/Invitation";
import { EVENTS } from "@/lib/events";

export const metadata = {
  title: "The Wedding of Eshani & Ayesh · 09 January 2027",
  description: "Holy Matrimony at St. Anthony's Church, Kadalana · Reception at Grand Bolgoda, Moratuwa",
  openGraph: {
    title: "The Wedding of Eshani & Ayesh",
    description: "Saturday, 09 January 2027 · St. Anthony's Church, Kadalana, Moratuwa",
  },
};

export default function Page() {
  return <Invitation ev={EVENTS.day1} />;
}
