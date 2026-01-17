import type { Metadata } from "next";
import { Nunito, Cherry_Bomb_One } from "next/font/google";
import "./globals.css";

const cherry = Cherry_Bomb_One({
    variable: "--font-cherry",
    weight: "400",
    subsets: ["latin"],
});

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "KittyK - Your kinky link in bio.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${cherry.variable} ${nunito.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
