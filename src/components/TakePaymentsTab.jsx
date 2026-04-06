import React, { useState, useRef } from 'react'
import MockTierPriceEditor from './MockTierPriceEditor'
import './TakePaymentsTab.css'

const FUND_OPTIONS = [
  'Signup Fund - Fish Fry',
  'General Fund',
  'Building Fund',
  'Youth Ministry',
  'Missions',
  'Special Events',
]

function IconCircle({ icon, size = 36 }) {
  return (
    <span className="icon-circle" style={{ width: size, height: size, minWidth: size }}>
      {icon}
    </span>
  )
}

const PriceInput = React.forwardRef(({ value, onChange, placeholder = '0' }, ref) => {
  return (
    <div className="price-input-wrap">
      <span className="price-prefix">$</span>
      <input
        ref={ref}
        type="text"
        className="price-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value
          if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
            onChange(val)
          }
        }}
      />
    </div>
  )
})

function SmallCheckbox({ checked, onChange }) {
  return (
    <label className="small-checkbox-wrap">
      <input
        type="checkbox"
        className="small-checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  )
}

function PricingCard({ children }) {
  return <div className="pricing-card">{children}</div>
}

function PricingRow({ icon, children, borderBottom = true }) {
  return (
    <div className={`pricing-row ${borderBottom ? '' : 'no-border'}`}>
      <IconCircle icon={icon} />
      <div className="pricing-row-content">{children}</div>
    </div>
  )
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="info-tooltip-wrap"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="info-tooltip-icon">i</span>
      {show && <span className="info-tooltip-text">{text}</span>}
    </span>
  )
}

export default function TakePaymentsTab({ paymentsEnabled, setPaymentsEnabled, chargeMode, setChargeMode, signupPricing, setSignupPricing, spotTimePricing, setSpotTimePricing, navigateToItems, initialSpotMax }) {
  const [selectedFund, setSelectedFund] = useState('Signup Fund - Fish Fry')

  // Destructure signup-level pricing
  const {
    pricingMode, price, maxPriceEnabled, maxPrice,
    earlyBirdEnabled, earlyBirdDate, earlyBirdPrice, earlyBirdMaxPrice,
    latePricingEnabled, lateDate, latePrice, lateMaxPrice,
  } = signupPricing

  const updatePricing = (updates) => setSignupPricing({ ...signupPricing, ...updates })

  // Convenience setters
  const setPricingMode = (v) => updatePricing({ pricingMode: v })
  const setPrice = (v) => updatePricing({ price: v })
  const setMaxPriceEnabled = (v) => updatePricing({ maxPriceEnabled: v })
  const setMaxPrice = (v) => updatePricing({ maxPrice: v })
  const setEarlyBirdEnabled = (v) => updatePricing({ earlyBirdEnabled: v })
  const setEarlyBirdDate = (v) => updatePricing({ earlyBirdDate: v })
  const setEarlyBirdPrice = (v) => updatePricing({ earlyBirdPrice: v })
  const setEarlyBirdMaxPrice = (v) => updatePricing({ earlyBirdMaxPrice: v })
  const setLatePricingEnabled = (v) => updatePricing({ latePricingEnabled: v })
  const setLateDate = (v) => updatePricing({ lateDate: v })
  const setLatePrice = (v) => updatePricing({ latePrice: v })
  const setLateMaxPrice = (v) => updatePricing({ lateMaxPrice: v })

  // Per-spot options
  const [spotMaxPriceEnabled, setSpotMaxPriceEnabled] = useState(initialSpotMax?.enabled ?? false)
  const [spotMaxPrice, setSpotMaxPrice] = useState(initialSpotMax?.price ?? '')
  const spotMaxPriceRef = useRef(null)
  const householdMaxPriceRef = useRef(null)


  const updateSpotTime = (updates) => setSpotTimePricing({ ...spotTimePricing, ...updates })
  const spotEarlyBirdEnabled = spotTimePricing.earlyBirdEnabled
  const spotEarlyBirdDate = spotTimePricing.earlyBirdDate
  const spotLateFeeEnabled = spotTimePricing.lateFeeEnabled
  const spotLateFeeDate = spotTimePricing.lateFeeDate
  const setSpotEarlyBirdEnabled = (v) => updateSpotTime({ earlyBirdEnabled: v })
  const setSpotEarlyBirdDate = (v) => updateSpotTime({ earlyBirdDate: v })
  const setSpotLateFeeEnabled = (v) => updateSpotTime({ lateFeeEnabled: v })
  const setSpotLateFeeDate = (v) => updateSpotTime({ lateFeeDate: v })

  // Bottom options
  const [suggestedDonation, setSuggestedDonation] = useState(false)
  const [requirePayments, setRequirePayments] = useState(false)

  // Tiered pricing (per-household)
  const [useTieredPricing, setUseTieredPricing] = useState(false)
  const [discountsOpen, setDiscountsOpen] = useState(false)
  const [spotDiscountsOpen, setSpotDiscountsOpen] = useState(false)
  const [householdTierData, setHouseholdTierData] = useState([
    { numberOfSlots: null, amount: '5.00', id: 'max' }
  ])

  const pricingLabel = pricingMode === 'per-spot' ? 'spot' : 'household'

  return (
    <div className="take-payments-tab">
      <label className="payments-checkbox-row">
        <input
          type="checkbox"
          className="payments-checkbox"
          checked={paymentsEnabled}
          onChange={(e) => setPaymentsEnabled(e.target.checked)}
        />
        <span className="payments-checkbox-label">Take payments with this Signup</span>
      </label>

      {paymentsEnabled && (
        <div className="payment-settings">
          <div className="fund-section">
            <label className="fund-label">Which fund should payments be allocated to?</label>
            <select
              className="fund-select"
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
            >
              {FUND_OPTIONS.map(fund => (
                <option key={fund} value={fund}>{fund}</option>
              ))}
            </select>
          </div>

          {/* Charge mode selection */}
          <div className="charge-options">
            <div className="charge-option-group">
              <label className={`charge-option charge-card ${chargeMode === 'per-spot' ? 'charge-card-selected' : ''}`}>
                <input
                  type="radio"
                  name="chargeMode"
                  className="charge-radio"
                  checked={chargeMode === 'per-spot'}
                  onChange={() => setChargeMode('per-spot')}
                />
                <div className="charge-option-content">
                  <div className="charge-option-title-row">
                    <span className="charge-option-title">Price each item</span>
                  </div>
                  <span className="charge-option-desc">
                    Configure pricing on each item's Take Payments tab.
                  </span>
                </div>
              </label>

              {chargeMode === 'per-spot' && (
                <div className="per-spot-settings">
                  {/* Max price card */}
                  <PricingCard>
                    <div className="pricing-row no-border">
                      <IconCircle icon={<FamilyIcon />} />
                      <div className="pricing-row-content">
                        <div className="max-price-header">
                          <span className="pricing-label">
                            Max per household across all items?
                            <InfoTooltip text="Caps what a household pays in total across every item in this signup. Does not include per-item fees." />
                          </span>
                          <SmallCheckbox
                            checked={spotMaxPriceEnabled}
                            onChange={(e) => {
                              setSpotMaxPriceEnabled(e.target.checked)
                              if (e.target.checked) setTimeout(() => spotMaxPriceRef.current?.focus(), 0)
                            }}
                          />
                        </div>
                        {spotMaxPriceEnabled && (
                          <PriceInput ref={spotMaxPriceRef} value={spotMaxPrice} onChange={setSpotMaxPrice} />
                        )}
                      </div>
                    </div>
                  </PricingCard>

                  {/* Discounts & Late Fees — collapsible, matching the per-household style */}
                  <div className="discounts-section">
                    <button className="discounts-toggle" onClick={() => setSpotDiscountsOpen(!spotDiscountsOpen)} type="button">
                      <span className="discounts-arrow">{spotDiscountsOpen ? '▾' : '▸'}</span>
                      Discounts & Late Fees
                      {(spotEarlyBirdEnabled || spotLateFeeEnabled) && (
                        <span className="discounts-badge">{(spotEarlyBirdEnabled ? 1 : 0) + (spotLateFeeEnabled ? 1 : 0)} active</span>
                      )}
                    </button>

                    {spotDiscountsOpen && (
                      <div className="discounts-content">
                        <p className="discounts-desc">Dates set here. Prices set on each item.</p>
                        <PricingCard>
                          <div className="pricing-toggle-row">
                            <IconCircle icon={<ClockIcon />} />
                            <div className="pricing-toggle-info">
                              <span className="pricing-toggle-title">Early Bird Discount</span>
                            </div>
                            <SmallCheckbox
                              checked={spotEarlyBirdEnabled}
                              onChange={(e) => setSpotEarlyBirdEnabled(e.target.checked)}
                            />
                          </div>

                          {spotEarlyBirdEnabled && (
                            <div className="inline-pricing-detail">
                              <PricingRow icon={<CalendarIcon />} borderBottom={false}>
                                <span className="pricing-label">Discount ends</span>
                                <input
                                  type="date"
                                  className="date-input"
                                  value={spotEarlyBirdDate}
                                  onChange={(e) => setSpotEarlyBirdDate(e.target.value)}
                                />
                              </PricingRow>
                            </div>
                          )}

                          <div className={`pricing-toggle-row ${spotLateFeeEnabled ? '' : 'no-border'}`}>
                            <IconCircle icon={<HourglassIcon />} />
                            <div className="pricing-toggle-info">
                              <span className="pricing-toggle-title">Late Fee</span>
                            </div>
                            <SmallCheckbox
                              checked={spotLateFeeEnabled}
                              onChange={(e) => setSpotLateFeeEnabled(e.target.checked)}
                            />
                          </div>

                          {spotLateFeeEnabled && (
                            <div className="inline-pricing-detail">
                              <PricingRow icon={<CalendarIcon />} borderBottom={false}>
                                <span className="pricing-label">Late fee starts</span>
                                <input
                                  type="date"
                                  className="date-input"
                                  value={spotLateFeeDate}
                                  onChange={(e) => setSpotLateFeeDate(e.target.value)}
                                />
                              </PricingRow>
                            </div>
                          )}
                        </PricingCard>
                      </div>
                    )}
                  </div>

                  {navigateToItems && (
                    <button className="cross-level-link" onClick={navigateToItems}>
                      Set item prices &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* All items */}
            <div className="charge-option-group">
              <label className={`charge-option charge-card ${chargeMode === 'per-household' ? 'charge-card-selected' : ''}`}>
                <input
                  type="radio"
                  name="chargeMode"
                  className="charge-radio"
                  checked={chargeMode === 'per-household'}
                  onChange={() => setChargeMode('per-household')}
                />
                <div className="charge-option-content">
                  <div className="charge-option-title-row">
                    <span className="charge-option-title">One price across the signup</span>
                  </div>
                  <span className="charge-option-desc">
                    Set pricing here and apply it to every item.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Signup Level Pricing — only when per-household is selected */}
          {chargeMode === 'per-household' && (
            <div className="signup-level-pricing">
              {/* Self-contained pricing card with toggle at top */}
              <div className="pricing-container">
                <div className="household-mode-toggle">
                  <button
                    className={`household-mode-btn ${pricingMode === 'per-spot' ? 'active' : ''}`}
                    onClick={() => setPricingMode('per-spot')}
                    type="button"
                  >
                    Per Spot
                  </button>
                  <button
                    className={`household-mode-btn ${pricingMode === 'per-household' ? 'active' : ''}`}
                    onClick={() => setPricingMode('per-household')}
                    type="button"
                  >
                    Per Household
                  </button>
                  <button
                    className={`household-mode-btn ${pricingMode === 'tiered' ? 'active' : ''}`}
                    onClick={() => setPricingMode('tiered')}
                    type="button"
                  >
                    Tiered
                  </button>
                </div>

                {pricingMode === 'tiered' ? (
                  <div className="pricing-container-body">
                    <MockTierPriceEditor
                      tierData={householdTierData}
                      setTierData={setHouseholdTierData}
                      entity="spot"
                    />
                  </div>
                ) : (
                  <div className="pricing-container-body">
                    <div className="pricing-row no-border">
                      <IconCircle icon={<DollarIcon />} />
                      <div className="pricing-row-content">
                        <span className="pricing-label">Price per {pricingLabel}</span>
                        <PriceInput value={price} onChange={setPrice} />
                      </div>
                    </div>

                    {pricingMode === 'per-spot' && (
                      <div className="pricing-row no-border max-price-row">
                        <IconCircle icon={<FamilyIcon />} />
                        <div className="pricing-row-content">
                          <div className="max-price-header">
                            <span className="pricing-label">
                              Max per household across all items?
                              <InfoTooltip text="Caps what a household pays in total across every item in this signup. Does not include per-item fees." />
                            </span>
                            <SmallCheckbox
                              checked={maxPriceEnabled}
                              onChange={(e) => {
                                setMaxPriceEnabled(e.target.checked)
                                if (e.target.checked) setTimeout(() => householdMaxPriceRef.current?.focus(), 0)
                              }}
                            />
                          </div>
                          {maxPriceEnabled && (
                            <PriceInput ref={householdMaxPriceRef} value={maxPrice} onChange={setMaxPrice} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Discounts & Late Fees — collapsible, visually demoted */}
              {pricingMode !== 'tiered' && (
                <div className="discounts-section">
                  <button className="discounts-toggle" onClick={() => setDiscountsOpen(!discountsOpen)} type="button">
                    <span className="discounts-arrow">{discountsOpen ? '▾' : '▸'}</span>
                    Discounts & Late Fees
                    {(earlyBirdEnabled || latePricingEnabled) && (
                      <span className="discounts-badge">{(earlyBirdEnabled ? 1 : 0) + (latePricingEnabled ? 1 : 0)} active</span>
                    )}
                  </button>

                  {discountsOpen && (
                    <div className="discounts-content">
                      <PricingCard>
                        <div className="pricing-toggle-row">
                          <IconCircle icon={<ClockIcon />} />
                          <div className="pricing-toggle-info">
                            <span className="pricing-toggle-title">Early Bird Discount</span>
                          </div>
                          <SmallCheckbox
                            checked={earlyBirdEnabled}
                            onChange={(e) => setEarlyBirdEnabled(e.target.checked)}
                          />
                        </div>

                        {earlyBirdEnabled && (
                          <div className="inline-pricing-detail">
                            <PricingRow icon={<CalendarIcon />}>
                              <span className="pricing-label">Discount ends</span>
                              <input
                                type="date"
                                className="date-input"
                                value={earlyBirdDate}
                                onChange={(e) => setEarlyBirdDate(e.target.value)}
                              />
                            </PricingRow>
                            <PricingRow icon={<DollarIcon />} borderBottom={pricingMode === 'per-spot' && maxPriceEnabled}>
                              <span className="pricing-label">Price per {pricingLabel}</span>
                              <PriceInput value={earlyBirdPrice} onChange={setEarlyBirdPrice} />
                            </PricingRow>
                            {pricingMode === 'per-spot' && maxPriceEnabled && (
                              <PricingRow icon={<FamilyIcon />} borderBottom={false}>
                                <span className="pricing-label">Max per household</span>
                                <PriceInput value={earlyBirdMaxPrice} onChange={setEarlyBirdMaxPrice} />
                              </PricingRow>
                            )}
                          </div>
                        )}

                        <div className={`pricing-toggle-row ${latePricingEnabled ? '' : 'no-border'}`}>
                          <IconCircle icon={<HourglassIcon />} />
                          <div className="pricing-toggle-info">
                            <span className="pricing-toggle-title">Late Fee</span>
                          </div>
                          <SmallCheckbox
                            checked={latePricingEnabled}
                            onChange={(e) => setLatePricingEnabled(e.target.checked)}
                          />
                        </div>

                        {latePricingEnabled && (
                          <div className="inline-pricing-detail">
                            <PricingRow icon={<CalendarIcon />}>
                              <span className="pricing-label">Late fee starts</span>
                              <input
                                type="date"
                                className="date-input"
                                value={lateDate}
                                onChange={(e) => setLateDate(e.target.value)}
                              />
                            </PricingRow>
                            <PricingRow icon={<DollarIcon />} borderBottom={pricingMode === 'per-spot' && maxPriceEnabled}>
                              <span className="pricing-label">Price per {pricingLabel}</span>
                              <PriceInput value={latePrice} onChange={setLatePrice} />
                            </PricingRow>
                            {pricingMode === 'per-spot' && maxPriceEnabled && (
                              <PricingRow icon={<FamilyIcon />} borderBottom={false}>
                                <span className="pricing-label">Max per household</span>
                                <PriceInput value={lateMaxPrice} onChange={setLateMaxPrice} />
                              </PricingRow>
                            )}
                          </div>
                        )}
                      </PricingCard>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom options — always shown */}
          <div className="bottom-options">
            <label className="bottom-option">
              <input
                type="checkbox"
                className="option-checkbox"
                checked={suggestedDonation}
                onChange={(e) => setSuggestedDonation(e.target.checked)}
              />
              <div className="charge-option-content">
                <span className="charge-option-title">Collect as suggested donation</span>
                <span className="charge-option-desc">
                  Members can adjust the amount.
                </span>
              </div>
            </label>

            <label className="bottom-option">
              <input
                type="checkbox"
                className="option-checkbox"
                checked={requirePayments}
                onChange={(e) => setRequirePayments(e.target.checked)}
              />
              <div className="charge-option-content">
                <span className="charge-option-title require-title">Require Payments</span>
                <span className="charge-option-desc">
                  Full payment required to hold spots.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

/* SVG Icon Components */
function DollarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function FamilyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  )
}

function ClockIcon({ small }) {
  if (small) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function HourglassIcon({ small }) {
  if (small) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  )
}
