const createTooltip = (text, el) => {
  const [tooltipHeight, tooltipPadding] = [35, 20];
  const {
    innerWidth, innerHeight, scrollY, scrollX,
  } = globalThis;
  const {
    left: elLeft, top: elTop, bottom: elBottom, width: elWidth,
  } = el.getBoundingClientRect();

  const tooltip = document.querySelector('.tooltip');
  const tooltipContent = tooltip.querySelector('.tooltip-content');
  tooltipContent.textContent = text;
  tooltip.dataset.tooltipActive = 'true';

  const tooltipCurrWidth = tooltip.offsetWidth;
  let postop = elBottom + scrollY + tooltipPadding;
  let posleft = elLeft + scrollX + elWidth / 2 - tooltipCurrWidth / 2;
  if (postop + tooltipHeight > innerHeight + scrollY) {
    postop = elTop + scrollY - tooltipHeight - tooltipPadding;
  }

  if (posleft < 0) {
    posleft = tooltipPadding / 2;
  }

  tooltip.style.left = ((posleft + tooltipCurrWidth) >= innerWidth)
    ? `${innerWidth - (tooltipCurrWidth + 25)}px`
    : `${posleft}px`;

  tooltip.style.top = `${postop}px`;
  return tooltip;
};

export default createTooltip;
