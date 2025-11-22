export const simpleForecast = (series = [], periods = 3) => {
  const last = series.slice(-periods);
  const avg = last.reduce((s, v) => s + v, 0) / (last.length || 1);
  return new Array(periods).fill(avg);
};

export default simpleForecast;
