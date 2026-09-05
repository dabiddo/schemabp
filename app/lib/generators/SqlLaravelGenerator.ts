import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema, ModelOutput } from '~/types'

type SqlColumn = {
    name: string
    type: string
    notNull: boolean
    unique: boolean
    isPrimary: boolean
    defaultValue: string | null
}

type ParsedTable = {
    name: string
    columns: SqlColumn[]
}

export default class SqlLaravelGenerator {
    private table: ParsedTable;

    constructor(table: ParsedTable) {
        this.table = table;
    }

    static fromSchema(schema: ParserSchema): SqlLaravelGenerator {
        const columns: SqlColumn[] = schema.fields.map(f => ({
            name: f.originalKey,
            type: mapBackToSqlType(f.type),
            notNull: f.value !== null,
            unique: false,
            isPrimary: f.key === 'id',
            defaultValue: typeof f.value === 'string' && f.value.length > 0 ? f.value : null,
        }))
        return new SqlLaravelGenerator({ name: schema.name, columns })
    }

    generateCode(): ModelOutput[] {
        const className = pascalCase(this.table.name)
        const tableName = snakeCase(this.table.name) + 's'

        const nonPrimary = this.table.columns.filter(c => !c.isPrimary)

        const migrationFields = nonPrimary.map(col => {
            const method = this.mapToBlueprintMethod(col)
            const modifiers: string[] = []
            if (col.notNull) modifiers.push('')
            if (col.unique) modifiers.push('->unique()')
            if (col.defaultValue !== null) {
                const v = col.defaultValue
                const quoted = /^\d+(\.\d+)?$/.test(v) || v === 'true' || v === 'false' || v === 'null'
                    ? v
                    : `'${v.replace(/'/g, "\\'")}'`
                modifiers.push(`->default(${quoted})`)
            }
            return `$table->${method}('${col.name}')${modifiers.join('')};`
        }).join('\n            ')

        const fillableList = ['id', ...nonPrimary.map(c => `'${c.name}'`)].join(', ')

        const modelCode = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class ${className} extends Model
{
    protected $table = '${snakeCase(this.table.name)}';
    protected $fillable = [${fillableList}];
}`

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
};`

        return [{
            name: className,
            model: modelCode,
            migration: migrationCode,
        }]
    }

    private mapToBlueprintMethod(col: SqlColumn): string {
        const t = col.type.toLowerCase().replace(/\(.*\)/, '').trim()
        switch (t) {
            case 'int': case 'integer': case 'smallint': case 'bigint': case 'tinyint':
                return 'integer'
            case 'decimal': case 'numeric': case 'float': case 'double': case 'real':
                return 'decimal'
            case 'bool': case 'boolean':
                return 'boolean'
            case 'date':
                return 'date'
            case 'datetime': case 'timestamp':
                return 'dateTime'
            case 'json': case 'jsonb':
                return 'json'
            default:
                return 'string'
        }
    }
}

const mapBackToSqlType = (parserType: string): string => {
    switch (parserType) {
        case 'number': return 'INT'
        case 'boolean': return 'BOOLEAN'
        case 'date': return 'DATETIME'
        case 'object': return 'JSON'
        default: return 'VARCHAR'
    }
}
