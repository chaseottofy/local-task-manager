import removeAllChildNodes from '../utils/remove-children';
import createTooltip from './ui/tooltip';

const statusGraphX = document.querySelector('.status-graph-x');
const statusGraphY = document.querySelector('.status-graph-y');
const tooltip = document.querySelector('.tooltip');

const configStatusGraph = (data) => {
  removeAllChildNodes(statusGraphX);
  removeAllChildNodes(statusGraphY);

  const statusCounts = {};
  for (const { status } of data) {
    statusCounts[status] = statusCounts[status] ? statusCounts[status] + 1 : 1;
  }
  const sortedCounts = Object.fromEntries(
    Object.entries(statusCounts).sort((a, b) => b[1] - a[1]),
  );
  const countsValues = Object.values(sortedCounts);

  let total = countsValues[0] + 5;
  total = total - (total % 5) + 5;
  for (let i = total; i >= 0; i -= 5) {
    const graphRow = document.createElement('span');
    graphRow.classList.add('graph-row');
    graphRow.style.width = '100%';
    graphRow.textContent = i;
    statusGraphY.append(graphRow);
  }
  statusGraphX.style.backgroundSize = `100% ${Number((5 / total).toFixed(2)) * 100}%`;
  const cellWidth = (100 / (countsValues.length));
  for (const [k, v] of Object.entries(sortedCounts)) {
    const graphCellWrapper = document.createElement('div');
    graphCellWrapper.classList.add('graph-cell-wrapper');
    graphCellWrapper.style.width = `${cellWidth}%`;
    graphCellWrapper.dataset.statusValue = k;
    const graphCell = document.createElement('div');
    graphCell.classList.add('graph-cell');
    graphCell.style.height = `${(Number((v / total) * 100).toFixed(2))}%`;
    graphCell.addEventListener('mouseenter', () => {
      createTooltip(`${k}: ${v}`, graphCell);
    });
    graphCell.addEventListener('mouseleave', () => {
      tooltip.dataset.tooltipActive = 'false';
    });
    graphCellWrapper.append(graphCell);
    statusGraphX.append(graphCellWrapper);
  }
};

export default configStatusGraph;
