import React, { useState } from 'react'
import TakePaymentsTab from './TakePaymentsTab'
import ItemsTab from './ItemsTab'
import './SignupEditor.css'

const TABS = [
  { name: 'Items', icon: '⊞' },
  { name: 'Respondent Data', icon: '⊞' },
  { name: 'Take Payments', icon: '' },
  { name: 'Signup Options', icon: '≡' },
]

export default function SignupEditor() {
  const [activeTab, setActiveTab] = useState('Items')
  const [paymentsEnabled, setPaymentsEnabled] = useState(true)
  const [chargeMode, setChargeMode] = useState('per-household')

  // Signup-level household pricing state (lifted so items can read it)
  const [signupPricing, setSignupPricing] = useState({
    pricingMode: 'per-spot',
    price: '4',
    maxPriceEnabled: true,
    maxPrice: '12',
    earlyBirdEnabled: false,
    earlyBirdDate: '2026-06-01',
    earlyBirdPrice: '5',
    earlyBirdMaxPrice: '15',
    latePricingEnabled: false,
    lateDate: '2026-08-15',
    latePrice: '4',
    lateMaxPrice: '12',
  })

  // Per-spot time-based dates (lifted so items can read them)
  const [spotTimePricing, setSpotTimePricing] = useState({
    earlyBirdEnabled: false,
    earlyBirdDate: '2026-06-01',
    lateFeeEnabled: false,
    lateFeeDate: '2026-08-15',
  })

  const navigateToPayments = () => setActiveTab('Take Payments')

  return (
    <div className="signup-editor">
      <div className="signup-editor-header">
        <div className="signup-title-row">
          <span className="signup-icon">📅</span>
          <h2>Fish Fry</h2>
        </div>
      </div>
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.name}
            className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 'Take Payments' && (
          <TakePaymentsTab
            paymentsEnabled={paymentsEnabled}
            setPaymentsEnabled={setPaymentsEnabled}
            chargeMode={chargeMode}
            setChargeMode={setChargeMode}
            signupPricing={signupPricing}
            setSignupPricing={setSignupPricing}
            spotTimePricing={spotTimePricing}
            setSpotTimePricing={setSpotTimePricing}
          />
        )}
        {activeTab === 'Items' && (
          <ItemsTab
            paymentsEnabled={paymentsEnabled}
            chargeMode={chargeMode}
            signupPricing={signupPricing}
            spotTimePricing={spotTimePricing}
            navigateToPayments={navigateToPayments}
          />
        )}
        {activeTab === 'Respondent Data' && (
          <div className="placeholder-tab">Respondent Data tab</div>
        )}
        {activeTab === 'Signup Options' && (
          <div className="placeholder-tab">Signup Options tab</div>
        )}
      </div>
    </div>
  )
}
