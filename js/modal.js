'use strict';

// eslint-disable-next-line no-unused-vars
class Modal {
  constructor(modalBody, originElement, containerId) {
    this.modalBody = modalBody;
    this.originElement = originElement;
    this.ref = document.getElementById(containerId);
    
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.toggleElementsFromTabOrder = this.toggleElementsFromTabOrder.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.render = this.render.bind(this);
  }
  openModal () {
    this.render();

    this.toggleElementsFromTabOrder();
    document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    document.addEventListener('keydown', this.onKeydown);
  }

  toggleElementsFromTabOrder () {
    const focusableElements = document.querySelectorAll('a:not([disabled]), button:not([disabled]), video, input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])');
    for (let i=0; i < focusableElements.length; i++) {
      if (!this.ref.contains(focusableElements[i])) {
        focusableElements[i].tabIndex = focusableElements[i].tabIndex === -1 ? 0 : -1;
      }
    }
  }

  closeModal () {
    document.getElementsByTagName('body')[0].classList.remove('disable-scrolling');
    this.originElement.focus();
    this.toggleElementsFromTabOrder();
    document.removeEventListener('keydown', this.onKeydown);
    this.ref.innerHTML = '';
  }

  onClick (event) {
    event.stopPropagation();
  }

  onKeydown (event) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  render () {
    this.ref.innerHTML = (
      `<div class="modal-background" id="overlay">
        <div class="modal-root" id="modal-root">
          <div class="modal-header">
            <button id="modal-close-button" class="modal-close">${String.fromCharCode(10007)}</button>
          </div>
          <div class="modal-main">
            ${this.modalBody.outerHTML}
          </div>
        </div>
      </div>`
    );

    
    const closeButton = document.getElementById('modal-close-button');
    closeButton.focus();
    closeButton.addEventListener('click', this.closeModal);

    document.getElementById('overlay').addEventListener('click', this.closeModal);
    document.getElementById('modal-root').addEventListener('click', this.onClick);
  }
}