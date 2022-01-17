import AbstractView from './abstract-view.js';

const createFilters = (filters, currentFilterType) => filters.map((filter) => (
  `<div class="trip-filters__filter">
  <input
    id="filter-${filter.name}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${filter.name}"
    ${filter.type === currentFilterType ? 'checked' : ''}
  >
  <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
</div>`
)).join('');


const createFiltersTemplate = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">

    ${createFilters(filters, currentFilterType)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();

    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
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
