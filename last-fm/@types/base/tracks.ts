import type { Album } from "./album.ts";
import type { Artist } from "./artist.ts";
import type { Image } from "./image.ts";

export interface Track {
    artist: Artist;
    mbid: string;
    name: string;
    image: Image[];
    streamable: string;
    album: Album;
    url: string;
    "@attr": {
        nowplaying: boolean;
    };
    loved: string;
}