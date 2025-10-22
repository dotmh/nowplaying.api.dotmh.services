import { ensure } from "../helpers/ensure.ts";
import { Env } from "../helpers/env.ts"

const ENV_LASTFM_API_KEY = "LASTFM_API_KEY";
const ENV_LASTFM_ENDPOINT = "LASTFM_ENDPOINT";
const ENV_LASTFM_PROTOCOL = "LASTFM_PROTOCOL";
const ENV_LASTFM_VERSION = 'LASTFM_VERSION';
const ENV_LASTFM_FORMAT = 'LASTFM_FORMAT';

type Protocol = 'https' | 'http';
type ResFormat = 'json' | 'xml';

export class Config {
    #key: string | null = null;
    #endpoint: string | null = null;
    #protocol: Protocol | null = null;
    #version: string | null = null;
    #format: ResFormat | null = null;

    get Key() {
        if (!this.#key) {
            this.#key = Env.get(ENV_LASTFM_API_KEY)
                .required
                .string;
        }

        return this.#key;
    }

    get Endpoint() {
        if (!this.#endpoint) {
            this.#endpoint = Env.get(ENV_LASTFM_ENDPOINT)
                .optional('ws.audioscrobbler.com')
                .string
        }

        return this.#endpoint;
    }

    get Protocol() {
        if (!this.#protocol) {
            const protocol = Env.get(ENV_LASTFM_PROTOCOL)
                .optional('https')
                .string;
            assertIsValidProtocol(protocol);
            this.#protocol = protocol;
        }

        return this.#protocol
    }

    get Version() {
        if (!this.#version) {
            this.#version = Env.get(ENV_LASTFM_VERSION)
                .optional('2.0')
                .string;
        }

        return this.#version;
    }

    get Format() {
        if (!this.#format) {
            const format = Env.get(ENV_LASTFM_FORMAT)
                .optional('json')
                .string;
            assertIsValidResFormat(format);
            this.#format = format;
        }

        return this.#format;
    }
}

function assertIsValidProtocol(protocol: unknown): asserts protocol is Protocol {
    ensure(protocol).as('protocol').exist().and.is.typeof('string').and.is.oneOf(['http', 'https']);
}

function assertIsValidResFormat(format: unknown): asserts format is ResFormat {
    ensure(format).as('format').exist().and.is.typeof('string').and.is.oneOf(['json', 'xml']);
}