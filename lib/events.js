// All wedding details live here — edit this file to change any text.

const mapEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
const mapLink = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const EVENTS = {
  day1: {
    slug: "day1",
    theme: "ivory",
    eyebrow: "The Wedding of",
    kind: "Holy Matrimony",
    first: { name: "Eshani", role: "Daughter of", parents: "Mr. & Mrs. Fernando" },
    second: { name: "Ayesh", role: "Son of", parents: "Mr. & Mrs. Kerawgoda" },
    inviteLine: "Request the honour of your presence",
    purpose: "as they unite in the Sacrament of Holy Matrimony",
    dateISO: "2027-01-09T10:00:00+05:30",
    weekday: "Saturday",
    month: "January",
    day: "09",
    year: "2027",
    timeLabel: "10.00 AM",
    schedule: [
      { time: "10.00 AM", title: "Holy Matrimony", place: "St. Anthony's Church, Kadalana" },
      { time: "12.00 Noon", title: "Wedding Reception", place: "Grand Bolgoda, Moratuwa" },
      { time: "4.00 PM", title: "Farewell", place: "Grand Bolgoda, Moratuwa" },
    ],
    venues: [
      {
        label: "The Ceremony",
        name: "St. Anthony's Church",
        address: "Kadalana, Moratuwa",
        time: "10.00 AM",
        embed: mapEmbed("St. Anthony's Church Kadalana Moratuwa"),
        link: mapLink("St. Anthony's Church Kadalana Moratuwa"),
      },
      {
        label: "The Reception",
        name: "Grand Bolgoda",
        address: "Moratuwa",
        time: "12.00 Noon – 4.00 PM",
        embed: mapEmbed("Grand Bolgoda Moratuwa"),
        link: mapLink("Grand Bolgoda Moratuwa"),
      },
    ],
    calendar: {
      title: "Wedding of Eshani & Ayesh",
      start: "20270109T043000Z",
      end: "20270109T103000Z",
      location: "St. Anthony's Church, Kadalana, Moratuwa",
    },
    rsvpNote: "Kindly let us know by 25th December 2026",
    contacts: [
      { name: "Eric Fernando", phone: "0758589512", display: "075 858 9512" },
      { name: "Eshani Fernando", phone: "0713503491", display: "071 350 3491" },
    ],
  },

  day2: {
    slug: "day2",
    theme: "maroon",
    eyebrow: "Together with our parents",
    kind: "Wedding Celebration",
    first: {
      name: "Ayesh",
      role: "Son of",
      parents: "Mr. Ajith Nishshanka & Mrs. Anoja Kumari Amarasekara",
    },
    second: {
      name: "Eshani",
      role: "Daughter of",
      parents: "Mr. Eric Anthony Fernando & Mrs. Lakmi Sanjeewani Fernando",
    },
    inviteLine: "Cordially invite",
    purpose: "to celebrate their marriage",
    dateISO: "2027-01-10T18:30:00+05:30",
    weekday: "Sunday",
    month: "January",
    day: "10",
    year: "2027",
    timeLabel: "6.30 PM – 10.00 PM",
    schedule: [
      { time: "6.30 PM", title: "Arrival of Guests", place: "Sharanga Banquet Hall" },
      { time: "7.00 PM", title: "Grand Entrance", place: "Welcoming the couple" },
      { time: "8.30 PM", title: "Dinner & Dancing", place: "Celebrate with us" },
      { time: "10.00 PM", title: "Farewell", place: "Until we meet again" },
    ],
    venues: [
      {
        label: "The Celebration",
        name: "Sharanga Banquet Hall",
        address: "No. 240/B, Station Road, Hapugoda, Kandana",
        time: "6.30 PM – 10.00 PM",
        embed: mapEmbed("Sharanga Banquet Hall Hapugoda Kandana"),
        link: mapLink("Sharanga Banquet Hall Hapugoda Kandana"),
      },
    ],
    calendar: {
      title: "Ayesh & Eshani — Wedding Celebration",
      start: "20270110T130000Z",
      end: "20270110T163000Z",
      location: "Sharanga Banquet Hall, No. 240/B, Station Road, Hapugoda, Kandana",
    },
    rsvpNote: "Kindly let us know by 25th December 2026",
    contacts: [
      { name: "Ajith", phone: "0768582477", display: "076 858 2477" },
      { name: "Ayesh", phone: "0767090645", display: "076 709 0645" },
    ],
  },
};

export const toIntl = (p) => "94" + p.replace(/\D/g, "").replace(/^0/, "");
