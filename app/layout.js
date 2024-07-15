// app/layout.js

import "./globals.css";

export const metadata = {
  title: "Visions",
  description: "AI-assisted visual synthesis. Create generative art sketches with no coding experience.",
  openGraph: {
    title: "Visions",
    description: "AI-assisted visual synthesis. Create generative art sketches with no coding experience.",
    url: "https://visions.iimaginary.com/",
    siteName: "Visions",
    images: [
      {
        url: "https://visions.iimaginary.com/eyeLogo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visions",
    description: "AI-assisted visual synthesis. Create generative art sketches with no coding experience.",
    images: ["https://visions.iimaginary.com/eyeLogo.png"],
    creator: "@yourtwitterhandle", // Add your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://visions.iimaginary.com/"),
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}