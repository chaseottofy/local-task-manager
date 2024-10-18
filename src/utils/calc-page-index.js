const getNxtIndex = (btnIdx, maxIdx, pageIdx, control) => {
  if (btnIdx === 0) return 0;
  if (btnIdx === 3) return maxIdx;
  const diff = Number.parseFloat(control) + pageIdx;
  return (diff > maxIdx || diff < 0) ? -1 : diff;
};

export default getNxtIndex;
