import removeAllChildNodes from '../utils/remove-children';
import createTabSystem from './ui/tabs';

const configDashboard = (config, state) => {
  const tabContainer = document.querySelector('.tab-list');
  removeAllChildNodes(tabContainer);

  const visibleViews = document.querySelectorAll('[data-hidden="false"]') || [];
  const hiddenViews = document.querySelectorAll('[data-hidden="true"]') || [];
  const views = [...visibleViews, ...hiddenViews];

  const groupViews = {};
  for (const viewElement of views) {
    const { view, hidden } = viewElement.dataset;
    if (groupViews[view] === undefined) {
      groupViews[view] = hidden === 'true';
    }
  }

  const loadedViews = new Set();
  const tabsConfig = {};
  for (const [viewName, hidden] of Object.entries(groupViews)) {
    if (!hidden && (loadedViews.has(viewName) === false)) {
      config[viewName](state);
      loadedViews.add(viewName);
      tabContainer.dataset.activeTab = viewName;
    }

    tabsConfig[viewName] = () => {
      for (const viewContainer of views) {
        const { view } = viewContainer.dataset;
        const isHidden = view === viewName;
        viewContainer.dataset.hidden = String(!isHidden);
        if (isHidden === true) {
          tabContainer.dataset.activeTab = view;
          if (loadedViews.has(view) === false) {
            config[view](state);
            loadedViews.add(view);
          }
        }
      }
    };
  }
  createTabSystem(tabsConfig);
};

export default configDashboard;
