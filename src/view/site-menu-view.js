import AbstractView from './abstract-view.js';
import {MenuItem} from '../consts/common.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.POINTS}</a>
    <a class="trip-tabs__btn" href="#">${MenuItem.STATISTICS}</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  get template () {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    this._callback.menuClick(evt.target.innerHTML);
    const links = this.element.querySelectorAll('.trip-tabs__btn');

    links.forEach((link) => link.classList.remove('trip-tabs__btn--active'));

    evt.target.classList.add('trip-tabs__btn--active');
  }
}
