import LaravelGenerator from './generators/LaravelGenerator'
import PrismaGenerator from './generators/PrismaGenerator'
import DrizzleGenerator from './generators/DrizzleGenerator'
import SqlLaravelGenerator from './generators/SqlLaravelGenerator'
import PhpDtoGenerator from './generators/PhpDtoGenerator'

interface ModelOutput {
    model: string;
    migration: string;
}

export default class SchemaBP {
    private parsedJsonLd: Record<string, any>;

    constructor(parsedJsonLd: Record<string, any>) {
        this.parsedJsonLd = parsedJsonLd;
    }

    toLaravelCode(): ModelOutput[] {
        const generator = new LaravelGenerator(this.parsedJsonLd);
        return generator.generateCode();
    }

    toPhpDtoCode(): string[] {
        const generator = new PhpDtoGenerator(this.parsedJsonLd);
        return generator.generateCode();
    }

    toPrismaCode(): string {
        const generator = new PrismaGenerator(this.parsedJsonLd);
        return generator.generateCode();
    }

    toDrizzleCode(): string {
        const generator = new DrizzleGenerator(this.parsedJsonLd);
        return generator.generateCode();
    }

    sqlToLaravelCode(sql: string): ModelOutput[] {
        const generator = new SqlLaravelGenerator(sql);
        return generator.generateCode();
    }
}
