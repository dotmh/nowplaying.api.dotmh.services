import { type NowPlaying, nowPlaying } from "./handlers/now-playing.ts";
import { Env } from "./helpers/env.ts";
import { Client } from "./last-fm/client.ts";
import { Config } from "./last-fm/config.ts";

const ENV_CONFIG_LIMIT = 'CONFIG_LIMIT';
const ENV_CONFIG_POWERED_BY = 'CONFIG_POWERED_BY';

const JSON_HEADER = { "content-type": "application/json" };
const PRE_FLIGHT = [
  "Origin",
  "X-Requested-With",
  "Content-Type",
  "Accept",
  "useragent"
];
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": PRE_FLIGHT.join(", ")
};

const asHeaders = (otherHeaders?: Record<string, string>) => {
  const poweredBy = Env.get(ENV_CONFIG_POWERED_BY).optional('DotMH Services').string;
  return {
    headers: {
      ...JSON_HEADER,
      ...CORS_HEADERS,
      ...otherHeaders ?? {},
      'X-POWERED-BY': poweredBy
    }
  }
}

const asResponse = (
  state: 'error' | 'success',
  data: string | NowPlaying | NowPlaying[] | undefined,
  headers?: Record<string, string>
) => {
  return new Response(JSON.stringify({ state, data }), asHeaders(headers))
}

Deno.serve(async () => {
  try {
    const config = new Config();
    const client = new Client(config);
    const limit = Env.get(ENV_CONFIG_LIMIT).optional('1').int;
    const response = await nowPlaying(client, limit);
    return asResponse('success', response);
  } catch (e) {
    return asResponse('error', (e as Error).message);
  }
});