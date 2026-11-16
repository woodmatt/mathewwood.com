---
title: Colorado Geological Survey
client: Colorado Geological Survey
year: 2024
role: Front-end development
summary: Rebuilt a state agency site around a 2,000+ publication archive, with faceted filtering and free downloads that no longer need a checkout.
featured: true
order: 1
stack: [Timber / Twig, JavaScript, Sass, WordPress, FacetWP]
tags: [development, accessibility]
visibility: public
liveUrl: https://coloradogeologicalsurvey.org/
cover: ../../assets/projects/colorado-geological-survey/publications-filtering.webp
coverAlt: The CGS publications archive filtered to Engineering Geology, with a category filter sidebar showing result counts, an active-filter chip, and a grid of publication thumbnails.
gallery:
  - src: ../../assets/projects/colorado-geological-survey/homepage.webp
    alt: The Colorado Geological Survey homepage, with a navy header, a dropdown navigation menu, a site search field, and a mountain lake photo under the agency introduction.
    caption: Homepage after the redesign.
  - src: ../../assets/projects/colorado-geological-survey/cores-results.webp
    alt: The CORES Data results table listing wells by name, company, basin, field and location, with Slabs and Photos attribute tags and a link to each record.
    caption: CORES, the core repository search we built for CGS in 2025.
---

## Problem

The Colorado Geological Survey's site was more than five years old, and both its design and its functionality had fallen behind. It held hundreds of pages and more than 900 reports, maps and datasets, and visitors found the volume overwhelming. Getting a publication was harder than it should have been: even free downloads went through a WooCommerce checkout that required an account.

## My role

I was the front-end developer on a four-person Fireant Studios team, alongside a designer, a senior developer and a QA lead. Working from the designer's Figma files, I:

- built the module structure in Twig templates
- styled the entire site in Sass
- wrote the JavaScript for menus, accordions and other interactive components
- worked with the senior developer on the tabbed page template and the JavaScript that drives it

## Approach

We split the build into three layers: reusable modules, navigation, and page templates. With the modules built first, most page templates became a matter of assembly.

The hardest part was the tabbed template, which puts content on the left and tabs on the right, generated from each page's content. The tabs had to stay dynamic and work at every breakpoint. On small screens they stack above the featured image, so they stay reachable without a separate mobile pattern.

The biggest constraint was legacy content: hundreds of pages and 900+ publications, far too much to review by hand. The senior developer imported the old site, so I tested every module and template against real migrated content throughout development instead of clean sample data.

The publications archive uses FacetWP for filtering by category, with result counts that update as filters change. The senior developer set it up; I styled the filters and worked on them through the styling and QA passes.

## Accessibility

Colorado requires state agency sites to meet WCAG 2.1 AA, so accessibility was a launch requirement.

- Keyboard support for the navigation, the tabbed templates and the archive filters
- Tabs built as native `<button>` elements, so Enter activates a tab, and focus moves through the open tab's content before reaching the next tab
- Color contrast checked throughout, with most issues resolved during design
- WAVE and axe testing during development
- A pre-launch audit with both manual and automated testing

## Outcome

The site launched in December 2024.

- Publications download free and directly, with no account or checkout.
- The archive has grown to more than 2,000 publications, with new ones added every month.
- CGS kept Fireant on as a partner and hired the team in 2025 to build CORES, a searchable map of the core repository that CGS runs with the Colorado School of Mines.
