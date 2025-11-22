export const parseCSV = (text) => {
  // Very small CSV parse stub
  const lines = text.split('\n').filter(Boolean);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((l) => {
    const cols = l.split(',');
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cols[i]));
    return obj;
  });
};

export default parseCSV;
