import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';
import {formatPointDate} from '../utils/dates.js';

import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const createFavorite = (value) => {
  if (value) {
    return 'event__favorite-btn event__favorite-btn--active';
  } else {
    return 'event__favorite-btn';
  }
};

const createOfferItems = (offers) => offers.map((offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`)).join('');

const createOffersBlock = (offers) => {
  if (offers.length <= 0) {
    return '';
  } else {
    return (
      `<ul class="event__selected-offers">
        ${createOfferItems(offers)}
      </ul>`
    );
  }
};

const getDiff = (dateTo, dateFrom) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  return dayjs.duration(diff).format(Date.duration);
};

const createPointTemplate = ({type, basePrice, dateFrom, dateTo, destination: {name}, isFavorite, offers}) => {
  const fullDateFromPoint = formatPointDate(dateFrom, Date.full);
  const fullDateToPoint = formatPointDate(dateTo, Date.full);
  const timeStart = formatPointDate(dateFrom, Date.time);
  const timeEnd = formatPointDate(dateTo, Date.time);

  const dayFromPoint = formatPointDate(dateFrom, Date.day);
  const dateFromPoint = formatPointDate(dateFrom, Date.date);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFromPoint}">${dayFromPoint}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${fullDateFromPoint}">${timeStart}</time>
          &mdash;
          <time class="event__end-time" datetime="${fullDateToPoint}">${timeEnd}</time>
        </p>
        <p class="event__duration">${getDiff(dateTo, dateFrom)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>

      ${createOffersBlock(offers)}

      <button class="${createFavorite(isFavorite)}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button
        class="event__rollup-btn"
        type="button"
        id="edit-btn"
      >
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`
  );
};

export default class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickOnPointHandler);
  }

  #clickOnPointHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
