import LaravelGenerator from './generators/LaravelGenerator'
//import PrismaGenerator from './generators/PrismaGenerator'
//import DrizzleGenerator from './generators/DrizzleGenerator'
//import SqlLaravelGenerator from './generators/SqlLaravelGenerator'
import PhpDtoGenerator from './generators/PhpDtoGenerator'

import type { ParserSchema, ModelOutput } from '~/types'

export default class SchemaBP {
    //private parsedJsonLd: Record<string, any>;
    private schemas: ParserSchema[];
    

    constructor(schemas: ParserSchema[]) {
        this.schemas = schemas;
    }

    toPhpDtoCode(): string[] {
        // We use flatMap because generateCode returns string[], 
        // this ensures we get a flat array of all DTO strings.
        return this.schemas.flatMap(schema => {
            const generator = new PhpDtoGenerator(schema);
            return generator.generateCode();
        });
    }

    toLaravelCode(): ModelOutput[] {
        return this.schemas.flatMap(schema => {
            const generator = new LaravelGenerator(schema);
            return generator.generateCode(); // Should return { model: string, migration: string }
        });
    }

    /*toLaravelCode(): ModelOutput[] {
        const generator = new LaravelGenerator(this.schema);
        return generator.generateCode();
    }*/

    /*constructor(parsedJsonLd: Record<string, any>) {
        this.parsedJsonLd = parsedJsonLd;
    }*/

    /*    toLaravelCode(): ModelOutput[] {
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
        }*/
}
