---
title: monday Workdocs — nested blocks | Saar Davidson
description: "NestedBlock work on monday.com Workdocs: validation, rollout, and keeping the document model valid."
eyebrow: MONDAY.COM · WORKDOCS
h1: Nested blocks without breaking the editor
lead: "Workdocs is a block-based editor. The product needed deeper nesting (including callout-style blocks) without breaking editing, serialization, or migrations."
navPrev:
  href: /work/bottom-sheet
  label: ← Bottom sheet migration
navNext:
  href: /work/healthy-io-marketing
  label: "Next: Healthy.io →"
---

## Context

I worked on **Workdocs**, a production React editor. The NestedBlock effort was architecture work: which trees are allowed, how that stays consistent in the UI, and how it ships without risky big-bangs.

## Problem

You cannot treat “nested UI” as only a rendering problem. Invalid trees are a product and persistence problem.

Different block types had different nesting rules. A table, a split layout, and a callout-style block could not all allow the same child blocks. The editor needed to prevent invalid combinations before they reached persistence.

The hard part was not rendering nested content. The hard part was protecting the editor from invalid states.

## Approach

Extend the existing model: a **NestedBlock** layer on top of **BaseBlock**, with **central validation** of allowed parent/child pairs instead of one-off guards scattered across block types.

<pre class="case-study-preblock">BaseBlock
  └── NestedBlock (shared nesting + validation)
        ├── Table
        ├── Split / layout
        └── Callout / note-like</pre>

## Rollout

Feature flags and gradual rollout, with Datadog on editor errors. Engineering owned implementation, rollout, and production validation.

## Result

A single place to answer “is this tree valid?” before bad state hit users or storage.
