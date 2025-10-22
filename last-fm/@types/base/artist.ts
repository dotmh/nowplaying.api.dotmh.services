import type { Image } from './image.ts';

export interface Artist {
    url: string;
    name: string;
    image: Image[]
    mbid: string;
}