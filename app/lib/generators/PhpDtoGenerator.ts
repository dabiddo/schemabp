// app/lib/generators/PhpDtoGenerator.ts
import type { ParserField, ParserSchema } from '~/types'

export default class PhpDtoGenerator {
    private schema: ParserSchema;

    constructor(schema: ParserSchema) {
        this.schema = schema;
    }

    private mapToPhpType(type: string): string {
        switch (type) {
            case 'number': return 'float';
            case 'boolean': return 'bool';
            case 'date': return '\\DateTimeImmutable';
            case 'string': return 'string';
            case 'object': return 'array'; // fallback
            default: 
                // If the parser passed a custom class name (e.g. "GlossDiv")
                // or an array type (e.g. "GlossSeeAlso[]")
                if (type.endsWith('[]')) return 'array';
                return `${type}Dto`; 
        }
    }

    generateCode(): string[] {
        const { name, fields } = this.schema;
        const className = `${name}Dto`;

        const properties = fields.map(field => {
            const phpType = this.mapToPhpType(field.type);
            // Add PHPDoc for arrays so your IDE knows what's inside
            const doc = field.type.endsWith('[]') 
                ? `/** @var ${field.type.replace('[]', 'Dto[]')} */\n        ` 
                : '';
            return `${doc}public ?${phpType} $${field.key} = null;`;
        }).join("\n        ");

        const constructorArgs = fields.map(field => {
            const phpType = this.mapToPhpType(field.type);
            return `?${phpType} $${field.key} = null`;
        }).join(",\n            ");

        const constructorBody = fields.map(field => {
            return `        $this->${field.key} = $${field.key};`;
        }).join("\n");

        const fromArrayAssignments = fields.map(field => {
            return `            $data['${field.originalKey}'] ?? null`; // Use originalKey for the JSON source
        }).join(",\n");

        const dtoClass = `<?php

namespace App\\Dtos;

/**
 * Generated from ${name}
 */
class ${className}
{
    public int $id;
    ${properties}

    public function __construct(
        int $id,
        ${constructorArgs}
    ) {
        $this->id = $id;
${constructorBody}
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'] ?? 0,
${fromArrayAssignments}
        );
    }
}`;

        return [dtoClass];
    }
}