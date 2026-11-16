import { describe, expect, test } from 'vite-plus/test';
import { formatRange, formatYearMonth, newestFirst, sortKey } from '../src/lib/dates';

describe('formatYearMonth', () => {
  test('formats year and month', () => {
    expect(formatYearMonth('2022-10')).toBe('Oct 2022');
  });
  test('passes a bare year through', () => {
    expect(formatYearMonth('1998')).toBe('1998');
  });
  test('rejects an impossible month', () => {
    expect(() => formatYearMonth('2022-13')).toThrow();
  });
});

describe('formatRange', () => {
  test('open-ended range reads as Present', () => {
    expect(formatRange('2022-10')).toBe('Oct 2022 – Present');
  });
  test('closed range', () => {
    expect(formatRange('1998', '2001')).toBe('1998 – 2001');
  });
});

describe('newestFirst', () => {
  test('orders mixed year and year-month values', () => {
    const roles = [
      { start: '1998' },
      { start: '2022-10' },
      { start: '2006-11' },
      { start: '2003' },
    ];
    expect(newestFirst(roles).map((r) => r.start)).toEqual(['2022-10', '2006-11', '2003', '1998']);
  });
  test('a bare year sorts before any month of that year', () => {
    expect(sortKey('2015')).toBeLessThan(sortKey('2015-02'));
  });
});
