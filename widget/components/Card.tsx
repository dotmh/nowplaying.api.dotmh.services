import { FC } from "@hono/hono/jsx/dom";
import { NowPlaying } from "../../lib/@types/now-playing.ts";
import { CoverArt } from "./CoverArt.tsx";

interface CardProps {
    playing: NowPlaying
}

export const Card: FC<CardProps> = ({ playing }) => {
    const alt = [playing.track, playing.album, playing.artist]
        .filter(Boolean)
        .join(" - ");

    return (
        <div className="card">
            <div>
                <CoverArt images={playing.images} alt={alt} size="large" />
            </div>
            <div className="right">
                <div className="details">
                    <p className="header">
                        {playing.user}{" "}
                        {playing.nowPlaying
                            ? "is currently listening to"
                            : "recently listened to"}
                    </p>
                    <h1>{playing.track}</h1>
                    {playing.album && <p>{playing.album}</p>}
                    <p>{playing.artist}</p>
                    <p>
                        <a href={`https://www.last.fm/user/${playing.user}`}>
                            Follow {playing.user}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}