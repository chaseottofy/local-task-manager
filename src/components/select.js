import createElement from '../utils/create-element';
import placeModal from '../utils/place-modal';
import removeAllChildNodes from '../utils/remove-children';

const listItemTemplate = createElement({
  type: 'li',
  css: ['option'],
  attr: { role: 'option' },
  sub: [
    createElement({ type: 'span', css: ['option-text'] }),
  ],
});

const createListItem = (key, selectedKey, optionsText) => {
  const li = listItemTemplate.cloneNode(true);
  li.dataset.value = key;
  li.setAttribute('aria-selected', String(key === selectedKey));
  li.firstChild.textContent = optionsText[key];
  return li;
};

export default class Select {
  constructor({
    data = () => {},
    appendToElement = document.body,
    icon = 'arrows',
    options = {},
    setState = () => {},
  }) {
    this.bodyRef = document.querySelector('body');
    this.appendToElement = appendToElement;

    this.container = this.appendToElement.querySelector('.custom-select');
    this.selectedOption = this.container.querySelector('.selected-option');
    this.selectedText = this.selectedOption.querySelector('.option-text');
    this.optionsList = this.container.querySelector('.options-list');
    this.listElements = null;

    this.data = data;
    this.options = options;
    this.optionKeys = Object.keys(this.options);
    this.optionsText = this.getOptionsText();
    this.selectedIndex = 0;
    this.selectedKey = this.optionKeys[this.selectedIndex];

    this.setState = setState;
    this.open = false;
    this.direction = 1;
    this.icon = icon;

    this.clickOutsideFn = this.handleClickOutside.bind(this);
  }

  init() {
    this.createElements();
    this.selectedOption.addEventListener('click', this.toggleDropdown.bind(this));
    this.optionsList.addEventListener('click', this.handleOptionClick.bind(this));
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  appendListenerArgs(args) {
    this.listenerArgs = args;
  }

  getOptionsText() {
    const ret = {};
    for (const [key, sub] of Object.entries(this.options)) {
      const { value, arg } = sub;
      ret[key] = arg === undefined ? value : `${value} (${arg})`;
    }
    return ret;
  }

  /**
   *
   * @param {Function} options
   */
  setOptions(optFunc) {
    this.options = optFunc();
    this.optionKeys = Object.keys(this.options);
    this.optionsText = this.getOptionsText();
    this.selectedKey = this.optionKeys[this.selectedIndex];
    this.updateListItems();
  }

  formatOptionText(key) {
    const ret = this.options[key];
    if (ret.arg === undefined) return ret.value;
    return `${ret.value} (${ret.arg})`;
  }

  updateListItems() {
    this.selectedText.textContent = this.optionsText[this.selectedKey];
    removeAllChildNodes(this.optionsList);
    for (const key of this.optionKeys) {
      this.optionsList.append(createListItem(
        key,
        this.selectedKey,
        this.optionsText,
      ));
    }
    this.listElements = this.optionsList.querySelectorAll('.option');
  }

  createElements() {
    this.selectedOption.dataset.icon = this.icon || 'arrows';
    this.updateListItems();
  }

  toggleDropdown() {
    if (!this.open) {
      this.optionsList.dataset.openDirection = placeModal(
        this.container,
      );
      this.selectedIndex = this.optionKeys.indexOf(this.selectedKey);
      for (const [ind, opt] of this.listElements.entries()) {
        opt.setAttribute(
          'aria-selected',
          String(ind === this.selectedIndex),
        );
      }
      this.selectedOption.blur();
    }
    this.open = !this.open;
    this.optionsList.style.display = this.open ? 'block' : 'none';
    this.selectedOption.setAttribute('aria-expanded', String(this.open));

    if (this.open) {
      this.bodyRef.addEventListener('click', this.clickOutsideFn);
    } else {
      this.bodyRef.removeEventListener('click', this.clickOutsideFn);
    }
  }

  handleOptionClick(e) {
    const closestOption = e.target.closest('.option');
    if (closestOption === null) {
      this.toggleDropdown();
      return;
    }
    const { value } = closestOption.dataset;
    if (this.selectedKey === value) {
      this.toggleDropdown();
    } else {
      this.selectOption(value);
    }
  }

  handleClickOutside(e) {
    if (!this.container.contains(e.target) && this.open) {
      this.toggleDropdown();
      this.bodyRef.removeEventListener('click', this.clickOutsideFn);
    }
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'Escape': {
        if (this.open) this.toggleDropdown();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        this.navigateOptions(this.direction * -1);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.navigateOptions(this.direction);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (this.open) {
          this.selectOption(this.optionKeys[this.selectedIndex]);
        } else {
          this.toggleDropdown();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  navigateOptions(direction) {
    const len = this.optionKeys.length;
    let nxt = this.selectedIndex + direction;
    if (nxt < 0) nxt = len - 1;
    if (nxt >= len) nxt = 0;
    this.selectedIndex = nxt;
    for (const [ind, opt] of this.listElements.entries()) {
      opt.setAttribute('aria-selected', String(ind === nxt));
      this.listElements[nxt].scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  selectOption(key) {
    this.container.blur();
    this.setState(key);
    this.selectedKey = key;
    this.selectedOption.querySelector('.option-text').textContent = this.optionsText[key];
    this.toggleDropdown();
  }

  appendTo() {
    this.appendToElement.append(this.container);
  }

  // removeEventListeners() {
  //   this.selectedOption.removeEventListener('click', this.toggleDropdown);
  //   this.optionsList.removeEventListener('click', this.handleOptionClick);
  //   this.bodyRef.removeEventListener('click', this.handleClickOutside);
  //   this.container.removeEventListener('keydown', this.handleKeyDown);
  // }

  // setupEventListeners() {
  //   this.selectedOption.addEventListener('click', this.toggleDropdown);
  //   this.optionsList.addEventListener('click', this.handleOptionClick);
  //   this.bodyRef.addEventListener('click', this.handleClickOutside);
  //   this.container.addEventListener('keydown', this.handleKeyDown);
  // }
}
