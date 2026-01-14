import { type NowPlaying } from "./@types/now-playing.ts";

export const asResponse = (
    state: 'error' | 'success',
    data: string | NowPlaying | NowPlaying[] | undefined,
) => {
    return { state, data }
}