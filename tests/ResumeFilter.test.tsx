import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vite-plus/test';
import ResumeFilter from '../src/components/ResumeFilter';
import type { Role } from '../src/lib/roles';

const roles: Role[] = [
  {
    id: 'now',
    plate: 'K',
    title: 'Full Stack Developer',
    company: 'Studio A',
    location: 'Denver, CO',
    start: '2022-10',
    bullets: ['Builds accessible sites.'],
    tags: ['development', 'accessibility'],
  },
  {
    id: 'agency',
    plate: 'Y',
    title: 'Front-End Developer',
    company: 'Agency B',
    location: 'Denver, CO',
    start: '2019-11',
    end: '2022-10',
    bullets: ['Built WordPress sites.'],
    tags: ['development', 'design'],
  },
  {
    id: 'shop',
    plate: 'C',
    title: 'Operations Manager',
    promotions: 'Assistant → Manager',
    company: 'Print Shop C',
    location: 'Denver, CO',
    start: '2006-11',
    end: '2015-02',
    bullets: ['Ran production.'],
    tags: ['print'],
  },
];

afterEach(cleanup);

const button = (name: string) => screen.getByRole('button', { name });
const roleTitles = () =>
  within(screen.getAllByRole('list')[0]!)
    .getAllByRole('heading', { level: 3 })
    .map((h) => h.textContent);

describe('ResumeFilter', () => {
  test('server render includes every role, so the résumé works without JavaScript', () => {
    const html = renderToString(<ResumeFilter roles={roles} />);
    for (const role of roles) expect(html).toContain(role.title);
  });

  test('starts with all roles shown and "All" pressed', () => {
    render(<ResumeFilter roles={roles} />);
    expect(roleTitles()).toEqual([
      'Full Stack Developer',
      'Front-End Developer',
      'Operations Manager',
    ]);
    expect(button('All').getAttribute('aria-pressed')).toBe('true');
    expect(button('Print').getAttribute('aria-pressed')).toBe('false');
  });

  test('buttons are grouped under a visible label', () => {
    render(<ResumeFilter roles={roles} />);
    const group = screen.getByRole('group', { name: 'Filter by focus' });
    expect(
      within(group)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['All', 'Development', 'Accessibility', 'Design', 'Print']);
  });

  test('pressing a tag filters roles and updates aria-pressed', () => {
    render(<ResumeFilter roles={roles} />);
    fireEvent.click(button('Print'));
    expect(roleTitles()).toEqual(['Operations Manager']);
    expect(button('Print').getAttribute('aria-pressed')).toBe('true');
    expect(button('All').getAttribute('aria-pressed')).toBe('false');
  });

  test('multiple tags combine with OR', () => {
    render(<ResumeFilter roles={roles} />);
    fireEvent.click(button('Accessibility'));
    fireEvent.click(button('Print'));
    expect(roleTitles()).toEqual(['Full Stack Developer', 'Operations Manager']);
  });

  test('pressing a tag again un-presses it', () => {
    render(<ResumeFilter roles={roles} />);
    fireEvent.click(button('Design'));
    fireEvent.click(button('Design'));
    expect(button('Design').getAttribute('aria-pressed')).toBe('false');
    expect(button('All').getAttribute('aria-pressed')).toBe('true');
    expect(roleTitles()).toHaveLength(3);
  });

  test('"All" clears the selection', () => {
    render(<ResumeFilter roles={roles} />);
    fireEvent.click(button('Print'));
    fireEvent.click(button('All'));
    expect(roleTitles()).toHaveLength(3);
  });

  test('a polite status region announces the result count', () => {
    render(<ResumeFilter roles={roles} />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Showing all 3 roles');
    fireEvent.click(button('Development'));
    expect(status.textContent).toBe('Showing 2 of 3 roles');
  });

  describe('with element-scoped view transitions', () => {
    // jsdom has no view transitions, so every other test covers the instant fallback.
    // Here a stand-in records which element started the transition and runs the update.
    const scopes: Element[] = [];
    let titlesInsideUpdate: (string | null)[] = [];

    function stubTransitions() {
      Object.defineProperty(Element.prototype, 'startViewTransition', {
        configurable: true,
        value: vi.fn(function (this: Element, update: () => void) {
          scopes.push(this);
          update();
          titlesInsideUpdate = roleTitles();
          return { ready: Promise.reject(new Error('skipped')) };
        }),
      });
    }

    afterEach(() => {
      delete (Element.prototype as { startViewTransition?: unknown }).startViewTransition;
      scopes.length = 0;
      titlesInsideUpdate = [];
    });

    test('scopes the transition to the list, not the document', () => {
      stubTransitions();
      render(<ResumeFilter roles={roles} />);
      fireEvent.click(button('Print'));
      expect(scopes).toHaveLength(1);
      expect(scopes[0]).toBe(screen.getAllByRole('list')[0]);
    });

    test('commits the new list inside the transition callback', () => {
      stubTransitions();
      render(<ResumeFilter roles={roles} />);
      fireEvent.click(button('Print'));
      // flushSync: the DOM is already filtered when the browser would take its snapshot.
      expect(titlesInsideUpdate).toEqual(['Operations Manager']);
      fireEvent.click(button('All'));
      expect(titlesInsideUpdate).toHaveLength(3);
    });

    test('a skipped transition (rapid clicks) still leaves the right state', async () => {
      stubTransitions();
      render(<ResumeFilter roles={roles} />);
      fireEvent.click(button('Design'));
      fireEvent.click(button('Print'));
      await Promise.resolve(); // let the rejected `ready` settle; it must not throw
      expect(roleTitles()).toEqual(['Front-End Developer', 'Operations Manager']);
    });
  });

  test('the plate colour chip is hidden from assistive tech', () => {
    render(<ResumeFilter roles={roles} />);
    expect(screen.getByText('K plate · Development', { exact: false })).toBeTruthy();
    const chips = document.querySelectorAll('[aria-hidden="true"]');
    expect(chips).toHaveLength(roles.length);
  });
});
