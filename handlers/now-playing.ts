import { Context } from "@hono/hono";
import { Config } from "../last-fm/config.ts";
import { Client } from "../last-fm/client.ts";
import { nowPlaying } from "../lib/now-playing.ts";
import { asResponse } from "../lib/as-response.ts";
import { Env } from "../helpers/env.ts";
import { ENV_CONFIG_LIMIT } from "../lib/constants.ts";

export const nowPlayingHandler = async (ctx: Context): Promise<Response> => {
    const limit = Env.get(ENV_CONFIG_LIMIT).optional('1').int;
    try {
        const config = new Config();
        const client = new Client(config);
        const response = await nowPlaying(client, limit);
        return ctx.json(asResponse('success', response));
    } catch (err) {
        return ctx.json(asResponse('error', (err as Error).message), 500);
    }
}