export default class BaseGenerator<T = string> {
    protected parsedJsonLd: Record<string, any>;

    constructor(parsedJsonLd: Record<string, any>) {
        this.parsedJsonLd = parsedJsonLd;
    }

    generateCode(): T {
        throw new Error('generateCode() must be implemented by subclass');
    }
}
