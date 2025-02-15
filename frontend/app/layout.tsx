import type { Metadata } from "next";
import {Josefin_Sans,Urbanist,Oswald,Roboto,Noto_Sans_Cuneiform,Instrument_Serif} from "next/font/google";
import "./globals.css";

const oswald=Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200","300","400", "500", "600", "700"], 
});


const josefinSans=Josefin_Sans({
  variable: "--font-josefinsans",
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700"], 
});

const urbanist=Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700","800","900"], 
});

const roboto=Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: [ "700","400"], 
});

const noto=Noto_Sans_Cuneiform({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400"], 
});

const serif=Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight:["400"] 
});


export const metadata: Metadata = {
  title: "jabWEmet",
  description: "love story generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`  ${josefinSans.variable} ${urbanist.variable} ${noto.variable} ${serif.variable} ${roboto.variable} ${oswald.variable}antialiased`}
      >
        {children}
      </body>
    </html>
  );
}