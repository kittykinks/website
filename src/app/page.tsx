import Link from "next/link";
import { ReactNode } from "react";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center p-4 h-screen">
            <main className="p-4 flex flex-col items-stretch gap-8 max-w-min h-full justify-center relative">
                <header className="flex flex-col">
                    <h1 className="text-8xl font-cherry">KittyK</h1>
                    <p className="ml-1">Your kinky link in bio.</p>
                </header>
                <section className="flex flex-col items-stretch gap-4 text-center">
                    <ContinueButton href={process.env.NEXT_PUBLIC_LOGIN_URL_DISCORD || "#"}>
                        Continue with Discord
                    </ContinueButton>
                </section>
                <footer className="absolute bottom-8 w-full flex flex-col items-center justify-center py-1 leading-none rounded bg-pink-100">
                    <Link href="//nyeki.dev" className="opacity-50 text-xs py-2 -my-2 hover:opacity-100">Made by Nyeki</Link>
                </footer>
            </main>
        </div>
    );
}

function ContinueButton({
    children,
    href = "#",
}: {
    children?: ReactNode;
    href?: string;
}) {
    return (
        <Link
            href={href}
            className="leading-none px-8 py-4 cursor-pointer relative group text-center text-background"
        >
            <div className="rounded-full bg-pink-800 group-hover:bg-pink-900 absolute inset-0 group-hover:scale-105 transition-all"></div>
            <div className="relative z-10 group-hover:text-background transition-colors">{children}</div>
        </Link>
    );
}
