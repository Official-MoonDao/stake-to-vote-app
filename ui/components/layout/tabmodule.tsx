import React, { useState } from 'react';

interface TabModuleProps {
  tabs: { label: string; content: React.ReactNode }[];
}

const TabModule: React.FC<TabModuleProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab px-4 py-2 rounded-tl-[10px] rounded-tr-[10px] ${
              activeTab === index
                ? 'bg-gradient-to-r from-dark-cool to-mid-cool text-white'
                : 'bg-white text-gray-500'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab].content}</div>
    </div>
  );
};

export default TabModule;
