import SchemaBP from '../lib/schemaBP'

import type { ModelOutput } from '~/types';


export const useSchemaBP = (parsedJsonLd: any) => {
  const schemabp = new SchemaBP(parsedJsonLd)

  const toLaravelCode = (): ModelOutput[] => schemabp.toLaravelCode()
  const toPhpDtoCode = (): string[] => schemabp.toPhpDtoCode()
  const toPrismaCode = (): string => schemabp.toPrismaCode()
  const toDrizzleCode = (): string => schemabp.toDrizzleCode()
  const sqlToLaravelCode = (): ModelOutput[] => {
    // For SQL to Laravel, we need to pass the SQL string directly
    // parsedJsonLd in this case is actually the SQL string
    return schemabp.sqlToLaravelCode(parsedJsonLd)
  }

  return { toLaravelCode, toPhpDtoCode, toPrismaCode, toDrizzleCode, sqlToLaravelCode }
}
