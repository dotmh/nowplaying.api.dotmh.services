import { nowPlaying } from "./handlers/now-playing.ts";
import { Env } from "./helpers/env.ts";
import { Client } from "./last-fm/client.ts";
import { Config } from "./last-fm/config.ts";

const ENV_CONFIG_LIMIT = 'CONFIG_LIMIT';

Deno.serve(async () => {
  try {
    const config = new Config();
    const client = new Client(config);
    const limit = Env.get(ENV_CONFIG_LIMIT).optional('1').int;
    const response = await nowPlaying(client, limit);
    return new Response(JSON.stringify({ state: 'success', data: response }));
  } catch (e) {
    return new Response(JSON.stringify({ state: 'error', data: (e as Error).message }));
  }
})