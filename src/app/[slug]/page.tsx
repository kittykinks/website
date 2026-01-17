"use client";

import { fetchSite, Site as SiteSchema } from "@/lib/api";
import { NotFoundError } from "@/lib/api/errors";
import ErrorScreen from "@/ui/error-screen";
import LoadingScreen from "@/ui/loading-screen";
import Site from "@/ui/site";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ErrorType = "not-found" | "unknown";

export default function SitePage() {
    const [site, setSite] = useState<SiteSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType | null>(null);

    const slug = useParams().slug;

    useEffect(() => {
        async function inner() {
            try {
                const res = await fetchSite(slug as string);
                setSite(res);
            } catch (e) {
                if (e instanceof NotFoundError) {
                    setError("not-found");
                } else {
                    setError("unknown");
                }
            } finally {
                setIsLoading(false);
            }
        }

        inner();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        let message = "An unknown error occurred.";

        if (error === "not-found") {
            message = `There's no /${slug} site. What about making this your own?`;
        }

        return <ErrorScreen error={message} />;
    }

    return (
        <main className="flex flex-col items-center justify-stretch px-4 py-16 relative min-h-screen">
            <div className="w-full max-w-sm relative min-h-full flex-1 flex flex-col">
                <Site site={site!} />
            </div>
        </main>
    );
}
