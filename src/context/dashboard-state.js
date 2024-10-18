export default class HandleState {
  static async create({ data, apiManager }) {
    try {
      const tData = await data;
      return new HandleState({ data: tData, apiManager });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  constructor({ data = [], apiManager = null }) {
    this.apiManager = apiManager;
    this.data = data;
    this.filteredData = data;
    this.checked = new Set();
    this.ids = this.getIds();
    this.pageIndex = 0;
    this.pageLength = this.getPageLength();
    this.searchInput = '';
    this.searchFor = 'title';
    this.statusFilter = 'all';
    this.tableRows = 10;
    this.updaters = {};
  }

  getData() { return this.data; }

  getSearchParam() { return this.searchFor; }

  getIds() { return [...this.getData()].map((task) => task.id); }

  getChecked() { return this.checked; }

  getDataLength() { return this.filteredData.length; }

  getPageIndex() { return this.pageIndex; }

  getSearchInput() { return this.searchInput; }

  getStatusFilter() { return this.statusFilter; }

  getTableRows() { return this.tableRows; }

  getCompData() { return this.filteredData; }

  getPageTaskIndices() {
    const rows = this.getTableRows();
    const start = this.getPageIndex() * rows;
    const end = Math.min(this.getCompData().length, start + rows);
    return [start, end];
  }

  getPageRangeString() {
    const rows = this.getTableRows();
    const pagesTotal = Math.ceil(this.getDataLength() / rows) || 1;
    return `Page ${this.getPageIndex() + 1} of ${pagesTotal}`;
  }

  getCheckedRangeString() {
    const checked = this.getChecked();
    const total = this.getDataLength();
    const checkedTotal = checked.size;
    return `${checkedTotal} of ${total}`;
  }

  getPageLength() {
    const len = Math.ceil(this.getDataLength() / this.getTableRows());
    return len > 0 ? len - 1 : 0;
  }

  getPageData() {
    const [start, end] = this.getPageTaskIndices();
    return this.getCompData().slice(start, end);
  }

  getStatusKeys() {
    const statusKeys = new Set();
    for (const task of this.getData()) {
      statusKeys.add(task.status);
    }
    return [...statusKeys];
  }

  getStatusData() {
    const total = this.getDataLength();
    const cnts = { all: { arg: total, value: 'all' } };
    for (const task of this.getData()) {
      const { status } = task;
      if (cnts[status]) {
        const { arg } = cnts[status];
        cnts[status].arg = arg + 1;
      } else {
        cnts[status] = {
          arg: 1,
          value: status,
        };
      }
    }
    const sortedCounts = Object.fromEntries(
      Object.entries(cnts).sort((a, b) => {
        const { arg: argA } = a[1];
        const { arg: argB } = b[1];
        return Number.parseInt(argB, 10) - Number.parseInt(argA, 10)
          || a[0].localeCompare(b[0]);
      }),
    );

    return sortedCounts;
  }

  setSearchParam(value) { this.searchFor = value; }

  setPageIndex(value) { this.pageIndex = value; }

  setSearchInput(value) { this.searchInput = value; }

  setStatusFilter(value) { this.statusFilter = value; }

  setCompData(value) { this.filteredData = value; }

  setTableRows(value) { this.tableRows = value; }

  setUpdater(element, updater) { this.updaters[element] = updater; }

  handleUpdate(updater) {
    if (Object.prototype.hasOwnProperty.call(
      this.updaters,
      updater,
    )) {
      this.updaters[updater]();
    }
  }

  updateAllUpdaters() {
    const updaterValues = Object.values(this.updaters);
    if (updaterValues.length > 0) {
      for (const updater of updaterValues) {
        updater();
      }
    }
  }

  isChecked(id) { return this.checked.has(id); }

  clearChecked() { this.checked.clear(); }

  handleCheckAll(checkStatus) {
    if (checkStatus) {
      const tempComp = this.getCompData();
      const [start, end] = this.getPageTaskIndices();
      if (start >= tempComp.length) return;
      const subComp = tempComp.slice(start, end);
      if (subComp.length > 0) {
        this.checked = new Set(subComp.map((task) => task.id));
      }
    } else {
      this.checked.clear();
    }
  }

  handleCheck(id, checkStatus) {
    if (checkStatus) {
      this.checked.add(id);
    } else {
      this.checked.delete(id);
    }
  }

  sortData(key, direction) {
    this.setCompData(this.getCompData().sort((a, b) => {
      const y = direction === 'asc' ? a[key] : b[key];
      const x = direction === 'asc' ? b[key] : a[key];
      return key === 'created-at'
        ? Number.parseInt(x, 10) - Number.parseInt(y, 10)
        : x.localeCompare(y);
    }));
  }

  async deleteTask(id) {
    if (this.data.length === 0) return;
    try {
      await this.apiManager.deleteTask(id);
      this.data = this.data.filter((task) => task.id !== id);
      this.ids = this.getIds();
      this.setCompData(this.processData());
      this.updateAllUpdaters();
    } catch (error) {
      console.error(error);
    }
  }

  processData() {
    const data = this.getData();
    let formattedData = [...data];

    const statusFilter = this.getStatusFilter();
    formattedData = statusFilter === 'all'
      ? data
      : formattedData.filter((task) => {
        return task.status === statusFilter;
      });

    const searchInput = this.getSearchInput();
    if (searchInput.length > 0) {
      formattedData = formattedData.filter((task) => {
        const taskValue = task[this.getSearchParam()].toLowerCase();
        return taskValue.startsWith(searchInput.toLowerCase(), 0);
      });
    } else if ((formattedData.length !== data.length) && (statusFilter === 'all')) {
      formattedData = data;
    }
    if (formattedData.length !== data.length) this.setPageIndex(0);
    return formattedData;
  }

  process(filterArg = false, resetData = false) {
    const data = this.getData();
    if (data.length === 0) return;
    this.setCompData((resetData && filterArg) ? data : this.processData());
  }
}
