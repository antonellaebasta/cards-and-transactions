# Cards & Transactions

A banking-style overview page: card selection → balance → filters →
transaction list.

## How to run

```bash
yarn
yarn dev      # start the dev server
yarn test run # run the full test suite once
yarn build    # typecheck + production build
yarn lint     # eslint
```

## Assumptions & tradeoffs

**Data**
- *Adapter over direct JSON imports*: one normalizing layer
  (`src/adapters/`) hides source-data inconsistencies behind a stable
  `Card`/`Transaction` contract, so swapping in a real API later needs
  no architecture change.
- *Three-way amount classification* (`settled` / `pending` / `invalid`):
  `null` is a real business state (the transaction hasn't finished
  processing, so it has no final amount yet) and can't be confused
  with unparseable data — collapsing either into `0` would misrepresent
  real money.
- *Duplicate transaction ids kept, not removed*: dropping one would
  silently discard real money movement. React's `key` uses a synthetic
  `${id}-${index}` instead of the raw id.

**Filtering**
- *Filter by size, ignoring plus/minus* (`Math.abs(amount) >=
  minAmount`): the separate In/Out control already handles direction,
  so the amount filter doesn't need to. If it compared the signed
  value instead, "Out" would read backwards — typing `50` would have
  to mean "amount >= -50".
- *Pending excluded once filtering is active*: no amount yet to
  compare against the filter.
- *Invalid always excluded*: the amount couldn't be read as a number
  at all, so there's nothing to compare — no filter value would ever
  include or exclude it correctly.
- *Filters reset on card switch*: a filter set up for one card can't
  silently carry over and mislead on another's data.
- *Every keystroke re-renders the filtered list, even when the visible
  set doesn't change*: `filterTransactions` always returns a new array
  (`.filter()`), so `TransactionList` gets a new array reference — and
  re-renders — on every keystroke, even one that doesn't move any row
  in or out of view. Fixing that means a value-equality check
  (comparing transaction identity, not object reference) instead of
  reference equality — either inside the hook or via a custom
  `React.memo` comparator on `TransactionList`; both need the same
  extra logic, just in different places. Left out deliberately: at
  this scale (2 cards, a handful of rows) the wasted render costs
  nothing a profiler would ever show, and the fix itself isn't free —
  it's a second equality concept plus a real subtlety to get right
  (an earlier attempt at this exact thing shipped a bug where it
  interacted badly with the card-switch reset, costing an extra
  render pass instead of saving one). Worth adding only once the list
  is large enough that the wasted render is actually measurable (see
  "What I'd improve").

**Stack**
- *TanStack Query over `useEffect` + `fetch`*: the data is meant to
  represent a real API, even though it's local JSON for now. At this
  app's size, a plain `useEffect` + `fetch` would have worked fine —
  but once real endpoints exist, that hand-rolled version would need
  its own loading/error/retry state, retry-on-failure, and caching
  built on top. TanStack Query already gives all of that, so it's the
  better choice for where this is heading, not just for this exercise. In
  practice that means: loading/error/retry state without writing it
  by hand; the app's "Retry" button calling `query.refetch()` directly
  instead of a custom retry counter; transient failures retrying
  automatically before the error UI even shows; and swapping the
  simulated fetch for a real one staying a one-line change later.
- *Tailwind design tokens over hardcoded values*: zero runtime style
  computation, and the token constraint keeps every color/spacing
  value traceable to one source of truth instead of drifting per
  component.
- *Hand-built inline SVG icons + a self-hosted font*, not an icon
  library or a Google Fonts `<link>`: avoids an external request or
  dependency for a handful of small assets.
- *No pagination or virtualization*: this app only ever shows two
  cards and a handful of transactions per card — the whole list
  already fits on one screen. Adding pagination or a virtualized list
  now would mean building for a problem that doesn't exist yet: extra
  API parameters, scroll-position tracking, windowed rendering — real
  work with no payoff at this size. Worth adding once transaction
  volume is actually large (see "What I'd improve").

**Design**
- *Tokens + atomic components over per-component values*: a color or
  spacing value has exactly one place to change, so it can't drift
  between components.
- *Color is never the only signal*: selection also gets a checkmark
  badge, `aria-pressed`, and panel headers naming the selected card
  ("Current balance · {name}"); pending/unavailable rows pair an icon
  with text; credit vs. debit differ by shape (filled pill vs. plain
  text) and an explicit `+`/`-` sign — so it's still clear even if you
  can't see color.
- *Mobile carousel peeks the next card*: a fully hidden card gives no
  sign that a second one exists to swipe to.

**Accessibility**
- WCAG 2.1 AA contrast at minimum, verified for every color pairing in
  use.
- Full Tab navigation, a visible focus ring, and no focus trap, so the
  app works without a mouse.
- Descriptive, dynamic `aria-label`s (e.g. `Transactions for
  {card name}`) instead of generic ones, so what's announced matches
  what's on screen.
- `aria-pressed` on selection and `aria-live="polite"` on the
  transaction list, so state changes are announced, not only shown.
- `prefers-reduced-motion` respected everywhere except two brief,
  localized transitions (the selection badge's fade-in, the carousel's
  tap-to-center scroll) — small enough that gating them wasn't worth
  the added complexity.

## What I'd improve with more time

- **Schema validation at the boundary**: runtime validation (e.g. Zod)
  instead of trusting the raw shape at compile time only, plus
  contract tests so an upstream change can't silently break the
  frontend.
- **Richer filtering**: grow the single amount filter into a fuller
  query model (min/max amount, date range, merchant, transaction type,
  status), with the adapter layer staying responsible for translating
  those into requests to a real backend. At that point filtering would
  move server-side rather than running client-side on an
  already-fetched list, so each distinct query would need filter and
  pagination state included in the TanStack Query key to be cached and
  requested correctly.
- **Non-blocking filter input**: once the transaction list is large
  enough that re-filtering on every keystroke makes typing feel slow —
  whether that filtering runs client-side or is triggered by a
  server-side move like the one above — debounce the input to cut how
  often it runs, and wrap the update in `useTransition` so React can
  keep typing itself responsive while the list catches up. The same
  point in the code where a value-equality check (see "Filtering"
  above) would go, once the wasted re-render is actually worth
  avoiding. Not needed at this data scale.
- **Large transaction histories**: keep cursor-based pagination, and
  add virtualization if volume grows from "a handful of rows" to a
  large, continuously rendered list — not needed at this data scale.
- **Real-time updates**: poll, or move to SSE/WebSockets, with
  TanStack Query invalidating the relevant queries as new data arrives.
  Assumes a real backend exists to push from.
- **Caching strategy**: TanStack Query already caches fetched data in
  memory by default, which is fine for a single local session. Once a
  real backend and multiple users exist, that default isn't enough —
  it would need a deliberate choice about what's cached where (client
  memory vs. a backend cache vs. a CDN), since transaction data is
  sensitive and changes often and shouldn't be cached carelessly.
- **Observability**: once filtering and fetching move to a real
  backend (see "Richer filtering"), add structured logging, metrics,
  tracing, and error monitoring there — query latency, error rates,
  downstream failures. Not applicable to the current client-only setup,
  which has no server process to instrument.
- **Translatable text**: every label and message is hardcoded English
  inline in JSX right now ("Minimum amount", "No transactions match
  your filters.", etc.). Move it into a proper i18n layer (e.g.
  react-intl/FormatJS or i18next) instead, so strings are extracted
  and swappable per locale rather than baked into components — paired
  with a translation management platform (e.g. Phrase) for the actual
  translation workflow.
