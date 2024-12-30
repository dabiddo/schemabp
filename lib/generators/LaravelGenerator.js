// lib/generators/LaravelGenerator.js
import BaseGenerator from './BaseGenerator'
import { toSnakeCase, toPascalCase } from '../utils'

export default class LaravelGenerator extends BaseGenerator {
    constructor(parsedJsonLd) {
        super(parsedJsonLd)
    }

    generateCode() {
        const models = this.parseJsonLd(this.parsedJsonLd);
        const generatedCodeArray = [];

        for (const [model, fields] of models.entries()) {
            const pascalCaseModel = toPascalCase(model);

            const modelClass = `<?php
    
    namespace App\\Models;
    
    use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
    use Illuminate\\Database\\Eloquent\\Model;
    
    class ${pascalCaseModel} extends Model
    {
        use HasFactory;
        
        protected $fillable = [
            ${fields.filter(field => field.startsWith('$table->string')).map(field => `"${field.split('"')[1]}"`).join(', ')}
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

            // Push each model and migration separately into the array
            generatedCodeArray.push({
                model: modelClass,
                migration: migrationClass
            });
        }

        return generatedCodeArray; // Return as an array of objects containing model and migration code
    }


    generateOldCode() {
        const models = this.parseJsonLd(this.parsedJsonLd)
        let generatedCode = ''

        for (const [model, fields] of models.entries()) {
            const pascalCaseModel = toPascalCase(model)

            const modelClass = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class ${pascalCaseModel} extends Model
{
    use HasFactory;
    
    protected $fillable = [
        ${fields.filter(field => field.startsWith('$table->string')).map(field => `"${field.split('"')[1]}"`).join(', ')}
    ];
}
`

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
`

            generatedCode += `${modelClass}\n${migrationClass}\n`
        }

        return generatedCode
    }

    // Function to parse JSON-LD and return fields (same as before)
    parseJsonLd(jsonLd) {
        const models = new Map()

        const parseNode = (node, parentName) => {
            if (typeof node === 'object' && !Array.isArray(node)) {
                const nodeType = node['@type']
                if (nodeType) {
                    const modelName = toSnakeCase(nodeType)
                    if (parentName) {
                        if (!models.has(parentName)) models.set(parentName, [])
                        models.get(parentName).push(`$table->foreignId("${toSnakeCase(nodeType)}_id")->constrained()->onDelete("cascade");`)
                    }
                    if (!models.has(modelName)) models.set(modelName, [])
                    Object.keys(node).forEach(key => {
                        if (key !== '@type' && key !== '@context') {
                            const snakeCaseKey = toSnakeCase(key)
                            models.get(modelName).push(`$table->string("${snakeCaseKey}");`)
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
