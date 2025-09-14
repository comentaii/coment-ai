import { useState } from 'react';

const useTabs = (init = 0) => {
  const [activeTab, setActiveTab] = useState(init);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return [activeTab, handleTabClick] as const;
};

export default useTabs;
