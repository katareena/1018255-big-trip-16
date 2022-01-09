import AbstractView from './abstract-view.js';
import {FilterType} from '../consts/common.js';

const NoTasksTextType = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointsTemplate = (filterType) => {
  const noTaskTextValue = NoTasksTextType[filterType];

  return (
    `<p class="trip-events__msg">${noTaskTextValue}</p>`
  );
};

export default class NoPointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoPointsTemplate(this._data);
  }
}
