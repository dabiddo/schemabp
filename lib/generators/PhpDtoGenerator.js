import BaseGenerator from './BaseGenerator'
import { toSnakeCase, toPascalCase } from '../utils'

export default class PhpDtoGenerator extends BaseGenerator {
    constructor(parsedJsonLd) {
        super(parsedJsonLd)
    }

    generateCode() {
        const models = this.parseJsonLd(this.parsedJsonLd);
        const classes = [];

        for (const [model, fields] of Object.entries(models)) {
            const pascalCaseModel = toPascalCase(model);

            // Generate properties
            const properties = fields.map(field => `public ?string $${field};`).join("\n    ");

            // Generate constructor arguments
            const constructorArgs = fields.map(field => `?string $${field} = null`).join(",\n        ");

            // Generate constructor body
            const constructorBody = fields.map(field => `        $this->${field} = $${field};`).join("\n");

            // Generate fromArray assignments
            const fromArrayAssignments = fields
                .map(field => `$data['${field}'] ?? null`)
                .join(",\n            ");

            // Build the DTO class template
            const DtoClass = `<?php
    namespace App\\Dtos;
    
    class ${pascalCaseModel}Dto
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

            classes.push(DtoClass);
        }

        return classes;
    }

    // Function to parse JSON-LD and return fields (same as before)
    parseJsonLd(jsonLd) {
        const models = new Map();

        const parseNode = (node, parentName) => {
            if (typeof node === 'object' && !Array.isArray(node)) {
                const nodeType = node['@type'];
                if (nodeType) {
                    const modelName = toSnakeCase(nodeType);
                    if (!models.has(modelName)) models.set(modelName, []);
                    Object.keys(node).forEach(key => {
                        if (key !== '@type' && key !== '@context') {
                            const snakeCaseKey = toSnakeCase(key);
                            const properties = models.get(modelName);
                            if (!properties.includes(snakeCaseKey)) {
                                properties.push(snakeCaseKey);
                            }
                            parseNode(node[key], modelName);
                        }
                    });
                }
            } else if (Array.isArray(node)) {
                node.forEach(item => parseNode(item, parentName));
            }
        };

        parseNode(jsonLd);
        return Object.fromEntries(models);
    }


}