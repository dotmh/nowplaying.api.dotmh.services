import { FC, useState } from "@hono/hono/jsx/dom";
import { Error } from "./Error.tsx";
import { type NowPlaying as NowPlayingT } from "../../lib/@types/now-playing.ts";
import { Loading } from "./Loading.tsx";
import { ensure } from "../../helpers/ensure.ts";
import { Card } from "./Card.tsx";

interface NowPlayingProps {
    endpoint: string;
}

function assertNowPlayingData(data: unknown): asserts data is NowPlayingT {
    ensure(data).as('data').exist().and.is.typeof('object');
    ensure(data).as('data').get('artist').exist().and.is.typeof('string');
    ensure(data).as('data').get('album').exist().and.is.typeof('string');
    ensure(data).as('data').get('track').exist().and.is.typeof('string');
    ensure(data).as('data').get('user').exist().and.is.typeof('string');
    ensure(data).as('data').get('nowPlaying').exist().and.is.typeof('boolean');
    ensure(data).as('data').get('images').exist().and.is.array().lengthGreaterThan(0);
}

export const NowPlaying: FC<NowPlayingProps> = ({ endpoint }) => {
    const [data, setData] = useState<NowPlayingT | undefined>(undefined);
    const [error, setError] = useState<string | false>(false);
    const [loading, setLoading] = useState<boolean>(true);

    if (!URL.canParse(endpoint)) return <Error code={1} message="Invalid Endpoint Specified" />

    const eventSource = new EventSource(endpoint);

    eventSource.addEventListener('nowplaying.update', (event) => {
        try {
            const nowPlaying = JSON.parse(event.data);
            assertNowPlayingData(nowPlaying);
            setData(nowPlaying);
            setLoading(false)
        } catch (e) {
            console.error(e);
            setError('Failed to get Now Playing');
        }
    })

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error code={2} message={error} />
    }

    if (!error && !loading && data) {
        return <Card playing={data} />
    }

    return null;
}