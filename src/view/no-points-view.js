import {createElement} from '../render.js';

const TEXT = {
  'filter-everything': 'Click New Event to create your first point',
  'filter-future': 'There are no future events now',
  'filter-past': 'There are no past events now',
};

const createNoPointsTemplate = (id) => {
  const innerText = TEXT[id];
  return `<p class="trip-events__msg">${innerText}</p>`;
};

export default class NoPointsView {
  #element = null;
  #id = null;

  constructor(id) {
    this.#id = id;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoPointsTemplate(this.#id);
  }

  removeElement() {
    this.#element = null;
  }
}
