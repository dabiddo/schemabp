import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema, ParserField } from '../types'

export const useSchemaParser = () => {
    // We store all discovered DTOs here to handle nesting
    const schemas: ParserSchema[] = []

    const parse = (rawInput: string): ParserSchema[] => {
        try {
            const json = JSON.parse(rawInput)
            schemas.length = 0 // Reset for new parse

            // Determine root name
            let rootName = json['@type'] || 'RootEntity'
            let rootData = json

            // Handle the single wrapper object case (like your glossary example)
            const keys = Object.keys(json).filter(k => !k.startsWith('@'))
            if (!json['@type'] && keys.length === 1 && typeof json[keys[0]] === 'object' && !Array.isArray(json[keys[0]])) {
                rootName = keys[0]
                rootData = json[keys[0]]
            }

            processObject(rootName, rootData)

            return schemas
        } catch (e) {
            throw new Error('Invalid JSON: ' + (e as Error).message)
        }
    }

    const processObject = (name: string, obj: any): string => {
        const className = pascalCase(name)
        const fields: ParserField[] = []

        for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('@')) continue

            let type: string = 'string'

            if (Array.isArray(value)) {
                // Handle Arrays
                if (value.length > 0 && typeof value[0] === 'object') {
                    const subTypeName = processObject(key, value[0])
                    type = `${subTypeName}[]`
                } else {
                    type = value.length > 0 ? `${typeof value[0]}[]` : 'array'
                }
            } else if (value !== null && typeof value === 'object') {
                // Handle Nested Objects (This is what was failing)
                // We process the object, get its Class Name, and use it as the type
                type = processObject(key, value)
            } else {
                // Simple scalars
                type = inferType(value, key)
            }

            fields.push({
                key: snakeCase(key),
                originalKey: key,
                type: type as any,
                value: value
            })
        }

        schemas.push({ name: className, fields })
        return className // Return the name so the parent field knows its type
    }

    const inferType = (val: any, key: string): ParserField['type'] => {
        if (typeof val === 'number') return 'number'
        if (typeof val === 'boolean') return 'boolean'
        if (key.toLowerCase().includes('date')) return 'date'
        return 'string'
    }

    return { parse }
}