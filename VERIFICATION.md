# Verifikasi versi 0.4.0

**92 pengujian JavaScript + 10 pengujian Python lulus: total 102.**

## Engine keuangan

- Seluruh pengujian lama tetap lulus: precision, FX, migrasi, transfer, goals, debt payoff, kartu/pembayaran, tanggal, Monte Carlo standalone, parser struk/statement/suara, dan duplicate detection.
- 29 pengujian engine terpadu mencakup ownership migration, perspektif anggota/shared/household, inheritance vs override, split atomicity, percentage rounding, filter laporan, pengecualian transfer, rekonsiliasi FX per owner, saved view validation, dan snapshot native dengan kurs historis.
- Forecast dibandingkan dengan kasus yang mempunyai hasil diketahui: saldo konstan tanpa growth/flows; transfer investasi yang mempertahankan aset; pembayaran principal yang mempertahankan net worth; interest yang mengurangi net worth; pembelian properti/loan yang tidak menciptakan net worth; biaya sekali/rutin; pensiun satu pemilik; income yang kembali setelah career break; discount inflasi; shortfall dan gap yang kemudian terbayar; goal reserve yang berhenti pada target; baseline historis dibagi tepat 12; serta konversi denominasi rencana.
- Integrated Monte Carlo dibandingkan dengan deterministic Forecast pada volatilitas nol, seed yang reproducible, dan persentil berurutan.

## Workflow

- 28 pengujian render/handler melalui adapter DOM minimal mencakup seluruh alur lama serta halaman baru dengan workspace berisi/kosong.
- Owner switching mengubah hasil yang terlihat tanpa mengubah record aktual; saved view mengembalikan owner/mata uang; edit ownership/split tidak mengubah saldo; member rename menjaga ID.
- Reports filtering/drill-down/saved report, Sankey, treemap, dan snapshot position diuji. Nama view/draft dengan markup di-escape.
- Scenario plan dan life events tetap terpisah dari baseline/actual records. Perbandingan dengan horizon berbeda menggunakan periode yang sama dan tidak menghasilkan label undefined.
- Year detail, integrated Monte Carlo pada rencana terpilih, dan preferensi widget dashboard diuji.

## Layanan lokal

- HTTP nyata diuji untuk Host/Origin/CSRF, penolakan file sensitif, status tanpa credential leakage, dan manifest 0.4.0.
- Telegram allowlist/update-ID/offset/acknowledgement memakai fixture API. Muse memakai response mock dan consent checks.
- Tesseract **benar-benar dijalankan** terhadap PNG contoh: TOTAL/nominal dikenali.

## Batas verifikasi

- Chromium/browser nyata tidak tersedia; tidak ada klaim visual QA, assistive-technology/WCAG compliance, atau interaksi browser penuh. Adapter DOM menguji logika, bukan layout.
- Telegram bot nyata, Muse Spark/ASR langsung, kurs live, browser speech recognition, dan notifikasi OS belum diverifikasi di lingkungan ini. Konfigurasi kredensial tidak disediakan.
- Tidak ada autentikasi produksi, member access isolation, real-time cross-device sharing, bank connector, background reminder scheduler, atau update distribution cloud.
- OCR dokumen nyata dan seluruh layout bank belum diklaim. Parser/import tetap membutuhkan review.

## Menjalankan pemeriksaan

```sh
npm test
python3 -m unittest discover -s tests -p '*_test.py' -v
python3 build.py
```

## v0.4.1 quick capture verification

97 JavaScript tests and 10 Python backend tests pass. New tests cover income multiplier parsing, numeric account suffixes, question/transfer routing, explicit account and currency checks, draft-only mutation, single-save behavior, duplicates, shared question history, and preserving pending drafts. Browser visual and microphone checks are not available in this environment. External-provider connections remain unverified.

## v0.5.0 Investment verification

108 JavaScript tests and 11 backend tests pass. New investment checks cover end-period deposits and withdrawals, historical FX, date alignment, rebasing, missing data, basis mismatches, duplicate dates, consistent metadata, CSV parsing, future-date rejection on import, observed drawdown, benchmark excess and immutable calculations. UI adapter checks cover navigation, empty states, persisted import/restore, unchanged assets/journal, atomic replacement and escaped source labels. No browser visual or live market-provider verification was performed.

## v0.6.0 UI and Reports verification

115 JavaScript tests + 11 backend tests pass (126 total). Added checks for cash-flow conservation under surplus/deficit/zero-flow, Other aggregation, refusal of unreconciled groups, accessible icon labels, pin preserving financial state, mobile drawer state/inertness, Escape and navigation close, chart switching/monthly grouping, selected SVG export and honest empty reports. CSS hover/keyboard rendering, pointer interaction, layout and mobile visual QA were not run: no browser binary was available.

## v0.7.0 appearance and forecast checks

133 total passing checks: 122 JavaScript + 11 Python backend. New coverage checks preset text/accent/button contrast, custom hex/contrast rejection, independent light/dark palettes, persisted palette restore, grouped navigation destinations/active submenu, rich forecast metric switching/year exploration, and unchanged plan/ledger. Backend confirms all index-referenced scripts are served, including appearance.js. CSS/browser visual and pointer/touch QA were not run.

## v0.8.0 membership and Forecast setup

142 passing checks (131 JavaScript + 11 Python). Added tier/feature inheritance, monthly/annual quote calculations, invalid price/catalog rejection, no-charge preview switching without data deletion, atomic draft pricing edits, cancel without mutation, Finish-only validated retirement/assumption commits, invalid retirement rejection, table tabs and event-template selection. Existing event scenario test now follows the new chooser workflow. No live payment transaction or server paid entitlement was implemented/tested. No browser visual QA was available.

## v0.8.1 horizontal page tabs

48 existing render checks and 11 backend checks pass. The fix explicitly overrides the inherited vertical nav flex direction, keeps tab buttons at intrinsic width, and adds palette-aware hover/focus/active indicators plus narrow-screen horizontal scrolling. No new calculation logic was introduced; the financial-engine suite was not rerun. Real-browser layout/hover verification remains unavailable.


## v0.9.0 Investment rebuild

**150 JavaScript checks + 11 Python backend checks pass (161 total).** New checks cover fractional holdings, current valuation versus historical cost FX, owner/shared/account filtering, null and zero cost, allocation conservation, fund-only metadata grouping, fixed-current-quantity capital-weighted backtest, historical FX and price/total mismatch, missing per-holding history, strict price CSV validation, safe money bounds, captured gain/ownership/FX history, date shortcuts, and formula-safe CSV output.

UI adapter checks cover Holdings/Advanced tabs, persisted creation/restore without double-counting assets, atomic invalid input, escaped labels, security quote import, household-only legacy TWR, fund exclusion/grouping, snapshot preservation on removal, account deletion guard, empty migration, and palette-resolved SVG export with empty-chart rejection. The manifest is verified as 0.9.0.

No real-browser rendering, hover/touch or mobile visual check was available because Chromium is not installed. The DOM adapter verifies behavior and markup, not CSS layout. No live broker/quote/Morningstar provider or production tax engine has been connected or tested. Input price/cost/FX fixtures are explicitly synthetic test data and do not ship as user performance history.


## v0.9.1 floating quick chat

58 render/handler checks and 11 Python backend checks pass (69 checks this release). Added behavior checks confirm minimize/reopen retains input/account/pending drafts, and Enter creates review without ledger mutation while Shift+Enter/IME composition do not submit. Existing capture, question routing, duplicate, Investment, Forecast and UI-handler checks remain passing. No financial-engine code changed. Native popover/CSS hover/layout and mobile visual checks remain unverified because no real browser binary is installed.


## v0.9.2 global chat and attachments

60 render/handler checks + 11 backend checks pass (71 checks this release). New checks cover exactly one composer on all 20 pages, absence of the removed header, preserved input/minimized state across navigation, camera/file attachment staging, file type/size rejection, escaped filenames, staging through page changes, explicit removal, and no ledger/workspace binary mutation. Existing rendering/capture/save logic checks pass; no financial-engine calculation changed. Native camera permissions, storage-picker behavior, physical camera/OCR integration for actual documents and CSS/browser/mobile visual interaction remain unverified.


## v0.10.0 multimodal assistant

**161 JavaScript + 19 Python checks pass (180 total).** Added checks cover migration/default permissions, preference limits/deduplication, bounded owner/shared-scoped history, escaping provider output, consent before sending, optional context exclusion, native-file staging and unchanged ledger workflows. Provider adapter fixtures cover Responses PDF/image payloads and store:false, Gemini native audio/system context, Muse extracted PDF, OpenAI audio transcription, invalid roles/files/models, empty responses, and credential-free configuration. An HTTP check verifies /api/chat CSRF, consent rejection and response forwarding.

External-provider requests are mocked. No real API credentials were supplied. Real browser layout, mobile/native camera and MediaRecorder microphone behavior were not tested in this environment. Key availability is not a live connectivity check. No autonomous model training, production member authentication, server-enforced subscriptions or direct AI financial mutation is implemented.


## v0.11.0 corrections, unified chat and 9Router

**167 JavaScript + 22 Python checks pass (189 total).** New cases cover immutable income-to-expense correction, repeated-save idempotence, journal-only corrections, preserved source IDs, captured-FX transfer reversal after rate changes, rejected invalid edits/missing FX and split changes, transaction dialog persistence, outside minimize retaining drafts/input, removal of marked controls, and unified AI drafts requiring explicit save. Gateway fixtures verify model IDs, server-only endpoint/key, unsafe URL rejection, PDF extraction and gateway-bound audio. AI intent tests reject invalid amounts, dates, currency and transfer drafts, and treat non-JSON as a question.

External gateway/provider responses are mocked; no live 9Router installation, upstream account or credential was supplied. No real browser/device layout, camera or microphone check is claimed.


## v0.12.0 actions and navigation icons

**174 JavaScript + 22 Python checks pass (196 total).** New cases cover inline edit/cancel/validation, saved popup, explicit deletion confirmation/cancel, income/expense reversal, captured-FX transfer deletion after rate changes, journal-only balance preservation, repeated deletion rejection, unsafe FX/overflow atomicity and storage failure keeping original financial state/draft. Navigation SVG shape uniqueness and report/investment/forecast tab icon markup are verified.

The DOM adapter verifies behavior/markup, not rendered browser layout. Real browser/device visual and pointer/tooltip QA remain unavailable in this environment. No new live integration was introduced or tested.


## v0.13.0 artwork and expense colors

**178 JavaScript + 22 Python checks pass (200 total).** New checks cover bounded raster data URLs, rejection of SVG/remote/oversized images, aggregate storage budget, mocked browser decode/re-encode upload/persist/restore/removal, unchanged balances/debts, rejected unsupported uploads, and expense/income/transfer classes across journal/report/recurring rows.

Canvas/device output and visual light/dark/browser layout are not verified in a real browser. Upload behavior uses mocked Image/FileReader/canvas. No live crypto exchange connector or credential has been configured.


## v0.14.0 verification

- Node tests cover Operations rules, ownership cents, pending/posted, snapshot
  policy/reconciliation, source tombstones, receipt matching, recurring proposals,
  signed refunds, card purchase/payment/delete/migration, historical averaging,
  withdrawal rank/start year, staged return rates and inflation-linked flows.
- Render tests exercise the Operations page/forms, rule creation, pending posting,
  observed balance capture and card metadata edits in the existing DOM adapter.
- Python tests verify local endpoint, release metadata, OCR and mocked external
  adapters. Live provider connectivity and actual browser/device layout remain
  unverified; this release does not establish production cloud readiness.

Final v0.14.0: 212 Node tests and 22 Python tests passed (234 total).


## v0.15.0 Holdings charts

231 Node tests and 22 Python tests passed (253 total). New checks cover stable portfolio dates when toggling benchmarks, missing observations, historical FX, scoped holdings, Return/Value geometry, sampling extrema, keyboard navigation, pointer pinning, touch exploration and accessible chart markup.

Light and dark chart SVGs were rendered and visually inspected. DOM interaction tests use an adapter. A real-browser run could not be completed because the Chromium download failed; responsive browser layout and native device interaction remain unverified. External live price feeds and authenticated Monarch pixel comparison were not performed.
