import React, { useState } from 'react'
import './MockTierPriceEditor.css'

let nextTierId = 100

function TierAddButton({ onClick, disabled }) {
  return (
    <div className="tier-add-row">
      <button className="tier-add-btn" onClick={onClick} disabled={disabled} type="button">
        <span className="tier-add-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </span>
        Add a Tier
      </button>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export default function MockTierPriceEditor({ tierData, setTierData, entity = 'spot', disabled = false }) {
  const maxTier = tierData?.find(t => t.numberOfSlots === null) || { numberOfSlots: null, amount: '', id: 'max' }
  const nonMaxTiers = tierData?.filter(t => t.numberOfSlots !== null) || []

  const updateMaxAmount = (val) => {
    if (disabled) return
    if (val !== '' && !/^\d*\.?\d{0,2}$/.test(val)) return
    setTierData(tierData.map(t => t.numberOfSlots === null ? { ...t, amount: val } : t))
  }

  const updateTierSlots = (id, delta) => {
    if (disabled) return
    setTierData(tierData.map(t => {
      if (t.id === id) {
        const newSlots = Math.max(1, (Number(t.numberOfSlots) || 1) + delta)
        return { ...t, numberOfSlots: newSlots }
      }
      return t
    }))
  }

  const updateTierAmount = (id, val) => {
    if (disabled) return
    if (val !== '' && !/^\d*\.?\d{0,2}$/.test(val)) return
    setTierData(tierData.map(t => t.id === id ? { ...t, amount: val } : t))
  }

  const addTier = (insertIndex) => {
    if (disabled || nonMaxTiers.length >= 3) return
    const prevSlots = insertIndex > 0 ? Number(nonMaxTiers[insertIndex - 1]?.numberOfSlots || 1) : 0
    const newTier = { numberOfSlots: prevSlots + 2, amount: '', id: nextTierId++ }
    const newNonMax = [...nonMaxTiers]
    newNonMax.splice(insertIndex, 0, newTier)
    setTierData([...newNonMax, maxTier])
  }

  const removeTier = (id) => {
    if (disabled) return
    setTierData(tierData.filter(t => t.id !== id))
  }

  const lastNonMaxSlots = nonMaxTiers.length > 0
    ? Number(nonMaxTiers[nonMaxTiers.length - 1].numberOfSlots)
    : 0

  // Ensure we always have at least one non-max tier when rendered
  if (nonMaxTiers.length === 0 && tierData) {
    const newTier = { numberOfSlots: 2, amount: '', id: nextTierId++ }
    setTierData([newTier, maxTier])
  }

  return (
    <div className="mock-tier-editor">
      <div className="tier-list">
        <TierAddButton onClick={() => addTier(0)} disabled={disabled || nonMaxTiers.length >= 3} />

        {nonMaxTiers.map((tier, i) => (
          <React.Fragment key={tier.id}>
            <div className="tier-row">
              <div className="tier-slots">
                <div className="tier-slots-number">
                  <span className="tier-up-to">Up to</span>
                  <button className="tier-slot-btn" onClick={() => updateTierSlots(tier.id, -1)} disabled={disabled} type="button">−</button>
                  <span className="tier-slot-value">{tier.numberOfSlots}</span>
                  <button className="tier-slot-btn" onClick={() => updateTierSlots(tier.id, 1)} disabled={disabled} type="button">+</button>
                  <span className="tier-spots-label">{entity}s</span>
                </div>
              </div>
              <div className="tier-price">
                <span className="tier-price-label">Total Price</span>
                <input
                  type="text"
                  className="tier-price-input"
                  placeholder="$0.00"
                  value={tier.amount ? `$${tier.amount}` : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/^\$/, '')
                    updateTierAmount(tier.id, raw)
                  }}
                  disabled={disabled}
                />
              </div>
              <button className="tier-delete-btn" onClick={() => removeTier(tier.id)} disabled={disabled} type="button">
                <TrashIcon />
              </button>
            </div>

            <TierAddButton onClick={() => addTier(i + 1)} disabled={disabled || nonMaxTiers.length >= 3} />
          </React.Fragment>
        ))}

        {/* Max tier (always shown) */}
        <div className="tier-row tier-max-row">
          <div className="tier-max-slots">
            <span className="tier-max-value">{lastNonMaxSlots + 1}+</span>
            <span className="tier-spots-label">{entity}s</span>
          </div>
          <div className="tier-price">
            <span className="tier-price-label">Total Price</span>
            <input
              type="text"
              className="tier-price-input"
              placeholder="$0.00"
              value={maxTier.amount ? `$${maxTier.amount}` : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/^\$/, '')
                updateMaxAmount(raw)
              }}
              disabled={disabled}
            />
          </div>
          <div className="tier-delete-placeholder" />
        </div>
      </div>
    </div>
  )
}
