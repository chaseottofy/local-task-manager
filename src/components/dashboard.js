import getNxtIndex from '../utils/calc-page-index';
import handleNavBtnControls from '../utils/handle-table-nav';
import generateRows from '../utils/rows-arr';
import configDashboard from './config-dashboard';
import createTask from './create-task';
import Select from './select';
import configStatusGraph from './status-graph';

const configTasks = (state) => {
  const tbody = document.querySelector('tbody');
  const rootCheckbox = document.querySelector('#root-checkbox');
  const filterTasks = document.querySelector('#filter-tasks');
  const sortBtns = document.querySelectorAll('.sort-btn');
  const pageInfo = document.querySelector('.page-info');
  const selectedPageInfo = document.querySelector('.page-info-selected');
  const pageControls = document.querySelector('.page-controls');

  let data = state.getCompData();
  let selectElements = [];

  const processTasks = () => {
    pageInfo.textContent = state.getPageRangeString();
    selectedPageInfo.textContent = state.getCheckedRangeString();
    if (tbody.childElementCount > 1) {
      while (tbody.childElementCount > 1) {
        tbody.firstChild.remove();
      }
    }
    const pageData = state.getPageData();
    for (const task of pageData) {
      tbody.append(createTask(task, state));
    }
    tbody.firstChild.remove();
  };

  const processLocal = () => {
    processTasks();
  };

  const processSelectState = (processAll) => {
    state.process(true, processAll);
    processLocal();
    handleNavBtnControls(0, state.getPageLength());
  };

  // updates and initializes select element content
  const selectUpdaters = {
    updateSearchFilter: () => {
      return [...document.querySelectorAll('[data-filter-key]')].map((btn) => {
        return btn.dataset.sortKey;
      }).reduce((acc, row) => {
        acc[row] = { value: row };
        return acc;
      }, {});
    },
    updateRowsFilter: () => {
      return generateRows(data.length, 10) || {};
    },
    updateStatus: () => {
      return state.getStatusData() || {};
    },
  };

  const createSelectElements = () => {
    // SEARCH FILTERS
    const searchFilter = new Select({
      data,
      appendToElement: document.querySelector('.cg-search-param'),
      icon: 'filter',
      options: selectUpdaters.updateSearchFilter(),
      setState: (value) => {
        state.setSearchParam(value);
        filterTasks.placeholder = `${value}...`;
        processSelectState(false);
      },
    });
    // ROWS SELECT - (under table)
    const rowsSelect = new Select({
      data,
      appendToElement: document.querySelector('.control-row'),
      icon: 'arrows',
      options: selectUpdaters.updateRowsFilter(),
      setState: (value) => {
        state.setTableRows(Number.parseInt(value));
        state.setPageIndex(0);
        processSelectState(false);
      },
    });
    // ALL, DONE, PENDING SELECT
    const statusSelect = new Select({
      data,
      appendToElement: document.querySelector('.cg-status'),
      icon: 'arrows',
      options: selectUpdaters.updateStatus(),
      setState: (value) => {
        state.setStatusFilter(value);
        processSelectState(value === 'all');
      },
    });

    selectElements = [searchFilter, rowsSelect, statusSelect];
    const selectUpdatersEntries = Object.entries(selectUpdaters);
    for (let i = 0; i < selectElements.length; i += 1) {
      const currElement = selectElements[i];
      const [k, upd] = selectUpdatersEntries[i];
      currElement.init();
      state.setUpdater(k, () => currElement.setOptions(upd));
    }
  };

  const sortHandler = (e) => {
    const btn = e.target.closest('.sort-btn');
    const { direction, sortKey } = btn.dataset;
    state.sortData(sortKey, direction);
    processLocal();
    // eslint-disable-next-line no-param-reassign
    btn.dataset.direction = direction === 'asc' ? 'desc' : 'asc';
  };

  const setev = () => {
    // Search input
    filterTasks.addEventListener('input', (e) => {
      state.setSearchInput(e.target.value.toLowerCase());
      state.process(true);
      processLocal();
      handleNavBtnControls(0, state.getPageLength());
    });

    // root checkbox: table header
    rootCheckbox.addEventListener('change', (e) => {
      state.handleCheckAll(e.target.checked);
      selectedPageInfo.textContent = state.getCheckedRangeString();
      rootCheckbox.parentElement.dataset.hasCheck = String(e.target.checked);
      state.process();
      processLocal();
    });

    // Table header buttons
    for (const btn of sortBtns) {
      btn.addEventListener('click', sortHandler);
    }

    // arrows, page controls, bottom of table
    pageControls.addEventListener('click', (e) => {
      rootCheckbox.checked = false;
      rootCheckbox.parentElement.dataset.hasCheck = 'false';
      const closestControl = e.target.closest('button');
      if (closestControl === null) return;
      const { controlIndex, controlValue } = closestControl.dataset;
      const maxIndex = state.getPageLength();
      const nxtIndex = getNxtIndex(
        Number.parseFloat(controlIndex),
        maxIndex,
        state.getPageIndex(),
        controlValue,
      );
      if (nxtIndex >= 0) {
        state.setPageIndex(nxtIndex);
        processTasks();
        handleNavBtnControls(nxtIndex, maxIndex);
      }
    });
  };

  createSelectElements();
  setev();
  processTasks();
  state.setUpdater('processData', () => {
    data = state.getCompData();
    processLocal();
    configStatusGraph(state.getData());
  });
};

const initDashboard = (state) => {
  const config = {
    tasks: (passedState) => {
      configTasks(passedState);
    },
    overview: (passedState) => {
      configStatusGraph(passedState.getData());
    },
  };
  configDashboard(config, state);
};

export default initDashboard;
