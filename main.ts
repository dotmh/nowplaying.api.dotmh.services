import { Hono } from '@hono/hono';
import { serveStatic } from '@hono/hono/deno'
import { cors } from '@hono/hono/cors';
import { streamSSE } from '@hono/hono/streaming';
import { logger } from '@hono/hono/logger';

import { Env } from "./helpers/env.ts";
import {
  CONFIG_EVENT_NAME,
  ENV_CONFIG_MAX_AGE_SEC,
  ENV_CONFIG_POWERED_BY,
  ENV_CONFIG_UPDATE_RATE
} from "./lib/constants.ts";
import { nowPlayingHandler } from "./handlers/now-playing.ts";

const app = new Hono();

const updateRate = Env.get(ENV_CONFIG_UPDATE_RATE).optional(`${30 * 1000}`).int;

const cacheDirectives = {
  'Max-Age': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-While-Revalidate': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
  'Stale-If-Error': Env.get(ENV_CONFIG_MAX_AGE_SEC).optional('30').string,
}

app.use(logger());
app.use('*', cors());
app.use('*', async (ctx, next) => {
  await next();
  const poweredBy = Env.get(ENV_CONFIG_POWERED_BY).optional('DotMH Services').string;
  ctx.header('X-POWERED-BY', poweredBy);
  ctx.header('Cache-Control', Object.entries(cacheDirectives).map(directive => directive.join('=')).join(', '));
});

app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }));
app.use('/public/*', serveStatic({ root: './' }));

app.get('/', async (ctx) => {
  const [message, status] = await nowPlayingHandler();
  ctx.status(status)
  return ctx.json(message);
});

app.get('/events', (ctx) => {
  return streamSSE(ctx, async (stream) => {
    while (true) {
      const [message] = await nowPlayingHandler();
      await stream.writeSSE({
        data: JSON.stringify(message),
        event: CONFIG_EVENT_NAME,
        id: crypto.randomUUID()
      });
      await stream.sleep(updateRate);
    }
  })
});

Deno.serve(app.fetch);