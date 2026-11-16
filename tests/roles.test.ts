import { describe, expect, test } from 'vite-plus/test';
import { availableTags, filterRoles } from '../src/lib/roles';
import type { Tag } from '../src/lib/taxonomy';

const roles: { name: string; tags: Tag[] }[] = [
  { name: 'dev', tags: ['development', 'accessibility'] },
  { name: 'agency', tags: ['development', 'design'] },
  { name: 'shop', tags: ['print'] },
];

describe('availableTags', () => {
  test('lists only tags in use, in canonical order', () => {
    expect(availableTags(roles)).toEqual(['development', 'accessibility', 'design', 'print']);
    expect(availableTags([{ tags: ['print', 'design'] }])).toEqual(['design', 'print']);
  });
});

describe('filterRoles', () => {
  test('an empty selection returns every role', () => {
    expect(filterRoles(roles, new Set())).toEqual(roles);
  });
  test('a single tag keeps only matching roles', () => {
    expect(filterRoles(roles, new Set<Tag>(['print'])).map((r) => r.name)).toEqual(['shop']);
  });
  test('multiple tags combine with OR and keep the original order', () => {
    const result = filterRoles(roles, new Set<Tag>(['print', 'accessibility']));
    expect(result.map((r) => r.name)).toEqual(['dev', 'shop']);
  });
  test('does not mutate the input', () => {
    const copy = [...roles];
    filterRoles(roles, new Set<Tag>(['design']));
    expect(roles).toEqual(copy);
  });
});
