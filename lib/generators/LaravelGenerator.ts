// lib/generators/LaravelGenerator.ts
import BaseGenerator from './BaseGenerator'
import { toSnakeCase, toPascalCase } from '../utils'
import type { ModelOutput } from '~/types'

export default class LaravelGenerator extends BaseGenerator<ModelOutput[]> {
    constructor(parsedJsonLd: Record<string, any>) {
        super(parsedJsonLd)
    }

    determineColumnType(value: any): string {
        if (typeof value === 'boolean') {
            return 'boolean'
        } else if (typeof value === 'number') {
            return Number.isInteger(value) ? 'integer' : 'decimal'
        } else if (value instanceof Date) {
            return 'datetime'
        } else if (Array.isArray(value)) {
            return 'json'
        } else {
            return 'string'
        }
    }

    override generateCode(): ModelOutput[] {
        const models = this.parseJsonLd(this.parsedJsonLd);
        const generatedCodeArray: ModelOutput[] = [];

        for (const [model, fields] of models.entries()) {
            const pascalCaseModel = toPascalCase(model);

            // Filter out foreign keys from fillable
            const fillableFields = fields
                .filter(field => !field.includes('foreignId'))
                .map(field => {
                    const match = field.match(/"([^"]+)"/);
                    return match ? match[1] : '';
                })
                .filter(Boolean);

            const modelClass = `<?php

    namespace App\\Models;

    use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
    use Illuminate\\Database\\Eloquent\\Model;

    class ${pascalCaseModel} extends Model
    {
        use HasFactory;

        protected $fillable = [
            ${fillableFields.map(field => `"${field}"`).join(', ')}
        ];
    }
    `;

            const migrationClass = `<?php

    use Illuminate\\Database\\Migrations\\Migration;
    use Illuminate\\Database\\Schema\\Blueprint;
    use Illuminate\\Support\\Facades\\Schema;

    class Create${pascalCaseModel}sTable extends Migration
    {
        public function up()
        {
            Schema::create('${toSnakeCase(model)}s', function (Blueprint $table) {
                $table->id();
                ${fields.join('\n            ')}
                $table->timestamps();
            });
        }

        public function down()
        {
            Schema::dropIfExists('${toSnakeCase(model)}s');
        }
    }
    `;

            generatedCodeArray.push({
                model: modelClass,
                migration: migrationClass
            });
        }

        return generatedCodeArray;
    }

    parseJsonLd(jsonLd: Record<string, any>): Map<string, string[]> {
        const models = new Map<string, string[]>();

        const parseNode = (node: any, parentName?: string): void => {
            if (typeof node === 'object' && !Array.isArray(node)) {
                const nodeType = node['@type']
                if (nodeType) {
                    const modelName = toSnakeCase(nodeType)
                    if (parentName) {
                        if (!models.has(parentName)) models.set(parentName, [])
                        models.get(parentName)?.push(`$table->foreignId("${toSnakeCase(nodeType)}_id")->constrained()->onDelete("cascade");`);
                    }
                    if (!models.has(modelName)) models.set(modelName, [])
                    Object.keys(node).forEach(key => {
                        if (key !== '@type' && key !== '@context') {
                            const snakeCaseKey = toSnakeCase(key)
                            const columnType = this.determineColumnType(node[key])
                            models.get(modelName)?.push(`$table->${columnType}("${snakeCaseKey}");`);
                            parseNode(node[key], modelName)
                        }
                    })
                }
            } else if (Array.isArray(node)) {
                node.forEach(item => parseNode(item, parentName))
            }
        }

        parseNode(jsonLd)
        return models
    }
}
