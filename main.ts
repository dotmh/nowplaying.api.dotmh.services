import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { cache } from '@hono/hono/cache';

import { type NowPlaying, nowPlaying } from "./handlers/now-playing.ts";
import { Env } from "./helpers/env.ts";
import { Client } from "./last-fm/client.ts";
import { Config } from "./last-fm/config.ts";

const app = new Hono();

const ENV_CONFIG_LIMIT = 'CONFIG_LIMIT';
const ENV_CONFIG_POWERED_BY = 'CONFIG_POWERED_BY';
const ENV_CONFIG_MAX_AGE_SEC = 'CONFIG_MAX_AGE_SEC';

const CACHE_HEADERS = {
  'Max-Age': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-While-Revalidate': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-While-Error': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
}

const asResponse = (
  state: 'error' | 'success',
  data: string | NowPlaying | NowPlaying[] | undefined,
) => {
  return { state, data }
}

app.use('*', cors());
app.use('*', cache({
  cacheName: 'nowplaying.api.dotmh.services',
  cacheControl: Object.entries(CACHE_HEADERS).map(directives => directives.join('=')).join(', '),
  wait: true
}));
app.use('*', async (ctx, next) => {
  await next();
  const poweredBy = Env.get(ENV_CONFIG_POWERED_BY).optional('DotMH Services').string;
  ctx.header('X-POWERED_BY', poweredBy);
})

app.get('/', async (ctx) => {
  try {
    const config = new Config();
    const client = new Client(config);
    const limit = Env.get(ENV_CONFIG_LIMIT).optional('1').int;
    const response = await nowPlaying(client, limit);
    return ctx.json(asResponse('success', response));
  } catch (e) {
    return ctx.json(asResponse('error', (e as Error).message), 500);
  }
})

Deno.serve(app.fetch);