import SchemaBP from '~/lib/schemaBP'
import { useSchemaParser } from './useSchemaParser'
//import type { ModelOutput } from '~/types';


export const useSchemaBP = () => {
  const { parse } = useSchemaParser()

  const getGenerators = (rawInput: string) => {
    // 1. Parse/Flatten the input once
    const normalizedSchema = parse(rawInput)

    // 2. Pass the clean schema to the BP logic
    const schemabp = new SchemaBP(normalizedSchema)

    return {
      toPhpDtoCode: () => schemabp.toPhpDtoCode(),
      toLaravelCode: () => schemabp.toLaravelCode(),
    }
  }

  return { getGenerators }
}
