import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const customFont = localFont({
  src: "../public/1.ttf",
  variable: "--font-custom-1",
  display: "swap",
});


export const metadata: Metadata = {
  title: "காாதணி விழா அழைப்பிதழ் | ஜ வி பூர்ணிகா",
  description: "திரு க ஜெயராஜ் & திருமதி விஷாலி அவர்களின் அன்பு மகள் ஜ வி பூர்ணிகாவின் காது குத்தும் விழா அழைப்பிதழ்",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta" className={`${customFont.variable} ${customFont.className} h-full antialiased dark`}>
      <body className={`${customFont.className} min-h-full flex flex-col bg-amber-950 text-amber-50 selection:bg-amber-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}


