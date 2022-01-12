import AbstractView from './abstract-view.js';

const createTripTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>`
);

export default class TripView extends AbstractView {
  get template() {
    return createTripTemplate();
  }
}
