import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema } from '~/types'

export default class LaravelGenerator {
    private schema: ParserSchema;

    constructor(schema: ParserSchema) {
        this.schema = schema;
    }

    generateCode() {
        const name = pascalCase(this.schema.name);
        const tableName = snakeCase(name) + 's'; // Simple pluralization

        const migrationFields = this.schema.fields.map(field => {
            const method = this.mapToBlueprintMethod(field.type);
            return `$table->${method}('${field.key}')->nullable();`;
        }).join('\n            ');

        const modelFillable = this.schema.fields
            .map(f => `'${f.key}'`)
            .join(', ');

        const modelCode = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class ${name} extends Model
{
    protected $fillable = [${modelFillable}];
}`;

        const migrationCode = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('${tableName}', function (Blueprint $table) {
            $table->id();
            ${migrationFields}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('${tableName}');
    }
};`;

        return [{
            name: name,
            model: modelCode,
            migration: migrationCode
        }];
    }

    private mapToBlueprintMethod(type: string): string {
        switch (type) {
            case 'number': return 'decimal';
            case 'boolean': return 'boolean';
            case 'date': return 'dateTime';
            default: return 'string';
        }
    }
}