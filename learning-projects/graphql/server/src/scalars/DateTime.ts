// ─────────────────────────────────────────────────────────────────────────────
// DateTime.ts — Custom Scalar
//
// GraphQL has 5 built-in scalars: String, Int, Float, Boolean, ID.
// Custom scalars let you add your own primitive types with validation.
//
// A scalar needs 3 methods:
//  • serialize    — converts the internal value → what the client receives (JSON)
//  • parseValue   — converts client-sent value (variables) → internal value
//  • parseLiteral — converts client-sent value (inline in query) → internal value
//
// Our DateTime stores ISO 8601 strings internally and sends them as strings.
// ─────────────────────────────────────────────────────────────────────────────

import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601 date-time string (e.g. "2024-01-15T10:30:00Z")',

  // Called when sending data TO the client. Validates the value we stored.
  serialize(value: unknown): string {
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    throw new Error(`DateTime cannot serialize value: ${JSON.stringify(value)}`);
  },

  // Called when the client sends a value via VARIABLES.
  parseValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('DateTime must be a string');
    }
    if (isNaN(Date.parse(value))) {
      throw new Error(`DateTime: invalid date string "${value}"`);
    }
    return value;
  },

  // Called when the client sends a value INLINE in the query (literal).
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error('DateTime must be a string literal');
    }
    if (isNaN(Date.parse(ast.value))) {
      throw new Error(`DateTime: invalid date string "${ast.value}"`);
    }
    return ast.value;
  },
});
