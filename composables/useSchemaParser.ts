//import { toSnakeCase, toPascalCase } from '../lib/utils'
import type { ParserSchema, ParserField } from '~/types'
import { snakeCase, pascalCase } from 'scule'

export const useSchemaParser = () => {
    const parse = (rawInput: string): ParserSchema => {
        try {
            const json = JSON.parse(rawInput)
            const entityName = json['@type'] || 'GeneratedEntity'
            const fields: ParserField[] = [] // Using the new name

            const flatten = (obj: any, prefix = '') => {
                for (const [key, value] of Object.entries(obj)) {
                    if (key.startsWith('@')) continue

                    const currentKey = prefix ? `${prefix}_${key}` : key

                    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                        flatten(value, currentKey)
                    } else {
                        fields.push({
                            key: snakeCase(currentKey),
                            originalKey: key,
                            type: inferType(value, key),
                            value: value
                        })
                    }
                }
            }

            flatten(json)

            return {
                name: pascalCase(entityName),
                fields
            }
        } catch (e) {
            throw new Error('Invalid JSON')
        }
    }

    const inferType = (val: any, key: string): ParserField['type'] => {
        if (typeof val === 'number') return 'number'
        if (typeof val === 'boolean') return 'boolean'
        if (key.toLowerCase().includes('date')) return 'date'
        return 'string'
    }

    return { parse }
}