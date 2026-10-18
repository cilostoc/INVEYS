# v0.23.0 — 2026-10-17

- Pegadaian Mulia Physical Gold Installment Tracker & Financial Engine:
  - Dedicated investment tab (`Cicilan Emas`) specifically tailored for tracking physical 24K Galeri 24 gold financing contracts.
  - Pre-populated with real contract parameters (50.0g 24K Gold Bar, Initial Purchase Rp 126.604.000, 15% Down Payment Rp 19.040.600, Loan Principal Rp 107.613.400, 60-month tenor, Monthly Installment Rp 2.464.559).
  - 4 Live Key Performance Indicators (KPIs): Current 50g Market Valuation, Remaining Loan Principal, Net Gold Equity, and Break-Even Price (BEP) at Rp 3.338.282/gram.
  - Interactive Ownership & Tenor Timeline: visual progress bar and dual-bound range slider reflecting months completed vs remaining, cumulative installments paid, and current gold equity held.
  - Full 60-Month Amortization Schedule: month-by-month table detailing payment dates (Sept 2026 to Aug 2031), principal breakdown (Rp 1.793.557), flat mu'nah sewa modal fee (Rp 671.002), and paid/pending badges with standalone CSV export.
  - Real-Time Gold Price Simulator & 5-Year CAGR Projections: dynamic net profit/loss simulation with quick-preset buttons (Contract Inception Rp 2.532.080, BEP Rp 3.338.282, Today's Spot, and 5-Year compound annual growth projections of +8% Conservative, +12% Moderate, and +15% Bullish).
  - 1-Click Portfolio & Ledger Synchronization: seamlessly integrates the gold financing contract into investment accounts (`Pegadaian Mulia - Emas 50g`), security holdings (`GALERI24-50G`), debt liabilities (`Pembiayaan Emas Pegadaian Mulia`), monthly recurring bill flows (`Angsuran Emas Pegadaian Mulia`), and payoff savings goals.
  - Instant Monthly Payment Logger: 1-click 'Bayar Angsuran Bulan Ini' button that advances the tenor, decrements outstanding debt principal, accumulates gold savings equity, and creates a ledger expense entry.

# v0.22.0 — 2026-10-17

- 1-Click Automated VPS Update Engine & 4-Segment Architecture:
  - Structured application architecture into 4 isolated segments: Web Client & PWA Assets (`client`), Python API Gateway & Daemon (`backend`), SQLite Persistent Data Vault (`vault`), and Pipeline Engine (`pipeline`).
  - Automated 1-Click Update workflow: creates pre-flight SQLite snapshot backup to `~/.inveys/backups/`, recompiles standalone bundle (`inveys-app.html`), validates SHA-256 integrity checksums across all segments, and hot-reloads services with zero downtime and zero data risk.
  - Dedicated segment status check and diagnostic report modal in the Updates menu.
- Financial Heatmap Treemap Visualization:
  - Upgraded heatmap into a proportional full-view financial treemap without requiring vertical or horizontal scrolling.
  - Replaced single-click toggle with a sleek, proportional dropdown selector across Reports visualizations (Sankey, Donut, Bar, Heatmap).
  - Cleaned up obsolete Market Cap / Calendar view controls for a focused, streamlined experience.
- Vibrant Investment Performance Curves & Dynamic Gain/Loss Coloring:
  - Boosted visual contrast and saturation of investment return and asset performance graphs.
  - Dynamic typography coloring that automatically renders portfolio gains in vibrant emerald green and drawdowns in vibrant coral red.
- Smooth Interactive Slide Switches:
  - Upgraded Ghost Mode (privacy blur toggle) and Theme Switcher (Dark/Light) from simple click buttons into smooth, horizontal draggable slider toggles with physical pill handles and full ARIA accessibility (`role="switch"`, `aria-checked`).
- Clean Transaction Journal Presentation:
  - Eliminated redundant status dot indicators and duplicate converted currency amounts from source transaction listings for a decluttered, high-clarity ledger view.
- Streamlined Planning Navigation:
  - Removed nested sub-buttons (`[ Scenarios | Monte Carlo ]`) from the sidebar accordion, keeping the sidebar aesthetic minimal and consistent with other modules.
  - Scenarios and Monte Carlo simulations remain fully accessible via the top in-page planning switcher.
- Multi-Tier Cash Flow Sankey Overhaul:
  - Zero Ribbon Criss-Crossing: logical alignment of Column 3 allocation pillars (Fixed Obligations -> Flexible Spending -> Goals & Savings -> Net Free Cash Surplus) matching Column 4 categories directly across.
  - True Volumetric Fluid Ribbon Bands: rendered via closed cubic Bezier polygon SVG bands with soft source-to-destination gradients and interactive hover glow effects.
  - Horizontal Total Inflow Badge: replaced rotated -90° vertical text on the central inflow hub with a clear, readable horizontal card badge.
  - Spacious Layout: dynamic SVG height preventing text and amount overlap across category rows.

# v0.21.0 — 2026-10-14

- Submenu Hub Consolidation & Top Sub-Module Switcher Bars:
  - Consolidated 22 fragmented standalone views into cohesive functional hubs with instant 1-click top sub-tab switchers.
  - Accounts Hub: Accounts (`accounts`), Credit Cards (`cards`), and Debt & Liabilities (`debt`).
  - Ledger & Transactions Hub: Transactions (`transactions`), Smart Receipt Capture (`capture`), Master Categories (`categories`), and Batch Operations (`operations`).
  - Cash Flow & Budget Hub: Cash Flow Sankey (`cashflow`), Rollover Budgeting (`budget`), and Bill Calendar (`calendar`).
  - Financial Planning Hub: Long-Term Forecast (`forecast`), Savings Goals (`goals`), Scenario Modeler (`scenarios`), and Monte Carlo Simulator (`montecarlo`).
  - Shared Hub: Shared Accounts (`shared`) and Household Budgeting (`household`).
- Membership & Plan Tiers Alignment:
  - Transparent alignment of features across Core/Starter, Plus, Pro, and Ultra tiers.
  - Plus tier: Smart Receipt Capture (OCR), Bill Calendar, Rollover Budgeting, Savings Goals, and Automated Transaction Rules (`autorules`).
  - Pro tier: Smart Portfolio Rebalancer (`rebalance`), Scenario Modeler (`scenarios`), Monte Carlo Simulation (`montecarlo`), and Advanced Financial Health Audits.
  - Ultra tier: CCXT Cryptocurrency CEX Connectors (`crypto`), Unlimited Multi-Provider AI Routing, and Unlimited Data Operations.
  - Distinct interactive badges (`.badge.plus`, `.badge.pro`, `.badge.ultra`) styled seamlessly for both Light and Dark modes.
- Grounded Personal Financial Intelligence & Multi-Provider AI:
  - Enriched system context grounding in `inveys_ai.py` and `app.js` with direct user preference memory, asset grounding, and spending behavior history.
  - Explicit multi-provider support: Google Gemini, OpenAI (ChatGPT / GPT-4o), Anthropic Claude (via 9Router / OpenRouter), Meta AI (Muse Spark), and Local Offline Calculator.
  - Strict Read-Only Ledger Security: AI is architecturally prohibited from modifying or deleting transaction records without explicit user confirmation.
- Smart Auto-Correction & Merchant Normalization Engine:
  - Expense Outlier & Anomaly Detection: flags unusual spikes or aberrant category transactions.
  - Duplicate Transaction Shield: detects identical amounts and timestamps within rolling windows.
  - Smart Merchant Cleanup & Normalization: standardizes raw payment gateway strings (e.g. `GOPAY*TRANSJABODETABEK` -> `GoPay / Transjakarta`) based on learned user patterns.

# v0.20.0 — 2026-10-14

- Multi-Platform Crypto Exchange Connector (CCXT Integration):
  - Unified cryptocurrency exchange integration supporting 8 major exchanges: Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, and KuCoin via industry-standard CCXT library.
  - Read-Only Security Architecture: enforces read-only balance inspection (`Spot` and `Funding`), strictly forbidding withdrawal or trade execution permissions; credentials stay local on the user's private server.
  - Live Multi-Coin Valuation (USD & IDR): automatic real-time conversion for BTC, ETH, SOL, altcoins, and stablecoins into USD and IDR integrated with Frankfurter FX reference rates and intelligent offline/timeout fallback pricing tables.
  - Interactive Review & Dust Filtering: customizable minimum balance threshold (`minUsd: 1.0`) to suppress crypto dust, and interactive review modal with individual coin checkboxes prior to committing into investment holdings.
  - 1-Click Demo Simulation Mode: instant simulation mode (`apiKey: 'demo'`) returning realistic multi-coin portfolios to test integration workflows safely without real API credentials.
  - HTTP/SOCKS Proxy Support: user-configurable proxy endpoint to bypass ISP-level DNS or domain filtering common in Southeast Asia (e.g. Indonesia).
  - Integrations & Investment Page UI: dedicated Crypto Exchange Connectors card in the Integrations hub, plus 1-click "Sinkron Crypto CEX" button in the Investment Data & History toolbar.
  - Comprehensive Automated Testing: 100% test coverage across Node.js render tests and Python backend endpoint tests (246 Node tests + 13 Python tests passing).

# v0.19.0 — 2026-10-14

- Multi-Tier Interactive Cash Flow Sankey Diagram (Monarch Money Style):
  - Hierarchical multi-tier visual cash flow: Tier 1 (Income Sources) -> Tier 2 (Central Inflow Hub) -> Tier 3 (Core Pillars: Goals & Investments, Fixed Bills & Debt Obligations, Flexible Spending) -> Tier 4 (Specific Categories & Net Free Cash Surplus / Gap).
  - Prominent Savings Rate % metric card and real-time badge calculating exact portion of monthly income preserved for future wealth.
  - Interactive month filter dropdown (`Plan Baseline` vs actual historical transaction months like `2026-10`).
  - 1-click standalone SVG export (`inveys-cashflow-sankey.svg`) preserving current theme palette.
  - Full compatibility with Ghost Mode privacy masking (`.sankey-val`).
- Portfolio Target Asset Allocation & Smart Rebalancer (Monarch Money Investments Style):
  - Target Asset Allocation in workspace state (`s.targetAllocations: [{ id, assetClass, percent }]`).
  - 4 Industry-Standard Model Allocation Presets (1-Click): 60/40 Classic Balanced, 80/20 Aggressive Growth, All-Weather Portfolio, and Conservative Income.
  - Live Drift Analysis: computes actual portfolio weight vs target allocation percentage, color-coded status badges (`Overweight`, `Underweight`, `Balanced`), and overall portfolio Drift Score (0–100).
  - Smart Rebalance Calculator: computes precise BUY/SELL actions and amounts to restore targets.
  - Cash-Only Rebalance Simulation: simulator allocating new cash deposits exclusively to underweight assets without selling winners, minimizing transaction fees and tax burdens.
  - Interactive Target Allocation configuration modal (`openTargetAllocationModal`) with add/remove rows, percent validation, and quick model presets.

# v0.18.0 — 2026-10-14

- Flexible Category Budgeting with Rollover (Monarch Money Style):
  - Dedicated Budget navigation item and view (`budgetView()`) with monthly navigation and category group filtering.
  - Multi-group categorization distinguishing Flexible Expenses (Discretionary Pool) from Fixed Bills & Commitments.
  - Automatic surplus/deficit rollover engine (`monthlyBudgetSummary`), allowing unspent budget from previous months to carry forward or deduct overspending from current month capacity.
  - Budget setup modal with interactive group assignment and 1-click rollover toggle.
  - One-click copy or auto-generation of budgets from historical transaction spending habits.
- Spending Pace Indicator & Real-Time Dual Track:
  - Visual monthly pace tracker comparing days elapsed in the month against percentage of budget spent.
  - Real-time status indicators (`On Track`, `Pacing Fast`, `Over Budget`) with contextual coaching messages.
  - Dual progress bar track visualizing time elapsed vs budget consumed simultaneously.
- 1-Click Transaction Automation Rules (Monarch Style):
  - Added instant lightning button (`⚡`) to each transaction journal row to create an automation rule pre-populated with merchant name, transaction type, and category.
  - Clean merchant renaming (`actions.name`) while preserving original journal raw descriptions.
  - Automatic prompt for retroactive rule execution with preview on matching historical transactions.
- Transaction Automation Rules Manager:
  - Accessible directly from Transactions toolbar via "⚡ Aturan otomatis" button.
  - Modal interface to view, enable/disable, edit, delete, and retroactively execute automation rules across all records without balance changes.

# v0.17.0 — 2026-10-14

- Global Ghost Mode / Privacy Toggle (Monarch Money Style):
  - Added 1-click global privacy button (`👁` / `🔒`) in the top navigation bar header.
  - Automatically masks and blurs all sensitive monetary numbers, net worth, account balances, holding values, cash flow amounts, and calendar chip figures (`.privacy-on`).
  - Persists preference reliably in browser `localStorage` (`inveys_hide_money`).
- Recurring Cash Flow & Payday Calendar (Cash Timing Grid):
  - Integrated scheduled income paydays (inflows) onto the monthly visual calendar as green chips alongside bill outflows.
  - Added month-level Net Cash Flow summary indicator (`Net Kas Proyeksi = Expected Inflows - Expected Bills`) to instantly spot liquidity gaps before bills fall due.
  - Added quick-toggle status and payment recording modals for scheduled income.
  - Added dedicated scheduled inflows breakdown in the calendar list view.
- Spend From Goal (Belanja dari Target Tabungan):
  - Added goal linkage (`goalId`) in the Monarch transaction modal for expense transactions.
  - Deducts purchase amount directly from accumulated goal savings reserve (`goal.saved`) via `E.spendFromGoal` without inflating regular operating monthly discretionary budgets.
  - Displayed "Dibelanjakan dari target" (Spent from goal) tracking in the Goals & Plans view.
  - Automated Goal Reserve Restoration: Deleting or modifying a goal-linked expense transaction automatically restores or recalculates the goal reserve balance without affecting total assets.

# v0.16.5 — 2026-10-14

- Interactive Investment Visualizer & Sample Portfolio Generator:
  - Added 1-click "Muat data contoh" (Load sample data) button in the Investment empty state and Data & History toolbar.
  - Automatically loads 4 realistic holdings (`VOO`, `AAPL`, `BND`, `BBCA`), 52 monthly historical closing quotes, and 5 benchmark series (`S&P 500`, `US Total Stock`, `US Bond`, `Bitcoin`, `IHSG`), immediately activating the interactive TWR performance curve, benchmark comparisons, and allocation donut chart.
  - Generates 13 historical monthly snapshots for unrealized gain & loss curve analysis.
- Automated Market History Endpoint in Backend (`/api/market-history`):
  - Implemented `/api/market-history` in `serve.py` with standard library `urllib.request`.
  - Supports automated EOD historical quotes for US securities (`VOO`, `AAPL`), Indonesian IDX stocks (`.JK`), and Crypto (`BTC-USD`) with zero external pip dependencies.
- Live Market Price Syncing:
  - Added "Sinkron harga live" (Sync live prices) in the Investment Data & History panel to fetch and update closing quotes for all active holdings without date collisions.
- Standalone CSV Sample Dataset:
  - Exported ready-to-import sample files (`inveys-investment-sample.csv`) for direct manual import and verification.

# v0.16.4 — 2026-10-14

- Comprehensive Stability & Performance Audit:
  - Guarded modal error elements in `openModal` against null target exceptions when submitting custom forms.
  - Optimized modal lifecycle and event listeners to prevent duplicate listener accumulation on repeated dialog opens.
- Category Group Creation Bug Fix & Custom Category Edit:
  - Fixed bug where newly created custom category groups were omitted from the category creation dropdown.
  - Added inline edit button (✏️) on custom category rows in Settings to modify category names, groups, and emoji icons.
- Financial Heatmap & SVG Export Refinements:
  - Added descriptive empty states for filtered spending and income tabs when no matching transactions occur.
  - Calculated daily activity using absolute transaction volume to prevent negative adjustments from distorting heat intensity.
  - Refined chart export notifications for clear user feedback.
- Chatbox Popover & Attachment Polish:
  - Added automatic reverse rotation for (+) button when launching secondary modals (new chat, AI settings).
  - Configured specialized file type filters for Document (`.pdf`, `.csv`, `.txt`, images), Video (`.mp4`, `.webm`), and Audio (`.m4a`, `.wav`).
  - Constrained Monarch transaction dialog to viewport with smooth internal scrolling, preventing clipping across small screens.
- Server & Environment Robustness:
  - Wrapped Pillow OCR image import in `serve.py` with fallback error handling to return informative feedback on unconfigured servers.

# v0.16.3 — 2026-10-13

- Unified 1-Click Chart Selector in Reports:
  - Replaced duplicate dropdown menu with modern animated segmented toggle buttons (Sankey, Donut, Bar, Heatmap).
  - Cleaned up reports toolbar layout and harmonized tab-specific chart choices.
- Interactive Financial Heatmap (replacing Treemap):
  - Daily spending activity & intensity calendar heatmap displaying transaction volume, date badges, and color intensity gradients.
  - Interactive category concentration matrix with emoji avatars, contribution percentages, and 1-click drill-down filtering.
  - Direct Heatmap SVG export support via chart export button.
- Smooth Chatbox (+) Button Spin Animation:
  - Attachment (+) button rotates smoothly 405° (one full turn + 45°) into a red cross (✕) when opened.
  - Button rotates back to its original (+) state immediately after adding a document/file or when dismissed.
- Seamless & Floating Chat Attachment Popover:
  - Redesigned modern floating popover card with 2x2 media grid (Camera, Document, Video, Audio).
  - Eliminates vertical cut-offs, viewport clipping, and awkward scrollbars on standard displays.

# v0.16.2 — 2026-10-13

- Monarch Money-style Reports Sub-menu Overhaul:
  - Clean, modern, colorful financial reports UI with 6 distinct animated tabs (Arus Kas / Cash Flow, Pengeluaran / Spending, Pendapatan / Income, Kekayaan Bersih / Net Worth, Hutang / Debt, Kartu Kredit / Cards).
  - Vibrant Flowing Sankey Ribbon Diagram: dynamic multi-colored bezier ribbons mapping income sources directly to category expenditures and net income/savings, featuring category emoji badges, percentage labels, and interactive hover glow effects.
  - Multi-colored Donut / Ring Chart: 10 vibrant color palette slices for Spending and Income breakdown, centered total KPI display, and interactive category legend with direct drill-down links.
  - 4 Monarch-style Executive Metric Cards: responsive top summary cards (Total Income, Total Expenses, Net Income, Savings Rate) with colored value pills and trend indicators.
  - 2-Column Split Grid Architecture:
    - Left Timeline (~70%): date-grouped transaction list with sticky date headers, daily sums, category avatars, merchant names, owner pills, account badges, and expense coloring.
    - Right Summary Panel (~30%): Monarch Period Summary card showing total transactions, largest expense, average daily spending, total income/spending, date span, and 1-click CSV export.
  - Quick Chart Controls: 1-click switcher buttons for [🌈 Sankey], [🍩 Donat / Ring], and [📊 Bar / Batang] chart views.
  - Harmonized Net Worth, Debt, and Cards position reports with matching top metric cards and clean layout.

# v0.16.1 — 2026-10-13

- Compact & Proportional Add Transaction Modal:
  - Redesigned 2-column grid layout for paired transaction fields (Amount + Merchant, Date + Source Account, Category + Goal, Notes + Tags).
  - Constrained modal dialog height to under 440px to completely avoid vertical scrolling on standard laptop and desktop screens.
  - Retained all rich Monarch Money features: segmented Debit/Credit/Transfer selector, currency-aware amount formatting, adjust balance card toggle, and goal allocation.
- Category Management Relocated to Settings:
  - Cleaned up primary navigation sidebar under Keuangan by moving Categories into the Settings (Pengaturan) screen.
  - Maintained instant access to the full Categories Manager via dedicated action cards in Settings.
- Unified Planning Scenarios & Monte Carlo:
  - Consolidated Skenario and Monte Carlo into a single unified navigation group under Perencanaan (Planning).
  - Integrated 1-click header switcher tabs enabling seamless toggling between Planning Scenarios and Monte Carlo probability simulations.
- Powerful Tanya INVEYS Chatbox (ChatGPT & Gemini style):
  - Streamlined modern conversation dock with message bubbles, typing shimmer indicators, and quick question starter pills.
  - Enhanced multi-format attachments: support for images (PNG/JPEG/WebP), documents & PDFs, audio, and video (MP4/WebM/QuickTime) with distinct visual category badges and attachment preview popovers.
  - Safe payload limits (< 8 MB) and keyboard shortcuts (Enter to submit, Shift+Enter for newline).
- Simplified Integrations with Animated Connection Topology:
  - Simplified integrations overview into 4 clean cards (AI Provider, Telegram Alerts, Live FX Rates, Python Core Engine).
  - Interactive SVG connection topology diagram featuring glowing animated pulse data streams connecting the INVEYS Central Hub with external nodes.
  - Added interactive "Tes Status Semua Integrasi" button to simulate real-time ping and latency across all connected services.

# v0.16.0 — 2026-10-13

- Monarch Money-style Add Transaction Modal: top segmented toggle (Debit, Credit, Transfer),
  large currency-aware amount input with dynamic symbol prefix, merchant autocomplete from previous records,
  date picker with calendar icon, dynamic goal linking ("Withdraw from save up goal" / "Link to save up goal"),
  interactive tag chips (e.g. Business ✕), notes input, and adjust account balance toggle switch card
  (enabling clean historical journal entries without affecting account balances).
- Interactive Category Popover Flyout: real-time search filtering ("Search categories..."), emoji avatars,
  and comprehensive groups (Income, Bills & Utilities, Food & Dining, Auto & Transport, Housing,
  Gifts & Donations, Travel & Lifestyle) with integrated "+ Create new category" modal.
- Categories Manager Page: Monarch-inspired category groups, transaction counts per category,
  reorder drag handles (`⋮⋮`), custom category creation with emoji selector, and custom group support.
- Visual Category Avatars in Transaction Journal: transactions now display elegant rounded emoji avatars
  for fast, intuitive visual identification across all journal entries.
- Visual Bills & Subscriptions Calendar inspired by Monarch Money: 7-column interactive monthly grid,
  due/paid/overdue status chips, summary metrics (Total Expected, Paid so far, Remaining Due, Active Count),
  and quick month navigation.
- Dual visual modes: interactive Calendar grid and prioritized List view (Overdue, Due in 7 Days,
  Later this Month, Paid) with instant mark-as-paid toggles.
- Direct payment recording into liquid accounts (creating matching journal expense records atomically)
  and full subscription CRUD modals with emoji pickers, categories, and monthly/annual cadence.
- Hostinger KVM 4 VPS Deployment & Security: Master Password lock screen modal, session token verification,
  automatic SQLite persistent storage synchronization (`serve.py`), systemd daemon service, and nginx proxy setup.

# v0.15.0 — 2026-10-09

- Redesign Holdings performance summary, range shortcuts, benchmark cards, and responsive light/dark chart styling.
- Add unified pointer/touch/keyboard tooltip, pin/reset, Return/Value toggle, and per-holding chart drilldown.
- Keep portfolio timeline stable with sparse benchmarks, expose gaps and comparable end-date availability,
  retain calendar spacing and extrema.
- Preserve existing workspaces, journal/account data, Operations, and Advanced analytics.

# v0.14.0 — 2026-10-06

- Add Operations: metadata/ownership rules, retroactive preview, review queues,
  snapshot reconciliation, local activity, recurring proposals and receipt matching.
- Keep deleted/linked source IDs protected against accidental reimport.
- Add signed refunds and conserved Sankey flows for refund-only periods.
- Record card purchases as debt increases and card payments as internal transfers;
  migrate legacy payment expenses without replaying balances.
- Extend Forecast/Monte Carlo assumptions with available history, inflation-linked
  flows, withdrawal order/start year and staged return rates.
- Preserve existing IDR/FX, investment, Shared Views, AI, themes and plan previews.
- Document current implementation and external/production work still required.

# v0.13.0 — Credit card artwork and red expenses

- Card artwork upload/replace/remove and realistic aspect-ratio preview. Native browser decode/downsize/re-encode strips source metadata, with 8 MB input, 20 MP, per-image and aggregate workspace limits.
- Atomic persistence, stale upload fencing, backup/restore validation and retained card/debt/financial metadata. Artwork is local workspace data and is not sent to AI.
- Red expense amounts in journal and source reports, recurring expense rows and draft amount inputs; income/transfer semantics retained. Palette-compatible light/dark red styles.
- Crypto exchange connection remains a future connector requiring exchange selection; no live account sync is claimed.

# v0.12.0 — Journal action column and distinct icons

- Dedicated Actions column; inline pencil edit, disk save, X cancel and trash delete controls with labels/tooltips/focus indicators. Original full transaction amounts are used for edits, independent of view splits.
- Draft inputs do not mutate records. Validation/storage failure preserves the original workspace. Success popup with check icon follows persisted correction. Search/type filters survive renders.
- Confirmed deletion reverses recorded income/expense or both transfer impacts atomically, using captured historical received amounts; historical journal-only entries keep balances unchanged. Unsafe reversal/overflow is rejected.
- Distinct SVGs for all sidebar destinations and groups, About/Settings and report/investment/forecast tabs. Palette-aware icon styling and responsive table scrolling.

# v0.11.0 — Corrections and unified chat

- Edit transaction dialog and immutable correction engine; reverse/apply financial effects once, preserve historical-journal balance policy, source identity and transfer FX metadata. Atomic rejection for unsafe missing historical FX, invalid data, overflow or financial changes to a split record.
- Outside click/pointer minimize updates only the dock in a real DOM, avoiding replacement of page forms. Reopen retains text, attachments and drafts. Removed inline provider, modes and minimize actions.
- Unified server AI intent schema stages bounded income/expense drafts for explicit review. Captures selected account/document policy before asynchronous requests. No automatic ledger execution.
- Assistant settings in Integrations; OpenAI-compatible 9Router chat, image, extracted-text PDF and gateway transcription support. Server-only environment configuration, validated endpoint, no redirect forwarding of credentials. Model/media compatibility depends on the gateway.
- Full copilot uses the selected assistant and scoped persisted history.

# v0.10.0 — Multimodal INVEYS assistant

- Conversation thread, Ask/Record modes, provider dropdown and explicit minimize button. Removed marked bottom caption.
- Native MediaRecorder microphone capture, image/PDF/TXT/CSV/audio attachments (8 MB), native camera where supported.
- Read-only server adapters: OpenAI Responses plus transcription, Gemini generateContent, Muse Spark chat plus existing extraction/transcription. Credentials from environment only; consent required before sending.
- Optional editable preference memory and financial summary; owner/shared-scoped conversation history with bounded retention. No autonomous model training or ledger execution.
- Provider payloads, consent, context scoping, escaping, file limits, migration and existing financial workflows verified with tests. Live API and real-browser visual/device QA remain unverified.

# v0.9.2 — Compact global chat and camera/file attachment

- Removed the marked chat header; minimize and full-chat navigation now live in the + popover.
- One chat composer on all menu/submenu pages; no duplicate composer on the dashboard. Shared pending Capture drafts render once on the Capture page.
- Direct hidden native inputs for camera (capture=environment where supported) and storage image/PDF selection. Staged files persist in memory across page changes and are excluded from workspace storage/export.
- PNG/JPEG/WebP/PDF, max 8 MB. Explicit extract/review uses local OCR/text-PDF processing; account/source type captured before asynchronous work, with generation guard against removed/replaced attachments and workspace resets.
- Voice capture and record-save status work beyond Dashboard. Current ownership perspective also scopes the chat account chooser.

# v0.9.1 — Floating chat and sidebar type

- About INVEYS / Settings & data labels use 13px sidebar typography; 19px icon sizing remains scoped to the icon.
- Large dashboard capture card replaced by a compact bottom floating chat with + popover, recording account, receipt/statement and audio Capture shortcuts, microphone and send controls.
- Minimize/reopen preserves typed input, selected account and pending drafts. Full chat remains accessible.
- Enter submits to the existing question/draft pipeline; Shift+Enter retains multiline input and IME composing Enter is ignored.
- Popover closes on outside click/Escape; responsive dock respects pinned desktop sidebar and mobile safe area. Review remains separate from saving.

# v0.9.0 — Investment workspace

- Holdings / Advanced mengikuti struktur interaksi referensi gambar dan video. Tab horizontal, hover/focus/active, filter akun, periode dan mata uang.
- Holdings mencatat sekuritas, unit pecahan, harga/sumber/tanggal, cost basis dan kurs biaya historis. Valuasi tidak mengubah saldo akun/net worth.
- Backtest price-only memakai kuantitas saat ini yang tetap, harga dan kurs historis pada tanggal bersama; TWR impor seluruh keluarga tersedia terpisah.
- Advanced: Allocation pie/breakdown; unrealized Gains & Losses dengan bar dan snapshot history; Funds ETF/reksa dana dengan klasifikasi manual.
- Migrasi workspace lama, validasi atomik, ekspor CSV/SVG, penolakan penghapusan/perubahan tipe akun yang masih berisi holdings.
- Tidak ada live market feed, broker sync, data Morningstar otomatis, analisis tax lot FIFO atau tax reporting.

## 0.8.1 — 2026-10-03

- Fix page tabs inheriting vertical flex direction from sidebar navigation.
- Reports and Forecast tabs remain horizontal with narrow-screen scrolling.
- Add palette-aware hover/focus fill and compact active underline.
- Existing render/backend regression checks pass; browser visual QA unavailable.

## 0.8.0 — 2026-10-03

- Plus/Pro/Ultra catalog, editable draft IDR pricing and no-charge preview tiers.
- Consistent typography and numeric/table styling.
- Video-inspired Forecast setup, year-by-year account/cash flow matrix, events tab and template chooser.
- Safe cancel/commit of setup; existing records remain on preview downgrades.
- 131 JavaScript + 11 backend checks pass. Paid checkout, server entitlements and browser visual QA are not active.

## 0.7.0 — 2026-10-03

- Charcoal dark mode and consistent palette-driven surfaces, labels, controls and chart accents.
- Four palette families and independent custom light/dark colors with readability checks.
- Grouped navigation with expandable submenus.
- Monthly forecast chart, event badges, scenario overlay, metric picker and year explorer.
- 122 JavaScript + 11 backend checks pass; real-browser visual QA not available.

## 0.6.0 — 2026-10-03

- Compact icon sidebar expands on hover/keyboard, with pin and mobile backdrop.
- Cleaner page spacing, hierarchy, theme styling and Reports controls.
- Reports: Sankey/Bar selector, surplus ratio, proportional cash-flow model, monthly paired bars.
- Sankey and Bar SVG exports match the selected chart.
- 115 JavaScript + 11 backend checks pass; no real-browser visual validation available.

## 0.5.0 — 2026-10-03

- Investment menu: five benchmarks, historical CSV import, account allocation, period/currency filters.
- Cash-flow-adjusted performance, historical FX, matched dates and return-basis checks.
- Comparison chart/table and export; no live price-provider connection.
- 108 JavaScript and 11 backend tests.

## 0.4.1 — 2026-10-03

- Quick capture and local copilot composer on the dashboard.
- Inline editable draft review, duplicate protection, explicit account selection.
- Scan handoff to Capture and browser voice input with consent.
- 97 JavaScript tests and 10 backend tests.

# INVEYS changelog

## 0.4.0

- Shared Views: pemilik akun/transaksi, split nominal/persentase, editor massal dan tampilan tersimpan
- Reports: cash flow, spending, income, snapshot net worth, debt dan credit cards
- Grafik batang/Sankey/treemap, drill-down, filter, saved reports dan ekspor CSV/SVG
- Forecast bulanan/tahunan, asumsi per akun, kejadian hidup dan perbandingan skenario
- Monte Carlo terpadu dengan akun, utang, life events, dan aturan shortfall
- Dashboard dapat dikustomisasi dan navigasi terkelompok

## 0.3.0

- Telegram inbox dan pengiriman pesan dengan persetujuan pengguna
- Muse Spark: asisten AI dan transkripsi audio
- OCR struk/statement, review draft, dan indikator duplikasi
- Kurs referensi otomatis dan pusat pembaruan

## 0.2.0

- Bahasa Indonesia/English, multi-currency, tema terang/gelap
- Editor owner, Monte Carlo, dashboard kartu kredit

## 0.1.0

- Financial operating system lokal: akun, transaksi, cash flow, goals, utang
