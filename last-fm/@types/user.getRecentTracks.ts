import { Track } from "./base/tracks.ts";

export interface User__RecentTracks {
    recenttracks: {
        track: Track[];
    }
    "@attr": {
        user: string;
        totalPages: string;
        page: string;
        perPage: string;
        total: string;
    }
}