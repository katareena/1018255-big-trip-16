import dayjs from 'dayjs';
import {createElement} from '../render.js';

const createPointTemplate = ({type, basePrice, dateFrom, dateTo, destination: {name}, isFavorite, offers}) => {

  const dateFromPoint = dayjs(dateFrom).format('DD/MM/YY HH:MM');
  const dateToPoint = dayjs(dateTo).format('DD/MM/YY HH:MM');
  const timeStart = dayjs(dateFrom).format('HH:MM');
  const timeEnd = dayjs(dateTo).format('HH:MM');

  const createFavorite = (value) => {
    if (value) {
      return 'event__favorite-btn event__favorite-btn--active';
    } else {
      return 'event__favorite-btn';
    }
  };

  const createOffersBlock = (arr) => {

    const createOfferItems = () => arr.map((el) => (
      `<li class="event__offer">
        <span class="event__offer-title">${el.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${el.price}</span>
      </li>`)
    );

    if (arr.length <= 0) {
      return '<ul class="event__selected-offers"></ul>';
    } else {
      return `<ul class="event__selected-offers">
        ${createOfferItems(arr).join('')}
      </ul>`;
    }
  };

  return `<div class="event">
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
    </div>`;
};

export default class PointView {
  #element = null;
  #points = null;

  constructor(points) {
    this.#points = points;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointTemplate(this.#points);
  }

  removeElement() {
    this.#element = null;
  }
}
