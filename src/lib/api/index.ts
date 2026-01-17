import { NotFoundError, UnauthorizedError } from "./errors";

export interface Site {
    id: string;
    slug: string;
    name: string;
    bio: string;
    avatar_url: string | null;
    banner_url: string | null;
    kinks: Kink[];
    links: Link[];
    created_at: string;
    updated_at: string;
}

export interface Kink {
    id: string;
    name: string;
    description: string;
    rating: number | null;
    comment: string | null;
    created_at: string;
    updated_at: string;
}

export interface Link {
    id: string;
    source: LinkSource;
    pointer: string;
}

export enum LinkSource {
    DISCORD = "discord",
    TWITTER = "twitter",
    INSTAGRAM = "instagram",
    WATTPAD = "wattpad",
    SESSION = "session",
    REDDIT = "reddit",
    TELEGRAM = "telegram",
    TUMBLR = "tumblr",
    FETLIFE = "fetlife",
    FEELD = "feeld",
    BLUESKY = "bluesky",
    MASTODON = "mastodon",
    SIGNAL = "signal",
    MATRIX = "matrix",
    OTHER = "other",
}

async function handleError(response: Response) {
    if (response.status === 401) {
        throw new UnauthorizedError("The user is not logged in.");
    }

    if (response.status === 404) {
        throw new NotFoundError("The requested resource was not found.");
    }

    if (!response.ok) {
        throw new Error("API request failed: " + (await response.text()));
    }
}

export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/files/upload`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        }
    );

    await handleError(response);

    const data: { url: string } = await response.json();
    return data.url;
}

export async function fetchSite(id: string = "me"): Promise<Site> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/site/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    await handleError(response);

    const data: Site = await response.json();
    return data;
}

export async function updateSite(site: Site): Promise<Site> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/site/me`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(site),
        }
    );

    await handleError(response);

    const data: Site = await response.json();
    return data;
}

export async function fetchKinks(): Promise<Kink[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/kinks`, {
        method: "GET",
        credentials: "include",
    });

    await handleError(response);

    const data = await response.json();
    return data.items;
}
