import TripView from '../view/trip-view.js';
import SortingMenuView from '../view/sorting-view.js';
import PointsContainerView from '../view/points-container-view.js';
import NoPointsView from '../view/no-points-view.js';

import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';

import {filter} from '../utils/filter.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../consts/sort-type.js';
import {sortPointTime, sortPointPrice} from '../utils/sorting-points.js';
import {FormType} from '../consts/form-type.js';
import {UserAction, UpdateType, FilterType} from '../consts/common.js';

export default class TripPresenter {
  #tripContainer = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointsModel = null;
  #filterModel = null;

  #pointCreateComponent = null;
  #tripComponent = new TripView();
  #sortingMenuComponent = null;
  #pointsContainerComponent = new PointsContainerView();
  #noPointsComponent = null;

  #pointPresenters = new Map();
  #pointNewPresenter = null;

  // в конструктор передается ТОЛЬКО жизненно необходимые элементы
  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsContainerComponent, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = this.#filterType && filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }

    return filteredPoints;
  }

  init = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);
    render(this.#tripComponent, this.#pointsContainerComponent, RenderPosition.BEFORE_END);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetSortType: true});

    remove(this.#pointsContainerComponent);
    remove(this.#tripComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = (callback) => {
    // this.#currentSortType = SortType.DAY;
    // this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(FormType.NEW, callback);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, updatePoint) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatePoint);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, updatePoint);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updatePoint);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints(this.points);
  }

  #renderSortMenu = () => {
    this.#sortingMenuComponent = new SortingMenuView();
    this.#sortingMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripComponent, this.#sortingMenuComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderPointsContainer = () => {
    render(this.#tripComponent, this.#pointsContainerComponent, RenderPosition.BEFORE_END);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsContainerComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, FormType.EDIT);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  }

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingMenuComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#tripComponent, this.#noPointsComponent, RenderPosition.BEFORE_END);
  }

  #renderBoard = () => {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSortMenu();
    this.#renderPointsContainer();
    this.#renderPoints(this.points);
  }
}
