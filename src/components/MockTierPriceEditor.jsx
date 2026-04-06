import React, { useState } from 'react'
import './MockTierPriceEditor.css'

let nextTierId = 100

export default function MockTierPriceEditor({ tierData, setTierData, entity = 'spot', disabled = false }) {
  const maxTier = tierData?.find(t => t.numberOfSlots === null) || { numberOfSlots: null, amount: '', id: 'max' }
  const nonMaxTiers = tierData?.filter(t => t.numberOfSlots !== null) || []

  const updateMaxAmount = (val) => {
    if (disabled) return
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
          <div className="tier-add-row">
            <button className="tier-add-btn" onClick={() => addTier(0)} disabled={disabled || nonMaxTiers.length >= 3} type="button">
              📊 Add a Tier
            </button>
          </div>

          {nonMaxTiers.map((tier, i) => (
            <React.Fragment key={tier.id}>
              <div className="tier-row">
                <div className="tier-slots">
                  <span className="tier-up-to">Up to</span>
                  <button className="tier-slot-btn" onClick={() => updateTierSlots(tier.id, -1)} disabled={disabled} type="button">−</button>
                  <span className="tier-slot-value">{tier.numberOfSlots}</span>
                  <button className="tier-slot-btn" onClick={() => updateTierSlots(tier.id, 1)} disabled={disabled} type="button">+</button>
                  <span className="tier-spots-label">{entity}s</span>
                </div>
                <div className="tier-price">
                  <span className="tier-price-label">Total Price</span>
                  <div className="price-input-wrap">
                    <span className="price-prefix">$</span>
                    <input
                      type="text"
                      className="price-input"
                      placeholder="0.00"
                      value={tier.amount}
                      onChange={(e) => updateTierAmount(tier.id, e.target.value)}
                      disabled={disabled}
                    />
                  </div>
                </div>
                <button className="tier-delete-btn" onClick={() => removeTier(tier.id)} disabled={disabled} type="button">
                  🗑
                </button>
              </div>

              <div className="tier-add-row">
                <button className="tier-add-btn" onClick={() => addTier(i + 1)} disabled={disabled || nonMaxTiers.length >= 3} type="button">
                  📊 Add a Tier
                </button>
              </div>
            </React.Fragment>
          ))}

          {/* Max tier (always shown) */}
          <div className="tier-row tier-max-row">
            <div className="tier-slots">
              <span className="tier-max-value">{lastNonMaxSlots + 1}+</span>
              <span className="tier-spots-label">{entity}s</span>
            </div>
            <div className="tier-price">
              <span className="tier-price-label">Total Price</span>
              <div className="price-input-wrap">
                <span className="price-prefix">$</span>
                <input
                  type="text"
                  className="price-input"
                  placeholder="0.00"
                  value={maxTier.amount}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^\d*\.?\d{0,2}$/.test(val) || val === '') updateMaxAmount(val)
                  }}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="tier-delete-placeholder" />
          </div>
        </div>
    </div>
  )
}
