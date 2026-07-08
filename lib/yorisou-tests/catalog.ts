import { c02CatalogEntry } from "./c02";
import { f01CatalogEntry } from "./f01";
import { f02CatalogEntry } from "./f02";
import { r01CatalogEntry } from "./r01";
import { r04CatalogEntry } from "./r04";
import { s01CatalogEntry } from "./s01";

export const PHASE1_TEST_CATALOG = [
  r01CatalogEntry,
  f01CatalogEntry,
  c02CatalogEntry,
  s01CatalogEntry,
  r04CatalogEntry,
  f02CatalogEntry,
] as const;
