import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

import SmartView from './smart-view.js';
import {Date} from '../consts/dates.js';
import {uniqTypes} from '../mock/types.js';
import {formatPointDate} from '../utils/dates.js';

import {CITIES, destination as currentDestinations} from '../mock/destination.js';
import {offers as currentOffers} from '../mock/offer.js';
import {FormType} from '../consts/form-type.js';

const createCityItems = (cities) => cities.map((city) => (
  `<option class="event__option" value="${city}"></option>`
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

const createTypesList = (id) => uniqTypes.map((type) => (
  `<div class="event__type-item">
    <input
      id="event-type-${type}-${id}"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
    >
    <label
      class="event__type-label  event__type-label--${type}"
      for="event-type-${type}-${id}"
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

const createPhotoItems = (photos) => photos?.map((photo) => (
  `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
)).join('');

const createPhotosBlock = (photos) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createPhotoItems(photos)}
    </div>
  </div>`
);

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

const setId = (id = 0) => id;

const createFormEditTemplate = (data, formType) => {
  const {id, type, basePrice, dateFrom, dateTo, destination, offers, isOffers, isDescription, isPicture} = data;
  const dateFromPoint = formatPointDate(dateFrom, Date.full);
  const dateToPoint = formatPointDate(dateTo, Date.full);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${setId(id)}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" ${formType === 'form-edit' ? `src="img/icons/${type}.png"` : ''} alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesList(id)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${formType === 'form-edit' ? type : ''}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${formType === 'form-edit' ? destination.name : ''}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${createCityItems(CITIES)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time  event-time-start" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFromPoint}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time event-time-end" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToPoint}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" pattern="^[0-9]+$" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${createNameBtn(formType)}</button>

          ${createRollupBtn(formType)}

        </header>

        ${ formType === 'form-edit' ? createDetailsBlock(offers, destination.description, destination.pictures, isOffers, isDescription, isPicture) : ''}

      </form>
    </li>`
  );
};

export default class FormEditView extends SmartView {
  // data - состояние  point - данные/информация
  _data = null; // состояние
  #formType = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, formType) {
    super();
    this._data = FormEditView.parsePointToData(point); // записываем поступившие данные как состояние
    this.#formType = formType;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditTemplate(this._data, this.#formType);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom && this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;

      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateData(
      FormEditView.parsePointToData(point),
    );
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitFormHandler(this._callback.formSubmit);
    this.setCloseClickFormHandler(this._callback.clickClose);
    this.setDeleteClickFormHandler(this._callback.clickDelete);
    this.#setDatepicker();
  }

  setCloseClickFormHandler = (callback) => {
    this._callback.clickClose = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#clickHandler);
  }

  setDeleteClickFormHandler = (callback) => {
    this._callback.clickDelete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  }

  setSubmitFormHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.#formType = FormType.EDIT;
  }

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickDelete(this._data);
  }

  #clickHandler = (evt) => {// чтобы контекст не потерялся специально используется стрелочная ф-я
    evt.preventDefault();
    this._callback.clickClose();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormEditView.parsePointToData(this._data));
  }

  #setDatepicker = () => {
    // flatpickr инициализируется всегда - поле даты не должно быть пустым

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('.event-time-start'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this.#dateFromChangeHandler, // колбэк на событие flatpickr
        maxDate: this._data.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('.event-time-end'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this.#dateToChangeHandler, // колбэк на событие flatpickr
        minDate: this._data.dateFrom,
      },
    );
  }

  #setInnerHandlers = () => {
    const inputsType = this.element.querySelectorAll('.event__type-input');
    inputsType.forEach((input) => input.addEventListener('change', this.#typeToggleHandler));
    this.element.querySelector('.event__input').addEventListener('change', this.#cityToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  }

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: Math.ceil(Math.abs(evt.target.value)),
    }, true); // true это параметр justDataUpdating в updateData
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate,
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate,
    });
  }

  #typeToggleHandler = (evt) => {
    const newType = evt.target.value;
    const newOffers = currentOffers.filter((offer) => offer.type === newType)[0].offers;
    this.updateData({
      type: newType,
      offers: newOffers,
      isOffers: newOffers.length !== 0,
    });
  }

  #cityToggleHandler = (evt) => {
    const newCity = evt.target.value;
    const newDescription = currentDestinations.filter((destination) => destination.name === newCity)[0].description;
    const newPicture = currentDestinations.filter((destination) => destination.name === newCity)[0].pictures;

    this.updateData({
      destination: {
        name: newCity,
        description: newDescription,
        pictures: newPicture,
      },
      isDescription: newDescription.length !== 0,
      isPicture: newPicture.length!== 0,
    });
  }

  static parsePointToData = (point) => ({...point,
    isOffers: point.offers?.length !== 0,
    isDescription: point.destination?.description?.length !== 0,
    isPicture: point.destination?.pictures?.length !== 0,
  });

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
