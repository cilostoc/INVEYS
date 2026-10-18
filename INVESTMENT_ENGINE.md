# Investment model v0.9.0

## Data contract and preservation

Workspace v1 receives `holdings`, `holdingPrices`, and `investmentSnapshots` as empty arrays. `investmentHistory` retains its original schema and values. Old accounts and journal records are preserved. Holdings are analytical detail; adding/editing/removing them never creates account balances or transactions. Restored malformed holdings/quotes/snapshots are rejected by workspace validation.

Each holding references one Investment account, inherits account ownership for current views, and stores symbol/name, native security currency, quantity, unit price, quote date/source, remaining native total cost basis (nullable), historical cost FX to IDR, and user-supplied fund classifications. Quantity and unit price are decimal values; valuations round to integer minor units. Supported holdings are long-only and unlevered; derivative multipliers, shorts and accrued bond interest are not modeled. Bond prices must be entered as actual per-unit currency prices, not percent-of-par quotes.

## Current valuation and gains

- Native market value = quantity × stored unit price, rounded to minor units.
- Reporting market value = native market value converted with saved current FX.
- Cost in IDR = remaining native total cost × user-supplied historical weighted cost FX, rounded to minor units. IDR uses 1.
- Reporting cost = IDR cost converted with saved current reporting-currency FX.
- Unrealized gain = reporting market value − reporting cost.
- Unrealized gain percentage = gain / reporting cost only when cost > 0.

Missing cost remains null. A group or portfolio with any missing cost shows unavailable total cost/gain/percentage; known-cost subtotals remain accessible in the engine. No holdings produce zero detail value and unavailable gain, rather than a meaningful 0% performance. Group weights use current market value. Grouping is by asset class, account, symbol or available fund metadata; missing metadata is Unclassified. No automatic licensed fund classifications or look-through exposure are inferred. Gain amounts may include currency movement; this is analytical cost, not a jurisdiction-specific tax basis computation.

## Two distinct performance models

**Current holdings backtest:** quantity is fixed at its current value on every historical quote date. Aggregate historical capital on date t = sum(quantity × price[t] × historical native-to-IDR FX[t]). This is converted to IDR or USD with that date’s USD/IDR. Return = capital[t] / capital[start] − 1, with no trading or rebalancing. Thus it represents how the current holdings would have performed, not actual investor return. It excludes dividends, fees, taxes and previous purchases/sales. Consistent split-adjusted price-only history is required.

**Imported portfolio history:** preserves the existing end-period external-flow assumption. Growth ratio = (ending value − ending external flow) / preceding value; cumulative growth chains these ratios. First observation has flow = 0. Full intraperiod cash-flow valuations would be needed for more precise actual TWR. The imported dataset has no account/owner mapping and is available only for whole-household, all-account analysis.

Portfolio Performance documents why external cash flows must be neutralized and subperiod growth chained: https://help.portfolio-performance.info/en/concepts/performance/time-weighted/ . Its capital-gain discussion also distinguishes purchase cost and market valuation: https://help.portfolio-performance.info/en/reference/view/reports/performance/calculation/ . INVEYS implements the explicitly stated simplified assumptions above; it does not claim tax-lot or daily TTWR equivalence.

## Comparison and unavailable data

Benchmark datasets identify series, native currency, basis price/total, historical FX and source. US Stock and US Bond are existing VTI/BND proxies, not a universal stock/bond index. All curves rebase to zero on the same intersection of dates within the selected period; benchmark bases must match the portfolio model. Missing/incompatible datasets are excluded with reasons. No forward-fill or interpolation occurs. An imported but very sparse selected benchmark may leave too few common dates; deselect it or import compatible dates.

Return-period cards reflect the actual common period, which may be shorter than the selected shortcut. Today requires current calendar date and preceding calendar date, otherwise it is unavailable. Dates have no intraday timestamps/timezone session alignment; use consistent closing observations. Observed drawdown is calculated from common points, not the full daily risk path. Current quote price does not replace historical return data.

## Historical gains and exports

Snapshots capture market value/cost in IDR, account and owner per holding, and USD/IDR at capture. Re-saving a date replaces its snapshot; holdings removal preserves prior snapshots. Gain history filters ownership at capture time. Missing cost yields null and breaks a displayed line; holdings are never backfilled into prior dates. A change of holdings or owner can change aggregate gains and is not a performance attribution calculation. Capturing snapshots uses saved prices/FX, which can be stale.

CSV outputs apply spreadsheet-formula neutralization to arbitrary text. SVG exports use the current palette and escaped labels. Line/pie SVG export and tabular CSV export are implemented; allocation breakdown and gain bar views export data as CSV. Data import replaces only its named dataset, atomically after validation. Holding removal deletes related quote history and retains historical snapshots. Accounts with current holdings cannot be deleted or converted to a non-Investment type.

## Production extensions

Licensed broker/security/price adapters with provider IDs, exchange/session timezone and provenance; corporate actions; a buy/sell/dividend journal with historical lots; validated opening quantities; multicurrency tax-basis policy; realized gains and jurisdiction-specific tax reports; fund composition datasets with licensing; server authorization and audit trail. These are extensions, not enabled capabilities.


## v0.15.0 chart presentation engine

The Holdings UI now calls `performance` → `displayCompare`. The earlier
`compare`/`backtest` APIs retain strict common-date behavior for compatibility;
they are not used to drive the new Holdings chart. Portfolio dates come from
its own observations, or the complete intersection of selected holdings' quote
dates. Adding a benchmark never changes portfolio dates or cumulative return.
Each benchmark must have a value on the portfolio's first displayed date.
Missing intermediate/end values stay null, with no fill/interpolation. End
return and excess are null if the benchmark lacks the portfolio end date.
Last change uses that series' latest two available matching observations,
whose dates are shown. It is not labeled as intraday or Today.

Capital values are stored in chart output as integer minor units after using
historical FX. Return series remain ratios. Imported flows are excluded from
TWR growth but included in capital value, preventing an account deposit from
being misrepresented as investment gain. Backtest capital fixes current units
through history. Neither chart changes account balances or the journal.

`chartGeometry` spaces x coordinates by UTC calendar dates. Hit testing uses
binary search for the nearest observed date. Long-series sampling retains
bucket minima/maxima, endpoints, and null boundaries. Tooltip access still
uses the complete original data. Drawdown is over observed dates only.

A single keyboard focus target supports arrows/Home/End/Escape, with an
announced date/value. Pointer and touch inspection use the same index mapping.
Stable series colors are independent of selection order, and are adapted for
light/dark palettes. Exports preserve gaps (CSV blanks, disconnected SVG paths).

Design reference: Monarch's public Investments documentation, reviewed
2026-10-09: https://help.monarch.com/hc/en-us/articles/41855507661076-Investments-in-Monarch
The implementation uses INVEYS data and independent calculations. The earlier
separate conversation's detailed UI analysis could not be retrieved during
this update; no pixel-for-pixel comparison with a signed-in Monarch screen
was completed.
