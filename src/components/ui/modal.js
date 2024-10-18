// Modal.js
export default class Modal {
  constructor(content, options = {}) {
    this.content = content;
    this.options = {
      position: { top: '50%', left: '50%' },
      cleanUp: () => {},
      ...options,
    };
    this.modal = null;
    this.backdrop = null;
    this.closeHandler = this.close.bind(this);
    this.escapeHandler = this.handleEscapeKey.bind(this);
    this.onResize = this.handleResize.bind(this);
  }

  create() {
    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('modal-backdrop');
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    Object.assign(this.modal.style, this.options.position);
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('modal-content');
    if (typeof this.content === 'string') {
      const textNode = document.createTextNode(this.content);
      contentContainer.append(textNode);
    } else if (this.content instanceof Node) {
      contentContainer.append(this.content);
    }
    this.modal.append(contentContainer);
    this.backdrop.addEventListener('click', this.closeHandler);
    document.addEventListener('keydown', this.escapeHandler);
    window.addEventListener('resize', this.onResize);
    document.body.append(this.backdrop, this.modal);
  }

  open() {
    this.create();
  }

  close() {
    if (this.modal && this.backdrop) {
      this.options.cleanUp();
      this.modal.remove();
      this.backdrop.remove();
      this.modal = null;
      this.backdrop = null;
      document.removeEventListener('keydown', this.escapeHandler);
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('click', this.closeHandler);
    }
  }

  handleResize() {
    if (this.modal) {
      this.close();
    }
  }

  handleEscapeKey(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
