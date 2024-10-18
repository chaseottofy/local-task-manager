import './styles/root.css';
import './styles/sanitize.css';
import './styles/templates.css';
import './styles/header.css';
import './styles/dashboard.css';
import './styles/tasks-control.css';
import './styles/ui/tabs.css';
import './styles/ui/spinner.css';
import './styles/ui/modal.css';
import './styles/ui/toast.css';
import './styles/ui/tooltip.css';
import './styles/graph.css';

import initDashboard from './components/dashboard';
import HandleState from './context/dashboard-state';
import apiManager from './server/cached-api';
import handleFetchError from './utils/handle-fetch-error';

async function init() {
  try {
    const data = await apiManager.getAllTasks();
    const state = await HandleState.create({ data, apiManager });
    initDashboard(state);
  } catch (error) {
    handleFetchError(error);
  } finally {
    document?.querySelector('.spinner-wrapper').remove();
  }
  setTimeout(() => {
    document.querySelector('.body').dataset.disableTransitions = 'false';
  }, 500);
}

await init();
