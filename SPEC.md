# Signup Payments Feature Spec

Extracted from the `payments-prototype/` Vite app. Framework-agnostic — describes **what** the feature does, not how any specific UI library renders it.

---

## 1. Data Model

### SignupList (top-level entity)

| Field | Type | Notes |
|---|---|---|
| `paymentsEnabled` | boolean | Master toggle. When false, no payment UI appears anywhere. |
| `chargeMode` | enum: `per-spot` \| `per-household` | Determines where pricing is configured and how costs are calculated. |
| `fundId` | foreign key | Which giving fund payments are allocated to. |
| `suggestedDonation` | boolean | If true, amounts are suggestions — respondents can adjust. |
| `requirePayments` | boolean | If true, full payment is required to hold spots. |

### SignupLevelPricing (only used when `chargeMode = per-household`)

| Field | Type | Notes |
|---|---|---|
| `pricingMode` | enum: `per-spot` \| `per-household` | Within household mode, price can still be calculated per-spot (then optionally capped) or flat per-household. |
| `price` | decimal | Base price per unit (spot or household, depending on `pricingMode`). |
| `maxPriceEnabled` | boolean | Only available when `pricingMode = per-spot`. |
| `maxPrice` | decimal | Caps total household cost across all items. Excludes per-item additional fees. |
| `earlyBirdEnabled` | boolean | |
| `earlyBirdDate` | date | Discount ends on this date. |
| `earlyBirdPrice` | decimal | Price per unit during early bird window. |
| `latePricingEnabled` | boolean | |
| `lateDate` | date | Late fee starts on this date. |
| `latePrice` | decimal | Price per unit during late window. |

### SpotTimePricing (only used when `chargeMode = per-spot`)

Dates are set at the signup level; prices are set per-item.

| Field | Type | Notes |
|---|---|---|
| `earlyBirdEnabled` | boolean | |
| `earlyBirdDate` | date | Discount ends on this date. |
| `lateFeeEnabled` | boolean | |
| `lateFeeDate` | date | Late fee starts on this date. |

### SpotMaxPrice (only used when `chargeMode = per-spot`)

| Field | Type | Notes |
|---|---|---|
| `enabled` | boolean | |
| `maxPrice` | decimal | Max a household pays across all items (excludes additional fees). |

### ItemPricing (per signup item, only editable when `chargeMode = per-spot`)

| Field | Type | Notes |
|---|---|---|
| `itemPaymentsEnabled` | boolean | Per-item toggle. |
| `pricingMode` | enum: `per-spot` \| `per-household` | Item can independently choose per-spot or per-household pricing. |
| `price` | decimal | Base price for this item. |
| `maxPriceEnabled` | boolean | Max per household for **this item** specifically. |
| `maxPrice` | decimal | |
| `earlyBirdEnabled` | boolean | Opt-in per item. Date inherited from SpotTimePricing. |
| `earlyBirdPrice` | decimal | |
| `lateFeeEnabled` | boolean | Opt-in per item. Date inherited from SpotTimePricing. |
| `latePrice` | decimal | |

### AdditionalFee (per item, always editable regardless of charge mode)

| Field | Type | Notes |
|---|---|---|
| `title` | string | e.g. "T-shirt fee", "Materials fee" |
| `amount` | decimal | Flat fee added on top of item pricing. |

---

## 2. Business Rules

### Master toggle
- When `paymentsEnabled = false`: no payment config UI is shown. Items tab has no "Take Payments" sub-tab.
- When toggled on: charge mode selection and all downstream config become available.

### Charge mode determines configuration ownership

| Charge Mode | Pricing lives at | Items see |
|---|---|---|
| `per-spot` | Each item's "Take Payments" sub-tab | Editable price, max, time-based prices |
| `per-household` | Signup-level "Take Payments" tab | Read-only inherited view with "Edit in Take Payments" link |

### Per-household pricing rules
- `pricingMode` toggle (per-spot / per-household) controls whether the base price is multiplied by spots or is a flat household charge.
- `maxPriceEnabled` is only available when `pricingMode = per-spot` (when per-household, a max cap is meaningless since price is already flat).
- Early bird and late pricing each independently have: a date cutoff and a price override (same unit as `pricingMode`).
- Time-based pricing sections include both date AND price fields because pricing is centralized.

### Per-spot pricing rules
- Signup level sets **dates only** for early bird / late fee (no prices — those are per-item).
- Signup level can set a **max per household across all items**.
- Each item independently opts into early bird / late fee. The date is inherited (read-only at item level); the price is item-specific.
- Each item has its own `pricingMode` toggle (per-spot / per-household) and its own max-per-household cap.
- Per-spot info banner at item level says: "dates from signup level" with a link back to "Edit dates."

### Additional fees
- Always editable at the item level, regardless of charge mode.
- Excluded from household max cap calculations.
- Each fee has a name and a flat dollar amount.

### Suggested donation
- When enabled, displayed amounts are suggestions — respondents can adjust.
- Available in both charge modes.

### Require payments
- When enabled, full payment is required to hold spots.
- Available in both charge modes.

### Input validation
- All price fields accept only digits with up to 2 decimal places (`/^\d*\.?\d{0,2}$/`).
- Enabling a max/early-bird/late-fee auto-focuses the associated price input.

---

## 3. UX Flows

### Flow A: Edit Signup (existing signup)

**Tab structure:**
```
[Items] [Respondent Data] [Take Payments] [Signup Options]
```

**Take Payments tab:**
1. Master checkbox: "Take payments with this Signup"
2. If enabled:
   a. Fund selector dropdown
   b. Charge mode radio: "Charge per spot" / "Charge per household"
   c. Mode-specific pricing config (see below)
   d. Bottom options: "Collect as suggested donation" checkbox, "Require Payments" checkbox

**Per-spot selected (Take Payments tab):**
- Max per household card (checkbox + price input)
- TIME-BASED PRICING section header
  - Early Bird toggle (checkbox) → if on: date picker for "Discount ends"
  - Late Fee toggle (checkbox) → if on: date picker for "Late fee starts"
- "Set item prices" link → navigates to Items tab

**Per-household selected (Take Payments tab):**
- Pricing card:
  - Price per [spot|household] with toggle buttons
  - Price input
  - If per-spot mode: Max per household checkbox + price
- TIME-BASED PRICING section header
  - Early Bird toggle → if on: date picker + price input
  - Late Fee toggle → if on: date picker + price input

**Items tab:**
- Left sidebar: list of items + "Add New Item" button
- Right panel sub-tabs: `Info | Additional Info | [Take Payments] | Respondents`
  - "Take Payments" sub-tab only appears when `paymentsEnabled = true`

**Item Take Payments sub-tab (per-spot mode):**
- Per-item "Take payments for this Item" checkbox
- Info banner: "Per-spot pricing — dates from signup level" with link to edit dates
- Pricing card: price input + per-spot/per-household toggle + max per household for this item
- TIME-BASED PRICING (only if signup has early bird or late fee enabled):
  - Early Bird: shows inherited date (read-only), opt-in checkbox, price input
  - Late Fee: shows inherited date (read-only), opt-in checkbox, price input
- ADDITIONAL FEES section: add/remove fee rows (name + amount)
- Save / Cancel buttons

**Item Take Payments sub-tab (per-household mode):**
- Per-item "Take payments for this Item" checkbox
- Locked banner: "Per-household pricing — configured at signup level" with "Edit in Take Payments" link
- Read-only card showing inherited: price, pricing mode, max, early bird summary, late fee summary
- ADDITIONAL FEES section (still editable)
- Save / Cancel buttons

### Flow B: Create Signup (wizard)

**Steps:**
```
[Type] > [Title] > [Take Payments] > [Pricing]
```

**Step 1 — Type:** Choose signup type (Event, Class, Fund Raiser, etc.).

**Step 2 — Title:** Name and description.

**Step 3 — Take Payments:**
- Radio choice:
  - "Make it free to sign up" → selecting this and clicking next skips to creation (no step 4)
  - "Charge a fixed amount" → proceeds to step 4
  - "Suggest a donation" → proceeds to step 4 with donation note banner

**Step 4 — Pricing:**
- If free was selected: shows "No pricing needed" message
- Otherwise: charge mode radio (per-spot / per-household) with inline pricing config

**Step 4 — Per-spot selected:**
- Max per household card (same as edit view)
- Note: "You'll set individual item prices after creating the signup."
- Collapsible "Advanced: Time-based pricing" section:
  - Early Bird toggle → date picker + note: "Early bird prices will be set on each item after creation."
  - Late Fee toggle → date picker + note: "Late fee prices will be set on each item after creation."

**Step 4 — Per-household selected:**
- Price per [spot|household] card with toggle + price input
- If per-spot: max per household card
- Collapsible "Advanced: Time-based pricing" section:
  - Early Bird toggle → date picker + price input (inline, since pricing is centralized)
  - Late Fee toggle → date picker + price input

---

## 4. Key UX Patterns to Replicate

1. **Cross-level navigation links** — "Set item prices →" and "Edit in Take Payments" allow users to jump between related config surfaces without losing context.

2. **Inherited read-only views** — When per-household mode is active, items show a locked/dimmed version of the signup-level pricing with a link to edit at the source. This prevents confusion about where to make changes.

3. **Progressive disclosure** — Time-based pricing is behind toggles (edit view) or a collapsible "Advanced" section (create flow). Users who don't need it never see it.

4. **Conditional sub-tabs** — The "Take Payments" sub-tab on items only appears when payments are enabled at the signup level. If payments are turned off, the sub-tab disappears and the active tab resets to "Info."

5. **Auto-focus on enable** — When a user checks a box to enable a price field (max, early bird, late fee), the associated input auto-focuses for immediate typing.

6. **Deferred configuration in create flow** — Per-spot mode during creation defers item-level prices to after creation, with explicit messaging about this. Per-household mode collects all pricing upfront.

---

## 5. API Contracts

### Read signup payment config

```json
{
  "fundIt": {
    "isActive": true,
    "isSuggested": false,
    "requirePayment": false,
    "chargeMode": "per-spot | per-household",
    "fund": { "id": 123, "name": "Signup Fund - Fish Fry" },
    "availableFunds": [{ "id": 123, "name": "..." }],
    "signupLevelPricing": {
      "pricingMode": "per-spot | per-household",
      "price": "10.00",
      "maxHouseholdPriceEnabled": true,
      "maxHouseholdPrice": "25.00",
      "earlyBird": { "enabled": true, "date": "2026-06-01", "price": "8.00" },
      "lateFee": { "enabled": true, "date": "2026-08-15", "price": "15.00" }
    },
    "spotTimePricing": {
      "earlyBird": { "enabled": true, "date": "2026-06-01" },
      "lateFee": { "enabled": true, "date": "2026-08-15" }
    },
    "spotMaxHouseholdPrice": { "enabled": true, "price": "25.00" }
  }
}
```

### Read item payment config

```json
{
  "itemFundIt": {
    "isActive": true,
    "pricingMode": "per-spot | per-household",
    "price": "4.00",
    "maxHouseholdPriceEnabled": true,
    "maxHouseholdPrice": "12.00",
    "earlyBird": { "optedIn": true, "inheritedDate": "2026-06-01", "price": "3.00" },
    "lateFee": { "optedIn": true, "inheritedDate": "2026-08-15", "price": "6.00" },
    "additionalFees": [{ "id": 1, "title": "Materials fee", "amount": "5.00" }]
  }
}
```

### Save signup payment config (POST editFundItOptions)

```json
{
  "signupListID": 123,
  "isActive": true,
  "isSuggested": false,
  "requirePayment": false,
  "chargeMode": "per-household",
  "fundID": 456,
  "signupLevelPricing": { "..." },
  "spotTimePricing": { "..." },
  "spotMaxHouseholdPrice": { "..." }
}
```

### Save item payment config (POST editItemFundItOptions)

```json
{
  "signupListID": 123,
  "signupListItemID": 456,
  "isActive": true,
  "pricingMode": "per-spot",
  "price": "4.00",
  "maxHouseholdPrice": "12.00",
  "earlyBird": { "optedIn": true, "price": "3.00" },
  "lateFee": { "optedIn": true, "price": "6.00" },
  "additionalFees": [{ "id": null, "title": "Materials fee", "amount": "5.00" }]
}
```

---

## 6. Backend Engineer Notes

Existing infrastructure that can be extended:
- `signupPricingDateRange` / `signupPricingDateRangeCost` already support date-windowed pricing
- `HouseholdSignupSlots` already aggregates household members
- `SignupPricingCalculationService.getQualifyingDateRange()` already selects by date
- `signupListCostSettings` needs new columns: `chargeMode`, `maxHouseholdPrice`, `requirePayment`
- `signupPricingDateRange` needs `rangeType` to distinguish early bird vs late fee
- Per-item tables need `earlyBirdOptIn`, `lateFeeOptIn`, `maxHouseholdPriceForItem`

---

## 7. Prototype Source Files

| File | What it covers |
|---|---|
| `payments-prototype/src/App.jsx` | Scenario configs, view switching |
| `payments-prototype/src/components/SignupEditor.jsx` | Edit view shell, state ownership, tab routing |
| `payments-prototype/src/components/TakePaymentsTab.jsx` | Signup-level payment config (both charge modes) |
| `payments-prototype/src/components/ItemsTab.jsx` | Item list + item-level payment config |
| `payments-prototype/src/components/CreateSignupFlow.jsx` | 4-step creation wizard |
