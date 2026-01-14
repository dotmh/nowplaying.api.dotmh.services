export type ImageSize = "small" | "medium" | "large" | "extralarge"

export interface NowPlaying {
    images: { src: string, size: ImageSize }[];
    artist: string;
    album: string;
    track: string;
    user: string;
    nowPlaying: boolean;
}