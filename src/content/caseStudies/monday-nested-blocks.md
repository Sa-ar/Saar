---
title: monday Workdocs — valid nested blocks | Saar Davidson
description: "NestedBlock architecture for monday.com Workdocs: validation, serialization, safe rollout, and protecting a rich editor from impossible states."
eyebrow: MONDAY.COM · WORKDOCS
h1: The hard part was not nesting blocks. It was keeping the editor honest.
lead: "Workdocs behaved like a Notion-style editor: composable blocks, rich layouts, and many implicit rules about what could live inside what. The product needed **deeper nesting**, including callout and note-like structures, without destabilizing editing, serialization, or migrations."
navPrev:
  href: /work/bottom-sheet
  label: ← Bottom sheet rewrite
navNext:
  href: /work/healthy-io-marketing
  label: "Next: Healthy.io marketing →"
---

## Context

The editor already supported tables, split and layout blocks, and standard content. A new feature line pushed nesting further, but the architecture had not been designed as one constraint-first model. Each block type carried slightly different capabilities and edge cases.

## Problem

You cannot declare “everything may contain children” and call it done. Some combinations broke editor assumptions; some interactions produced states that were hard to serialize or migrate cleanly. The danger was not only pixels; it was **consistency, invalid trees, migration safety, and rollout stability** across a large surface.

Without a central model, nesting logic would scatter into conditionals and one-off guards. That is the kind of slow reliability leak that gets harder to reverse every sprint.

## Constraints

- Per-block rules differed: not every block should accept every child type.
- Serialization and migrations had to stay safe as the document model evolved.
- Feature work needed to ship incrementally, not as one risky “big bang.”

## Technical decision

Extend the existing abstraction instead of bolting nesting on per feature. Introduce and extend a **NestedBlock** layer, reuse shared behavior through **BaseBlock**, and **centralize validation** for allowed nesting with capability checks per block type.

<pre class="case-study-preblock">BaseBlock
  └── NestedBlock (shared nesting + validation)
        ├── Table
        ├── Split / layout
        └── Callout / note-like</pre>

## Rollout & risk

Shipped with **feature flags** and gradual rollout, with Datadog monitoring around editor failures. On this path there was not dedicated QA ownership for every edge, so engineering owned implementation, rollout, observability, and production validation end to end.

That pushed explicit metrics and failure signals into the work from the beginning instead of treating them as optional polish.

## Result

Table, split, and callout-style blocks could share nesting behavior instead of each re-implementing rules. The editor gained a clearer place to answer “is this tree valid?” before bad state reached users, persistence, or future migrations.

## Reflection

**The hard part was protecting the editor from impossible states.** That turns rich-text work into a systems-design problem: constraints, invariants, and safe evolution matter more than any single UI control.
