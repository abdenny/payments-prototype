import React, { useState, useRef } from 'react'
import MockTierPriceEditor from './MockTierPriceEditor'
import './ItemsTab.css'

let nextId = 2

export default function ItemsTab({ paymentsEnabled, chargeMode, signupPricing, spotTimePricing, navigateToPayments }) {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
  ])
  const [selectedItemId, setSelectedItemId] = useState(1)
  const [activeSubTab, setActiveSubTab] = useState('Info')

  const selectedItem = items.find(i => i.id === selectedItemId)

  const subTabs = paymentsEnabled
    ? ['Info', 'Additional Info', 'Take Payments', 'Respondents']
    : ['Info', 'Additional Info', 'Respondents']

  // Reset sub-tab if Take Payments disappears
  if (!paymentsEnabled && activeSubTab === 'Take Payments') {
    setActiveSubTab('Info')
  }

  const addItem = () => {
    const newItem = { id: nextId++, name: `Item ${nextId - 1}` }
    setItems([...items, newItem])
    setSelectedItemId(newItem.id)
  }

  const renameItem = (id, newName) => {
    setItems(items.map(i => i.id === id ? { ...i, name: newName } : i))
  }

  return (
    <div className="items-tab">
      {/* Sidebar */}
      <div className="items-sidebar">
        <div className="sidebar-header">
          <span className="customize-icon">🎨</span>
          <span className="customize-label">Customize</span>
          <span className="new-badge">NEW</span>
        </div>
        <div className="items-list">
          {items.map(item => (
            <div
              key={item.id}
              className={`item-row ${selectedItemId === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedItemId(item.id)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <button className="add-item-btn" onClick={addItem}>
          <span className="add-icon">⊞</span> Add New Item
        </button>
      </div>

      {/* Detail panel */}
      <div className="item-detail">
        {/* Sub-tab bar */}
        <div className="sub-tab-bar">
          {subTabs.map((tab, i) => (
            <React.Fragment key={tab}>
              <button
                className={`sub-tab-btn ${activeSubTab === tab ? 'active' : ''}`}
                onClick={() => setActiveSubTab(tab)}
              >
                <span className="sub-tab-icon">
                  {tab === 'Info' && 'ⓘ'}
                  {tab === 'Additional Info' && 'ℹ'}
                  {tab === 'Take Payments' && ''}
                  {tab === 'Respondents' && '👥'}
                </span>
                {tab}
              </button>
              {i < subTabs.length - 1 && <span className="sub-tab-sep">›</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Sub-tab content */}
        <div className="sub-tab-content">
          {activeSubTab === 'Info' && selectedItem && (
            <ItemInfoSubTab item={selectedItem} onRename={renameItem} />
          )}
          {activeSubTab === 'Additional Info' && (
            <div className="placeholder-sub">Additional Info content</div>
          )}
          {activeSubTab === 'Take Payments' && selectedItem && (
            <ItemTakePaymentsSubTab chargeMode={chargeMode} signupPricing={signupPricing} spotTimePricing={spotTimePricing} navigateToPayments={navigateToPayments} />
          )}
          {activeSubTab === 'Respondents' && (
            <div className="placeholder-sub">Respondents content</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemInfoSubTab({ item, onRename }) {
  return (
    <div className="item-info-form">
      <label className="info-label">Item Name</label>
      <input
        type="text"
        className="info-input"
        value={item.name}
        onChange={(e) => onRename(item.id, e.target.value)}
      />
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

let nextFeeId = 1

function ItemTakePaymentsSubTab({ chargeMode, signupPricing, spotTimePricing, navigateToPayments }) {
  const [itemPaymentsEnabled, setItemPaymentsEnabled] = useState(true)
  const [pricingMode, setPricingMode] = useState('per-spot')
  const [price, setPrice] = useState('4')
  const [maxPriceEnabled, setMaxPriceEnabled] = useState(false)
  const [maxPrice, setMaxPrice] = useState('')
  const maxPriceRef = useRef(null)
  const [itemEarlyBirdEnabled, setItemEarlyBirdEnabled] = useState(false)
  const [earlyBirdPrice, setEarlyBirdPrice] = useState('')
  const [itemLateFeeEnabled, setItemLateFeeEnabled] = useState(false)
  const [latePrice, setLatePrice] = useState('')
  const [additionalFees, setAdditionalFees] = useState([])
  const newFeeRef = useRef(null)
  const [useTieredPricing, setUseTieredPricing] = useState(false)
  const [itemTierData, setItemTierData] = useState([
    { numberOfSlots: null, amount: '4.00', id: 'max' }
  ])

  const isHouseholdMode = chargeMode === 'per-household'

  const addFee = () => {
    const newId = nextFeeId++
    setAdditionalFees([...additionalFees, { id: newId, title: '', amount: '' }])
    setTimeout(() => newFeeRef.current?.focus(), 0)
  }

  const updateFee = (id, field, value) => {
    if (field === 'amount' && value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return
    setAdditionalFees(additionalFees.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const removeFee = (id) => {
    setAdditionalFees(additionalFees.filter(f => f.id !== id))
  }

  const inheritedPricingLabel = signupPricing.pricingMode === 'per-spot' ? 'spot' : 'household'
  const hasSpotTimePricing = spotTimePricing.earlyBirdEnabled || spotTimePricing.lateFeeEnabled

  return (
    <div className="item-take-payments">
      <label className="payments-checkbox-row">
        <input
          type="checkbox"
          className="payments-checkbox"
          checked={itemPaymentsEnabled}
          onChange={(e) => setItemPaymentsEnabled(e.target.checked)}
        />
        <div className="item-payments-label">
          <span className="payments-checkbox-label">
            Take payments for this Item
            <InfoTooltip text="Processing fee coverage and add-on gifts are not available for Signup payments." />
          </span>
        </div>
      </label>

      {itemPaymentsEnabled && (
        <div className="item-payment-settings">

          {isHouseholdMode ? (
            /* ── Inherited pricing (read-only) ── */
            <div className="inherited-pricing">
              <div className="inherited-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>
                  Per-household pricing — configured at signup level.{' '}
                  <button className="inherited-link" onClick={navigateToPayments}>
                    Edit in Take Payments
                  </button>
                </span>
              </div>

              <div className="item-pricing-widget">
                <div className="item-pricing-card inherited-card">
                  <div className="item-pricing-main">
                    <span className="icon-circle inherited-icon" style={{ width: 36, height: 36, minWidth: 36 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                    <div className="item-pricing-fields">
                      <div className="item-pricing-header">
                        <span className="item-pricing-label inherited-text">Price per {inheritedPricingLabel}</span>
                        <div className="pricing-toggle inherited-toggle">
                          <span className={`toggle-btn ${signupPricing.pricingMode === 'per-spot' ? 'active' : ''}`}>
                            Per Spot
                          </span>
                          <span className={`toggle-btn ${signupPricing.pricingMode === 'per-household' ? 'active' : ''}`}>
                            Per Household
                          </span>
                        </div>
                      </div>
                      <div className="price-input-wrap inherited-input">
                        <span className="price-prefix">$</span>
                        <input type="text" className="price-input" value={signupPricing.price} readOnly />
                      </div>
                    </div>
                  </div>

                  {signupPricing.pricingMode === 'per-spot' && signupPricing.maxPriceEnabled && (
                    <div className="item-pricing-max inherited-max">
                      <span className="icon-circle inherited-icon" style={{ width: 36, height: 36, minWidth: 36 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                      </span>
                      <div className="item-pricing-fields">
                        <span className="item-pricing-label inherited-text">Max per household across all items</span>
                        <div className="price-input-wrap inherited-input">
                          <span className="price-prefix">$</span>
                          <input type="text" className="price-input" value={signupPricing.maxPrice} readOnly />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Early bird inherited */}
                  {signupPricing.earlyBirdEnabled && (
                    <div className="inherited-time-row">
                      <span className="icon-circle inherited-icon" style={{ width: 28, height: 28, minWidth: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <div className="inherited-time-info">
                        <span className="inherited-time-title">Early Bird</span>
                        <span className="inherited-time-detail">
                          ${signupPricing.earlyBirdPrice}/{inheritedPricingLabel} before {new Date(signupPricing.earlyBirdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Late pricing inherited */}
                  {signupPricing.latePricingEnabled && (
                    <div className="inherited-time-row">
                      <span className="icon-circle inherited-icon" style={{ width: 28, height: 28, minWidth: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                        </svg>
                      </span>
                      <div className="inherited-time-info">
                        <span className="inherited-time-title">Late Fee</span>
                        <span className="inherited-time-detail">
                          ${signupPricing.latePrice}/{inheritedPricingLabel} after {new Date(signupPricing.lateDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── Editable pricing (per-spot mode) ── */
            <>
              {useTieredPricing ? (
                <div style={{ marginBottom: 12 }}>
                  <MockTierPriceEditor
                    tierData={itemTierData}
                    setTierData={setItemTierData}
                    entity="spot"
                  />
                  <button className="inherited-link" onClick={() => setUseTieredPricing(false)} style={{ marginTop: 8, display: 'block' }}>
                    Switch to standard pricing &rarr;
                  </button>
                </div>
              ) : (
              <>
              {/* Per-spot info banner */}
              <div className="spot-info-banner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  {hasSpotTimePricing
                    ? <>Per-spot pricing — dates from signup level. <button className="inherited-link" onClick={navigateToPayments}>Edit dates</button></>
                    : <>Per-spot pricing — time-based discounts can be enabled at signup level. <button className="inherited-link" onClick={navigateToPayments}>Go to Take Payments</button></>
                  }
                </span>
              </div>

              <div className="item-pricing-widget">
                <div className="item-pricing-card">
                  <div className="item-pricing-main">
                    <span className="icon-circle" style={{ width: 36, height: 36, minWidth: 36 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                    <div className="item-pricing-fields">
                      <div className="item-pricing-header">
                        <span className="item-pricing-label">Price per {pricingMode === 'per-spot' ? 'spot' : 'household'}</span>
                        <div className="pricing-toggle">
                          <button
                            className={`toggle-btn ${pricingMode === 'per-spot' ? 'active' : ''}`}
                            onClick={() => setPricingMode('per-spot')}
                          >
                            Per Spot
                          </button>
                          <button
                            className={`toggle-btn ${pricingMode === 'per-household' ? 'active' : ''}`}
                            onClick={() => setPricingMode('per-household')}
                          >
                            Per Household
                          </button>
                        </div>
                      </div>
                      <div className="price-input-wrap">
                        <span className="price-prefix">$</span>
                        <input
                          type="text"
                          className="price-input"
                          value={price}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                              setPrice(val)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {pricingMode === 'per-spot' && (
                    <div className="item-pricing-max">
                      <span className="icon-circle" style={{ width: 36, height: 36, minWidth: 36 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                      </span>
                      <div className="item-pricing-fields">
                        <div className="item-max-header">
                          <span className="item-pricing-label">
                            Max per household for this item?
                            <InfoTooltip text="Caps what a household pays for this specific item, regardless of how many spots they take." />
                          </span>
                          <label className="small-checkbox-wrap">
                            <input
                              type="checkbox"
                              className="small-checkbox"
                              checked={maxPriceEnabled}
                              onChange={(e) => {
                                setMaxPriceEnabled(e.target.checked)
                                if (e.target.checked) setTimeout(() => maxPriceRef.current?.focus(), 0)
                              }}
                            />
                          </label>
                        </div>
                        {maxPriceEnabled && (
                          <div className="price-input-wrap">
                            <span className="price-prefix">$</span>
                            <input
                              ref={maxPriceRef}
                              type="text"
                              className="price-input"
                              value={maxPrice}
                              onChange={(e) => {
                                const val = e.target.value
                                if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                                  setMaxPrice(val)
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button className="inherited-link" onClick={() => setUseTieredPricing(true)} style={{ marginTop: 4, marginBottom: 8, display: 'block' }}>
                  Use tiered pricing instead &rarr;
                </button>

                {/* Time-based pricing inputs (per-spot mode) */}
                {hasSpotTimePricing && (
                  <div className="item-time-pricing">
                    <div className="section-header">
                      <span className="section-header-text">TIME-BASED PRICING</span>
                    </div>
                    <div className="item-time-card">
                      {spotTimePricing.earlyBirdEnabled && (
                        <>
                          <div className="item-time-card-header">
                            <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </span>
                            <div className="item-time-card-info">
                              <span className="item-time-card-title">Early Bird</span>
                              <span className="item-time-card-subtitle">
                                Discount ends {new Date(spotTimePricing.earlyBirdDate + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <label className="small-checkbox-wrap">
                              <input
                                type="checkbox"
                                className="small-checkbox"
                                checked={itemEarlyBirdEnabled}
                                onChange={(e) => setItemEarlyBirdEnabled(e.target.checked)}
                              />
                            </label>
                          </div>
                          {itemEarlyBirdEnabled && (
                            <div className="item-time-card-detail">
                              <div className="item-time-card-row">
                                <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                </span>
                                <span className="item-time-card-label">Price per {pricingMode === 'per-spot' ? 'spot' : 'household'}</span>
                                <div className="price-input-wrap">
                                  <span className="price-prefix">$</span>
                                  <input
                                    type="text"
                                    className="price-input"
                                    value={earlyBirdPrice}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                                        setEarlyBirdPrice(val)
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {spotTimePricing.lateFeeEnabled && (
                        <>
                          <div className={`item-time-card-header ${spotTimePricing.earlyBirdEnabled ? 'with-divider' : ''}`}>
                            <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                              </svg>
                            </span>
                            <div className="item-time-card-info">
                              <span className="item-time-card-title">Late Fee</span>
                              <span className="item-time-card-subtitle">
                                Late fee starts {new Date(spotTimePricing.lateFeeDate + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <label className="small-checkbox-wrap">
                              <input
                                type="checkbox"
                                className="small-checkbox"
                                checked={itemLateFeeEnabled}
                                onChange={(e) => setItemLateFeeEnabled(e.target.checked)}
                              />
                            </label>
                          </div>
                          {itemLateFeeEnabled && (
                            <div className="item-time-card-detail">
                              <div className="item-time-card-row">
                                <span className="icon-circle" style={{ width: 32, height: 32, minWidth: 32 }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                </span>
                                <span className="item-time-card-label">Price per {pricingMode === 'per-spot' ? 'spot' : 'household'}</span>
                                <div className="price-input-wrap">
                                  <span className="price-prefix">$</span>
                                  <input
                                    type="text"
                                    className="price-input"
                                    value={latePrice}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                                        setLatePrice(val)
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              </>
              )}
</>
          )}

          {/* Additional Fees — always editable */}
          <div className="additional-fees-section">
            <div className="section-header">
              <span className="section-header-text">ADDITIONAL FEES</span>
            </div>

            {additionalFees.length > 0 && (
              <div className="fees-card">
                {additionalFees.map((fee, i) => (
                  <div key={fee.id} className={`fee-row ${i === additionalFees.length - 1 ? 'no-border' : ''}`}>
                    <input
                      type="text"
                      className="fee-title-input"
                      placeholder="Fee name"
                      value={fee.title}
                      onChange={(e) => updateFee(fee.id, 'title', e.target.value)}
                      ref={i === additionalFees.length - 1 ? newFeeRef : null}
                    />
                    <div className="price-input-wrap fee-amount-input">
                      <span className="price-prefix">$</span>
                      <input
                        type="text"
                        className="price-input"
                        placeholder="0"
                        value={fee.amount}
                        onChange={(e) => updateFee(fee.id, 'amount', e.target.value)}
                      />
                    </div>
                    <button className="fee-delete-btn" onClick={() => removeFee(fee.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="add-fee-btn" onClick={addFee}>
              + Add fee
            </button>
          </div>

          {/* Action buttons */}
          <div className="item-actions">
            <button className="btn-cancel">Cancel</button>
            <button className="btn-save">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}
