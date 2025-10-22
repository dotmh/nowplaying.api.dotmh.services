import { Env } from "../helpers/env.ts";
import { Client } from "../last-fm/client.ts";
import { User__RecentTracks } from '../last-fm/@types/user.getRecentTracks.ts';

const ENV_CONFIG_USER = 'CONFIG_USER';

export interface NowPlaying {
    images: { src: string, size: "small" | "medium" | "large" | "extralarge" }[];
    artist: string;
    album: string;
    track: string;
    user: string;
    nowPlaying: boolean;
}

export const nowPlaying = async (client: Client, limit: number = 1): Promise<NowPlaying | NowPlaying[] | undefined> => {
    const user = Env.get(ENV_CONFIG_USER).required.string;
    const res = await client.get<User__RecentTracks>('user.getrecenttracks', {
        user,
        limit: limit.toString(),
        extended: '1'
    });

    const data = res.recenttracks.track.map(track => {
        const images = track.image?.map(image => ({ src: image['#text'], size: image.size }));
        const artist = track.artist?.name;
        const album = track.album?.['#text'];
        const { name } = track;
        const nowPlaying = track?.['@attr']?.nowplaying ?? false;
        return { images, artist, album, track: name, user, nowPlaying };
    });

    const first = data.find(({ nowPlaying }) => nowPlaying) ?? data[0];

    return limit === 1 ? first : data;
}