import BoardView from '../view/board-view.js';
import SortingMenuView from '../view/sorting-view.js';
import PointListView from '../view/point-list-view.js';

import PointPresenter from './point-presenter.js';

import FormCreateView from '../view/form-create-view.js';
import NoPointsView from '../view/no-points-view.js';

import {render, RenderPosition} from '../utils/render.js';
import {MOCK_FOR_CREATE_FORM} from '../consts/common.js';
import {updateItem} from '../utils/update-item.js';

export default class TripPresenter {
  #tripContainer = null;

  #boardComponent = new BoardView();
  #sortingMenuComponent = new SortingMenuView();
  #pointListComponent = new PointListView();
  #noPointsComponent = new NoPointsView();

  #points = [];
  #pointPreseters = new Map();

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (points) => {
    this.#points = [...points];
    render(this.#tripContainer, this.#boardComponent, RenderPosition.AFTER_BEGIN);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPreseters.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPreseters.get(updatedPoint.id).init(updatedPoint);
  }

  #renderPointList = () => {
    render(this.#boardComponent, this.#pointListComponent, RenderPosition.BEFORE_END);
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortingMenuComponent, RenderPosition.BEFORE_END);
  }

  #renderFormCreate = (index) => {
    render(this.#pointListComponent, new FormCreateView(this.#points[index]), RenderPosition.BEFORE_END);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPreseters.set(point.id, pointPresenter);
  }

  #clearPointList = () => {
    this.#pointPreseters.forEach((presenter) => presenter.destroy());
    this.#pointPreseters.clear();
  }

  #renderPoints = () => {
    for (let i = 0; i < this.#points.length - MOCK_FOR_CREATE_FORM; i++) {
      this.#renderPoint(this.#points[i]);
    }
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
    this.#renderPointList();
    this.#renderFormCreate(this.#points.length - MOCK_FOR_CREATE_FORM);
    this.#renderPoints();
  }
}
