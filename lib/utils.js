// lib/utils.js

export const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '')
}

export const toPascalCase = (str) => {
    return str.replace(/(?:^|_)(\w)/g, (_, c) => c.toUpperCase())
}
