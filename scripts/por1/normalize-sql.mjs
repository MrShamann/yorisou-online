// POR-1 M1-A — erase one specific formatting freedom from boolean expressions.
//
// THE OBSERVATION THAT MADE THIS NECESSARY.
//
// A CHECK constraint read out of Preview renders as
//
//     ... OR (((char_length(d) >= 1) AND (char_length(d) <= 200)) AND (d !~ '@') AND (d !~ '\s'))
//
// but the very same constraint, re-created from that exact text and read back, renders as
//
//     ... OR ((char_length(d) >= 1) AND (char_length(d) <= 200) AND (d !~ '@') AND (d !~ '\s'))
//
// The parser flattens a nested AND into the enclosing AND chain, so the grouping the original
// author typed survives in the source database and disappears the moment it round-trips. Both were
// observed on PostgreSQL 17.10, so this is not a version artifact — it is what re-parsing does.
//
// A contract that compares these as unequal reports drift on every promotion forever. A contract
// that compares raw text with all parentheses stripped would accept a genuine precedence change.
// This does neither: it removes ONLY the parentheses whose removal is guaranteed by associativity —
// a parenthesized group whose own top-level operator is the same as the operator of the chain it
// sits in. `(A AND B) AND C` becomes `A AND B AND C`; `(A OR B) AND C` is left completely alone.
//
// Everything else — operators, operands, literals, bounds, casts, column names — is untouched, so a
// constraint that actually changed still fails the comparison.

/**
 * Split `text` at top-level occurrences (depth 0, outside string literals) of ` AND ` / ` OR `.
 * Returns null when there is no top-level boolean operator.
 */
function splitTopLevel(text) {
  let depth = 0;
  let inString = false;
  const parts = [];
  let operator = null;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      // '' is an escaped quote inside a SQL string literal.
      if (ch === "'") {
        if (text[i + 1] === "'") i += 1;
        else inString = false;
      }
      continue;
    }
    if (ch === "'") { inString = true; continue; }
    if (ch === "(") { depth += 1; continue; }
    if (ch === ")") { depth -= 1; continue; }
    if (depth !== 0) continue;

    const rest = text.slice(i);
    for (const candidate of ["AND", "OR"]) {
      if (!rest.startsWith(`${candidate} `)) continue;
      // Must be preceded by whitespace to be an operator rather than part of an identifier.
      if (i === 0 || !/\s/.test(text[i - 1])) continue;
      if (operator && operator !== candidate) return null; // mixed operators: precedence matters
      operator = candidate;
      parts.push(text.slice(start, i).trim());
      i += candidate.length;
      start = i + 1;
      break;
    }
  }

  if (!operator) return null;
  parts.push(text.slice(start).trim());
  return { operator, parts };
}

/** True when `text` is exactly one parenthesized group, e.g. `(a AND b)`. */
function isWrapped(text) {
  if (!text.startsWith("(") || !text.endsWith(")")) return false;
  let depth = 0;
  let inString = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (ch === "'") {
        if (text[i + 1] === "'") i += 1;
        else inString = false;
      }
      continue;
    }
    if (ch === "'") { inString = true; continue; }
    if (ch === "(") depth += 1;
    else if (ch === ")") {
      depth -= 1;
      if (depth === 0 && i !== text.length - 1) return false;
    }
  }
  return depth === 0;
}

/**
 * Recursively flatten associative boolean nesting.
 *
 * Only ever removes a paren pair; never reorders, never rewrites an operand, never touches a group
 * whose operator differs from its parent's.
 */
export function normalizeBooleanExpression(text) {
  const input = String(text ?? "").trim();
  if (!input) return input;

  const split = splitTopLevel(input);
  if (!split) {
    // A single term. If it is wrapped, normalize the inside and keep the wrapper — dropping it here
    // could change how the caller's chain parses.
    if (isWrapped(input)) return `(${normalizeBooleanExpression(input.slice(1, -1))})`;
    return input;
  }

  const flattened = [];
  for (const part of split.parts) {
    const normalizedPart = normalizeBooleanExpression(part);
    if (isWrapped(normalizedPart)) {
      const inner = normalizedPart.slice(1, -1).trim();
      const innerSplit = splitTopLevel(inner);
      // THE ONLY REMOVAL: same operator as the chain this operand sits in.
      if (innerSplit && innerSplit.operator === split.operator) {
        flattened.push(inner);
        continue;
      }
    }
    flattened.push(normalizedPart);
  }
  return flattened.join(` ${split.operator} `);
}

/**
 * Normalize a `pg_get_constraintdef` / `pg_get_indexdef` string.
 *
 * The boolean flattening is applied to the predicate only; the statement scaffolding around it
 * (CHECK / WHERE / USING) is left exactly as PostgreSQL rendered it.
 */
export function normalizeDefinition(definition) {
  const text = String(definition ?? "").replace(/\s+/g, " ").trim();
  return text.replace(/\b(CHECK|WHERE)\s*(\(.*\))\s*$/, (_, keyword, expr) => {
    const inner = isWrapped(expr) ? expr.slice(1, -1) : expr;
    return `${keyword} (${normalizeBooleanExpression(inner)})`;
  });
}
