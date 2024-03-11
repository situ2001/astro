import type { AstroIntegration } from 'astro';
import type { z } from 'zod';
import type {
	booleanColumnSchema,
	numberColumnSchema,
	textColumnSchema,
	dateColumnSchema,
	jsonColumnSchema,
	columnSchema,
	tableSchema,
	referenceableColumnSchema,
	indexSchema,
	numberColumnOptsSchema,
	textColumnOptsSchema,
	columnsSchema,
	MaybeArray,
	dbConfigSchema,
} from './schemas.js';

export type Indexes = Record<string, z.infer<typeof indexSchema>>;

export type BooleanColumn = z.infer<typeof booleanColumnSchema>;
export type BooleanColumnInput = z.input<typeof booleanColumnSchema>;
export type NumberColumn = z.infer<typeof numberColumnSchema>;
export type NumberColumnInput = z.input<typeof numberColumnSchema>;
export type TextColumn = z.infer<typeof textColumnSchema>;
export type TextColumnInput = z.input<typeof textColumnSchema>;
export type DateColumn = z.infer<typeof dateColumnSchema>;
export type DateColumnInput = z.input<typeof dateColumnSchema>;
export type JsonColumn = z.infer<typeof jsonColumnSchema>;
export type JsonColumnInput = z.input<typeof jsonColumnSchema>;

export type ColumnType =
	| BooleanColumn['type']
	| NumberColumn['type']
	| TextColumn['type']
	| DateColumn['type']
	| JsonColumn['type'];

export type DBColumn = z.infer<typeof columnSchema>;
export type DBColumnInput =
	| DateColumnInput
	| BooleanColumnInput
	| NumberColumnInput
	| TextColumnInput
	| JsonColumnInput;
export type DBColumns = z.infer<typeof columnsSchema>;
export type DBTable = z.infer<typeof tableSchema>;
export type DBTables = Record<string, DBTable>;
export type DBSnapshot = {
	schema: Record<string, DBTable>;
	version: string;
};

export type DBConfigInput = z.input<typeof dbConfigSchema>;
export type DBConfig = z.infer<typeof dbConfigSchema>;

export type ColumnsConfig = z.input<typeof tableSchema>['columns'];
export type OutputColumnsConfig = z.output<typeof tableSchema>['columns'];

export interface TableConfig<TColumns extends ColumnsConfig = ColumnsConfig>
	// use `extends` to ensure types line up with zod,
	// only adding generics for type completions.
	extends Pick<z.input<typeof tableSchema>, 'columns' | 'indexes' | 'foreignKeys'> {
	columns: TColumns;
	foreignKeys?: Array<{
		columns: MaybeArray<Extract<keyof TColumns, string>>;
		references: () => MaybeArray<z.input<typeof referenceableColumnSchema>>;
	}>;
	indexes?: Record<string, IndexConfig<TColumns>>;
	deprecated?: boolean;
}

interface IndexConfig<TColumns extends ColumnsConfig> extends z.input<typeof indexSchema> {
	on: MaybeArray<Extract<keyof TColumns, string>>;
}

/** @deprecated Use `TableConfig` instead */
export type ResolvedCollectionConfig<TColumns extends ColumnsConfig = ColumnsConfig> =
	TableConfig<TColumns>;

// We cannot use `Omit<NumberColumn | TextColumn, 'type'>`,
// since Omit collapses our union type on primary key.
export type NumberColumnOpts = z.input<typeof numberColumnOptsSchema>;
export type TextColumnOpts = z.input<typeof textColumnOptsSchema>;

export type AstroDbIntegration = AstroIntegration & {
	hooks: {
		'astro:db:setup'?: (options: {
			extendDb: (options: {
				configEntrypoint?: URL | string;
				seedEntrypoint?: URL | string;
			}) => void;
		}) => void | Promise<void>;
	};
};
