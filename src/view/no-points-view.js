import AbstractView from './abstract-view.js';

const TEXT = {
  'filter-everything': 'Click New Event to create your first point',
  'filter-future': 'There are no future events now',
  'filter-past': 'There are no past events now',
};

const createNoPointsTemplate = (id) => {
  const innerText = TEXT[id];
  return `<p class="trip-events__msg">${innerText}</p>`;
};

export default class NoPointsView extends AbstractView {
  #id = null;

  constructor(id) {
    super();
    this.#id = id;
  }

  get template() {
    return createNoPointsTemplate(this.#id);
  }
}
