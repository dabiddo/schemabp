// lib/generators/PhpDtoGenerator.ts
import BaseGenerator from './BaseGenerator'
import type { ParserSchema } from '~/types/schema' // Use your new type

export default class PhpDtoGenerator {
    private schema: ParserSchema;

    constructor(schema: ParserSchema) {
        this.schema = schema;
    }

    generateCode(): string[] {
        const { name, fields } = this.schema;

        // Map normalized fields to PHP types
        const properties = fields.map(field => {
            const phpType = this.mapToPhpType(field.type);
            return `public ?${phpType} $${field.key} = null;`;
        }).join("\n        ");

        const constructorArgs = fields.map(field => {
            const phpType = this.mapToPhpType(field.type);
            return `?${phpType} $${field.key} = null`;
        }).join(",\n            ");

        const constructorBody = fields.map(field => {
            return `        $this->${field.key} = $${field.key};`;
        }).join("\n");

        const fromArrayAssignments = fields.map(field => {
            return `            $data['${field.key}'] ?? null`;
        }).join(",\n");

        const dtoClass = `<?php

namespace App\\Dtos;

/**
 * Generated from ${name}
 */
class ${name}Dto
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
            $data['id'],
${fromArrayAssignments}
        );
    }
}`;

        return [dtoClass];
    }

    private mapToPhpType(type: string): string {
        switch (type) {
            case 'number': return 'float'; // or int based on your need
            case 'boolean': return 'bool';
            case 'date': return '\\DateTimeImmutable';
            default: return 'string';
        }
    }
}