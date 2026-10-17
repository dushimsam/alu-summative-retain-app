import { ValueTransformer } from 'typeorm';

// Postgres numeric columns come back as strings, so turn them into numbers.
export const numericTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => (value === null ? null : parseFloat(value)),
};
