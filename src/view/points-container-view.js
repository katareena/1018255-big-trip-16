import AbstractView from './abstract-view.js';

const createPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointsContainerView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
