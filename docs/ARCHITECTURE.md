# INVEYS 0.4 — struktur untuk pengembangan berikutnya

## Batas modul

| Modul | Tanggung jawab |
|---|---|
| engine.js | Integer money, currency conversion, actual position, mutations, debt, card payments, simple projection, portfolio Monte Carlo. |
| finance.js | Ownership attribution, scoped analytical views, split apportionment, reports, snapshots, deterministic life-event projection, scenario plans, integrated Monte Carlo. |
| recording.js | Input parsing, source review helpers, duplicate signals, FX response normalization. |
| app.js | Local UI, localization selection, navigation, user review/consent, local persistence, import/export. |
| serve.py | Loopback-only provider boundary, OCR/audio handling, Telegram queue, server-owned credentials. |
| releases.json / releases.js | Version metadata and changelog, without executable updates. |

## Invariants

- Actual records are never mutated by report/forecast engines.
- Shared ownership is an attribution, not another copy of an account or transaction.
- Split amounts sum to the source integer amount. Currency-reporting allocations reconcile to the converted source total.
- Transfers do not enter income/expense reports. Goal designations do not create assets. Debt principal reduces assets and liabilities together.
- Forecast retains native plan denomination, applies saved FX, and identifies missing funding separately from liquid assets.
- Every asynchronous provider exchange stays outside the financial engine. AI never has ledger mutation capability.

## Data and compatibility

Workspace schema remains v1, with backward-compatible extension fields: ownerId/splits, activeView, savedViews, savedReports, forecastPlan, dashboardWidgets, positionHistory. Legacy workspaces receive defaults and stable member ownership mappings. Unknown owner labels default to shared and preserve the original label. A schema version should increase when representation changes become incompatible; do not silently reinterpret native money.

Snapshots retain per-date native balances/FX/ownership. Plans and scenarios are separate from actuals. Saved reports store criteria, not stale copied totals. Report FX uses current saved rates; snapshot history uses its captured rates.

## Next production milestones

1. Authenticated household tenancy with invitations, MFA/passkeys, backend sessions, per-resource authorization, audit logs, revocation, encrypted storage, and secure multi-device sync. UI ownership filters must never serve as authorization.
2. A durable double-entry journal, reconciliation, pending/posted lifecycle, stable merchant/category entities, splits with classifications, historical FX policy, and account balance provenance.
3. Persisted plan revisions, background worker simulations, historical market/correlation assumptions, configurable withdrawals, locally appropriate tax/benefit engines, and versioned model assumptions.
4. Server-backed report query/indexing, bounded pagination/aggregation, exports, scheduled reminders, signed release manifests, and supported migration/rollback paths.
5. Browser/device/accessibility QA and observability across supported languages, currencies, screen sizes and privacy boundaries.

The present application remains a single-browser local MVP. These production milestones describe future implementation and are not presented as active capabilities.

## Investment performance boundary

`investment.js` validates a separate `investmentHistory` dataset and provides CSV ingestion and cash-flow-adjusted return comparisons. Valuation history does not modify account balances or produce ledger transactions. It wraps migrate/validate after `finance.js` so older workspaces acquire an empty history and invalid restored investment data is rejected. Comparison uses imported historical FX and identical observation dates; missing series and incompatible bases stay explicit. Future licensed provider adapters should produce the same validated observations, retain provider/as-of provenance, and support intraperiod cash-flow valuations before enabling broker-synced actual returns.

## Reports presentation and navigation

`cashFlowGraph` in finance.js builds a conserved presentation model from the filtered cash-flow report; it does not create financial transactions. Source/use nodes preserve totals while folding smaller groups into Other. Funding gap and surplus are derived presentation nodes. Bar and Sankey rendering consume filtered records and export the same SVG markup shown on screen. Grouping/chart controls use existing report filters; saved report schema remains compatible. Sidebar state and pin preference are independent from financial state; CSS hover/focus controls the desktop overlay, with explicit drawer state and inertness on mobile.

## Appearance and forecast presentation

`appearance.js` wraps workspace migration/validation after investment.js and adds independently validated theme palettes. `syncPreferences` applies sanitized CSS tokens; no arbitrary CSS or external theme resources are accepted. Navigation grouping is presentation-only and preserves existing page IDs and deep links.

Forecast chart reads the existing monthly/annual model, with the same owner scope, baseline plan and scenario horizon. Chart metric and selected year are session-only state. Palette changes and chart interactions do not modify the financial plan. SVG event nodes use existing event editor actions with keyboard activation. Tax, contribution and FX models remain unchanged by this presentation update.

## Membership preview and Forecast setup

plans.js wraps migration/validation after appearance.js and stores draft commercial configuration in the workspace. Tier/feature checks only demonstrate upgrade UX; they are not trusted authorization. Real billing must use authenticated server entitlements, not commercial.previewTier.

Forecast setup keeps a separate cloned plan until Finish. Candidate account settings/events are validated and simulated before assigning the selected scenario/base plan. Existing scenarios are preserved when committing the baseline. Year-by-year matrix reads engine snapshots directly; no additional assets or income are synthesized for display. Full annual breakdown remains available under a disclosure.


## Investment v0.9 holdings boundary

Investment now exposes positions/summary/group, account-owner scope, fixed-current-quantity price backtest, security quote CSV validation, and captured gains history. New holdings/history/snapshot arrays migrate empty. Current valuation uses saved current FX; cost uses explicit historical weighted cost FX; backtest uses historical quote FX. Holdings detail never enters position() assets a second time. Analytical imports/creation are gated by the existing UI investment preview entitlement; reading/removal/export remain available. The original performance history contract and TWR model remain compatible, but cannot be reused for a filtered account/owner. Detailed assumptions and production gaps are documented in INVESTMENT_ENGINE.md.


## v0.10.0 assistant boundary

`assistant.js` migrates and validates bounded preference/history state. `app.js` renders a global multimodal composer, stages non-persistent files, separates Ask from local Record drafts, scopes history by owner/shared view and fences asynchronous responses against workspace/view changes. `serve.py` protects `/api/chat` with the existing localhost Host/Origin/CSRF checks. `inveys_ai.py` validates context/files and adapts requests to configured providers; it exposes no ledger tools and never accepts API keys from the client. External content is untrusted; responses render as escaped text with a small formatting subset. Preferences are explicitly maintained context, not online model training.


## v0.11.0 intent and correction boundaries

`finance.editTransaction` clones the workspace, reverses known old journal impacts, applies the validated correction, preserves source identity and returns a validated workspace; no partial mutation occurs on failure. Metadata-only edits preserve historical FX. `balanceApplied:false` remains journal-only. Split financial edits require explicitly removing the split first. Historical snapshots and correction audit history are not rewritten/generated.

AI unification requests a constrained intent/draft JSON shape; invalid/plain output cannot execute records. Server and browser both validate fields. The browser binds drafts to the selected account and document policy captured before the request and uses the existing duplicate/review/commit pipeline. The 9Router adapter accepts only server-defined endpoint/key/model, refuses credential-bearing/unsafe URLs and redirects, and exposes no financial mutation tools. Gateway routing/media support remains external configuration.


## v0.12.0 journal actions

`txEdit` stores non-persistent inline values. The correction commit validates a cloned workspace and writes localStorage before assigning active state. Row errors keep draft values and original records. `finance.deleteTransaction` performs immutable reversal/removal validation before persistence, retaining the historical journal policy and exact transfer received amount. No audit log/tombstone is introduced. Success toasts are announced through the existing role=status region. SVG paths are explicit per destination/group/tab instead of falling back to the Accounts icon.


## v0.13.0 credit card artwork

Optional `card.image` is a bounded raster data URL validated by the engine, including aggregate workspace limits. Upload re-encodes in a browser canvas before atomic workspace persistence; reset/replacement generations fence stale writes. Card metadata edits preserve existing image fields. Artwork is local/exported workspace data, excluded from existing external AI context, and is not an OCR/card-number source. Runtime decode is required before upload; restore validates data URL type/shape/size and header prefix, not a full image decode.


## v0.14.0 Operations

`operations.js` loads after finance/assistant and before app. It migrates
review and balance-policy metadata, wraps transaction creation atomically,
adds bounded local activity and source tombstones, and wraps corrections and
card accounting. Monetary computations remain integer minor units. Rules
only modify metadata/ownership, with safe percentage apportionment. Snapshot
reconciliation deliberately decouples historical journals from observed balances.

Refunds remain expense-kind rows with `refundOf`; report values are signed,
including owner splits and historical baselines. Negative spending groups
become refund sources in Sankey; signed bars preserve refund-only periods.
Card purchases have `cardCharge` and debt effects without bank effects.
Payments are transfer-kind rows with `targetDebtId`, captured bank/card values,
FX provenance and statement-cycle date. This schema extension is validated
by engine + operations; financial edits use delete/re-record.

Forecast adds explicit averaging policies, growth modes, per-account withdrawal
rank/start-year and piecewise annual return schedules. Both deterministic and
Monte Carlo projections use these assumptions. No provider sync, auth/tenant
service, encrypted cloud database or paid-entitlement backend is introduced.


## v0.15.0 Holdings chart

Investment performance, calendar geometry and nearest-observation selection
are pure engine functions. UI stores view selection and inspection state only
in memory; gestures do not trigger journal mutations or repeated workspace
writes. Portfolio dates anchor the display; benchmarks use nullable aligned
values. Current holdings value, historic capital and cumulative return remain
separate concepts. See INVESTMENT_ENGINE.md for exact behavior.


## VPS Deployment Architecture: 4-Segment Modular Structure & 1-Click Update Pipeline

Aplikasi INVEYS dirancang dengan arsitektur **4 Segmen Terisolasi (Isolated 4-Segment Architecture)** untuk mempermudah operasional, keamanan, dan pembaruan berkala di server VPS (Hostinger KVM / Ubuntu Linux):

| Segmen | Lingkup Komponen | Tanggung Jawab & Isolasi | Karakteristik Pembaruan |
|---|---|---|---|
| **Segmen 1: Web Client & PWA Assets** | `src/` (`index.html`, `styles.css`, `app.js`, `*.js`, `manifest.webmanifest`, `icon.svg`, `sw.js`) & bundle `inveys-app.html` | Antarmuka pengguna, perutean halaman, visualisasi chart, financial domain calculators, offline service worker caching. | **Stateless**. Dapat ditimpa/diperbarui kapan saja tanpa merusak data finansial pengguna. |
| **Segmen 2: VPS API Gateway & Services** | `server/` (`serve.py`, `inveys_ai.py`, `inveys_crypto.py`), `requirements.txt` | Daemon server Python (port 3000), Master Password PBKDF2-SHA256 Auth, Session Management, Multimodal AI Gateway, CCXT Crypto Connector, Tesseract OCR & FFmpeg voice. | **Service Daemon**. Menjaga kredensial API tetap berada di server dan mematuhi prinsip Read-Only Ledger safety. |
| **Segmen 3: Persistent Data Vault & Storage** | Database SQLite WAL (`inbox.sqlite3`), direktori `INVEYS_DATA_DIR` (`~/.inveys/`), tabel `workspaces`, `backups`, `auth`, `sessions`. | Penyimpanan persisten buku besar, akun, kartu, target tabungan, dan rolling backup otomatis 30 hari. | **Stateful & Terisolasi Penuh**. Berada di luar direktori kode aplikasi sehingga kebal dari penimpaan file saat proses update. |
| **Segmen 4: Build, Release & Update Pipeline** | `scripts/` (`build.py`, `build-manifest.json`), `src/releases.json`, endpoint `GET /api/vps/segments`, endpoint `POST /api/vps/update` | Pipeline orkestrasi pembaruan otomatis, verifikasi integritas checksum SHA-256, pembuatan snapshot cadangan pra-pembaruan, dan hot-rebuild mandiri. | **Automation Engine**. Menjalankan alur pembaruan 1-klik dengan jaminan keamanan data. |

### Invarian dan Alur Kerja 1-Klik Pembaruan VPS (`POST /api/vps/update`):
1. **Pre-flight Automated Snapshot**: Sistem selalu membuat snapshot cadangan instan dari workspace aktif ke tabel `backups` SQLite sebelum berkas apa pun disentuh.
2. **Git Pull / Package Ingestion**: Memeriksa ketersediaan remote update dan melakukan sinkronisasi berkas sumber terbaru secara aman.
3. **Automated Standalone Compilation**: Menjalankan `build.py` di server VPS untuk mengompilasi seluruh aset klien ke dalam berkas mandiri `inveys-app.html`.
4. **Manifest Integrity Recalculation**: Menghitung ulang hash SHA-256 dari bundle dan memperbarui `build-manifest.json`.
5. **Zero Downtime Reload**: Klien web menyegarkan cache dan memuat versi terbaru tanpa perlu mematikan database atau memutus sesi pengguna.

