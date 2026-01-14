import { FC } from "@hono/hono/jsx/dom";

export const LastFM: FC = () => (
    <a href="https://www.last.fm">
        <img
            src="https://img.shields.io/badge/last.fm-D51007?style=for-the-badge&logo=last.fm&logoColor=white"
            alt="last.fm"
            className="badge"
        />
    </a>);


export const DotMH: FC = () => (
    <a href="https://www.dotmh.dev">
        <img
            className="badge"
            src="https://assets.codepen.io/6325996/dotmh.svg"
            alt="DotMH"
        />
    </a>
);