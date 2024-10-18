import configDate from '../utils/config-date';
import createElement from '../utils/create-element';
import getIcon from './icons';
import createTaskModal from './task-modal';

const selectedPageInfo = document.querySelector('.page-info-selected');

const updateCheckbox = (e, id, state) => {
  const checked = !(state.isChecked(id));
  const row = e.target.closest('tr');
  const label = e.target.parentElement;
  state.handleCheck(id, checked);
  label.dataset.hasCheck = String(checked);
  if (row) row.dataset.taskChecked = String(checked);
  selectedPageInfo.textContent = state.getCheckedRangeString();
};

const createTask = (task, state) => {
  const {
    title,
    extension,
    status,
    id,
    description,
    'created-at': createdAt,
  } = task;
  const handleCheckbox = (e) => updateCheckbox(e, id, state);
  const checkboxId = `checkbox-id-${id}`;
  const haschecked = state.isChecked(id);
  const tableRow = createElement({
    attr: {
      'data-task-checked': String(haschecked),
      'data-task-processed': status === 'done',
    },
    css: ['task-item'],
    type: 'tr',
  });

  const checkboxWrapper = createElement({
    sub: [
      createElement({
        sub: [
          createElement({
            attr: {
              'data-has-check': String(haschecked),
              for: checkboxId,
            },
            sub: [
              createElement({
                attr: { id: checkboxId, type: 'checkbox', checked: Boolean(haschecked) },
                eventListeners: {
                  change: handleCheckbox,
                  keypress: (e) => {
                    const { key } = e;
                    if (key.toLowerCase() === 'enter') {
                      handleCheckbox(e);
                    }
                  },
                },
                type: 'input',
              }),
            ],
            type: 'label',
          }),
        ],
        css: ['checkbox-1'],
        type: 'div',
      }),
    ],
    css: ['checkbox-wrapper'],
    type: 'div',
  });

  const taskTitle = createElement({ css: ['task-title'], text: title, type: 'span' });

  const taskExtWrapper = createElement({
    sub: [
      createElement({ css: ['tag'], text: extension, type: 'div' }),
    ],
    css: ['td-two'],
    type: 'div',
  });

  const taskDescWrapper = createElement({ text: description, css: ['task-desc--text'], type: 'span' });

  const taskDesc = createElement({
    sub: [taskExtWrapper, taskDescWrapper],
    css: ['task-desc'],
    type: 'div',
  });

  const taskDate = createElement({ css: ['task-date'], text: configDate(createdAt), type: 'span' });

  const statusWrapper = createElement({
    sub: [
      getIcon(status),
      createElement({ text: status, type: 'span' }),
    ],
    css: ['div-center', 'td-status'],
    type: 'div',
  });

  const optionsButton = createElement({
    sub: [getIcon('menu')],
    css: ['task-item--options'],
    attr: {
      'data-task-id': id,
      'data-task-active': 'false',
      'data-tooltip-text': 'options',
      'aria-label': 'button',
    },
    type: 'button',
    eventListeners: {
      click: (e) => createTaskModal(e, state),
    },
  });

  const elements = [
    checkboxWrapper,
    taskTitle,
    taskDesc,
    taskDate,
    statusWrapper,
    optionsButton,
  ];

  for (const el of elements) {
    tableRow.append(createElement({ sub: [el], type: 'td' }));
  }

  return tableRow;
};

export default createTask;
