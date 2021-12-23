import AbstractView from './abstract-view.js';

// const text = {
//   'everything': 'Click New Event to create your first point',
//   'future': 'There are no future events now',
//   'past': 'There are no past events now',
// };
// const innerText = text[value];

const createNoPointsTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class NoPointsView extends AbstractView {
  // #value = null;

  // constructor(value) {
  //   super();
  //   this.#value = value;
  // }

  get template() {
    return createNoPointsTemplate();
  }
}
