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

export default function SignupEditor({ initialConfig = {} }) {
  const [activeTab, setActiveTab] = useState(initialConfig.activeTab || 'Items')
  const [paymentsEnabled, setPaymentsEnabled] = useState(initialConfig.paymentsEnabled ?? true)
  const [chargeMode, setChargeMode] = useState(initialConfig.chargeMode || 'per-spot')

  const [signupPricing, setSignupPricing] = useState(initialConfig.signupPricing || {
    pricingMode: 'per-spot',
    price: '4',
    maxPriceEnabled: false,
    maxPrice: '',
    earlyBirdEnabled: false,
    earlyBirdDate: '2026-06-01',
    earlyBirdPrice: '5',
    earlyBirdMaxPrice: '15',
    latePricingEnabled: false,
    lateDate: '2026-08-15',
    latePrice: '4',
    lateMaxPrice: '12',
  })

  const [spotTimePricing, setSpotTimePricing] = useState(initialConfig.spotTimePricing || {
    earlyBirdEnabled: false,
    earlyBirdDate: '2026-06-01',
    lateFeeEnabled: false,
    lateFeeDate: '2026-08-15',
  })

  const navigateToPayments = () => setActiveTab('Take Payments')
  const navigateToItems = () => setActiveTab('Items')

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
            navigateToItems={navigateToItems}
            initialSpotMax={initialConfig.spotMax}
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
