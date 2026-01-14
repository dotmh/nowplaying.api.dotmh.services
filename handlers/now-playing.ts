import { Config } from "../last-fm/config.ts";
import { Client } from "../last-fm/client.ts";
import { nowPlaying } from "../lib/now-playing.ts";
import { asResponse } from "../lib/as-response.ts";
import { Env } from "../helpers/env.ts";
import { ENV_CONFIG_LIMIT } from "../lib/constants.ts";
import { type StatusCode } from "@hono/hono/utils/http-status";

export const nowPlayingHandler = async (): Promise<[ReturnType<typeof asResponse>, StatusCode]> => {
    const limit = Env.get(ENV_CONFIG_LIMIT).optional('1').int;
    try {
        const config = new Config();
        const client = new Client(config);
        const response = await nowPlaying(client, limit);
        return [asResponse('success', response), 200];
    } catch (err) {
        return [asResponse('error', (err as Error).message), 500];
    }
}