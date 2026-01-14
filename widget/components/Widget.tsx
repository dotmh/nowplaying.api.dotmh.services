import { render, FC } from '@hono/hono/jsx/dom'
import { NowPlaying } from "./NowPlaying.tsx";
import { DotMH, LastFM } from "./BrandLogos.tsx";

interface WidgetProperties {
    endpoint: string
}

export const Widget: FC<WidgetProperties> = ({ endpoint }) => {
    return (
        <div className="nowPlaying">
            <NowPlaying endpoint={endpoint} />
            <div className="poweredBy">
                <p>Powered By</p>
                <DotMH />
                <LastFM />
            </div>
        </div>
    );
}

const root = document.getElementById('dotmh-nowplaying');
if (root) {
    const endpoint = root.getAttribute('data-nowplaying-endpoint');
    if (!endpoint) throw new Error('No Endpoint Specified');
    render(<Widget endpoint={endpoint} />, root);
}