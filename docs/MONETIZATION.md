# INVEYS monetization blueprint — v0.8.0

Plus, Pro and Ultra are implemented as a reviewable catalog and no-charge UI preview. This file defines the remaining work required for paid subscriptions. The current local app does not accept payments or authenticate subscribers.

## Draft commercial model

| Tier | Monthly IDR | Annual IDR | Positioning |
|---|---:|---:|---|
| Plus | 49,000 | 490,000 | Everyday financial operations, reports and core forecasting |
| Pro | 129,000 | 1,290,000 | Deeper investment comparisons, scenarios and Monte Carlo |
| Ultra | 299,000 | 2,990,000 | Advanced channels and external AI workflows |

These are editable product assumptions, not market-validated prices. Annual amounts are explicit SKU prices; a discount is computed only against twelve monthly payments. Prices do not use workspace exchange rates. Tax, trial, promotional discounts, refunds and cancellation/grace rules must be defined before selling subscriptions.

Current preview creation limits are 1/5/20 saved scenarios and 3/20/100 events per plan. Core record reading/export remains available after a preview downgrade. No data is deleted because a lower tier is selected. External integrations still depend on separately configured provider access and consent. Ultra does not imply unlimited API usage, unlimited AI tokens or an active Muse/Telegram connection.

## Trust boundary

commercial.previewTier and commercial.prices in localStorage are demonstration preferences. Users can change them and bypass browser checks. They must never grant paid access on a production server. Price editing currently has no role boundary because this app has no identity system; it must become an administrative operation in a hosted service.

Production models should include authenticated users, household/tenant membership, billing accounts, catalog/SKU versions, provider customers, subscriptions, billing events, entitlement snapshots and usage records. Keep catalog IDs distinct from provider-specific price IDs and preserve the purchased version for existing subscriptions.

## Hosted payment lifecycle

1. An authenticated household owner chooses tier and billing cycle. The backend validates allowed SKUs and creates a hosted checkout session using server-held provider credentials.
2. The browser opens the provider-hosted checkout. INVEYS should not collect card numbers in its own forms.
3. Returning to a success URL is provisional. The server waits for verified provider events before granting an entitlement.
4. A webhook validates the provider signature against the raw request payload, records the event ID uniquely, and applies subscription/entitlement changes transactionally. Replayed events must have no extra effect.
5. The frontend fetches current entitlements from the authenticated server. Protected APIs check them again before costly AI/provider actions or premium resource creation.
6. Cancellation, renewal failure, refund and downgrade events update verified subscription state. Existing financial records remain available under the chosen read/export/grace policy.
7. Provide provider-hosted billing management and a clear renewal/cancellation summary once the commercial policy is decided.

Provider selection, credentials, merchant/entity setup, persistent database and authentication are not configured in v0.8.0. No provider-specific API compatibility is implied by this blueprint.

## Entitlements and usage

Use stable feature keys such as core, forecast, investment, montecarlo, scenarios and integrations. A server capability response should distinguish feature availability from creation quotas, current usage and service configuration. A paid entitlement does not imply that an external account is connected.

Count scenario/event creation atomically in the tenant database; local counters are not authoritative. Define external AI and document processing budgets in measurable units before advertising limits. Meter requests on the server and reserve usage before provider calls; release reservations for retryable failures according to the configured policy. Separate household subscription status from individual role permissions.

## Launch validation

Production readiness requires verified checkout/webhook flows, duplicate/out-of-order billing event tests, tenant isolation, role-protected price configuration, API entitlement checks, renewal/downgrade/read-only behavior and clear invoice/tax/cancellation terms. Test recovery after webhook outages and ensure payment/provider failures cannot corrupt the financial ledger.

Current automated checks validate catalog amounts, tier ordering, draft updates, no-charge preview and preservation of financial data. They do not validate live billing. Typography and Forecast workflows still require actual browser/mobile QA before production release.
