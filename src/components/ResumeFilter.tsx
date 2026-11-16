import { useId, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { formatRange } from '../lib/dates';
import { availableTags, filterRoles, type Role } from '../lib/roles';
import { PLATE_COLOR, PLATE_LABEL, TAG_LABEL, type Tag } from '../lib/taxonomy';
import styles from './ResumeFilter.module.css';

interface Props {
  /** Roles in display order (newest first). */
  roles: Role[];
}

type Selection = ReadonlySet<Tag>;

/** Element-scoped view transitions (Chromium 147+); not yet in TypeScript's DOM types. */
type ScopedTransitionElement = Element & {
  startViewTransition(update: () => void): { ready: Promise<void> };
};

const supportsScopedTransition = (el: Element | null): el is ScopedTransitionElement =>
  el !== null && 'startViewTransition' in el;

/**
 * Résumé timeline with tag filters. Astro server-renders it with every role
 * visible, so the full résumé is in the HTML; hydration only adds filtering.
 * Toggle buttons use `aria-pressed`; selected tags combine with OR.
 *
 * Filtering animates roles in place with a view transition scoped to the list,
 * so the filter buttons and the rest of the page stay interactive while it runs.
 * Where scoped transitions aren't supported the list simply updates.
 */
export default function ResumeFilter({ roles }: Props) {
  const [selected, setSelected] = useState<Selection>(() => new Set());
  const labelId = useId();
  const listRef = useRef<HTMLOListElement>(null);

  const tags = availableTags(roles);
  const visible = filterRoles(roles, selected);

  function update(next: (current: Selection) => Selection) {
    const list = listRef.current;
    if (!supportsScopedTransition(list)) {
      setSelected(next);
      return;
    }
    // flushSync makes React commit inside the callback, so the browser snapshots the new DOM.
    const transition = list.startViewTransition(() => flushSync(() => setSelected(next)));
    // A quick second click skips the running transition and rejects `ready`; that's expected.
    transition.ready.catch(() => {});
  }

  function toggle(tag: Tag) {
    update((current) => {
      const next = new Set(current);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const status =
    selected.size === 0
      ? `Showing all ${roles.length} roles`
      : `Showing ${visible.length} of ${roles.length} roles`;

  return (
    <>
      <div className={styles.toolbar}>
        <p id={labelId} className={`label ${styles.toolbarLabel}`}>
          Filter by focus
        </p>
        <div role="group" aria-labelledby={labelId} className={styles.buttons}>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={selected.size === 0}
            onClick={() => update(() => new Set())}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.toggle}
              aria-pressed={selected.has(tag)}
              onClick={() => toggle(tag)}
            >
              {TAG_LABEL[tag]}
            </button>
          ))}
        </div>
        <p role="status" className={`label ${styles.status}`}>
          {status}
        </p>
      </div>

      <ol ref={listRef} className={styles.timeline}>
        {visible.map((role) => (
          <li key={role.id} className={styles.entry}>
            <div className={styles.when}>
              <span className={`label ${styles.plate}`}>
                <span
                  className={styles.chip}
                  style={{ '--c': PLATE_COLOR[role.plate] } as CSSProperties}
                  aria-hidden="true"
                />
                {role.plate} plate · {PLATE_LABEL[role.plate]}
              </span>
              <span className={styles.dates}>{formatRange(role.start, role.end)}</span>
            </div>
            <div className={styles.what}>
              <h3>{role.title}</h3>
              <p className={styles.org}>
                {role.company} · {role.location}
              </p>
              {role.promotions && <p className={styles.promos}>{role.promotions}</p>}
              <ul>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
