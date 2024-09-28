// composables/useSchemaBP.js
import SchemaBP from '../lib/schemaBP'

export const useSchemaBP = (parsedJsonLd) => {
  const schemabp = new SchemaBP(parsedJsonLd)

  const toLaravelCode = () => schemabp.toLaravelCode()
  const toPrismaCode = () => schemabp.toPrismaCode()

  return { toLaravelCode, toPrismaCode }
}
