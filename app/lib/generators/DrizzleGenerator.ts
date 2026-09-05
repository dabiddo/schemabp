import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema, ParserField } from '~/types'

export default class DrizzleGenerator {
    private schema: ParserSchema;

    constructor(schema: ParserSchema) {
        this.schema = schema;
    }

    generateCode(): string[] {
        const name = pascalCase(this.schema.name);
        const tableName = snakeCase(name) + 's';
        const varName = pascalCase(name, false) + 'Table';

        const columns = this.schema.fields.map(field => {
            return this.buildColumn(field, this.schema.name);
        }).join(',\n    ');

        const code = `import { pgTable, serial, varchar, text, integer, bigint, boolean, timestamp, date, numeric, jsonb, primaryKey } from 'drizzle-orm/pg-core'

export const ${varName} = pgTable('${tableName}', {
    id: serial('id').primaryKey(),
    ${columns}
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
`;

        return [code];
    }

    private buildColumn(field: ParserField, _ownerName: string): string {
        const colName = field.key;
        const colVar = snakeCase(colName);
        const type: string = field.type;

        if (type === 'number') {
            return `${colName}: numeric('${colVar}')`;
        }
        if (type === 'boolean') {
            return `${colName}: boolean('${colVar}')`;
        }
        if (type === 'date') {
            return `${colName}: timestamp('${colVar}')`;
        }
        if (type === 'string') {
            return `${colName}: varchar('${colVar}', { length: 255 })`;
        }
        if (type === 'object') {
            return `${colName}: jsonb('${colVar}')`;
        }
        if (type.endsWith('[]')) {
            return `${colName}: jsonb('${colVar}')`;
        }
        // Custom class reference: store as jsonb
        return `${colName}: jsonb('${colVar}')`;
    }
}
