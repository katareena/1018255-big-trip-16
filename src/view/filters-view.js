import AbstractView from './abstract-view.js';
import {filter as getFilter} from '../utils/filter.js';

const createFilters = (filters, currentFilterType, points) => filters.map((filter) => (
  `<div class="trip-filters__filter">
  <input
    id="filter-${filter.name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${filter.name}"
    ${filter.type === currentFilterType ? 'checked' : ''}
    ${getFilter[filter.type](points).length === 0 ? 'disabled' : ''}
  >
  <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
</div>`
)).join('');


const createFiltersTemplate = (filters, currentFilterType, points) => (
  `<form class="trip-filters" action="#" method="get">

    ${createFilters(filters, currentFilterType, points)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #points = null;

  constructor(filters, currentFilterType, points) {
    super();

    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#points = points;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType, this.#points);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
