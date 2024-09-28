// lib/SchemaBP.js
import LaravelGenerator from './generators/LaravelGenerator'
import PrismaGenerator from './generators/PrismaGenerator'
// import DrizzleGenerator from './generators/DrizzleGenerator'  (add this when ready)

export default class SchemaBP {
    constructor(parsedJsonLd) {
        this.parsedJsonLd = parsedJsonLd
    }

    toLaravelCode() {
        const generator = new LaravelGenerator(this.parsedJsonLd)
        return generator.generateCode()
    }

    toPrismaCode() {
        const generator = new PrismaGenerator(this.parsedJsonLd)
        return generator.generateCode()
    }

    // Add future ORM code generators here
    // toDrizzleCode() {
    //   const generator = new DrizzleGenerator(this.parsedJsonLd)
    //   return generator.generateCode()
    // }
}
