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