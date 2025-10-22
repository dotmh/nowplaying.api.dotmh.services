import { Config } from "./config.ts";

interface LastFMError {
    message: string,
    code: number
}

export class Client {
    #config: Config;
    constructor(config: Config) {
        this.#config = config;
    }

    public get<R>(method: string, params?: Record<string, string>): Promise<R> {
        return this.#request<R>(method, params);
    }

    async #request <R>(method: string, params?: Record<string, string>): Promise<R> {
        const url = `${this.#url}`;
        const queryParams = new URLSearchParams({
            ...params ?? {},
            api_key: this.#config.Key,
            format: this.#config.Format,
            method: method.toLowerCase()
        });

        const res = await fetch(`${url}/?${queryParams}`);
        if (res.status >= 400) {
            const error = await res.json() as LastFMError;
            throw new Error(`${res.status}: ${error.message} for ${url} with ${JSON.stringify(params)}`);
        }

        if (this.#config.Format !== 'json') {
            throw new Error('Not Implemented');
        }

        const json = await res.json();
        return json as R;
    }

    get #url() {
        return `${this.#config.Protocol}://${this.#config.Endpoint}/${this.#config.Version}`;
    }
}