import AbstractView from './abstract-view.js';

const newEventBtnTemplate = () => (
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    id="new-event-btn"
  >
  New event
  </button>`
);

export default class NewEventBtnView extends AbstractView {
  get template() {
    return newEventBtnTemplate();
  }

  setOpenClickHandler = (callback) => {
    this._callback.createClick = callback;
    this.element.addEventListener('click', this.#clickOnBtnHandler);
  }

  #clickOnBtnHandler = (evt) => {
    evt.preventDefault();
    this._callback.createClick();
    // this.element.disabled = 'true';
  }
}
