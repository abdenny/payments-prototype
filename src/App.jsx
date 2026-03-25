import React, { useState } from 'react'
import SignupEditor from './components/SignupEditor'
import './App.css'

const CONFIGS = {
  'off': {
    paymentsEnabled: false,
    chargeMode: 'per-spot',
    activeTab: 'Take Payments',
    signupPricing: {
      pricingMode: 'per-spot', price: '', maxPriceEnabled: false, maxPrice: '',
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', earlyBirdPrice: '', earlyBirdMaxPrice: '',
      latePricingEnabled: false, lateDate: '2026-08-15', latePrice: '', lateMaxPrice: '',
    },
    spotTimePricing: {
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', lateFeeEnabled: false, lateFeeDate: '2026-08-15',
    },
  },
  'simple-spot': {
    paymentsEnabled: true,
    chargeMode: 'per-spot',
    activeTab: 'Take Payments',
    signupPricing: {
      pricingMode: 'per-spot', price: '', maxPriceEnabled: false, maxPrice: '',
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', earlyBirdPrice: '', earlyBirdMaxPrice: '',
      latePricingEnabled: false, lateDate: '2026-08-15', latePrice: '', lateMaxPrice: '',
    },
    spotTimePricing: {
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', lateFeeEnabled: false, lateFeeDate: '2026-08-15',
    },
  },
  'simple-household': {
    paymentsEnabled: true,
    chargeMode: 'per-household',
    activeTab: 'Take Payments',
    signupPricing: {
      pricingMode: 'per-spot', price: '10', maxPriceEnabled: false, maxPrice: '',
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', earlyBirdPrice: '', earlyBirdMaxPrice: '',
      latePricingEnabled: false, lateDate: '2026-08-15', latePrice: '', lateMaxPrice: '',
    },
    spotTimePricing: {
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', lateFeeEnabled: false, lateFeeDate: '2026-08-15',
    },
  },
  'advanced-spot': {
    paymentsEnabled: true,
    chargeMode: 'per-spot',
    activeTab: 'Take Payments',
    signupPricing: {
      pricingMode: 'per-spot', price: '', maxPriceEnabled: false, maxPrice: '',
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', earlyBirdPrice: '', earlyBirdMaxPrice: '',
      latePricingEnabled: false, lateDate: '2026-08-15', latePrice: '', lateMaxPrice: '',
    },
    spotTimePricing: {
      earlyBirdEnabled: true, earlyBirdDate: '2026-06-01', lateFeeEnabled: true, lateFeeDate: '2026-08-15',
    },
    spotMax: { enabled: true, price: '25' },
  },
  'advanced-household': {
    paymentsEnabled: true,
    chargeMode: 'per-household',
    activeTab: 'Take Payments',
    signupPricing: {
      pricingMode: 'per-spot', price: '4', maxPriceEnabled: true, maxPrice: '12',
      earlyBirdEnabled: true, earlyBirdDate: '2026-06-01', earlyBirdPrice: '3', earlyBirdMaxPrice: '',
      latePricingEnabled: true, lateDate: '2026-08-15', latePrice: '6', lateMaxPrice: '',
    },
    spotTimePricing: {
      earlyBirdEnabled: false, earlyBirdDate: '2026-06-01', lateFeeEnabled: false, lateFeeDate: '2026-08-15',
    },
  },
}

export default function App() {
  const [complexity, setComplexity] = useState('simple') // 'off' | 'simple' | 'advanced'
  const [chargeType, setChargeType] = useState('spot')   // 'spot' | 'household'
  const [resetKey, setResetKey] = useState(0)

  const scenarioId = complexity === 'off'
    ? 'off'
    : `${complexity}-${chargeType === 'spot' ? 'spot' : 'household'}`

  const config = CONFIGS[scenarioId]

  const selectComplexity = (c) => {
    setComplexity(c)
    setResetKey(k => k + 1)
  }

  const selectChargeType = (t) => {
    setChargeType(t)
    setResetKey(k => k + 1)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
      <div className="scenario-bar">
        <div className="scenario-bar-header">
          <span className="scenario-bar-title">Prototype Scenarios</span>
          <span className="scenario-bar-desc">Select a configuration to preview</span>
        </div>
        <div className="scenario-rows">
          <div className="scenario-row">
            <span className="scenario-row-label">Config</span>
            <div className="scenario-toggle-group">
              <button
                className={`scenario-toggle ${complexity === 'off' ? 'active' : ''}`}
                onClick={() => selectComplexity('off')}
              >
                Payments Off
              </button>
              <button
                className={`scenario-toggle ${complexity === 'simple' ? 'active' : ''}`}
                onClick={() => selectComplexity('simple')}
              >
                Simple
              </button>
              <button
                className={`scenario-toggle ${complexity === 'advanced' ? 'active' : ''}`}
                onClick={() => selectComplexity('advanced')}
              >
                Advanced
              </button>
            </div>
          </div>
          <span className="scenario-hint">
            {complexity === 'off' && 'No payments configured on this signup.'}
            {complexity === 'simple' && 'Base pricing only — no early bird or late fee windows.'}
            {complexity === 'advanced' && 'Includes early bird discounts and late fee date windows.'}
          </span>

          {complexity !== 'off' && (
            <div className="scenario-row">
              <span className="scenario-row-label">Charge mode</span>
              <div className="scenario-toggle-group">
                <button
                  className={`scenario-toggle ${chargeType === 'spot' ? 'active' : ''}`}
                  onClick={() => selectChargeType('spot')}
                >
                  Per Spot
                </button>
                <button
                  className={`scenario-toggle ${chargeType === 'household' ? 'active' : ''}`}
                  onClick={() => selectChargeType('household')}
                >
                  Per Household
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SignupEditor key={resetKey} initialConfig={config} />
    </div>
  )
}
