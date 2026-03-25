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
  const [chargeMode, setChargeMode] = useState('per-spot')

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
          />
        )}
        {activeTab === 'Items' && (
          <ItemsTab paymentsEnabled={paymentsEnabled} chargeMode={chargeMode} />
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
