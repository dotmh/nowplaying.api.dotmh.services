import { FC } from "@hono/hono/jsx/dom";
import type { ImageSize, NowPlaying } from "../../lib/@types/now-playing.ts";

interface CoverArtProps {
    images: NowPlaying['images'];
    size: ImageSize;
    alt: string;
}

const NoImage = { src: '' }

export const CoverArt: FC<CoverArtProps> = ({ images, size, alt }) => {
    const cover = images.find((image) => image.size === size);
    return (
        <img
            src={(cover ?? images.pop() ?? NoImage).src}
            alt={alt ?? "Album Cover"}
            className="coverArt"
        />
    );
}