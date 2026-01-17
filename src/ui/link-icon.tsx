import { LinkSource } from "@/lib/api";
import DiscordIcon from "./icons/discord";
import TwitterIcon from "./icons/twitter";
import InstagramIcon from "./icons/instagram";
import WattpadIcon from "./icons/wattpad";
import SessionIcon from "./icons/session";
import RedditIcon from "./icons/reddit";
import TelegramIcon from "./icons/telegram";
import TumblrIcon from "./icons/tumblr";
import BlueskyIcon from "./icons/bluesky";
import MastodonIcon from "./icons/mastodon";
import SignalIcon from "./icons/signal";
import MatrixIcon from "./icons/matrix";
import { PlusIcon } from "lucide-react";
import { SVGProps } from "react";

export default function LinkIcon({
    source,
    ...props
}: { source: LinkSource } & SVGProps<SVGSVGElement>) {
    let Icon;

    switch (source) {
        case LinkSource.DISCORD:
            Icon = DiscordIcon;
            break;
        case LinkSource.TWITTER:
            Icon = TwitterIcon;
            break;
        case LinkSource.INSTAGRAM:
            Icon = InstagramIcon;
            break;
        case LinkSource.WATTPAD:
            Icon = WattpadIcon;
            break;
        case LinkSource.SESSION:
            Icon = SessionIcon;
            break;
        case LinkSource.REDDIT:
            Icon = RedditIcon;
            break;
        case LinkSource.TELEGRAM:
            Icon = TelegramIcon;
            break;
        case LinkSource.TUMBLR:
            Icon = TumblrIcon;
            break;
        case LinkSource.BLUESKY:
            Icon = BlueskyIcon;
            break;
        case LinkSource.MASTODON:
            Icon = MastodonIcon;
            break;
        case LinkSource.SIGNAL:
            Icon = SignalIcon;
            break;
        case LinkSource.MATRIX:
            Icon = MatrixIcon;
            break;
        case LinkSource.OTHER:
        default:
            Icon = PlusIcon;
            break;
    }

    return <Icon {...props} />;
}
