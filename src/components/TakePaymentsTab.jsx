import React, { useState } from 'react'
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

function PriceInput({ value, onChange, placeholder = '0' }) {
  return (
    <div className="price-input-wrap">
      <span className="price-prefix">$</span>
      <input
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
}

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

export default function TakePaymentsTab() {
  const [enabled, setEnabled] = useState(true)
  const [selectedFund, setSelectedFund] = useState('Signup Fund - Fish Fry')
  const [chargeMode, setChargeMode] = useState('per-household')

  // Signup-level pricing state
  const [pricingMode, setPricingMode] = useState('per-spot') // per-spot or per-family
  const [price, setPrice] = useState('4')
  const [maxPriceEnabled, setMaxPriceEnabled] = useState(true)
  const [maxPrice, setMaxPrice] = useState('12')

  // Early bird
  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(false)
  const [earlyBirdDate, setEarlyBirdDate] = useState('2026-06-01')
  const [earlyBirdPrice, setEarlyBirdPrice] = useState('5')
  const [earlyBirdMaxPrice, setEarlyBirdMaxPrice] = useState('15')

  // Late pricing
  const [latePricingEnabled, setLatePricingEnabled] = useState(false)
  const [lateDate, setLateDate] = useState('2026-08-15')
  const [latePrice, setLatePrice] = useState('4')
  const [lateMaxPrice, setLateMaxPrice] = useState('12')

  // Per-spot options
  const [spotMaxPriceEnabled, setSpotMaxPriceEnabled] = useState(true)
  const [spotMaxPrice, setSpotMaxPrice] = useState('12')
  const [spotEarlyBirdEnabled, setSpotEarlyBirdEnabled] = useState(false)
  const [spotEarlyBirdDate, setSpotEarlyBirdDate] = useState('2026-06-01')
  const [spotLateFeeEnabled, setSpotLateFeeEnabled] = useState(false)
  const [spotLateFeeDate, setSpotLateFeeDate] = useState('2026-08-15')

  // Bottom options
  const [suggestedDonation, setSuggestedDonation] = useState(false)
  const [requirePayments, setRequirePayments] = useState(false)

  const pricingLabel = pricingMode === 'per-spot' ? 'student' : 'family'

  return (
    <div className="take-payments-tab">
      <label className="payments-checkbox-row">
        <input
          type="checkbox"
          className="payments-checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="payments-checkbox-label">Take payments with this Signup</span>
      </label>

      {enabled && (
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

          {/* Charge per spot */}
          <div className="charge-options">
            <div className="charge-option-group">
              <label className="charge-option">
                <input
                  type="radio"
                  name="chargeMode"
                  className="charge-radio"
                  checked={chargeMode === 'per-spot'}
                  onChange={() => setChargeMode('per-spot')}
                />
                <div className="charge-option-content">
                  <div className="charge-option-title-row">
                    <span className="charge-option-title">Charge per spot</span>
                    <span className="pricing-badge">Item level pricing</span>
                  </div>
                  <span className="charge-option-desc">
                    This setting allows each Signup item carry an individual charge. You have the
                    option to set prices for each item in its respective Take Payments tab.
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
                          <span className="pricing-label">Max price (without fees?)</span>
                          <SmallCheckbox
                            checked={spotMaxPriceEnabled}
                            onChange={(e) => setSpotMaxPriceEnabled(e.target.checked)}
                          />
                        </div>
                        {spotMaxPriceEnabled && (
                          <PriceInput value={spotMaxPrice} onChange={setSpotMaxPrice} />
                        )}
                      </div>
                    </div>
                  </PricingCard>

                  {/* Time-Based Pricing */}
                  <div className="time-based-section">
                    <div className="section-header">
                      <span className="section-header-text">TIME-BASED PRICING</span>
                    </div>
                    <PricingCard>
                      <div className="pricing-toggle-row">
                        <IconCircle icon={<ClockIcon />} />
                        <div className="pricing-toggle-info">
                          <span className="pricing-toggle-title">Early Bird Discount</span>
                          <span className="pricing-toggle-desc">Reduced rate for early registration</span>
                        </div>
                        <SmallCheckbox
                          checked={spotEarlyBirdEnabled}
                          onChange={(e) => setSpotEarlyBirdEnabled(e.target.checked)}
                        />
                      </div>

                      {spotEarlyBirdEnabled && (
                        <div className="inline-pricing-detail">
                          <PricingRow icon={<CalendarIcon />} borderBottom={false}>
                            <span className="pricing-label">Early Bird expires:</span>
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
                          <span className="pricing-toggle-title">Late Fees</span>
                          <span className="pricing-toggle-desc">Higher rate for late registration</span>
                        </div>
                        <SmallCheckbox
                          checked={spotLateFeeEnabled}
                          onChange={(e) => setSpotLateFeeEnabled(e.target.checked)}
                        />
                      </div>

                      {spotLateFeeEnabled && (
                        <div className="inline-pricing-detail">
                          <PricingRow icon={<CalendarIcon />} borderBottom={false}>
                            <span className="pricing-label">Late fees kick in:</span>
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
                </div>
              )}
            </div>

            {/* Charge per household */}
            <div className="charge-option-group">
              <label className="charge-option">
                <input
                  type="radio"
                  name="chargeMode"
                  className="charge-radio"
                  checked={chargeMode === 'per-household'}
                  onChange={() => setChargeMode('per-household')}
                />
                <div className="charge-option-content">
                  <div className="charge-option-title-row">
                    <span className="charge-option-title">Charge per household</span>
                    <span className="pricing-badge">Signup Level Pricing</span>
                  </div>
                  <span className="charge-option-desc">
                    This setting allows you to either charge each household a fixed amount or create
                    pricing tiers.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Signup Level Pricing — only when per-household is selected */}
          {chargeMode === 'per-household' && (
            <div className="signup-level-pricing">
              {/* Main price card */}
              <PricingCard>
                <div className="pricing-row no-border">
                  <IconCircle icon={<DollarIcon />} />
                  <div className="pricing-row-content">
                    <div className="price-header-row">
                      <span className="pricing-label">Price per {pricingLabel}</span>
                      <div className="pricing-toggle">
                        <button
                          className={`toggle-btn ${pricingMode === 'per-spot' ? 'active' : ''}`}
                          onClick={() => setPricingMode('per-spot')}
                        >
                          Per Spot
                        </button>
                        <button
                          className={`toggle-btn ${pricingMode === 'per-family' ? 'active' : ''}`}
                          onClick={() => setPricingMode('per-family')}
                        >
                          Per Family
                        </button>
                      </div>
                    </div>
                    <PriceInput value={price} onChange={setPrice} />
                  </div>
                </div>

                {pricingMode === 'per-spot' && (
                  <div className="pricing-row no-border max-price-row">
                    <IconCircle icon={<FamilyIcon />} />
                    <div className="pricing-row-content">
                      <div className="max-price-header">
                        <span className="pricing-label">Apply a maximum price per family</span>
                        <SmallCheckbox
                          checked={maxPriceEnabled}
                          onChange={(e) => setMaxPriceEnabled(e.target.checked)}
                        />
                      </div>
                      {maxPriceEnabled && (
                        <PriceInput value={maxPrice} onChange={setMaxPrice} />
                      )}
                    </div>
                  </div>
                )}
              </PricingCard>

              {/* Time-Based Pricing */}
              <div className="time-based-section">
                <div className="section-header">
                  <span className="section-header-text">TIME-BASED PRICING</span>
                </div>
                <PricingCard>
                  <div className={`pricing-toggle-row ${!earlyBirdEnabled && !latePricingEnabled ? '' : ''}`}>
                    <IconCircle icon={<ClockIcon />} />
                    <div className="pricing-toggle-info">
                      <span className="pricing-toggle-title">Early Bird Pricing</span>
                      <span className="pricing-toggle-desc">Reduced rate for early registration</span>
                    </div>
                    <SmallCheckbox
                      checked={earlyBirdEnabled}
                      onChange={(e) => setEarlyBirdEnabled(e.target.checked)}
                    />
                  </div>

                  {earlyBirdEnabled && (
                    <div className="inline-pricing-detail">
                      <PricingRow icon={<CalendarIcon />}>
                        <span className="pricing-label">Pay before</span>
                        <input
                          type="date"
                          className="date-input"
                          value={earlyBirdDate}
                          onChange={(e) => setEarlyBirdDate(e.target.value)}
                        />
                      </PricingRow>
                      <PricingRow icon={<DollarIcon />}>
                        <span className="pricing-label">Price per {pricingLabel}</span>
                        <PriceInput value={earlyBirdPrice} onChange={setEarlyBirdPrice} />
                      </PricingRow>
                      <PricingRow icon={<FamilyIcon />} borderBottom={false}>
                        <span className="pricing-label">Maximum price per family</span>
                        <PriceInput value={earlyBirdMaxPrice} onChange={setEarlyBirdMaxPrice} />
                      </PricingRow>
                    </div>
                  )}

                  <div className={`pricing-toggle-row ${latePricingEnabled ? '' : 'no-border'}`}>
                    <IconCircle icon={<HourglassIcon />} />
                    <div className="pricing-toggle-info">
                      <span className="pricing-toggle-title">Late Pricing</span>
                      <span className="pricing-toggle-desc">Higher rate for late registration</span>
                    </div>
                    <SmallCheckbox
                      checked={latePricingEnabled}
                      onChange={(e) => setLatePricingEnabled(e.target.checked)}
                    />
                  </div>

                  {latePricingEnabled && (
                    <div className="inline-pricing-detail">
                      <PricingRow icon={<CalendarIcon />}>
                        <span className="pricing-label">Pay after</span>
                        <input
                          type="date"
                          className="date-input"
                          value={lateDate}
                          onChange={(e) => setLateDate(e.target.value)}
                        />
                      </PricingRow>
                      <PricingRow icon={<DollarIcon />}>
                        <span className="pricing-label">Price per {pricingLabel}</span>
                        <PriceInput value={latePrice} onChange={setLatePrice} />
                      </PricingRow>
                      <PricingRow icon={<FamilyIcon />} borderBottom={false}>
                        <span className="pricing-label">Maximum price per family</span>
                        <PriceInput value={lateMaxPrice} onChange={setLateMaxPrice} />
                      </PricingRow>
                    </div>
                  )}
                </PricingCard>
              </div>
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
                  Checking this box sets the payment as a suggested donation. This will allow the
                  member to edit and adjust the amount of money they donate.
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
                  Whoever signs up will have to make the full payment due or else their spots will be forfeited!
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
