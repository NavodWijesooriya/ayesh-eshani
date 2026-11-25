import "./globals.css";

export const metadata = {
  title: "Ayesh & Eshani · Wedding Invitation",
  description: "Join us as we celebrate our marriage · January 2027",
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#8e1f2c" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Pinyon+Script&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
