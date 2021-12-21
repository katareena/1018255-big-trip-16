import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';

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

const createPointTemplate = ({type, basePrice, dateFrom, dateTo, destination: {name}, isFavorite, offers}) => {
  const dateFromPoint = dayjs(dateFrom).format(Date.full);
  const dateToPoint = dayjs(dateTo).format(Date.full);
  const timeStart = dayjs(dateFrom).format(Date.time);
  const timeEnd = dayjs(dateTo).format(Date.time);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">MAR 18</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFromPoint}">${timeStart}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateToPoint}">${timeEnd}</time>
        </p>
        <p class="event__duration">30M</p>
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
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`
  );
};

export default class PointView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createPointTemplate(this.#points);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickOnPointHandler);
  }

  #clickOnPointHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }
}
