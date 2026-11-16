import { TAGS, type Plate, type Tag } from './taxonomy';

/** One résumé entry, as passed from the `experience` collection to the ResumeFilter island. */
export interface Role {
  id: string;
  plate: Plate;
  title: string;
  promotions?: string;
  company: string;
  location: string;
  start: string;
  end?: string;
  bullets: string[];
  tags: Tag[];
}

/** Tags used by at least one role, in canonical `TAGS` order, so no filter can come up empty. */
export function availableTags(roles: readonly Pick<Role, 'tags'>[]): Tag[] {
  const used = new Set(roles.flatMap((role) => role.tags));
  return TAGS.filter((tag) => used.has(tag));
}

/**
 * Roles matching ANY selected tag. An empty selection means "all roles".
 * Order is preserved, so a newest-first list stays newest-first.
 */
export function filterRoles<T extends Pick<Role, 'tags'>>(
  roles: readonly T[],
  selected: ReadonlySet<Tag>,
): T[] {
  if (selected.size === 0) return [...roles];
  return roles.filter((role) => role.tags.some((tag) => selected.has(tag)));
}
