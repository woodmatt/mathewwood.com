---
title: Humane Colorado
client: Humane Colorado
year: 2025
role: Front-end development
summary: Launched the new Humane Colorado brand on a fixed public date, with synced listings of adoptable pets, faceted filtering and an events calendar.
order: 3
stack: [Timber / Twig, JavaScript, Sass, WordPress, FacetWP, Events Calendar Pro]
tags: [development, design, accessibility]
visibility: public
liveUrl: https://humanecolorado.org/
cover: ../../assets/projects/humane-colorado/adoptable-dogs.webp
coverAlt: The Adoptable dogs listing, with a filter sidebar for age, sex, weight and location and a grid of dog cards showing each name, photo, shelter location, breed and age.
gallery:
  - src: ../../assets/projects/humane-colorado/homepage.webp
    alt: The Humane Colorado homepage hero reading Paws for good, with donate and share-your-story buttons beside a circular photo of a cat.
    caption: Homepage, launched with the new brand.
  - src: ../../assets/projects/humane-colorado/events-calendar.webp
    alt: The Events Calendar in month view, with event search, list, month and day view toggles, category, venue and city filters, and events such as vaccine clinics and training classes on their dates.
    caption: The events calendar, filterable by category, venue and city.
---

## Problem

The Denver Dumb Friends League was renaming itself Humane Colorado, a full company rebrand of a historic name. An outside agency created the new logo, typefaces, colors and print materials, and kept the rebrand secret until launch. The new website had to carry that brand from day one and help people find adoptable pets, services and events.

## My role

I was the front-end developer on a four-person Fireant Studios team, alongside a designer, a senior developer and a QA lead. Our designer created the site in Figma, following the agency's brand guidelines, and I implemented it. I:

- built the module structure in Twig templates
- styled the entire site in Sass, holding strictly to the brand guidelines
- wrote the JavaScript for menus, accordions and other interactive components
- styled the Events Calendar Pro plugin and the FacetWP filters

The senior developer set up the pet data sync and the initial FacetWP filtering.

## Approach

We split the build into three layers: reusable modules, navigation, and page templates.

The hard constraint was the date. The rebrand had a fixed public launch, with TV, radio, billboard and mail advertising pointing people to the new site that day. There was no room to slip.

Adoptable pets come from an external Chameleon database with no API. The senior developer set up a sync that runs on a schedule, and FacetWP filters the results. Because shelter records vary, I styled the pet cards for incomplete data: a missing photo or missing details still produces a clean, consistent card.

## Accessibility

The site was built to WCAG 2.1 AA.

- Keyboard support across the whole site, including the navigation
- Color contrast checked throughout, with most issues resolved during design
- WAVE and axe testing during development
- A pre-launch audit with both manual and automated testing

## Outcome

The site launched in March 2025, on the rebrand date and alongside the media campaign.

- Adoptable pets update automatically from the shelter database.
- Staff publish events through the events calendar.
- Humane Colorado has brought Fireant back for several follow-up projects, including a navigation redesign in August 2026 that added menu items and functionality.
