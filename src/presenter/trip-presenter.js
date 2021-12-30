import BoardView from '../view/board-view.js';
import SortingMenuView from '../view/sorting-view.js';
import PointsContainerView from '../view/points-container-view.js';

import PointPresenter from './point-presenter.js';

import FormEditView from '../view/form-edit-view.js';
import NoPointsView from '../view/no-points-view.js';

import {render, RenderPosition} from '../utils/render.js';
import {MOCK_FOR_CREATE_FORM} from '../consts/common.js';
import {updateItem} from '../utils/update-item.js';
import {SortType} from '../consts/sort-type.js';
import {sortPointTime, sortPointPrice} from '../utils/sorting-points.js';
import {FormType} from '../consts/form-type.js';

export default class TripPresenter {
  #tripContainer = null;
  #newPointBtn = null;
  #pointCreateComponent = null;

  #boardComponent = new BoardView();
  #sortingMenuComponent = new SortingMenuView();
  #pointsContainerComponent = new PointsContainerView();
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPreseters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];
  #formType = '';

  constructor(tripContainer, newPointBtn) {
    this.#tripContainer = tripContainer;
    this.#newPointBtn = newPointBtn;
  }

  init = (points) => {
    this.#points = [...points];
    this.#sourcedPoints = [...points]; // сохранение исходного порядка(для сортировки)
    render(this.#tripContainer, this.#boardComponent, RenderPosition.AFTER_BEGIN);

    this.#formType = FormType.NEW;

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPreseters.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPreseters.get(updatedPoint.id).init(updatedPoint);
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
    render(this.#boardComponent, this.#sortingMenuComponent, RenderPosition.BEFORE_END);
    this.#sortingMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPointsContainer = () => {
    render(this.#boardComponent, this.#pointsContainerComponent, RenderPosition.BEFORE_END);
  }

  #renderFormCreate = (index, formType) => {
    render(this.#pointsContainerComponent, new FormEditView(this.#points[index], formType), RenderPosition.BEFORE_END);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsContainerComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPreseters.set(point.id, pointPresenter);
  }

  #renderPointList = () => {
    for (let i = 0; i < this.#points.length - MOCK_FOR_CREATE_FORM; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #clearPointList = () => {
    this.#pointPreseters.forEach((presenter) => presenter.destroy());
    this.#pointPreseters.clear();
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#boardComponent, RenderPosition.AFTER_BEGIN);
    render(this.#boardComponent, this.#noPointsComponent, RenderPosition.BEFORE_END);
  }

  #renderBoard = () => {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderFormCreate(this.#points.length - MOCK_FOR_CREATE_FORM, this.#formType);
    this.#renderPointList();
  }
}
