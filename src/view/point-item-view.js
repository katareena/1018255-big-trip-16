import AbstractView from './abstract-view.js';

const createPointItemTemplate = () => '<li class="trip-events__item"></li>';

export default class PointItemView extends AbstractView {
  get template() {
    return createPointItemTemplate();
  }
}
