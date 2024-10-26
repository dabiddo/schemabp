// lib/SchemaBP.js
import LaravelGenerator from './generators/LaravelGenerator'
import PrismaGenerator from './generators/PrismaGenerator'
import DrizzleGenerator from './generators/DrizzleGenerator'
import SqlLaravelGenerator from './generators/SqlLaravelGenerator'
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

    toDrizzleCode() {
        const generator = new DrizzleGenerator(this.parsedJsonLd)
        return generator.generateCode()
    }

    sqlToLaravelCode() {
        const generator = new SqlLaravelGenerator(this.parsedJsonLd)
        return generator.generateCode(this.parsedJsonLd)
    }

}
