const createElement = (options) => {
  const {
    type,
    css = [],
    text = '',
    attr = {},
    eventListeners = {},
    sub = [],
  } = options;
  const element = document.createElement(type);

  if (css.length > 0) {
    element.classList.add(...css);
  }

  if (text) element.textContent = text;

  for (const [key, value] of Object.entries(attr)) {
    if (type === 'input' && key === 'checked') {
      element.checked = false;
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const [event, listener] of Object.entries(eventListeners)) {
    element.addEventListener(event, listener);
  }

  for (const child of sub) {
    element.append(child);
  }

  return element;
};

export default createElement;
