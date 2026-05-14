---
title: Healthy.io — marketing & product frontend | Saar Davidson
description: "Next.js marketing properties at Healthy.io: SEO, accessibility, middleware, and maintainability."
eyebrow: HEALTHY.IO
h1: Healthy.io — marketing and product frontend
lead: "I worked on **marketing platforms and landing systems**, and on **frontend across public and patient-facing surfaces in a regulated health-tech company**."
navPrev:
  href: /work/monday-nested-blocks
  label: ← monday.com nested blocks
---

## Context

The work often looked like marketing infrastructure, but the risks were product risks: SEO regressions, accessibility issues, localization bugs, analytics gaps, and broken user journeys.

Sites had to stay fast enough, easy enough to change for campaigns, and predictable for a small frontend team.

## Problem

Marketing velocity and refactors both touched the same routes. Shortcuts showed up later as SEO or accessibility regressions.

## Technical notes

Shared **Next.js** patterns: reusable page shells, clear CMS boundaries, and **middleware** for cross-cutting behavior (country routing, geofencing, redirects) instead of duplicating checks in every page.

We upgraded a large codebase from **Next.js 11 → 12** and used that window to lean on **middleware** for country-specific behavior. That kept geo logic in one place, which was easier to review for SEO and accessibility assumptions and cheaper to maintain when routes changed.

## Risk

Representative routes in CI, boring checklists on SEO metadata and a11y, and keeping “pixel perfect” scoped so time went to durable behavior.

## Result

Marketing could ship campaigns without the stack turning into a pile of one-off landings.
