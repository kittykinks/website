"use client";

import {
    fetchKinks,
    fetchSite,
    Kink,
    Link,
    LinkSource,
    Site as SiteSchema,
    updateSite,
    uploadFile,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import Site from "@/ui/site";
import {
    CheckIcon,
    ChevronsUpDownIcon,
    LoaderIcon,
    SaveIcon,
    SearchIcon,
    StarHalfIcon,
    StarIcon,
    UndoIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import {
    ButtonHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
    RefAttributes,
    useEffect,
    useRef,
    useState,
} from "react";
import { create } from "zustand";
import TextareaAutosize, {
    TextareaAutosizeProps,
} from "react-textarea-autosize";
import { UnauthorizedError } from "@/lib/api/errors";
import LoadingScreen from "@/ui/loading-screen";
import LinkIcon from "@/ui/link-icon";

interface SiteState {
    site: null | SiteSchema;
    original: null | SiteSchema;
    isSaving: boolean;
    isChanged: boolean;
    setSite: (site: SiteSchema) => void;
    setOriginal: (site: SiteSchema) => void;
    setName: (name: string) => void;
    setSlug: (slug: string) => void;
    setBio: (bio: string) => void;
    setAvatarUrl: (avatarUrl: string | null) => void;
    setBannerUrl: (bannerUrl: string | null) => void;
    addKink: (kink: Kink) => void;
    setKink: (kink: Kink) => void;
    removeKink: (kinkId: string) => void;
    addLink: (link: Link) => void;
    setLink: (link: Link) => void;
    removeLink: (linkId: string) => void;
    setIsChanged: (isChanged: boolean) => void;
    setIsSaving: (isSaving: boolean) => void;
}

const useSite = create<SiteState>((set) => ({
    site: null as null | SiteSchema,
    original: null as null | SiteSchema,
    isChanged: false,
    isSaving: false,
    setSite: (site: SiteSchema) => set({ site }),
    setOriginal: (site: SiteSchema) => set({ original: site }),
    setName: (name: string) =>
        set((state) => ({
            site: state.site ? { ...state.site, name } : null,
            isChanged: true,
        })),
    setSlug: (slug: string) =>
        set((state) => ({
            site: state.site ? { ...state.site, slug } : null,
            isChanged: true,
        })),
    setBio: (bio: string) =>
        set((state) => ({
            site: state.site ? { ...state.site, bio } : null,
            isChanged: true,
        })),
    setAvatarUrl: (avatarUrl: string | null) =>
        set((state) => ({
            site: state.site ? { ...state.site, avatar_url: avatarUrl } : null,
            isChanged: true,
        })),
    setBannerUrl: (bannerUrl: string | null) =>
        set((state) => ({
            site: state.site ? { ...state.site, banner_url: bannerUrl } : null,
            isChanged: true,
        })),
    addKink: (kink: Kink) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      kinks: state.site.kinks
                          ? [...state.site.kinks, kink].toSorted((a, b) => {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            })
                          : [kink],
                  }
                : null,
            isChanged: true,
        })),
    setKink: (kink: Kink) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      kinks: state.site.kinks
                          ? state.site.kinks
                                .map((k) => (k.id === kink.id ? kink : k))
                                .toSorted((a, b) => {
                                    if (a.name < b.name) return -1;
                                    if (a.name > b.name) return 1;
                                    return 0;
                                })
                          : [],
                  }
                : null,
            isChanged: true,
        })),
    removeKink: (kinkId: string) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      kinks: state.site.kinks
                          ? state.site.kinks
                                .filter((k) => k.id !== kinkId)
                                .toSorted((a, b) => {
                                    if (a.name < b.name) return -1;
                                    if (a.name > b.name) return 1;
                                    return 0;
                                })
                          : [],
                  }
                : null,
            isChanged: true,
        })),
    addLink: (link: Link) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      links: state.site.links
                          ? [...state.site.links, link]
                          : [link],
                  }
                : null,
            isChanged: true,
        })),
    setLink: (link: Link) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      links: state.site.links
                          ? state.site.links.map((l) =>
                                l.id === link.id ? link : l
                            )
                          : [],
                  }
                : null,
            isChanged: true,
        })),
    removeLink: (linkId: string) =>
        set((state) => ({
            site: state.site
                ? {
                      ...state.site,
                      links: state.site.links
                          ? state.site.links.filter((l) => l.id !== linkId)
                          : [],
                  }
                : null,
            isChanged: true,
        })),
    setIsChanged: (isChanged: boolean) => set({ isChanged }),
    setIsSaving: (isSaving: boolean) => set({ isSaving }),
}));

export default function DashboardPage() {
    const { site, setSite, setOriginal } = useSite();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchSite();
                setSite(res);
                setOriginal(res);
            } catch (e: any) {
                if (e instanceof UnauthorizedError) {
                    location.href = "/";
                } else {
                    alert("Failed to load site data: " + e.message);
                }
            }
        })();
    }, []);

    if (site === null) {
        return <LoadingScreen />;
    }

    return <DashboardContent />;
}

function DashboardContent() {
    const site = useSite((state) => state.site);

    return (
        <Layout>
            <div className="relative w-screen max-w-sm">
                <Editor />
            </div>
            <div className="relative w-screen max-w-sm">
                <Site site={site!} />
            </div>
            <ChangeSaver />
        </Layout>
    );
}

function Layout({ children }: { children?: ReactNode }) {
    return (
        <div className="py-16 px-4 flex flex-col items-center">
            <div className="grid grid-cols-2 gap-16">{children}</div>
        </div>
    );
}

function Editor() {
    return (
        <main className="w-full flex flex-col items-stretch gap-8">
            <header>
                <h1 className="text-xl font-bold">Editor</h1>
                <p className="opacity-75">Edit your kinky link in bio here.</p>
            </header>
            <SlugField />
            <NameField />
            <BioField />
            <AvatarField />
            <BannerField />
            <KinksField />
            <LinksField />
        </main>
    );
}

function SlugField() {
    const slug = useSite((state) => state.site!.slug);
    const setSlug = useSite((state) => state.setSlug);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Slug</EditorFieldLabel>
                <EditorFieldDescription>
                    Your site's link after the /
                </EditorFieldDescription>
            </EditorFieldHeader>
            <EditorFieldInput>
                <EditorFieldInputText>https://kittyk.xyz/</EditorFieldInputText>
                <EditorFieldInputInput
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value);
                    }}
                />
            </EditorFieldInput>
        </EditorField>
    );
}

function NameField() {
    const name = useSite((state) => state.site!.name);
    const setName = useSite((state) => state.setName);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Name</EditorFieldLabel>
                <EditorFieldDescription>
                    Your display name on your link in bio site.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <EditorFieldInput>
                <EditorFieldInputInput
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <EditorFieldInputText>{name.length}/32</EditorFieldInputText>
            </EditorFieldInput>
        </EditorField>
    );
}

function BioField() {
    const bio = useSite((state) => state.site!.bio || "");
    const setBio = useSite((state) => state.setBio);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Bio</EditorFieldLabel>
                <EditorFieldDescription>
                    A short description about yourself.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <EditorFieldInput className="flex-col items-stretch pb-4">
                <EditorFieldInputTextarea
                    value={bio}
                    onChange={(e) => {
                        setBio(e.target.value);
                    }}
                />
                <EditorFieldInputText className="text-right">
                    {bio.length}/128
                </EditorFieldInputText>
            </EditorFieldInput>
        </EditorField>
    );
}

function AvatarField() {
    const avatarUrl = useSite((state) => state.site!.avatar_url);
    const setAvatarUrl = useSite((state) => state.setAvatarUrl);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Avatar</EditorFieldLabel>
                <EditorFieldDescription>
                    Your profile picture on your link in bio site.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <PictureInput
                url={avatarUrl}
                setUrl={setAvatarUrl}
                resource="Avatar"
            />
        </EditorField>
    );
}

function BannerField() {
    const bannerUrl = useSite((state) => state.site!.banner_url);
    const setBannerUrl = useSite((state) => state.setBannerUrl);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Banner</EditorFieldLabel>
                <EditorFieldDescription>
                    Your profile banner on your link in bio site.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <PictureInput
                url={bannerUrl}
                setUrl={setBannerUrl}
                resource="Banner"
            />
        </EditorField>
    );
}

function KinksField() {
    const [query, setQuery] = useState("");

    const [kinks, setKinks] = useState<Kink[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const siteKinks = useSite((state) => state.site!.kinks || []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetchKinks();
                setKinks(res);
            } catch (e) {
                alert("Failed to load kinks: " + (e as Error).message);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Kinks</EditorFieldLabel>
                <EditorFieldDescription>
                    Your kinks to show on your link in bio site.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <EditorFieldInput className="flex-col items-stretch overflow-hidden">
                <div className="flex flex-row items-center gap-2 h-8">
                    <EditorFieldInputIcon>
                        <SearchIcon />
                    </EditorFieldInputIcon>
                    <EditorFieldInputInput
                        placeholder="Search for a kink..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {isLoading ? (
                    <div className="py-4 flex flex-col items-center justify-center">
                        <LoaderIcon className="size-4 animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col items-stretch">
                        {kinks
                            ?.filter((value) =>
                                value.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                            )
                            .slice(0, 5)
                            .map((kink) => (
                                <KinkResult key={kink.id} kink={kink} />
                            ))}
                    </div>
                )}
            </EditorFieldInput>
            <div className="flex flex-col items-stretch gap-2">
                {siteKinks.map((kink) => (
                    <KinkItem key={kink.id} kink={kink} />
                ))}
            </div>
        </EditorField>
    );
}

function KinkResult({ kink }: { kink: Kink }) {
    const addKink = useSite((state) => state.addKink);
    const removeKink = useSite((state) => state.removeKink);
    const siteKinks = useSite((state) => state.site!.kinks || []);
    return (
        <button
            key={kink.id}
            className={cn(
                "h-8 text-sm flex flex-row items-center -mx-4 px-4 gap-2 select-none cursor-pointer group",
                siteKinks.find((k) => k.id === kink.id)
                    ? "opacity-50 hover:opacity-75"
                    : "hover:bg-pink-100"
            )}
            onClick={() => {
                if (siteKinks.find((k) => k.id === kink.id)) {
                    removeKink(kink.id);
                } else {
                    kink.rating = 10;
                    addKink(kink);
                }
            }}
        >
            <div className="size-4 opacity-50 relative">
                {siteKinks.find((k) => k.id === kink.id) && (
                    <>
                        <CheckIcon className="size-4 absolute inset-0" />
                        <XIcon className="size-4 hidden group-hover:block absolute inset-0 bg-white" />
                    </>
                )}
            </div>
            {kink.name}
        </button>
    );
}

function KinkItem({ kink }: { kink: Kink }) {
    const [isOpen, setIsOpen] = useState(false);

    const setKink = useSite((state) => state.setKink);
    const removeKink = useSite((state) => state.removeKink);

    return (
        <div className="px-4 flex flex-col items-stretch text-sm font-medium bg-white rounded-lg text-left text-pink-800 border border-white has-[>button:hover]:border-pink-200 overflow-hidden">
            <button
                className="flex flex-row items-center justify-between h-8 cursor-pointer"
                onClick={() => setIsOpen((v) => !v)}
            >
                <div className="flex flex-row items-center gap-2">
                    <ChevronsUpDownIcon className="size-4 opacity-50" />
                    {kink.name}
                </div>
                <div className="flex flex-row items-center">
                    {Array.from({ length: Math.ceil(kink.rating! / 2) }).map(
                        (_, index) => (
                            <div key={index} className="size-4 relative">
                                {index * 2 == kink.rating! - 1 ? (
                                    <StarHalfIcon className="size-4 fill-pink-800 absolute top-0 left-0" />
                                ) : (
                                    <StarIcon className="size-4 fill-pink-800 absolute top-0 left-0" />
                                )}

                                <StarIcon className="size-4" />
                            </div>
                        )
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="pl-6 text-foreground flex flex-col items-stretch">
                    <div className="h-8 flex flex-row items-center justify-between">
                        <label className="opacity-50">Rating:</label>
                        <div className="flex flex-row items-center h-8 flex-1">
                            <input
                                type="number"
                                min={0}
                                max={10}
                                className="flex-1 outline-none text-right"
                                placeholder="0"
                                value={
                                    kink.rating !== null
                                        ? kink.rating.toString()
                                        : ""
                                }
                                onChange={(e) => {
                                    const rating = parseInt(e.target.value);
                                    if (
                                        isNaN(rating) ||
                                        rating < 0 ||
                                        rating > 10
                                    ) {
                                        return;
                                    }
                                    setKink({ ...kink, rating });
                                }}
                            />
                            <span className="opacity-50">/10</span>
                        </div>
                    </div>
                    <div className="h-8 flex flex-row items-center justify-between gap-2">
                        <label className="opacity-50">Comment:</label>
                        <input
                            type="text"
                            className="flex-1 outline-none self-stretch"
                            placeholder="My favorite kink..."
                            value={kink.comment || ""}
                            maxLength={32}
                            onChange={(e) => {
                                setKink({ ...kink, comment: e.target.value });
                            }}
                        />
                    </div>
                    <button
                        className="px-4 h-8 flex flex-row items-center gap-2 text-pink-700 cursor-pointer -ml-10 -mr-4 hover:bg-pink-100"
                        onClick={() => removeKink(kink.id)}
                    >
                        <XIcon className="size-4" /> Remove Kink
                    </button>
                </div>
            )}
        </div>
    );
}

function LinksField() {
    type ItemType = {
        source: LinkSource;
        label: string;
    };

    const icons: ItemType[] = [
        { source: LinkSource.DISCORD, label: "Discord" },
        { source: LinkSource.TWITTER, label: "Twitter" },
        {
            source: LinkSource.INSTAGRAM,
            label: "Instagram",
        },
        { source: LinkSource.WATTPAD, label: "Wattpad" },
        { source: LinkSource.SESSION, label: "Session" },
        { source: LinkSource.REDDIT, label: "Reddit" },
        { source: LinkSource.TELEGRAM, label: "Telegram" },
        { source: LinkSource.TUMBLR, label: "Tumblr" },
        { source: LinkSource.BLUESKY, label: "Bluesky" },
        { source: LinkSource.MASTODON, label: "Mastodon" },
        { source: LinkSource.SIGNAL, label: "Signal" },
        { source: LinkSource.MATRIX, label: "Matrix" },
        {
            source: LinkSource.OTHER,
            label: "Other",
        },
    ];

    const links = useSite((state) => state.site!.links || []);
    const addLink = useSite((state) => state.addLink);

    return (
        <EditorField>
            <EditorFieldHeader>
                <EditorFieldLabel>Links</EditorFieldLabel>
                <EditorFieldDescription>
                    Your social media links to show on your link in bio site.
                </EditorFieldDescription>
            </EditorFieldHeader>
            <EditorFieldButtons>
                {icons.map(({ source, label }) => (
                    <Tooltip label={label} key={source}>
                        <EditorFieldButton
                            variant="on-white"
                            size="icon"
                            onClick={() => {
                                addLink({
                                    id: crypto.randomUUID(),
                                    source,
                                    pointer: "",
                                });
                            }}
                        >
                            <LinkIcon source={source} />
                        </EditorFieldButton>
                    </Tooltip>
                ))}
            </EditorFieldButtons>
            <div className="flex flex-col items-stretch gap-2">
                {links.map((link) => (
                    <LinkItem key={link.id} link={link} />
                ))}
            </div>
        </EditorField>
    );
}

function linkPlaceholder(source: LinkSource): string {
    switch (source) {
        case LinkSource.DISCORD:
        case LinkSource.TWITTER:
        case LinkSource.INSTAGRAM:
        case LinkSource.TELEGRAM:
        case LinkSource.WATTPAD:
            return "@your_username";
        case LinkSource.SESSION:
            return "Your Session ID";
        case LinkSource.REDDIT:
            return "u/your_username";
        case LinkSource.TUMBLR:
            return "your_username.tumblr.com";
        case LinkSource.BLUESKY:
            return "@your_username.bsky.social";
        case LinkSource.MASTODON:
            return "@your_username@mastodon.social";
        case LinkSource.SIGNAL:
            return "+1234567890";
        case LinkSource.MATRIX:
            return "@your_username:matrix.org";
        case LinkSource.OTHER:
        default:
            return "https://example.com/your-profile";
    }
}

function LinkItem({ link }: { link: Link }) {
    const setLink = useSite((state) => state.setLink);
    const removeLink = useSite((state) => state.removeLink);

    return (
        <EditorFieldInput>
            <EditorFieldInputIcon className="mr-2">
                <LinkIcon source={link.source} />
            </EditorFieldInputIcon>
            <EditorFieldInputInput
                placeholder={linkPlaceholder(link.source)}
                maxLength={66}
                value={link.pointer}
                onChange={(e) => {
                    setLink({ ...link, pointer: e.target.value });
                }}
            />
            <EditorFieldInputIcon
                className="px-2 -mr-2 hover:opacity-100 cursor-pointer h-8 flex flex-col items-center justify-center"
                onClick={() => {
                    removeLink(link.id);
                }}
            >
                <XIcon />
            </EditorFieldInputIcon>
        </EditorFieldInput>
    );
}

function EditorField({ children }: { children?: ReactNode }) {
    return <div className="flex flex-col items-stretch gap-4">{children}</div>;
}

function EditorFieldHeader({ children }: { children?: ReactNode }) {
    return <div>{children}</div>;
}

function EditorFieldLabel({ children }: { children?: ReactNode }) {
    return <label className="block font-bold">{children}</label>;
}

function EditorFieldDescription({ children }: { children?: ReactNode }) {
    return <p className="text-sm opacity-75">{children}</p>;
}

function EditorFieldInput({
    children,
    className,
    ...props
}: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-lg border border-pink-200 ring-0 has-[input:focus]:ring-1",
                "has-[textarea:focus]:ring-1 has-[input:focus]:ring-pink-500",
                "has-[textarea:focus]:ring-pink-500 has-[input:focus]:border-pink-500",
                "has-[textarea:focus]:border-pink-500 bg-white min-h-8 flex flex-row",
                "items-center px-4 text-sm leading-none transition-all",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function EditorFieldInputText({
    children,
    className,
    ...props
}: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("opacity-25", className)} {...props}>
            {children}
        </div>
    );
}

function EditorFieldInputInput({
    children,
    className,
    ...props
}: { children?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn("flex-1 h-full outline-none", className)}
            {...props}
        />
    );
}

function EditorFieldInputTextarea({
    children,
    className,
    ...props
}: {
    children?: ReactNode;
} & TextareaAutosizeProps &
    RefAttributes<HTMLTextAreaElement>) {
    return (
        <TextareaAutosize
            className={cn("outline-none flex-1 resize-none py-4", className)}
            {...props}
        />
    );
}

function EditorFieldInputIcon({
    children,
    className,
    ...props
}: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("[&>svg]:size-4 opacity-50", className)} {...props}>
            {children}
        </div>
    );
}

function EditorFieldButtons({
    children,
    className,
    ...props
}: { children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-row items-center gap-2 flex-wrap",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

type ButtonVariant = "primary" | "secondary" | "on-white";
type ButtonSize = "default" | "icon";

function EditorFieldButton({
    children,
    className,
    variant = "primary",
    size = "default",
    ...props
}: {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "text-sm [&>svg]:size-4 flex flex-row items-center gap-2 min-h-8",
                "transition-colors rounded-lg cursor-pointer border disabled:opacity-50",
                "disabled:cursor-not-allowed",
                variant === "primary" &&
                    "bg-pink-900 hover:bg-pink-800 border-pink-900 text-background disabled:hover:bg-pink-900",
                variant === "secondary" &&
                    "bg-pink-200 hover:bg-pink-300 border-pink-200 disabled:hover:bg-pink-200",
                variant === "on-white" &&
                    "bg-white border-white text-foreground hover:border-pink-200 disabled:hover:border-white",
                size === "icon" && "min-w-8 justify-center px-0",
                size === "default" && "px-4",
                size === "icon" &&
                    "size-8 min-w-8 flex items-center justify-center"
            )}
            {...props}
        >
            {children}
        </button>
    );
}

function PictureInput({
    url,
    setUrl,
    resource = "Image",
}: {
    url: string | null;
    setUrl: (url: string | null) => void;
    resource?: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <EditorFieldButtons>
                <EditorFieldButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoaderIcon className="animate-spin" /> Uploading{" "}
                            {resource}...
                        </>
                    ) : (
                        <>
                            <UploadIcon /> Upload {resource}
                        </>
                    )}
                </EditorFieldButton>
                <EditorFieldButton
                    variant="secondary"
                    disabled={!url || isLoading}
                    onClick={() => setUrl(null)}
                >
                    <XIcon /> Remove {resource}
                </EditorFieldButton>
            </EditorFieldButtons>
            <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={async (e) => {
                    const target = e.target;

                    if (target.files) {
                        const file = target.files[0];

                        setIsLoading(true);

                        try {
                            const url = await uploadFile(file);
                            setUrl(url);
                        } catch (e) {
                            alert(
                                "Failed to upload " +
                                    resource.toLowerCase() +
                                    ": " +
                                    (e as Error).message
                            );
                        } finally {
                            setIsLoading(false);
                            target.value = "";
                        }
                    }
                }}
            />
        </div>
    );
}

function Tooltip({ children, label }: { children: ReactNode; label: string }) {
    return (
        <div className="relative flex flex-col items-center group">
            {children}
            <div className="absolute bottom-full mb-0 group-hover:mb-1 transition-all px-2 py-1 bg-pink-900 text-background text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                {label}
            </div>
        </div>
    );
}

function ChangeSaver() {
    const {
        site,
        setSite,
        original,
        setOriginal,
        isChanged,
        setIsChanged,
        isSaving,
        setIsSaving,
    } = useSite();

    return (
        <div
            className={cn(
                "col-span-2 h-12 px-4 -mx-4 bg-white rounded-xl border border-pink-200",
                "shadow shadow-pink-200 sticky bottom-8 flex flex-row items-center",
                "justify-between gap-4 transition-all",
                !isChanged &&
                    "opacity-0 pointer-events-none -mb-12 translate-y-5"
            )}
        >
            <div className="text-sm font-semibold">
                You have unsaved changes. Save them to publish.
            </div>
            <div className="flex flex-row gap-2">
                <EditorFieldButton
                    variant="secondary"
                    disabled={isSaving}
                    onClick={() => {
                        setSite(original!);
                        setIsChanged(false);
                    }}
                >
                    <UndoIcon /> Undo Changes
                </EditorFieldButton>
                <EditorFieldButton
                    disabled={isSaving}
                    onClick={async () => {
                        setIsSaving(true);

                        try {
                            const updatedSite = await updateSite(site!);
                            setSite(updatedSite);
                            setOriginal(updatedSite);
                            setIsChanged(false);
                        } catch (e) {
                            alert(
                                "Failed to save changes: " +
                                    (e as Error).message
                            );
                        } finally {
                            setIsSaving(false);
                        }
                    }}
                >
                    <SaveIcon /> Save Changes
                </EditorFieldButton>
            </div>
        </div>
    );
}
