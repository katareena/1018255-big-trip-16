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

const createOffersBlock = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOfferItems(offers)}
    </div>
  </section>`
);

const createTypesList = () => uniqTypes.map((type) => (
  `<div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
    >
    <label
      class="event__type-label  event__type-label--${type}"
      for="event-type-${type}-1"
    >
    ${type[0].toUpperCase() + type.slice(1)}
    </label>
  </div>`
)).join('');

const createRollupBtn = (formType) => {
  if(formType === 'form-edit') {
    return (
      `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  } else {
    return '';
  }
};

const createNameBtn = (formType) => {
  if(formType === 'form-edit') {
    return 'Delete';
  } else {
    return 'Cancel';
  }
};

const createDetailsBlock = (offers, description, pictures, isOffers, isDescription, isPicture) => {
  if(!isOffers && !isDescription && !isPicture) {
    return '';
  }

  if(isOffers && !isDescription && !isPicture) {
    return(
      `<section class="event__details">
        ${createOffersBlock(offers)}
      </section>`
    );
  }

  if(!isOffers && (isDescription || isPicture)) {
    return(
      `<section class="event__details">

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>

          ${isDescription ? `<p class="event__destination-description">${description}</p>` : ''}

          ${isPicture ? createPhotosBlock(pictures) : ''}

        </section>
      </section>`
    );
  }

  return(
    `<section class="event__details">
      ${createOffersBlock(offers)}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        ${createPhotosBlock(pictures)}

      </section>
    </section>`
  );

};

const createFormEditTemplate = (data, formType) => {
  const {id, type, basePrice, dateFrom, dateTo, destination: {name, description, pictures}, offers, isOffers, isDescription, isPicture} = data;
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
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
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
          <button class="event__reset-btn" type="reset">${createNameBtn(formType)}</button>

          ${createRollupBtn(formType)}

        </header>

        ${createDetailsBlock(offers, description, pictures, isOffers, isDescription, isPicture)}

      </form>
    </li>`
  );
};

export default class FormEditView extends AbstractView {
  _data = null; // состояние
  #formType = null;

  constructor(point, formType) {
    super();
    this._data = FormEditView.parsePointToData(point); // записываем поступившие данные как состояние
    this.#formType = formType;

    this.#setInnerHandlers();
  }

  get template() {
    return createFormEditTemplate(this._data, this.#formType);
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    this.updateElement();
  }

  updateElement = () => { // обновление елемента НЕ компонента
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    // изменение вфеф

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.formSubmit);
    this.setCloseClickFormHandler(this._callback.clickClose);
  }

  setCloseClickFormHandler = (callback) => {
    this._callback.clickClose = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#clickHandler);
  }

  setSubmitFormHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #clickHandler = (evt) => {// чтобы контекст не потерялся специально используется стрелочная ф-я
    evt.preventDefault();
    this._callback.clickClose();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormEditView.parsePointToData(this._data));
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-input').addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#cityToggleHandler);
  }

  #typeToggleHandler = () => {
    // console.log(evt.target.value);
    this.updateData({
      // type: evt.target.value,
      isOffers: !this._data.isOffers,
    });
  }

  #cityToggleHandler = () => {
    this.updateData({
      isDescription: !this._data.isDescription,
      isPicture: !this._data.isPicture,
    });
  }

  static parsePointToData = (point) => ({...point,
    isOffers: point.offers.length !== 0,
    isDescription: point.destination.description.length !== 0,
    isPicture: point.destination.pictures.length !== 0,
  });

  // data - состояние  point - данные/информация

  static parseDataToPoint = (data) => {
    const point = {...data};

    if (!point.isOffers) {
      point.isOffers = [];
    }

    if (!point.isDescription) {
      point.isDescription = [];
    }

    if (!point.isPicture) {
      point.isPicture = [];
    }

    delete point.isOffers;
    delete point.isDescription;
    delete point.isPicture;

    return point;
  }
}
