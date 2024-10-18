const pageControls = document.querySelector('.page-controls');

const handleNavBtnControls = (pageIndex, maxIndex) => {
  const isMax = maxIndex && pageIndex === maxIndex;
  pageControls.dataset.pageIndex = isMax ? 'max' : pageIndex;
  if (maxIndex <= 0) {
    pageControls.setAttribute('disabled', true);
  } else {
    pageControls.removeAttribute('disabled');
    for (const btn of pageControls.children) {
      const ind = Number.parseInt(btn.dataset.controlIndex);
      if (isMax && ind >= 2) {
        btn.setAttribute('disabled', true);
      } else if (pageIndex === 0 && ind <= 1) {
        btn.setAttribute('disabled', true);
      } else {
        btn.removeAttribute('disabled');
      }
    }
  }
};

export default handleNavBtnControls;
