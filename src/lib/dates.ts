const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2022-10" → "Oct 2022", "1998" → "1998". */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split('-');
  if (!month) return year ?? value;
  const name = MONTHS.at(Number(month) - 1);
  if (!name) throw new Error(`Invalid month in "${value}"`);
  return `${name} ${year}`;
}

/** "Oct 2022 – Present" style range; omitting end means current. */
export function formatRange(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Present'}`;
}

/** Sort key so newer roles come first. "2022-10" → 202210, "1998" → 199800. */
export function sortKey(value: string): number {
  const [year = '0', month = '00'] = value.split('-');
  return Number(year) * 100 + Number(month);
}

export function newestFirst<T extends { start: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => sortKey(b.start) - sortKey(a.start));
}
