---
title: Bottom sheet migration | Saar Davidson
description: "React Native @gorhom/bottom-sheet upgrade: navigation, keyboard, gestures, layout, and rollout."
eyebrow: ENPITECH · REACT NATIVE
h1: Bottom sheet library migration
lead: "Autofleet needed a newer **@gorhom/bottom-sheet**, fewer hacks, and better support for dynamic content height. The compile step stayed green; behavior did not."
navNext:
  href: /work/monday-nested-blocks
  label: "Next: monday.com nested blocks →"
---

## Context

Autofleet uses React Native for operator and driver flows. Sheets were shared infrastructure: modal wrappers, gesture handlers, keyboard avoidance, and navigation glue. Changing the library changed timing and mount order in a lot of places.

I owned the migration from investigation through implementation, testing, and rollout validation.

## Problem

Two patterns (`BottomDrawer` and `BottomSheet`) had drifted apart. Screens relied on animation timing, snaps, backdrop taps, focus order, and gestures without documenting it. A library bump surfaced that in navigation stacks, keyboard behavior, pan handlers, and layout measurement for dynamic height.

**Before:** The app had duplicated sheet wrappers, timing assumptions, and layout hacks.

**After:** The app had smoother expansion, dynamic-height support, fewer hacks, and a clearer path toward one shared bottom-sheet abstraction.

The library upgrade was the trigger. The real work was finding the hidden assumptions around navigation, keyboard behavior, gestures, and layout.

## Constraints

- Duplicated implementations and z-index workarounds tied to the old timing model.
- Regressions that showed up in real flows, not only smoke tests.
- No single owner for every sheet; usage had grown feature by feature.

## What we did

Inventory call sites, align on one abstraction where possible, and re-check keyboard, gestures, focus, backdrop, snaps, and content height explicitly.

## Rollout

Focused regression passes on high-traffic sheets, navigation transitions, and keyboard-heavy forms.

## Outcome

Smoother sheets, less hacky code, and a clearer map of where coupling actually lived for the next change.
