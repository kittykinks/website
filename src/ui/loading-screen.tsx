import { LoaderIcon } from "lucide-react";

export default function LoadingScreen() {
    return (
        <main className="h-screen flex flex-col items-center justify-center">
            <LoaderIcon className="size-6 animate-spin" />
        </main>
    );
}
