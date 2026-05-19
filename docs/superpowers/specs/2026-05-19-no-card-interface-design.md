# No-card interface design constraint

## Decision

All Synapse frontend screens should avoid card-style content layouts. Content should read like an open workspace: structured by section headings, thin rules, columns, tables, timelines, indentation, and whitespace rather than repeated rounded white containers.

## What counts as card-style

- Large rounded content blocks with `border + bg-white + padding`.
- Repeated metric/content tiles that visually look like separate cards.
- Page sections stacked as independent slabs.

## Preferred layout patterns

- Hero/header areas use open spacing, large typography, and bottom rules.
- Lists use rows with `border-b` separators.
- Detail pages use article sections with left rails, section labels, and horizontal rules.
- Sidebars use vertical rules and compact stat rows.
- Empty/error states use inline copy and rules, not boxed panels.

## Allowed exceptions

- Form controls, textareas, search inputs, buttons, and code blocks may keep their functional background, border, or small radius.
- Dense data tables may use borders when they communicate row/column structure.
- Tiny badges may use subtle backgrounds when they are metadata, not layout containers.

## Rollout

M2 public community, detail, and profile screens are updated first. M3-M6 screens should be built with this constraint from the start.
