export class EnsureError extends Error {
    constructor(value: unknown, op: string, expected?: unknown, name?: string, message?: string, opts?: ErrorOptions) {
        const _message = message ?? `${name ? `${name} is ` : ''}expected ${op} "${expected}" but got "${value}"`;
        super(_message, opts);
    }
}

export const ensure = (value: unknown, name?: string): Ensure => {
    return new Ensure(value, name);
}

class Ensure {
    #value: unknown;
    #name: string;
    constructor(value: unknown, name?: string) {
        this.#value = value;
        this.#name = name ?? '';
    }

    get to(): Ensure {
        return this;
    }

    get and(): Ensure {
        return this;
    }

    get is(): Ensure {
        return this;
    }

    as(name: string): Ensure {
        this.#name = name;
        return this;
    }

    get(key: string) {
        this.has(key);
        const result: unknown = (this.#value as Record<string, unknown>)[key]
        return new Ensure(result).as(`${this.#name}.${key}`);
    }

    exist(message?: string): Ensure {
        if (this.#value === undefined || this.#value === null) {
            this.#fail('Null or Undefined', 'not to be', message);
        }
        return this;
    }

    equal(value: unknown, message?: string): Ensure {
        if (this.#value !== value) {
            this.#fail(value, 'to be', message);
        }
        return this;
    }

    typeof(value: string, message?: string): Ensure {
        // deno-lint-ignore valid-typeof
        if (typeof this.#value !== value) {
            throw new EnsureError(typeof this.#value, 'type of', value, this.#name, message)
        }
        return this;
    }

    has(value: string, message?: string): Ensure {
        if (!(value in (this.#value as object))) {
            this.#fail(value, 'is in', message);
        }
        return this;
    }

    gt(value: number, message?: string): Ensure {
        if (Number(this.#value) <= value) {
            this.#fail(value, 'greater than', message);
        }
        return this;
    }

    notEmpty(message?: string): Ensure {
        if (!this.#value) {
            this.#fail('empty', 'is', message);
        }
        return this;
    }

    array(message?: string): Ensure {
        if (!Array.isArray(this.#value)) {
            this.#fail('an array', 'to be', message);
        }

        return this;
    }

    matches(pattern: RegExp, message?: string): Ensure {
        if (!(typeof this.#value === 'string' && this.#value.match(pattern))) {
            this.#fail(pattern.source, 'to match', message);
        }

        return this;
    }

    oneOf(value: readonly unknown[], message?: string): Ensure {
        if (!value.includes(this.#value)) {
            this.#fail(value.join(', '), 'to be one of', message)
        }

        return this;
    }

    keysOfType(value: string, message?: string): Ensure {
        if (!(typeof this.#value === 'object' && Object.keys(this.#value as object).every(k => typeof k === value))) {
            this.#fail(value, '`object keys of type', message)
        }
        return this;
    }

    valuesOfType(value: string, message?: string): Ensure {
        if (!(typeof this.#value === 'object' && Object.values(this.#value as object).every(k => typeof k === value))) {
            this.#fail(value, 'object values of type', message);
        }
        return this;
    }

    #fail(expected: unknown, op: string, message?: string): never {
        throw new EnsureError(this.#value, op, expected, this.#name, message)
    }
}