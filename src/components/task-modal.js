import createElement from '../utils/create-element';
import placeModal from '../utils/place-modal';
import Modal from './ui/modal';
import createToast from './ui/toast';

/**
 *
 * @param {*} e
 * @param {*} state
 */
const createTaskModal = (e, state) => {
  e.target.dataset.taskActive = 'true';
  const { scrollX, scrollY } = globalThis;
  const { left, bottom, top } = e.target.getBoundingClientRect();
  const placeTop = placeModal(e.target) === 'up';
  const content = document.createElement('p');
  content.classList.add('task-modal--content');
  const divide = document.createElement('div');
  divide.classList.add('task-modal--divide');
  const editBtn = createElement({
    text: 'Edit',
    css: ['task-modal--edit'],
    type: 'button',
    attr: {
      'aria-label': 'button',
    },
  });
  const deleteBtn = createElement({
    text: 'Delete',
    css: ['task-modal--delete'],
    type: 'button',
    attr: {
      'aria-label': 'button',
    },
  });

  content.append(editBtn, divide, deleteBtn);
  const modal = new Modal(content, {
    position: {
      top: `${placeTop ? top + scrollY : bottom + scrollY}px`,
      left: `${Number.parseInt(left) + Number.parseInt(scrollX)}px`,
    },
    cleanUp: () => {
      e.target.dataset.taskActive = 'false';
    },
  });

  modal.open();
  editBtn.focus();
  editBtn.addEventListener('click', () => {
    modal.close();
  });

  deleteBtn.addEventListener('click', () => {
    createToast('Task deleted', 'Success: ', 'default', 2);
    state.deleteTask(e.target.dataset.taskId);
    state.process(true);
    modal.close();
  });
};

export default createTaskModal;
