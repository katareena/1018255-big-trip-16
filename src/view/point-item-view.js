import {createElement} from '../render.js';

const createPointItemTemplate = () => '<li class="trip-events__item"></li>';

export default class PointItemView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointItemTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
