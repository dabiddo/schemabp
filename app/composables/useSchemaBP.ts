import SchemaBP from '~/lib/schemaBP'
import { useSchemaParser } from './useSchemaParser'
import { useSqlParser } from './useSqlParser'

export const useSchemaBP = () => {
    const { parse: parseJson } = useSchemaParser()
    const { parse: parseSql } = useSqlParser()

    const getGenerators = (rawInput: string, mode: 'json' | 'sql' = 'json') => {
        const normalizedSchema = mode === 'sql' ? parseSql(rawInput) : parseJson(rawInput)
        const schemabp = new SchemaBP(normalizedSchema)

        return {
            toPhpDtoCode: () => schemabp.toPhpDtoCode(),
            toLaravelCode: () => schemabp.toLaravelCode(),
            toDrizzleCode: () => schemabp.toDrizzleCode(),
            toPrismaCode: () => schemabp.toPrismaCode(),
            sqlToLaravelCode: () => schemabp.sqlToLaravelCode(),
        }
    }

    return { getGenerators }
}
