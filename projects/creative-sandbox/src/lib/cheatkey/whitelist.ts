export const ALLOWED_TABLES = new Set([
  "demo_todos",
  "demo_orders",
  "demo_feedback",
  "demo_notes",
]);

export function isAllowedTable(name: string): boolean {
  return ALLOWED_TABLES.has(name);
}
