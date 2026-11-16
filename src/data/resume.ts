// Content that only the printable resume (/resume/print/ → resume.pdf) uses.
// Roles come from the `experience` collection and project lines from `projects`,
// so the site and the PDF can't drift apart.
//
// Tailor per application: `summary` and the order of `skills` are the parts to edit.

export const resume = {
  headline: 'Front-End Developer',
  location: 'Littleton, CO',
  website: 'mathewwood.com',

  /** Roles that started in or after this year get full detail; earlier ones are condensed. */
  detailFromYear: 2019,

  summary:
    'Front-end developer with seven years building accessible, responsive WordPress sites from Figma designs, ' +
    'backed by two decades in graphic design and print production. Builds custom themes with PHP templating ' +
    '(Timber/Twig), Sass and vanilla JavaScript using native DOM APIs, and delivers to WCAG 2.1 AA. Works ' +
    'alongside designers, developers and QA to turn designs into clean, modular, maintainable front ends, ' +
    'and brings years of direct client communication by email, phone and in person.',

  /** Exact terms job postings use. Only list what the experience or projects below back up. */
  skills: [
    {
      group: 'Languages',
      items: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Sass/SCSS', 'PHP', 'TypeScript'],
    },
    {
      group: 'Front-end',
      items: [
        'Native DOM APIs',
        'Semantic HTML',
        'Responsive design',
        'CSS Grid',
        'Flexbox',
        'CSS custom properties',
        'Design tokens',
        'React (JSX)',
      ],
    },
    {
      group: 'CMS and templating',
      items: [
        'WordPress custom themes',
        'Timber/Twig',
        'Advanced Custom Fields (ACF)',
        'FacetWP',
        'Events Calendar Pro',
      ],
    },
    {
      group: 'Accessibility and quality',
      items: [
        'Web Content Accessibility Guidelines (WCAG) 2.1 AA',
        'ARIA',
        'Keyboard testing',
        'WAVE',
        'axe',
        'Cross-browser and device testing',
        'Site performance',
      ],
    },
    {
      group: 'Tools',
      items: [
        'Git',
        'Gulp',
        'Node.js',
        'Vite',
        'webpack',
        'Astro',
        'pnpm',
        'Figma',
        'Sketch',
        'Adobe Creative Cloud',
        'Wrike',
      ],
    },
  ],

  projects: [
    {
      name: 'mathewwood.com',
      context: 'Personal portfolio',
      stack: 'Astro, React, TypeScript, Vite+',
      bullets: [
        'Static Astro site with React islands, strict TypeScript and typed content collections; the resume page and this PDF are generated from the same content files.',
        'Unit tests with Vitest and continuous integration on GitHub Actions; built to WCAG 2.2 AA with keyboard, screen reader and automated checks.',
        'Source code: github.com/woodmatt/mathewwood.com',
      ],
    },
  ],

  earlierCareerIntro:
    'Graphic design, print production and operations leadership, including managing staff, vendors and scheduling for a commercial print shop.',

  education: {
    degree: 'A.A.S., Visual Communications',
    school: 'Colorado Institute of Art, Denver, CO',
  },
} as const;
