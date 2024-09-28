// lib/generators/PrismaGenerator.js
import BaseGenerator from './BaseGenerator'
import { toSnakeCase, toPascalCase } from '../utils'

export default class PrismaGenerator extends BaseGenerator {
    constructor(parsedJsonLd) {
        super(parsedJsonLd)
    }

    generateCode() {
        const models = this.parseJsonLd(this.parsedJsonLd)
        let generatedCode = ''

        for (const [model, fields] of models.entries()) {
            const pascalCaseModel = toPascalCase(model)

            const modelClass = `model ${pascalCaseModel} {
  id         Int      @id @default(autoincrement())
  ${fields.map(field => this.formatPrismaField(field)).join('\n  ')}
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}`
            generatedCode += `${modelClass}\n\n`
        }

        return generatedCode
    }

    formatPrismaField(field) {
        // Convert Laravel's table->string("field") to Prisma's string representation
        const fieldName = field.split('"')[1]
        return `${fieldName} String`
    }

    parseJsonLd(jsonLd) {
        const models = new Map()

        const parseNode = (node, parentName) => {
            if (typeof node === 'object' && !Array.isArray(node)) {
                const nodeType = node['@type']
                if (nodeType) {
                    const modelName = toSnakeCase(nodeType)
                    if (!models.has(modelName)) models.set(modelName, [])
                    Object.keys(node).forEach(key => {
                        if (key !== '@type') {
                            const snakeCaseKey = toSnakeCase(key)
                            models.get(modelName).push(`$table->string("${snakeCaseKey}");`)
                            parseNode(node[key], modelName)
                        }
                    })
                }
            }
        }

        parseNode(jsonLd)
        return models
    }
}
