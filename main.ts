import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { cache } from '@hono/hono/cache';
import { streamSSE } from '@hono/hono/streaming';

import { Env } from "./helpers/env.ts";
import { ENV_CONFIG_MAX_AGE_SEC, ENV_CONFIG_POWERED_BY } from "./lib/constants.ts";
import { nowPlayingHandler } from "./handlers/now-playing.ts";

const app = new Hono();

const cacheHeaders = {
  'Max-Age': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-While-Revalidate': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-While-Error': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
}

app.use('*', cors());
app.use('*', cache({
  cacheName: 'nowplaying.api.dotmh.services',
  cacheControl: Object.entries(cacheHeaders).map(directives => directives.join('=')).join(', '),
  wait: true
}));
app.use('*', async (ctx, next) => {
  await next();
  const poweredBy = Env.get(ENV_CONFIG_POWERED_BY).optional('DotMH Services').string;
  ctx.header('X-POWERED_BY', poweredBy);
})

app.get('/', (ctx) => {
  return nowPlayingHandler(ctx)
});

Deno.serve(app.fetch);