import BaseGenerator from './BaseGenerator';
import type { ModelOutput, Column } from '~/types'

export default class SqlLaravelGenerator extends BaseGenerator<ModelOutput[]> {
    private sqlCreateTable: string;

    constructor(sqlCreateTable: string) {
        super({ sql: sqlCreateTable });
        this.sqlCreateTable = sqlCreateTable;
    }

    override generateCode(sql?: string): ModelOutput[] {
        const sqlToUse = sql || this.sqlCreateTable;

        const tableName = this.getTableName(sqlToUse);
        const columns = this.getColumns(sqlToUse);
        const generatedCodeArray: ModelOutput[] = [];

        const migrationOutput = this.createLaravelMigration(tableName, columns);
        const modelOutput = this.createLaravelModel(tableName, columns);

        generatedCodeArray.push({
            model: modelOutput,
            migration: migrationOutput
        });

        return generatedCodeArray;
    }

    getTableName(sql: string): string {
        const match = sql.match(/CREATE TABLE\s+`?(\w+)`?/i);
        return match ? match[1] : 'unknown_table';
    }

    getColumns(sql: string): Column[] {
        const columns: Column[] = [];
        // Remove comments and normalize whitespace
        const cleanSql = sql.replace(/--.*$/gm, '').replace(/\s+/g, ' ');

        // Extract content between parentheses
        const tableDefinition = cleanSql.match(/\(([\s\S]+)\)/);
        if (!tableDefinition) return columns;

        // Split into individual column definitions
        const columnDefinitions = tableDefinition[1]
            .split(',')
            .map(col => col.trim())
            .filter(col => col && !col.toLowerCase().startsWith('primary key'));

        columnDefinitions.forEach(colDef => {
            // Match column name and type
            const match = colDef.match(/`?(\w+)`?\s+(\w+)(?:\((\d+)\))?/);
            if (match) {
                const [, name, type, length] = match;
                // Skip id and timestamp columns as they're handled separately
                if (!['id', 'created_at', 'updated_at'].includes(name.toLowerCase())) {
                    const isNullable = colDef.toLowerCase().includes('null');
                    const isUnique = colDef.toLowerCase().includes('unique');
                    columns.push({
                        name,
                        type: type.toLowerCase(),
                        length: length || null,
                        nullable: isNullable,
                        unique: isUnique
                    });
                }
            }
        });

        return columns;
    }

    mapColumnToLaravelField(column: Column): string {
        const typeMap: Record<string, string> = {
            int: 'integer',
            bigint: 'bigInteger',
            varchar: 'string',
            text: 'text',
            datetime: 'dateTime',
            timestamp: 'timestamp',
            boolean: 'boolean',
            decimal: 'decimal',
            float: 'float',
            double: 'double'
        };

        const type = typeMap[column.type.toLowerCase()] || 'string';

        // Handle nullable fields
        let fieldDefinition = column.length
            ? `${type}('${column.name}', ${column.length})`
            : `${type}('${column.name}')`;

        // Add any additional modifiers
        if (column.nullable) {
            fieldDefinition += '->nullable()';
        }
        if (column.unique) {
            fieldDefinition += '->unique()';
        }

        return fieldDefinition;
    }

    createLaravelMigration(tableName: string, columns: Column[]): string {
        let migration = `<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\n`;
        migration += `return new class extends Migration {\n  public function up()\n  {\n    Schema::create('${tableName}', function (Blueprint $table) {\n`;
        migration += `      $table->id();\n`;

        columns.forEach(column => {
            const field = this.mapColumnToLaravelField(column);
            migration += `      $table->${field};\n`;
        });

        migration += `      $table->timestamps();\n`;
        migration += `    });\n  }\n\n  public function down()\n  {\n    Schema::dropIfExists('${tableName}');\n  }\n};\n`;

        return migration;
    }

    createLaravelModel(tableName: string, columns: Column[]): string {
        let model = `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\n\n`;
        model += `class ${this.toStudlyCase(tableName)} extends Model\n{\n  use HasFactory;\n\n`;

        const columnNames = columns.map(column => `'${column.name}'`);
        model += `  protected $fillable = [${columnNames.join(', ')}];\n`;
        model += `}\n`;

        return model;
    }

    toStudlyCase(str: string): string {
        return str.replace(/(?:^|_)(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
    }
}