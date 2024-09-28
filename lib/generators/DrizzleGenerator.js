// lib/generators/DrizzleGenerator.js
import BaseGenerator from './BaseGenerator';
import { toPascalCase } from '../utils';

export default class DrizzleGenerator extends BaseGenerator {
    constructor(parsedJsonLd) {
        super(parsedJsonLd);
    }

    generateCode() {
        let drizzleCode = '';

        // Start by generating the main table
        drizzleCode += this.generateTable(this.parsedJsonLd);

        // Then handle nested structures
        drizzleCode += this.handleNestedStructures(this.parsedJsonLd);

        return drizzleCode;
    }

    generateTable(parsedJson) {
        const tableName = this.generateTableName(parsedJson['@type'] || 'default_table');
        const fields = this.extractFields(parsedJson);

        let tableCode = `
      import { sqliteTable, text, integer, boolean } from 'drizzle-orm/sqlite';

      export const ${tableName} = sqliteTable('${tableName}', {
    `;

        // Add fields to the table schema
        fields.forEach(field => {
            tableCode += `        ${field.name}: ${field.type}(),\n`;
        });

        tableCode += `
      });
    `;
        return tableCode;
    }

    handleNestedStructures(parsedJson) {
        let nestedSchemas = '';

        for (const key in parsedJson) {
            const value = parsedJson[key];
            if (Array.isArray(value)) {
                // Handle array of objects
                value.forEach(item => {
                    if (typeof item === 'object') {
                        nestedSchemas += this.generateTable(item);
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                // Handle single object
                nestedSchemas += this.generateTable(value);
            }
        }
        return nestedSchemas;
    }

    extractFields(parsedJson) {
        return Object.entries(parsedJson).map(([key, value]) => {
            if (key.startsWith('@')) {
                return null; // Skip JSON-LD specific fields
            }

            return {
                name: toPascalCase(key),
                type: this.determineType(value)
            };
        }).filter(Boolean); // Remove nulls
    }

    determineType(value) {
        if (Array.isArray(value)) {
            return 'text'; // Arrays will be simplified to text for now
        }
        switch (typeof value) {
            case 'string':
                return 'text';
            case 'number':
                return 'integer';
            case 'boolean':
                return 'boolean';
            default:
                return 'text'; // Fallback type
        }
    }

    generateTableName(type) {
        return toPascalCase(type);
    }
}
