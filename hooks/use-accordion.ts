import { useState } from 'react';

const useAccordion = (init = 0) => {
  const [activeIndex, setActiveIndex] = useState(init);

  const handleAccordion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return [activeIndex, handleAccordion] as const;
};

export default useAccordion;
