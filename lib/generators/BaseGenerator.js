// lib/generators/BaseGenerator.js
export default class BaseGenerator {
    constructor(parsedJsonLd) {
        this.parsedJsonLd = parsedJsonLd
    }

    generateCode() {
        throw new Error('generateCode() must be implemented by subclass')
    }
}
