import LaravelGenerator from './generators/LaravelGenerator'
import PrismaGenerator from './generators/PrismaGenerator'
import DrizzleGenerator from './generators/DrizzleGenerator'
import SqlLaravelGenerator from './generators/SqlLaravelGenerator'
import PhpDtoGenerator from './generators/PhpDtoGenerator'

import type { ParserSchema, ModelOutput } from '~/types'

export default class SchemaBP {
    private schemas: ParserSchema[];

    constructor(schemas: ParserSchema[]) {
        this.schemas = schemas;
    }

    toPhpDtoCode(): string[] {
        return this.schemas.flatMap(schema => {
            const generator = new PhpDtoGenerator(schema);
            return generator.generateCode();
        });
    }

    toLaravelCode(): ModelOutput[] {
        return this.schemas.flatMap(schema => {
            const generator = new LaravelGenerator(schema);
            return generator.generateCode();
        });
    }

    toDrizzleCode(): string[] {
        return this.schemas.flatMap(schema => {
            const generator = new DrizzleGenerator(schema);
            return generator.generateCode();
        });
    }

    toPrismaCode(): string[] {
        return this.schemas.flatMap(schema => {
            const generator = new PrismaGenerator(schema);
            return generator.generateCode();
        });
    }

    sqlToLaravelCode(): ModelOutput[] {
        return this.schemas.flatMap(schema => {
            const generator = SqlLaravelGenerator.fromSchema(schema);
            return generator.generateCode();
        });
    }
}
