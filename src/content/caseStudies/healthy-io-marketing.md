---
title: Healthy.io — marketing systems | Saar Davidson
description: "Next.js marketing systems at Healthy.io: SEO, accessibility, geofencing via middleware, and keeping content velocity on a maintainable foundation."
eyebrow: HEALTHY.IO · MARKETING PLATFORM
h1: Marketing systems are product systems when the stakes are high.
lead: "At Healthy.io I worked on **multiple marketing platforms and landing systems**. The work may look like “just pages” from the outside, but the real job was keeping public surfaces crawlable, accessible, localized, fast, and flexible enough for marketing to move."
navPrev:
  href: /work/monday-nested-blocks
  label: ← monday.com nested blocks
---

## Context

The properties had to stay fast, maintainable for a small frontend surface, and flexible enough for campaigns and experiments. Marketing, design, compliance-adjacent review, and engineering all pulled on the same Next.js and CMS layer.

## Problem

The tension was not “build a landing page”; it was **balancing business velocity with architectural sanity**. Every shortcut shows up twice: once in Lighthouse, once six months later when nobody remembers why that route behaves differently in production.

Hidden complexity stacked up: SEO risk during refactors, accessibility expectations, performance pressure, content velocity, and experimentation loops that do not wait for a rewrite window.

## Constraints

- SEO and share metadata had to stay correct across locales and templates.
- Accessibility was not a polish pass; it was part of what “shipped” meant.
- Shared infrastructure across sites had to stay predictable as page count grew.

## Technical decision

Standardize on **Next.js** patterns the team could reuse: shared page systems, clear data boundaries for CMS content, and **middleware** where cross-cutting behavior belonged, including country-specific routing, geofencing, sunsets, redirects, and traffic shaping without duplicating logic in every page.

A notable slice of this era was upgrading a large codebase from **Next.js 11 → 12**. The version bump was not the story; the unlock was using middleware deliberately for geo and routing concerns instead of scattering one-off checks through the tree.

## Rollout & risk

Risk showed up as **SEO regressions**, subtle accessibility breaks, and performance cliffs when marketing velocity outpaced cleanup. Mitigation was intentionally boring: representative routes in CI, design alignment before pixel-chasing, and explicit boundaries around what “pixel perfect” meant so engineering time went to durable outcomes.

## Result

Marketing could iterate faster on a shared, well-understood stack. Engineering kept a maintainable spine — routing, middleware, and reusable page shells — instead of a graveyard of one-off landings. The public sites stayed within reach of performance and accessibility goals while the business kept shipping campaigns.

## Reflection

**Good frontend work protects both users and the team that ships for them.** The durable win is aligning on what actually moves the business — crawlability, clarity, speed, accessibility — and letting the craft show up there first.
