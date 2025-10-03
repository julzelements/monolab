import { MonologueParameters } from './decoder';

export interface ParameterDifference {
  path: string;
  before: any;
  after: any;
}

export interface DiffOptions {
  /** If true, include unchanged primitive leaves with includeUnchanged marker */
  includeUnchanged?: boolean;
  /** Maximum depth (default unlimited) */
  maxDepth?: number;
}

function isObject(val: any) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function buildPath(parent: string, key: string | number) {
  return parent ? `${parent}.${key}` : String(key);
}

export function diffMonologueParameters(a: MonologueParameters, b: MonologueParameters, options: DiffOptions = {}): ParameterDifference[] {
  const diffs: ParameterDifference[] = [];
  const { includeUnchanged = false, maxDepth } = options;

  function walk(av: any, bv: any, path: string, depth: number) {
    if (maxDepth !== undefined && depth > maxDepth) return;
    // Identical (using strict equality for primitives & reference check for objects)
    if (av === bv) {
      if (includeUnchanged && (typeof av !== 'object' || av === null)) {
        diffs.push({ path, before: av, after: bv });
      }
      return;
    }

    // If either is primitive or types differ -> record direct diff
    const aObj = isObject(av);
    const bObj = isObject(bv);
    if (!aObj || !bObj) {
      diffs.push({ path, before: av, after: bv });
      return;
    }

    // Both objects: union of keys
    const keys = new Set([...Object.keys(av || {}), ...Object.keys(bv || {})]);
    for (const key of keys) {
      walk(av?.[key], bv?.[key], buildPath(path, key), depth + 1);
    }
  }

  walk(a, b, '', 0);
  return diffs;
}
