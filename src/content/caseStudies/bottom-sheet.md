---
title: Bottom sheet migration — product primitive case study | Saar Davidson
description: "A React Native bottom-sheet migration that became product infrastructure work: hidden contracts, gesture stacks, keyboard behavior, and safer rollout."
eyebrow: ENPITECH · REACT NATIVE
h1: A small upgrade that behaved like product infrastructure.
lead: "The brief was to move Autofleet’s mobile surface to a newer **@gorhom/bottom-sheet**, remove old hacks, improve animations, and support dynamic content height. On paper, that sounds like a dependency bump. In practice, it touched a product primitive that many flows quietly depended on."
navNext:
  href: /work/monday-nested-blocks
  label: "Next: monday.com nested blocks →"
---

## Context

Autofleet ships operator and driver flows in React Native. Bottom sheets were not one neat component; they were a **shared interaction layer** made of modal wrappers, legacy drawers, gesture handlers, keyboard avoidance, and navigation glue. Upgrading the library meant changing timing and mount order for flows that had been tuned in place for years.

## Problem

The risk was not mostly TypeScript errors; it was **silent behavioral drift**. Two abstractions (`BottomDrawer` and `BottomSheet`) coexisted with different contracts. Screens depended on animation timing, snap defaults, backdrop taps, focus order, and gesture propagation, often without saying so.

Changing the sheet changed navigation stacks, modal layering, keyboard behavior, and layout measurement, even when the compile step stayed green.

## Constraints

- High coupling: z-index workarounds, duplicated implementations, and modal wrappers that assumed the old timing model.
- Regressions that only showed up in real flows, including late-night driver paths rather than happy-path smoke tests.
- No single owner for “all sheets”; usage had evolved organically across teams and features.

## Technical decision

Treat the migration as **re-establishing contracts**, not swapping imports. I inventoried call sites, aligned usage around one abstraction where possible, and validated the risky dimensions explicitly: keyboard, gestures, focus, backdrop, snap points, and content-height measurement.

The library upgrade was the lever. The actual work was discovery, narrowing blast radius, and replacing undocumented assumptions with behavior the next change could reason about.

## Rollout & risk

Risk lived in **regression hunting**: high-traffic sheets, navigation transitions, keyboard-heavy forms, and the small flows users notice when they fail. The goal was not a perfect greenfield API; it was smoother animations and real dynamic-height support without trading away trust in production behavior.

## Result

The migration delivered smoother expansion, fewer hacks, and a clearer path for future sheet work. It also surfaced technical debt that had stayed invisible while the old implementation absorbed edge cases. The product got a better primitive; engineering got a clearer map of where coupling actually lived.

## Reflection

**UI infrastructure components become product primitives.** Once reused enough, they are no longer just components; they are assumptions, contracts, and user expectations. The hard part of estimation is not always the coding. It is the invisible coupling that only appears when behavior changes.
