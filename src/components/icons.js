import doneIcon from '../assets/images/svg/done-icon.svg';
import menuIcon from '../assets/images/svg/menu-icon.svg';
import pendingIcon from '../assets/images/svg/pending-icon.svg';
import sortIcon from '../assets/images/svg/sort-icon.svg';
import createIcon from '../utils/create-icon';

const icons = {
  done: createIcon('', doneIcon, 'done'),
  menu: createIcon('', menuIcon, 'menu'),
  sort: createIcon('', sortIcon, 'sort'),
  pending: createIcon('', pendingIcon, 'pending'),
};

const getIcon = (key) => {
  // if (icons.hasOwnProperty(key)) {
  if (Object.prototype.hasOwnProperty.call(icons, key)) {
    return icons[key].cloneNode(true);
  }
  return icons.pending.cloneNode(true);
};

export default getIcon;
