import React, { useState, useRef } from 'react'
import MockTierPriceEditor from './MockTierPriceEditor'
import './CreateSignupFlow.css'

const STEPS = [
  { num: 1, label: 'Type' },
  { num: 2, label: 'Title' },
  { num: 3, label: 'Take Payments' },
  { num: 4, label: 'Pricing' },
]

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

export default function CreateSignupFlow() {
  const [currentStep, setCurrentStep] = useState(3)
  const [paymentChoice, setPaymentChoice] = useState('fixed')

  // Lifted so step 4 knows what was chosen in step 3
  const isFree = paymentChoice === 'free'
  const isDonation = paymentChoice === 'donation'

  const handleStep3Next = () => {
    if (isFree) {
      // Skip pricing entirely
      // In a real app this would finish creation
    }
    setCurrentStep(4)
  }

  return (
    <div className="create-flow">
      <div className="create-flow-header">
        <span className="create-flow-icon">📅</span>
        <h2>Create a Signup</h2>
      </div>

      {/* Step breadcrumb */}
      <div className="step-bar">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.num}>
            <button
              className={`step-btn ${currentStep === step.num ? 'active' : ''} ${step.num < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.num)}
            >
              {step.label}
            </button>
            {i < STEPS.length - 1 && <span className="step-sep">›</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="step-content">
        {currentStep === 1 && (
          <StepPlaceholder
            title="Signup Type"
            desc="Choose the type of signup you want to create."
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepPlaceholder
            title="Title & Details"
            desc="Name your signup and add a description."
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <StepTakePayments
            paymentChoice={paymentChoice}
            setPaymentChoice={setPaymentChoice}
            onNext={handleStep3Next}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <StepPricing
            isFree={isFree}
            isDonation={isDonation}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  )
}

function StepPlaceholder({ title, desc, onNext, onBack }) {
  return (
    <div className="step-placeholder">
      <h3>{title}</h3>
      <p>{desc}</p>
      <p className="step-placeholder-note">Not part of the payments prototype.</p>
      <div className="step-actions">
        {onBack && <button className="step-btn-back" onClick={onBack}>Back</button>}
        {onNext && <button className="step-btn-next" onClick={onNext}>Next</button>}
      </div>
    </div>
  )
}

function StepTakePayments({ paymentChoice, setPaymentChoice, onNext, onBack }) {
  return (
    <div className="step-take-payments">
      <h3>Would you like to take payments with this Signup?</h3>

      <div className="payment-choices">
        <label className={`payment-choice ${paymentChoice === 'free' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentChoice"
            checked={paymentChoice === 'free'}
            onChange={() => setPaymentChoice('free')}
          />
          <div className="payment-choice-content">
            <span className="payment-choice-title">Make it free to sign up</span>
          </div>
        </label>

        <label className={`payment-choice ${paymentChoice === 'fixed' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentChoice"
            checked={paymentChoice === 'fixed'}
            onChange={() => setPaymentChoice('fixed')}
          />
          <div className="payment-choice-content">
            <span className="payment-choice-title">Charge a fixed amount</span>
            <span className="payment-choice-desc">
              Respondents must pay a set amount to sign up. You can charge per spot or per household.
            </span>
          </div>
        </label>

        <label className={`payment-choice ${paymentChoice === 'donation' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentChoice"
            checked={paymentChoice === 'donation'}
            onChange={() => setPaymentChoice('donation')}
          />
          <div className="payment-choice-content">
            <span className="payment-choice-title">Suggest a donation</span>
            <span className="payment-choice-desc">
              Set a suggested amount — respondents can adjust before paying.
            </span>
          </div>
        </label>
      </div>

      <div className="step-actions">
        {onBack && <button className="step-btn-back" onClick={onBack}>Back</button>}
        <button className="step-btn-next" onClick={onNext}>
          {paymentChoice === 'free' ? 'Create Signup (prototype)' : "Let's Go"}
        </button>
      </div>
    </div>
  )
}

function PerSpotPricing() {
  const [maxEnabled, setMaxEnabled] = useState(false)
  const [maxPrice, setMaxPrice] = useState('')
  const maxPriceRef = useRef(null)

  return (
    <div className="create-pricing-card">
      <div className="create-pricing-row">
        <span className="icon-circle" style={{ width: 36, height: 36, minWidth: 36 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </span>
        <div className="create-pricing-fields">
          <div className="create-pricing-header">
            <span className="create-pricing-label">
              Max per household across all items?
              <InfoTooltip text="Caps what a household pays in total across every item in this signup. Does not include per-item fees." />
            </span>
            <label className="small-checkbox-wrap">
              <input
                type="checkbox"
                className="small-checkbox"
                checked={maxEnabled}
                onChange={(e) => {
                  setMaxEnabled(e.target.checked)
                  if (e.target.checked) setTimeout(() => maxPriceRef.current?.focus(), 0)
                }}
              />
            </label>
          </div>
          {maxEnabled && (
            <div className="price-input-wrap">
              <span className="price-prefix">$</span>
              <input
                ref={maxPriceRef}
                type="text"
                className="price-input"
                placeholder="0"
                value={maxPrice}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setMaxPrice(val)
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="create-spot-note">
        You'll set individual item prices and discounts after creating the signup.
      </div>
    </div>
  )
}

function PerHouseholdPricing({ pricingMode = 'per-spot' }) {
  const [price, setPrice] = useState('')
  const [maxEnabled, setMaxEnabled] = useState(false)
  const [maxPrice, setMaxPrice] = useState('')
  const maxPriceRef = useRef(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(false)
  const [earlyBirdDate, setEarlyBirdDate] = useState('2026-06-01')
  const [earlyBirdPrice, setEarlyBirdPrice] = useState('')
  const [earlyBirdMaxPrice, setEarlyBirdMaxPrice] = useState('')
  const [lateFeeEnabled, setLateFeeEnabled] = useState(false)
  const [lateFeeDate, setLateFeeDate] = useState('2026-08-15')
  const [latePrice, setLatePrice] = useState('')
  const [lateMaxPrice, setLateMaxPrice] = useState('')

  const pricingLabel = pricingMode === 'per-spot' ? 'spot' : 'household'

  return (
    <>
      <div className="create-pricing-card">
        <div className="create-pricing-row">
          <span className="icon-circle" style={{ width: 36, height: 36, minWidth: 36 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <div className="create-pricing-fields">
            <div className="create-pricing-header">
              <span className="create-pricing-label">Price per {pricingLabel}</span>
            </div>
            <div className="price-input-wrap">
              <span className="price-prefix">$</span>
              <input type="text" className="price-input" placeholder="0" value={price} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setPrice(val) }} />
            </div>
          </div>
        </div>
        {pricingMode === 'per-spot' && (
          <div className="create-pricing-row create-pricing-max">
            <span className="icon-circle" style={{ width: 36, height: 36, minWidth: 36 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </span>
            <div className="create-pricing-fields">
              <div className="create-pricing-header">
                <span className="create-pricing-label">
                  Max per household across all items?
                  <InfoTooltip text="Caps what a household pays in total across every item in this signup. Does not include per-item fees." />
                </span>
                <label className="small-checkbox-wrap">
                  <input type="checkbox" className="small-checkbox" checked={maxEnabled} onChange={(e) => { setMaxEnabled(e.target.checked); if (e.target.checked) setTimeout(() => maxPriceRef.current?.focus(), 0) }} />
                </label>
              </div>
              {maxEnabled && (
                <div className="price-input-wrap">
                  <span className="price-prefix">$</span>
                  <input ref={maxPriceRef} type="text" className="price-input" placeholder="0" value={maxPrice} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setMaxPrice(val) }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Advanced: Time-based pricing */}
      <div className="create-advanced-section">
        <button className={`create-advanced-toggle ${showAdvanced ? 'open' : ''}`} onClick={() => setShowAdvanced(!showAdvanced)}>
          <span className="create-advanced-arrow">{showAdvanced ? '▾' : '▸'}</span>
          Advanced: Time-based pricing
        </button>
        {showAdvanced && (
          <div className="create-advanced-content">
            <div className="create-time-card">
              {/* Early Bird */}
              <div className="create-time-toggle-row">
                <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </span>
                <div className="create-time-info">
                  <span className="create-time-title">Early Bird</span>
                  <span className="create-time-desc">Reduced rate for early registration</span>
                </div>
                <label className="small-checkbox-wrap">
                  <input type="checkbox" className="small-checkbox" checked={earlyBirdEnabled} onChange={(e) => setEarlyBirdEnabled(e.target.checked)} />
                </label>
              </div>
              {earlyBirdEnabled && (
                <div className="create-time-detail">
                  <div className="create-time-detail-row">
                    <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </span>
                    <span className="create-time-label">Discount ends</span>
                    <input type="date" className="date-input" value={earlyBirdDate} onChange={(e) => setEarlyBirdDate(e.target.value)} />
                  </div>
                  <div className="create-time-detail-row">
                    <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </span>
                    <span className="create-time-label">Price per {pricingLabel}</span>
                    <div className="price-input-wrap"><span className="price-prefix">$</span><input type="text" className="price-input" placeholder="0" value={earlyBirdPrice} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setEarlyBirdPrice(val) }} /></div>
                  </div>
                  {pricingMode === 'per-spot' && maxEnabled && (
                    <div className="create-time-detail-row">
                      <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </span>
                      <span className="create-time-label">Max per household</span>
                      <div className="price-input-wrap"><span className="price-prefix">$</span><input type="text" className="price-input" placeholder="0" value={earlyBirdMaxPrice} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setEarlyBirdMaxPrice(val) }} /></div>
                    </div>
                  )}
                </div>
              )}
              {/* Late Fee */}
              <div className="create-time-toggle-row">
                <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg>
                </span>
                <div className="create-time-info">
                  <span className="create-time-title">Late Fee</span>
                  <span className="create-time-desc">Higher rate for late registration</span>
                </div>
                <label className="small-checkbox-wrap">
                  <input type="checkbox" className="small-checkbox" checked={lateFeeEnabled} onChange={(e) => setLateFeeEnabled(e.target.checked)} />
                </label>
              </div>
              {lateFeeEnabled && (
                <div className="create-time-detail">
                  <div className="create-time-detail-row">
                    <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </span>
                    <span className="create-time-label">Late fee starts</span>
                    <input type="date" className="date-input" value={lateFeeDate} onChange={(e) => setLateFeeDate(e.target.value)} />
                  </div>
                  <div className="create-time-detail-row">
                    <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </span>
                    <span className="create-time-label">Price per {pricingLabel}</span>
                    <div className="price-input-wrap"><span className="price-prefix">$</span><input type="text" className="price-input" placeholder="0" value={latePrice} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setLatePrice(val) }} /></div>
                  </div>
                  {pricingMode === 'per-spot' && maxEnabled && (
                    <div className="create-time-detail-row">
                      <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      </span>
                      <span className="create-time-label">Max per household</span>
                      <div className="price-input-wrap"><span className="price-prefix">$</span><input type="text" className="price-input" placeholder="0" value={lateMaxPrice} onChange={(e) => { const val = e.target.value; if (/^\d*\.?\d{0,2}$/.test(val) || val === '') setLateMaxPrice(val) }} /></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CreateTieredPricing() {
  const [tierData, setTierData] = useState([
    { numberOfSlots: 2, amount: '', id: 1 },
    { numberOfSlots: null, amount: '', id: 'max' },
  ])

  return (
    <MockTierPriceEditor
      tierData={tierData}
      setTierData={setTierData}
      entity="spot"
    />
  )
}

function StepPricing({ isFree, isDonation, onBack }) {
  const [chargeMode, setChargeMode] = useState('per-spot')
  const [createPricingMode, setCreatePricingMode] = useState('per-spot')

  if (isFree) {
    return (
      <div className="step-pricing">
        <div className="step-placeholder">
          <h3>No pricing needed</h3>
          <p>This signup is free — no pricing configuration required.</p>
        </div>
        <div className="step-actions">
          <button className="step-btn-back" onClick={onBack}>Back</button>
          <button className="step-btn-next" disabled>Create Signup</button>
        </div>
      </div>
    )
  }

  return (
    <div className="step-pricing">
      <h3>How would you like to charge respondents?</h3>

      {isDonation && (
        <div className="donation-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Payments will be collected as a suggested donation — respondents can adjust the amount.</span>
        </div>
      )}

      <div className="create-charge-options">
        <div className="create-charge-group">
          <label className={`payment-choice ${chargeMode === 'per-spot' ? 'selected' : ''}`}>
            <input type="radio" name="createChargeMode" checked={chargeMode === 'per-spot'} onChange={() => setChargeMode('per-spot')} />
            <div className="payment-choice-content">
              <span className="payment-choice-title">Price each item</span>
              <span className="payment-choice-desc">You'll configure pricing on each item after creation.</span>
            </div>
          </label>
          {chargeMode === 'per-spot' && (
            <div className="create-inline-pricing">
              <PerSpotPricing />
            </div>
          )}
        </div>

        <div className="create-charge-group">
          <label className={`payment-choice ${chargeMode === 'per-household' ? 'selected' : ''}`}>
            <input type="radio" name="createChargeMode" checked={chargeMode === 'per-household'} onChange={() => setChargeMode('per-household')} />
            <div className="payment-choice-content">
              <span className="payment-choice-title">One price across the signup</span>
              <span className="payment-choice-desc">Set pricing here and apply it to every item.</span>
            </div>
          </label>
          {chargeMode === 'per-household' && (
            <div className="create-inline-pricing">
              <div className="household-mode-toggle" style={{ marginBottom: 12 }}>
                <button
                  className={`household-mode-btn ${createPricingMode === 'per-spot' ? 'active' : ''}`}
                  onClick={() => setCreatePricingMode('per-spot')}
                  type="button"
                >
                  Per Spot
                </button>
                <button
                  className={`household-mode-btn ${createPricingMode === 'per-household' ? 'active' : ''}`}
                  onClick={() => setCreatePricingMode('per-household')}
                  type="button"
                >
                  Per Household
                </button>
                <button
                  className={`household-mode-btn ${createPricingMode === 'tiered' ? 'active' : ''}`}
                  onClick={() => setCreatePricingMode('tiered')}
                  type="button"
                >
                  Tiered
                </button>
              </div>
              {createPricingMode === 'tiered' ? (
                <CreateTieredPricing />
              ) : (
                <PerHouseholdPricing pricingMode={createPricingMode} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button className="step-btn-back" onClick={onBack}>Back</button>
        <button className="step-btn-next" disabled>Create Signup</button>
      </div>
    </div>
  )
}
