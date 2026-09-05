import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema, ParserField } from '~/types'

export default class PrismaGenerator {
    private schema: ParserSchema;

    constructor(schema: ParserSchema) {
        this.schema = schema;
    }

    generateCode(): string[] {
        const name = pascalCase(this.schema.name);

        const fieldLines = this.schema.fields.map(field => {
            return `    ${field.key.padEnd(2)} ${this.mapType(field)}`;
        }).join('\n');

        const code = `// Prisma schema for ${name}

model ${name} {
    id        Int      @id @default(autoincrement())
${fieldLines}
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
`;

        return [code];
    }

    private mapType(field: ParserField): string {
        const t: string = field.type;
        const required = field.value === null ? '?' : '';

        if (t === 'number') return `Int${required}`;
        if (t === 'boolean') return `Boolean${required}`;
        if (t === 'date') return `DateTime${required}`;
        if (t === 'string') return `String${required}`;
        if (t === 'object') return `Json${required}`;
        if (t.endsWith('[]')) return `Json${required}`;
        // Custom class -> treat as Json for portability
        return `Json${required}`;
    }
}
