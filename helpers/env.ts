import { ensure } from "./ensure.ts";

function assertIsString(value: unknown, name: string): asserts value is string {
    ensure(value).as(name).to.exist().and.typeof('string');
}

const IS_TRUTHY = ['true', '1', 'y', 'yes'];
class Convert {
    readonly #value: string;
    readonly #name: string;

    constructor(name: string, value: string | undefined) {
        this.#name = name;
        const _value = value;
        assertIsString(_value, this.#name);
        this.#value = _value;
    }

    get int(): number {
        return parseInt(this.#value, 10);
    }

    get string(): string {
        return this.#value;
    }

    get float(): number {
        return parseFloat(this.#value);
    }

    get bool(): boolean {
        return IS_TRUTHY.includes(this.#value);
    }

    get boolean(): boolean {
        return this.bool;
    }

    get array(): string[] {
        return this.#value.split(',');
    }

    arrayWithDelimiter(delimiter: string): string[] {
        return this.#value.split(delimiter);
    }

    get raw(): string | undefined {
        return this.#value;
    }

    toString() {
        return this.string;
    }
}
class Validation {
    #value: string | undefined;

    readonly #name: string;

    constructor(name: string) {
        this.#name = name;
        this.#value = Deno.env.get(name);
    }

    get required(): Convert {
        if (!this.#value) {
            throw new Error(`Environment variable ${this.#name} is required`);
        }
        return new Convert(this.#name, this.#value);
    }

    optional(defaultValue: string): Convert {
        if (!this.#value) {
            this.#value = defaultValue;
        }
        return new Convert(this.#name, this.#value);
    }
}

export class Env {
    private constructor() { }

    public static get(name: string): Validation {
        return new Validation(name);
    }
}