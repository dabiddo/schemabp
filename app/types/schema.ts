export type ParserField = {
    key: string;
    originalKey: string;
    // Union type to strictly define our supported types
    type: 'string' | 'number' | 'boolean' | 'date' | 'object';
    value: any;
}

export type ParserSchema = {
    name: string;
    fields: ParserField[];
}

export type ModelOutput = {
    name: string;
    model: string;
    migration: string;
}