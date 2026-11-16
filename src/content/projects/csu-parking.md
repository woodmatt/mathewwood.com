---
title: CSU Parking
client: Colorado State University
year: 2025
role: Front-end development
summary: Rebuilt CSU's parking and transportation site to the university brand, with an admin-managed events calendar and live garage availability.
order: 2
stack: [Timber / Twig, JavaScript, Sass, WordPress, Events Calendar Pro]
tags: [development, design, accessibility]
visibility: public
liveUrl: https://pts.colostate.edu/
cover: ../../assets/projects/csu-parking/homepage.webp
coverAlt: The CSU Transportation homepage, with the Colorado State University header and a full-width video hero of a campus bus titled Colorado State University Transportation.
gallery:
  - src: ../../assets/projects/csu-parking/live-parking.webp
    alt: The Live Parking Information panel showing available spaces for Lake Street Garage and South College Garage as circular gauges by permit type.
    caption: Live garage availability, styled as circular gauges.
  - src: ../../assets/projects/csu-parking/navigation-menu.webp
    alt: The open site menu, organized into Active Transportation, Find Your Way Around CSU, Fleet Services and Parking columns of links.
    caption: The mega menu, with columns the client manages in WordPress.
---

## Problem

CSU's parking and transportation site sat apart from the main university website, and its branding no longer matched. The university was bringing all of its sub-sites in line with the CSU brand. The parking team also needed an easier way to post information for special events, such as football games, which the old site made hard to update.

## My role

I was the front-end developer on a four-person Fireant Studios team, alongside a designer, a senior developer and a QA lead. Working from the designer's Figma files, which were built on CSU's brand guidelines, I:

- built the module structure in Twig templates
- styled the entire site in Sass
- wrote the JavaScript for menus, accordions and other interactive components
- styled the Events Calendar Pro plugin to match the brand
- styled the live parking tracker, turning garage data into circular charts that match the design

The senior developer wrote the JavaScript that fetches the parking data from the garage API.

## Approach

We split the build into three layers: reusable modules, navigation, and page templates.

The hard part was the brand system. CSU's guidelines call for strict use of more than 10 colors and two typefaces, with accent font pairings that often appear on the same line as the main font, set on accent background colors. Each module offers those font and color choices to site admins, so the flexibility lives in the modules instead of in one-off page styling. Admins can combine the options freely and still stay on brand.

The decorative accent dots and lines also had to be dynamic while staying locked to the site grid, so they line up whatever content a page holds.

## Accessibility

As a public university, CSU requires WCAG 2.1 AA under Colorado state law.

- Keyboard support across the whole site. The mega menu can be tabbed through, and focus returns to its open/close button.
- A video hero, added after launch, with a play/pause control that respects `prefers-reduced-motion`
- Color contrast checked throughout, with most issues resolved during design
- WAVE and axe testing during development
- A pre-launch audit with both manual and automated testing

## Outcome

The site launched in May 2025.

- The parking team now adds events themselves through the events calendar.
- Live availability for two campus garages appears in the site footer.
- CSU hosts and maintains the site, and has brought Fireant back for several follow-up projects, including the accessible video hero.
