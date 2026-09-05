import { snakeCase, pascalCase } from 'scule'
import type { ParserSchema, ParserField } from '~/types'

type SqlColumn = {
    name: string
    type: string
    notNull: boolean
    unique: boolean
    isPrimary: boolean
    defaultValue: string | null
}

const TYPE_MAP: Record<string, ParserField['type']> = {
    int: 'number',
    integer: 'number',
    smallint: 'number',
    bigint: 'number',
    tinyint: 'number',
    decimal: 'number',
    numeric: 'number',
    float: 'number',
    double: 'number',
    real: 'number',
    bool: 'boolean',
    boolean: 'boolean',
    date: 'date',
    datetime: 'date',
    timestamp: 'date',
    json: 'object',
    jsonb: 'object',
}

const mapSqlType = (raw: string): { parser: ParserField['type']; blueprint: string } => {
    const t = raw.toLowerCase().replace(/\(.*\)/, '').trim()
    const parser = TYPE_MAP[t] ?? 'string'
    const blueprint = parser === 'number' ? 'decimal'
        : parser === 'boolean' ? 'boolean'
        : parser === 'date' ? 'dateTime'
        : parser === 'object' ? 'json'
        : 'string'
    return { parser, blueprint }
}

const cleanDefault = (raw: string | null): string | null => {
    if (!raw) return null
    return raw
}

const stripQuotes = (s: string) => s.replace(/^['"]|['"]$/g, '')

export const useSqlParser = () => {
    const parse = (rawInput: string): ParserSchema[] => {
        const schemas: ParserSchema[] = []
        const sql = rawInput.trim().replace(/;+\s*$/, '')

        const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?([A-Za-z0-9_]+)[`"']?\s*\(([\s\S]*)\)\s*(ENGINE\s*=\s*\w+|CHARSET\s*=\s*\w+|DEFAULT\s+CHARSET\s*=\s*\w+|COLLATE\s*=\s*\w+|\s|;)*/gi

        let match: RegExpExecArray | null
        while ((match = createTableRegex.exec(sql)) !== null) {
            const tableName = match[1]
            const body = match[2]

            const columns: SqlColumn[] = []
            const parts = splitTopLevelCommas(body)

            for (const partRaw of parts) {
                const part = partRaw.trim()
                if (!part) continue

                if (/^(PRIMARY\s+KEY|UNIQUE\s*\(|KEY\s+|INDEX\s+|CONSTRAINT\s+|FOREIGN\s+KEY)/i.test(part)) {
                    continue
                }

                const col = parseColumnLine(part)
                if (col) columns.push(col)
            }

            const fields: ParserField[] = columns
                .filter(c => !c.isPrimary)
                .map(c => {
                    const { parser } = mapSqlType(c.type)
                    return {
                        key: snakeCase(c.name),
                        originalKey: c.name,
                        type: parser,
                        value: c.notNull ? c.defaultValue ?? '' : null,
                    } as ParserField
                })

            // Detect primary key for the id
            const pk = columns.find(c => c.isPrimary)
            if (pk) {
                const { parser } = mapSqlType(pk.type)
                fields.unshift({
                    key: 'id',
                    originalKey: pk.name,
                    type: parser,
                    value: 0,
                } as ParserField)
            }

            schemas.push({
                name: pascalCase(tableName),
                fields,
            })
        }

        if (schemas.length === 0) {
            throw new Error('No CREATE TABLE statement found.')
        }
        return schemas
    }

    return { parse }
}

const splitTopLevelCommas = (input: string): string[] => {
    const result: string[] = []
    let depth = 0
    let current = ''
    let inString: string | null = null
    for (let i = 0; i < input.length; i++) {
        const ch = input[i]
        if (inString) {
            current += ch
            if (ch === inString && input[i - 1] !== '\\') inString = null
            continue
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            inString = ch
            current += ch
            continue
        }
        if (ch === '(') depth++
        if (ch === ')') depth--
        if (ch === ',' && depth === 0) {
            result.push(current)
            current = ''
        } else {
            current += ch
        }
    }
    if (current.trim()) result.push(current)
    return result
}

const parseColumnLine = (line: string): SqlColumn | null => {
    const tokens = line.split(/\s+/)
    if (tokens.length < 2) return null
    const name = stripQuotes(tokens[0])
    if (!name) return null

    const typeToken = tokens[1]
    const rest = line.slice(line.indexOf(typeToken) + typeToken.length).trim()

    const upper = rest.toUpperCase()
    const notNull = /\bNOT\s+NULL\b/i.test(upper)
    const unique = /\bUNIQUE\b/i.test(upper)
    const isPrimary = /\bPRIMARY\s+KEY\b/i.test(upper)
    const defaultMatch = rest.match(/DEFAULT\s+([^,]+?)(?=\s+(?:NOT\s+NULL|UNIQUE|PRIMARY|DEFAULT)\b|$)/i)
    const defaultValue = defaultMatch ? cleanDefault(defaultMatch[1].trim()) : null

    return { name, type: typeToken, notNull, unique, isPrimary, defaultValue }
}
