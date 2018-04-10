import React from 'react'

const Tabs = ({ labels, onClick, activeTab }) => (
  <div className="tabs">
    {
      labels.map(label => (
        <h3
          className={`tab ${activeTab === label ? 'active' : null}`}
          key={label}
          onClick={e => onClick(label)}
        >
          {label}
        </h3>
      ))
    }
  </div>
)

export default Tabs
