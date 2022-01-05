import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import TripView from '../view/trip-view.js';
import SortingMenuView from '../view/sorting-view.js';
import PointsContainerView from '../view/points-container-view.js';

import PointPresenter from './point-presenter.js';

import FormEditView from '../view/form-edit-view.js';
import NoPointsView from '../view/no-points-view.js';

import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/update-item.js';
import {SortType} from '../consts/sort-type.js';
import {sortPointTime, sortPointPrice} from '../utils/sorting-points.js';
import {FormType} from '../consts/form-type.js';

const BLANK_OFFER = {
  'basePrice': '',
  'dateFrom': dayjs().toDate(),
  'dateTo': dayjs().toDate(),
  'id': nanoid(5),
  'isFavorite': '',
  'type': '',
  'destination': [],
  'offers': [],
};

export default class TripPresenter {
  #tripContainer = null;
  #pointCreateComponent = null;

  #tripComponent = new TripView();
  #sortingMenuComponent = new SortingMenuView();
  #pointsContainerComponent = new PointsContainerView();
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (points) => {
    this.#points = [...points];
    this.#sourcedPoints = [...points]; // сохранение исходного порядка(для сортировки)
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPointPrice);
        break;
      default:
        // когда пользователь захочет "вернуть всё, как было" - запишем в #points исходный массив
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);

    this.#clearPointList();
    this.#renderPointList();
  }

  #renderSort = () => {
    render(this.#tripComponent, this.#sortingMenuComponent, RenderPosition.BEFORE_END);
    this.#sortingMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPointsContainer = () => {
    render(this.#tripComponent, this.#pointsContainerComponent, RenderPosition.BEFORE_END);
  }

  renderFormCreate = (point = BLANK_OFFER) => {
    render(this.#pointsContainerComponent, new FormEditView(point, FormType.NEW), RenderPosition.AFTER_BEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsContainerComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, FormType.EDIT);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);
    render(this.#tripComponent, this.#noPointsComponent, RenderPosition.BEFORE_END);
  }

  #renderBoard = () => {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPointList();
  }
}
