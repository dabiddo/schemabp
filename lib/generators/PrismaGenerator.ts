import BaseGenerator from './BaseGenerator'
import { toSnakeCase, toPascalCase } from '../utils'

export default class PrismaGenerator extends BaseGenerator<string> {
    constructor(parsedJsonLd: Record<string, any>) {
        super(parsedJsonLd)
    }

    override generateCode(): string {
        const models = this.parseJsonLd(this.parsedJsonLd)
        let generatedCode = ''

        for (const [model, fields] of models.entries()) {
            const pascalCaseModel = toPascalCase(model)

            const modelClass = `model ${pascalCaseModel} {
  id    Int    @id @default(autoincrement())
  ${fields.map(field => this.formatPrismaField(field)).join('\n  ')}
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}`
            generatedCode += `${modelClass}\n\n`
        }

        return generatedCode
    }

    formatPrismaField(field: string): string {
        const fieldName = field.split('"')[1]
        return `${fieldName} String`
    }

    parseJsonLd(jsonLd: Record<string, any>): Map<string, string[]> {
        const models = new Map<string, string[]>()

        const parseNode = (node: any, parentName?: string): void => {
            if (typeof node === 'object' && !Array.isArray(node)) {
                const nodeType = node['@type']
                if (nodeType) {
                    const modelName = toSnakeCase(nodeType)
                    if (!models.has(modelName)) models.set(modelName, [])
                    Object.keys(node).forEach(key => {
                        if (key !== '@type') {
                            models.get(modelName)?.push(`$table->string("${key}");`)
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
