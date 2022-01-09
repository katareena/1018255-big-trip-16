import AbstractView from './abstract-view.js';

// const setChecked = (currentFilterType, evt) => {
//   console.log(evt.target.value);
//   currentFilterType? === evt.target.value ? 'checked' : '';
// };

// ${setChecked(currentFilterType)}

// const createFilterItemTemplate = (currentFilterType) => {
//   `<div class="trip-filters__filter">
//     <input
//       id="filter-everything"
//       class="trip-filters__filter-input  visually-hidden"
//       type="radio"
//       name="trip-filter"
//       value="${type}"
//       ${type === currentFilterType ? 'checked' : ''}
//     >
//     <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
//   </div>`
// }

const createFiltersTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input
        id="filter-everything"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
        checked
      >
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-future"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="future"
      >
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-past"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="past"
      >
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  // #currentFilter = null;

  // constructor(currentFilterType) {
  //   super();
  //   this.#currentFilter = currentFilterType;
  // }

  // get template() {
  //   return createFiltersTemplate(this.#currentFilter);
  // }

  get template() {
    return createFiltersTemplate();
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
