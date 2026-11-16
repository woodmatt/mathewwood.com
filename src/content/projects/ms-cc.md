---
title: MS-CC design refresh
client: Minority Serving – Cyberinfrastructure Consortium
year: 2026
role: Front-end development
summary: Redesigned a live site through design tokens without touching its content, and added a multi-chapter Resource Center.
order: 4
stack: [Design tokens, Timber / Twig, Sass, WordPress, ACF, FacetWP]
tags: [development, design, accessibility]
visibility: public
liveUrl: https://ms-cc.org/
cover: ../../assets/projects/ms-cc/homepage.webp
coverAlt: The MS-CC homepage hero reading Accomplishing More Together, with join and learn-more buttons, a photo of a graduate celebrating, and a card linking to community features.
gallery:
  - src: ../../assets/projects/ms-cc/homepage-before.webp
    alt: The MS-CC homepage before the rebrand, with a serif Accomplishing More Together headline, a graduation photo, and a row of membership statistics.
    caption: Before — the homepage prior to the redesign.
  - src: ../../assets/projects/ms-cc/resource-center.webp
    alt: The Resource Center, with topic and resource-type filters on the left and a searchable, sortable table of resources showing name, description, type and related topics.
    caption: New — the Resource Center, filterable by topic and resource type.
---

## Problem

MS-CC's site had been rebuilt in 2023, but by 2026 its design needed to look more modern and more focused on technology. The consortium also needed a way to share resources with its tech education community, which the site had no place for.

## My role

I was the front-end developer on a four-person Fireant Studios team, alongside a designer, a senior developer and a QA lead. Working from the designer's Figma file, I expanded the existing design tokens, revamped the typography system, and updated the modules to deliver the new design. The senior developer set up the multi-chapter Resources section; I helped build it and styled the resource-specific modules and the chapter system.

## Approach

The rule for the redesign was that existing content stayed untouched. Every module kept its ACF field groups and database structure. I added fields where the new design needed them and replaced the styling and layouts around them.

That was possible because the colors, fonts, spacing and grid were already set up as design tokens. I expanded the token set and rebuilt the typography as a more flexible type system, so updating the tokens carried the new design across the whole site with minimal structural change. The work went into the new layouts instead of hunting down hard-coded values.

The new Resource Center lets the client and its users publish single resources and multi-chapter guides, linked to each other and to outside sources. FacetWP handles filtering and sorting. It launched behind a subscription gate and is now fully public.

## Accessibility

The site already met WCAG 2.1 AA, and the redesign and the new Resource Center had to keep it there.

- Keyboard support across the whole site, including the navigation
- Color contrast checked throughout, with most issues resolved during design
- WAVE and axe testing during development
- A pre-launch audit with both manual and automated testing

## Outcome

The redesign launched in spring 2026.

- The whole site moved to the new design with no content migration.
- The consortium now has a public Resource Center that it and its users contribute to.
- MS-CC remains a long-term client, with ongoing maintenance and updates.
