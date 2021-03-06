import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart-view.js';
import {Date} from '../consts/dates.js';
import {TYPES} from '../consts/types.js';
import {FormType} from '../consts/form-type.js';
import {formatPointDate} from '../utils/dates.js';

const createCityItems = (currentDestinations) => {
  const cities = currentDestinations.map((destination) => destination.name);
  return cities.map((city) => (
    `<option class="event__option" value="${city}"></option>`
  )).join('');
};

const createOfferItems = (offers) => offers.map((offer) => (
  `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="${offer.id}"
      type="checkbox"
      ${offer.isChecked ? 'checked' : ''}>
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

const createTypesList = (id) => TYPES.map((type) => (
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

const createRollupBtn = (formType, isDisabled) => {
  if (formType === 'form-edit') {
    return (
      `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  }

  return '';
};

const createNameBtn = (formType, isDeleting) => {
  if (formType === 'form-edit') {
    if (isDeleting) {
      return 'Deleting...';
    }

    return 'Delete';
  }

  return 'Cancel';
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
  if (!isOffers && !isDescription && !isPicture) {
    return '';
  }

  if (isOffers && (!isDescription && !isPicture)) {
    return (
      `<section class="event__details">
        ${createOffersBlock(offers)}
      </section>`
    );
  }

  return (
    `<section class="event__details">

      ${isOffers ? createOffersBlock(offers) : ''}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>

        ${isDescription ? `<p class="event__destination-description">${description}</p>` : ''}

        ${isPicture ? createPhotosBlock(pictures) : ''}

      </section>
    </section>`
  );

};

const createFormEditTemplate = (data, formType, currentDestinations) => {
  const {
    id,
    type,
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    isOffers,
    isDescription,
    isPicture,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;
  const dateFromPoint = formatPointDate(dateFrom, Date.full);
  const dateToPoint = formatPointDate(dateTo, Date.full);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              ${type === '' ? '' : `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` }
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesList(id)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type === '' ? '' : type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name ? destination.name : ''}" list="destination-list-${id}" autocomplete="off" required ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-${id}">
              ${createCityItems(currentDestinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time  event-time-start" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFromPoint}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time event-time-end" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToPoint}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${createNameBtn(formType, isDeleting)}</button>

          ${createRollupBtn(formType, isDisabled)}

        </header>

        ${createDetailsBlock(offers, destination.description, destination.pictures, isOffers, isDescription, isPicture)}

      </form>
    </li>`
  );
};

export default class FormEditView extends SmartView {
  // data - ??????????????????  point - ????????????/????????????????????
  _data = null; // ??????????????????
  #formType = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  currentOffers = null;
  currentDestinations = null;

  constructor(point, formType, currentOffers, currentDestinations) {
    super();
    this._data = FormEditView.parsePointToData(point); // ???????????????????? ?????????????????????? ???????????? ?????? ??????????????????
    this.#formType = formType;
    this.currentOffers = currentOffers;
    this.currentDestinations = currentDestinations;
    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createFormEditTemplate(this._data, this.#formType, this.currentDestinations);
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
  }

  #setDatepicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('.event-time-start'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this.#dateFromChangeHandler, // ???????????? ???? ?????????????? flatpickr
        maxDate: this._data.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('.event-time-end'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this.#dateToChangeHandler, // ???????????? ???? ?????????????? flatpickr
        minDate: this._data.dateFrom,
      },
    );
  }

  #setInnerHandlers = () => {
    const inputsType = this.element.querySelectorAll('.event__type-input');
    inputsType.forEach((type) => type.addEventListener('change', this.#typeToggleHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#cityToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);

    const offersInputs = this.element.querySelectorAll('.event__offer-checkbox');

    if (offersInputs.length !== 0) {
      offersInputs.forEach((input) => input.addEventListener('click', this.#offerClickHandler));
    }

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

    const newOffers = this.currentOffers.filter((offer) => offer.type === newType)[0].offers;

    const newOffersIsChecked = newOffers.map((offer) => ({
      ...offer,
      isChecked: offer.isChecked === undefined ? false : offer.isChecked,
    }));

    this.updateData({
      type: newType,
      offers: newOffersIsChecked,
      isOffers: newOffersIsChecked.length !== 0,
    });
  }

  #cityToggleHandler = (evt) => {
    let newCity = '';
    const cities = this.currentDestinations.map((destination) => destination.name);

    for (let i = 0; i < cities.length; i++) {
      if (evt.target.value.includes(cities[i])) {
        newCity = cities[i];
        this.element.querySelector('.event__input--destination').setCustomValidity('');
        break;
      } else {
        this.element.querySelector('.event__input--destination').setCustomValidity('???????????????? ?????????? ???????????????????? ???? ?????????????????????????? ????????????');
      }
    }

    if (newCity === '') {
      return;
    }

    const newDescription = this.currentDestinations.filter((destination) => destination.name === newCity)[0].description;
    const newPicture = this.currentDestinations.filter((destination) => destination.name === newCity)[0].pictures;

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

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    const regex = /\D/g;
    evt.target.value = evt.target.value.replace(regex, '');

    this.updateData({
      basePrice: Math.ceil(Math.abs(evt.target.value)),
    }); // true ?????? ???????????????? justDataUpdating ?? updateData: ???????????? ???????????????? ??????????????????, ???? ???? ????????????????????????????
  }

  #offerClickHandler = (evt) => {
    const offerCheckedId = Number(evt.target.id);

    const offers = this._data.offers.map((offer) => ({
      ...offer,
      isChecked: (offer.id === offerCheckedId ? !offer.isChecked : offer.isChecked)
    }));

    this.updateData({
      offers,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this._data.destination.name) {
      return;
    }

    const inputPrice = this.element.querySelector('.event__input--price');
    if (this._data.basePrice === 0) {
      inputPrice.setCustomValidity('?????????????? ??????????????????');
      return;
    } else {
      inputPrice.setCustomValidity('');
    }

    this._callback.formSubmit(FormEditView.parseDataToPoint(this._data));

    this.#formType = FormType.EDIT;
  }

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickDelete(this._data);
  }

  #clickHandler = (evt) => {// ?????????? ???????????????? ???? ?????????????????? ???????????????????? ???????????????????????? ???????????????????? ??-??
    evt.preventDefault();
    this._callback.clickClose();
  }

  static parsePointToData = (point) => {
    const offersChecked = point.offers.map((offer) => ({
      ...offer,
      isChecked: offer.isChecked === undefined ? false : offer.isChecked,
    }));

    const data = {...point,
      isOffers: point.offers?.length !== 0,
      isDescription: point.destination?.description?.length !== 0,
      isPicture: point.destination?.pictures?.length !== 0,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };

    data.offers = offersChecked;

    return data;
  };

  static parseDataToPoint = (data) => {
    const point = {...data};

    delete point.isOffers;
    delete point.isDescription;
    delete point.isPicture;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
