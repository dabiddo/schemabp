// lib/utils.js

export const toSnakeCase = (str: string) => {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Handle camelCase
        .replace(/[\s-]+/g, '_')                // Replace spaces/hyphens with underscores
        .toLowerCase();                         // This prevents U_S_E_R
}

export const toPascalCase = (str: string) => {
    return str
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/^(.)/, (m, chr) => chr.toUpperCase());
}
