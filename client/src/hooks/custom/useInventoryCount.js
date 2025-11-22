import { useState } from 'react';

const useInventoryCount = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  const reset = () => setCount(0);
  return { count, increment, reset };
};

export default useInventoryCount;
