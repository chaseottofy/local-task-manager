import createToast from '../components/ui/toast';
import removeAllChildNodes from './remove-children';

const handleFetchError = (error) => {
  console.error('Error:', error);
  const tbody = document.querySelector('.tbody');
  const pageControls = document.querySelector('.page-controls');
  for (const control of pageControls.children) {
    control.disabled = true;
  }
  removeAllChildNodes(tbody);
  createToast('Fetch failed', 'Error: ', 'error', 5);
};

export default handleFetchError;
