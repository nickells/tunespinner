import React from 'react'

const Tabs = ({ labels, onClick, activeTab }) => (
  <div className="tabs">
    {
      labels.map(label => (
        <div
          className={`tab ${activeTab === label ? 'active' : null}`}
          key={label}
          onClick={e => onClick(label)}
        >
          {label}
        </div>
      ))
    }
  </div>
)

export default Tabs
