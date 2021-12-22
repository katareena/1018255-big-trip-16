import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {Date} from '../consts/dates.js';
import {CITIES} from '../mock/destination.js';
import {uniqTypes} from '../mock/types.js';

const createPhotoItems = (photos) => photos.map((photo) => (
  `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
)).join('');

const createPhotosBlock = (photos) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createPhotoItems(photos)}
    </div>
  </div>`
);

const createCityItems = (cities) => cities.map((city) => (
  `<option value="${city}"></option>`
)).join('');

const createOfferItems = (offers) => offers.map((offer) => (
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox">
    <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus; &euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`)).join('');

const createOffersBlock = (offers) => {
  if (offers.length <= 0) {
    return '';
  } else {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOfferItems(offers)}
        </div>
      </section>`
    );
  }
};

const createTypesList = () => uniqTypes.map((type) => (
  `<div class="event__type-item">
    <input id="event-type-${type}-1"
      class="event__type-input
      visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
    >
    <label class="event__type-label
      event__type-label--${type}"
      for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}
    </label>
  </div>`
)).join('');

const createMakeFormTemplate = ({id, type, basePrice, dateFrom, dateTo, destination: {name, description, pictures}, offers}) => {
  const dateFromPoint = dayjs(dateFrom).format(Date.full);
  const dateToPoint = dayjs(dateTo).format(Date.full);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesList()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">

            <datalist id="destination-list-1">
            ${createCityItems(CITIES)}
            </datalist>

          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromPoint}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToPoint}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">

          ${createOffersBlock(offers)}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            ${createPhotosBlock(pictures)}

          </section>
        </section>
      </form>
    </li>`
  );
};

export default class FormCreateView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createMakeFormTemplate(this.#points);
  }
}
