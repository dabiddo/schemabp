import BaseGenerator from './BaseGenerator';
import { toSnakeCase, toPascalCase } from '../utils';

export default class SqlLaravelGenerator extends BaseGenerator {
    constructor(sqlCreateTable) {
        super(sqlCreateTable);
        this.sqlCreateTable = sqlCreateTable;
    }

    generateCode() {
        const tableName = this.getTableName(this.sqlCreateTable);
        const columns = this.getColumns(this.sqlCreateTable);
        const generatedCodeArray = [];

        const migrationOutput = this.createLaravelMigration(tableName, columns);
        const modelOutput = this.createLaravelModel(tableName, columns);

        generatedCodeArray.push({
            model: modelOutput,
            migration: migrationOutput
        });

        return generatedCodeArray;
    }

    getTableName(sql) {
        const match = sql.match(/CREATE TABLE\s+`?(\w+)`?/i);
        return match ? match[1] : 'unknown_table';
    }

    getColumns(sql) {
        const columns = [];
        const columnMatches = sql.match(/`(\w+)`\s+(\w+)(?:\((\d+)\))?/g) || [];

        columnMatches.forEach(column => {
            const parts = column.match(/`(\w+)`\s+(\w+)(?:\((\d+)\))?/);
            if (parts) {
                const [, name, type, length] = parts;
                columns.push({ name, type, length });
            }
        });

        return columns;
    }

    createLaravelMigration(tableName, columns) {
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

    mapColumnToLaravelField(column) {
        const typeMap = {
            int: 'integer',
            varchar: 'string',
            text: 'text',
            datetime: 'dateTime',
            boolean: 'boolean',
        };

        const type = typeMap[column.type.toLowerCase()] || 'string';
        return column.length ? `${type}('${column.name}', ${column.length})` : `${type}('${column.name}')`;
    }

    createLaravelModel(tableName, columns) {
        let model = `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\n\n`;
        model += `class ${this.toStudlyCase(tableName)} extends Model\n{\n  use HasFactory;\n\n`;

        const columnNames = columns.map(column => `'${column.name}'`);
        model += `  protected $fillable = [${columnNames.join(', ')}];\n`;
        model += `}\n`;

        return model;
    }

    toStudlyCase(str) {
        return str.replace(/(?:^|_)(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
    }
}
