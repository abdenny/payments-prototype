import React, { useState, useRef, useEffect } from 'react'
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

let nextFeeId = 1

function ItemTakePaymentsSubTab({ chargeMode, signupPricing, spotTimePricing, navigateToPayments }) {
  const [itemPaymentsEnabled, setItemPaymentsEnabled] = useState(true)
  const [pricingMode, setPricingMode] = useState('per-spot')
  const [price, setPrice] = useState('4')
  const [maxPriceEnabled, setMaxPriceEnabled] = useState(true)
  const [maxPrice, setMaxPrice] = useState('12')
  const [earlyBirdPrice, setEarlyBirdPrice] = useState('1.00')
  const [latePrice, setLatePrice] = useState('5.00')
  const [additionalFees, setAdditionalFees] = useState([])
  const newFeeRef = useRef(null)

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

  // For inherited display
  const inheritedPricingLabel = signupPricing.pricingMode === 'per-spot' ? 'spot' : 'family'

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
          <span className="payments-checkbox-label">Take payments for this Item</span>
          <span className="item-payments-note">
            Please note: Payments for a Signup do not include the option to cover the processing
            fee or include an "Add-on" gift.
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
                  Pricing is inherited from signup-level settings.{' '}
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
                          <span className={`toggle-btn ${signupPricing.pricingMode === 'per-family' ? 'active' : ''}`}>
                            Per Family
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
                        <span className="item-pricing-label inherited-text">Maximum price per family</span>
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
                        <span className="inherited-time-title">Late Pricing</span>
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
                      <span className="item-pricing-label">Price</span>
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
                        <span className="item-pricing-label">Max price (without fees?)</span>
                        <label className="small-checkbox-wrap">
                          <input
                            type="checkbox"
                            className="small-checkbox"
                            checked={maxPriceEnabled}
                            onChange={(e) => setMaxPriceEnabled(e.target.checked)}
                          />
                        </label>
                      </div>
                      {maxPriceEnabled && (
                        <div className="price-input-wrap">
                          <span className="price-prefix">$</span>
                          <input
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

              {/* Time-based pricing inputs (per-spot mode) */}
              {(spotTimePricing.earlyBirdEnabled || spotTimePricing.lateFeeEnabled) && (
                <div className="item-time-pricing">
                  {spotTimePricing.earlyBirdEnabled && (
                    <div className="item-time-block">
                      <div className="item-time-header">
                        <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </span>
                        <span className="item-time-title">Early Bird</span>
                      </div>
                      <div className="item-time-row">
                        <span className="item-time-date">
                          Price before {new Date(spotTimePricing.earlyBirdDate + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}:
                        </span>
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

                  {spotTimePricing.lateFeeEnabled && (
                    <div className="item-time-block">
                      <div className="item-time-header">
                        <span className="icon-circle" style={{ width: 28, height: 28, minWidth: 28 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                          </svg>
                        </span>
                        <span className="item-time-title">Late</span>
                      </div>
                      <div className="item-time-row">
                        <span className="item-time-date">
                          Price after {new Date(spotTimePricing.lateFeeDate + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}:
                        </span>
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
                </div>
              )}
            </div>
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
