import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';

const createDestinationsChain = (cities) => `<h1 class="trip-info__title">${cities.join(' - ')}</h1>`;

const getCost = (points) => {
  let cost = points.map((point) => point.basePrice).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);

  for(let i = 0; i < points.length; i++) {
    for(let x = 0; x < points[i].offers.length; x++) {
      if(points[i].offers[x].isChecked) {
        cost += points[i].offers[x].price;
      }
    }
  }

  return cost;
};

const createCost = (points) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getCost(points)}</span>
  </p>`
);

const createInfoRouteTemplate = (points) => {
  const destinations = points.map((point) => point.destination.name) ?? null;
  const timesFrom = points.map((point) => point.dateFrom) ?? null;
  const timesTo = points.map((point) => point.dateTo) ?? null;

  const dateStart = dayjs(timesFrom[0]).format(Date.day) ?? null;
  const dateEnd = dayjs(timesTo.length - 1).format(Date.day) ?? null;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      ${createDestinationsChain(destinations)}

        <p class="trip-info__dates">${dateStart}&mdash;${dateEnd}</p>
      </div>

      ${createCost(points)}

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
