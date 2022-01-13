import AbstractView from './abstract-view.js';
import {MenuItem} from '../consts/common.js';

const newEventBtnTemplate = () => (
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    id="${MenuItem.ADD_NEW_POINT}"
  >
  New event
  </button>`
);

export default class NewEventBtnView extends AbstractView {
  get template() {
    return newEventBtnTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.createClick = callback;
    this.element.addEventListener('click', this.#clickOnBtnHandler);
  }

  #clickOnBtnHandler = (evt) => {
    evt.preventDefault();
    this._callback.createClick(evt.target.id);
  }
}
