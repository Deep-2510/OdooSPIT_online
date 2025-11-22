export const calculateMargin = (cost, price) => {
  if (!price) return 0;
  return ((price - cost) / price) * 100;
};

export default calculateMargin;
