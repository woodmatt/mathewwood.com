---
title: Remedy Medical Properties
client: Remedy Medical Properties
year: 2023
role: Front-end development
summary: Rebuilt an inherited WordPress site to match its existing design exactly, with no design files, and added a filterable team section.
order: 5
stack: [Timber / Twig, JavaScript, Sass, WordPress, FacetWP]
tags: [development]
visibility: public
liveUrl: https://remedymed.com/
cover: ../../assets/projects/remedy-medical-properties/team-filtering.webp
coverAlt: The Meet the people team page, with department filter chips and Asset Management selected, above a row of team member portraits with names and titles.
gallery:
  - src: ../../assets/projects/remedy-medical-properties/portfolio.webp
    alt: The portfolio page, with a filter dropdown above a grid of medical building photos, each with the project name, location and a read-more button.
    caption: The project portfolio, filtered with FacetWP.
  - src: ../../assets/projects/remedy-medical-properties/homepage.webp
    alt: The Remedy homepage hero, a dark green panel with flowing pink and orange line art behind the headline We own, develop, and operate healthcare real estate.
    caption: The homepage, rebuilt to match the original.
---

## Problem

Remedy's WordPress site was built by another agency, which left parts of it unfinished or locked behind proprietary code and would no longer work with them. Remedy wanted the site to look exactly the same, but on a codebase they could keep. They also needed the team section reworked to highlight senior management.

## My role

I was the front-end developer, working with a senior developer and a QA lead. The senior developer set up the new site and brought over the content, media and some JavaScript. With no design file, I rebuilt the front end from the live site itself. I:

- built the module structure in Twig templates
- styled the entire site in Sass
- wrote the JavaScript for menus, accordions and other interactive components
- styled the team section's layout grid and profile modals

The senior developer wrote the team filtering in custom JavaScript.

## Approach

There were no design files or brand guidelines, so the live site was the spec. I measured and inspected it to recover the fonts, spacing, colors and layouts, then rebuilt each piece as a reusable module so the new site matched the old one without carrying over its code.

Projects are a custom post type with field groups for their details, so adding a project means filling in a form and the template does the rest. FacetWP handles project filtering. The team page uses custom filters that put senior management first.

## Accessibility

The client chose not to fund a full accessibility pass. I still wrote semantic markup that works with a keyboard, and spot-checked pages with WAVE and axe during development.

## Outcome

The site launched in summer 2023.

- Remedy owns a maintainable codebase that looks exactly like the site they already had.
- New projects are added through a form instead of custom page building.
- Remedy remains a hosting and maintenance client, and Fireant has since updated its map and content.
