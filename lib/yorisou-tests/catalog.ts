import { c02CatalogEntry } from "./c02";
import { f01CatalogEntry } from "./f01";
import { f02CatalogEntry } from "./f02";

export const PHASE1_TEST_CATALOG = [
  c02CatalogEntry,
  f01CatalogEntry,
  f02CatalogEntry,
] as const;
