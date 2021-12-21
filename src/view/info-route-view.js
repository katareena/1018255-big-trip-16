import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';

const createDestinationsChain = (cities) => `<h1 class="trip-info__title">${cities.join(' - ')}</h1>`;

const createInfoRouteTemplate = (points) => {
  const destinations = points.map((point) => point.destination.name);
  const timesFrom = points.map((point) => point.dateFrom);
  const timesTo = points.map((point) => point.dateTo);
  const cost = points.map((point) => point.basePrice).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);

  const dateStart = dayjs(timesFrom[0]).format(Date.day);
  const dateEnd = dayjs(timesTo.length - 1).format(Date.day);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      ${createDestinationsChain(destinations)}

        <p class="trip-info__dates">${dateStart}&mdash;${dateEnd}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class InfoRouteView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createInfoRouteTemplate(this.#points);
  }
}
