import {
    Kink as KinkSchema,
    Link as LinkSchema,
    Site as SiteSchema,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    ExternalLinkIcon,
    StarHalfIcon,
    StarIcon,
    ThumbsDownIcon,
} from "lucide-react";
import Link from "next/link";
import { createContext, ReactNode, useContext } from "react";
import LinkIcon from "./link-icon";

const SiteContext = createContext({ site: {} as SiteSchema });

function useSite() {
    const context = useContext(SiteContext);

    if (!context) {
        throw new Error("useSite must be used within a SiteProvider");
    }

    return context.site;
}

export default function Site({ site }: { site: SiteSchema }) {
    return (
        <SiteContext.Provider value={{ site }}>
            <div className="relative w-full flex flex-col items-stretch gap-8 flex-1">
                <Header>
                    <HeaderMedia>
                        <Banner />
                        <Avatar />
                    </HeaderMedia>
                    <HeaderContent>
                        <HeaderTitle>{site.name}</HeaderTitle>
                        <HeaderBio>{site.bio}</HeaderBio>
                    </HeaderContent>
                </Header>
                <Section>
                    <SectionTitle>Kinks</SectionTitle>
                    {site.kinks.length === 0 ? (
                        <SectionEmpty>
                            They have no kinks. So boring.
                        </SectionEmpty>
                    ) : (
                        site.kinks.toSorted((a, b) => {
                            return b.rating! - a.rating!;
                        }).map((kink) => (
                            <KinkItem key={kink.id} kink={kink} />
                        ))
                    )}
                </Section>
                <Section>
                    <SectionTitle>Fuck Me On</SectionTitle>
                    {site.links.length === 0 ? (
                        <SectionEmpty>No sex for now.</SectionEmpty>
                    ) : (
                        site.links.map((link) => (
                            <LinkItem key={link.id} link={link} />
                        ))
                    )}
                </Section>
                <Footer />
            </div>
        </SiteContext.Provider>
    );
}

function Header({ children }: { children?: ReactNode }) {
    return (
        <div className="flex flex-col items-stretch text-center gap-2">
            {children}
        </div>
    );
}

function HeaderMedia({ children }: { children?: ReactNode }) {
    return <div className="flex flex-col items-center">{children}</div>;
}

function Banner() {
    const site = useSite();
    const bannerUrl = site.banner_url;

    return (
        <div
            className="w-full h-40 rounded-lg bg-pink-100 relative bg-cover bg-center overflow-hidden"
            style={{
                backgroundImage: bannerUrl ? `url("${bannerUrl}")` : undefined,
            }}
        >
            {!bannerUrl && (
                <div className="w-full h-full font-cherry leading-5 tracking-[0.5rem] rotate-258 -ml-40 scale-150 opacity-10 select-none">
                    {"K ".repeat(300)}
                </div>
            )}
        </div>
    );
}

function Avatar() {
    const site = useSite();
    const avatarUrl = site.avatar_url;

    return (
        <div
            className="size-20 rounded-full bg-pink-200 border-4 border-pink-200 bg-cover bg-center overflow-hidden -mt-10 z-10 flex flex-col items-center justify-center"
            style={{
                backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined,
            }}
        >
            {!avatarUrl && (
                <div className="font-cherry text-6xl rotate-270 leading-none -ml-2.5 select-none">
                    K
                </div>
            )}
        </div>
    );
}

function HeaderContent({ children }: { children?: ReactNode }) {
    return <div className="px-4">{children}</div>;
}

function HeaderTitle({ children }: { children?: ReactNode }) {
    return <h1 className="text-xl font-bold">{children}</h1>;
}

function HeaderBio({ children }: { children?: ReactNode }) {
    return children ? <p className="opacity-75">{children}</p> : null;
}

function Section({ children }: { children?: ReactNode }) {
    return <div className="flex flex-col items-stretch gap-2">{children}</div>;
}

function SectionTitle({ children }: { children?: ReactNode }) {
    return <h2 className="text-lg font-semibold">{children}</h2>;
}

function SectionEmpty({ children }: { children?: ReactNode }) {
    return (
        <div className="p-4 text-sm border-2 border-pink-200 border-dashed rounded-lg text-center flex flex-col items-center justify-center text-foreground/50">
            {children}
        </div>
    );
}

function KinkItem({ kink }: { kink: KinkSchema }) {
    return (
        <div
            className={cn(
                "h-8 text-sm font-medium bg-white rounded-lg text-pink-800 overflow-hidden flex flex-col items-stretch cursor-default",
                kink.comment && "group"
            )}
        >
            <div
                className={cn(
                    "px-4 flex flex-row items-center justify-between h-8 min-h-8",
                    kink.comment && "group-hover:-mt-8 transition-all"
                )}
            >
                <div>{kink.name}</div>
                <div className="flex flex-row items-center">
                    {kink.rating === 0 ? (
                        <ThumbsDownIcon className="size-4 fill-pink-800" />
                    ) : (
                        Array.from({ length: Math.ceil(kink.rating! / 2) }).map(
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
                        )
                    )}
                </div>
            </div>
            {kink.comment && (
                <div className="h-8 text-center flex flex-col items-center justify-center px-4 line-clamp-1 whitespace-normal wrap-break-word max-w-full">
                    <div>{kink.comment}</div>
                </div>
            )}
        </div>
    );
}

function LinkItem({ link }: { link: LinkSchema }) {
    return (
        <div className="h-8 px-4 bg-white rounded-lg border border-white flex flex-row items-center gap-2 text-pink-800">
            <LinkIcon source={link.source} className="size-4 shrink-0" />
            <div className="text-sm font-medium wrap-break-word line-clamp-1 flex-1 leading-none min-w-0">
                {link.pointer}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <Link
            href="https://kittyk.xyz"
            className="text-center py-1 text-xs bg-pink-100 rounded flex flex-row items-center justify-center gap-1 text-foreground/50 hover:text-foreground cursor-pointer mt-auto"
        >
            Made with KittyKinks
            <ExternalLinkIcon className="size-3" />
        </Link>
    );
}
