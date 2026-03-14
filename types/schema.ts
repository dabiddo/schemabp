export interface ModelOutput {
    model: string;
    migration: string;
}

export interface Column {
    name: string;
    type: string;
    length: string | null;
    nullable: boolean;
    unique: boolean;
}

export interface Field {
    name: string;
    type: string;
}

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