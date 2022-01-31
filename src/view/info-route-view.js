import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';

const createDestinationsChain = (cities) => {
  if (cities.length > 3) {
    return (
      `<h1 class="trip-info__title">${cities[0]} ... ${cities[cities.length-1]}</h1>`
    );
  }

  return `<h1 class="trip-info__title">${cities.join(' - ')}</h1>`;
};

const getCost = (points) => {
  const baseCost = points.map((point) => point.basePrice).reduce((previousPrice, currentPrice) => previousPrice + currentPrice);

  const offersCost = points.reduce((sum, point) => {
    point.offers.forEach((offer) => {
      if (offer.isChecked) {
        sum += offer.price;
      }
    });

    return sum;
  }, 0);

  return baseCost + offersCost;
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

  if (points.length === 0) {
    return '';
  }

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
