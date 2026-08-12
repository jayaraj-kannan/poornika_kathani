import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const customFont = localFont({
  src: "../public/1.ttf",
  variable: "--font-custom-1",
  display: "swap",
});


export const metadata: Metadata = {
  title: "காதணி விழா அழைப்பிதழ் | ஜெ.வி பூர்ணிகா",
  description: "திரு ஜெயராஜ் & திருமதி விஷாலி அவர்களின் அன்பு மகள் ஜெ.வி பூர்ணிகாவின் காது குத்தும் விழா அழைப்பிதழ்",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👼🏻</text></svg>',
  },
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


