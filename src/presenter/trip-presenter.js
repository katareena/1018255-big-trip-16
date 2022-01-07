import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import TripView from '../view/trip-view.js';
import SortingMenuView from '../view/sorting-view.js';
import PointsContainerView from '../view/points-container-view.js';

import PointPresenter from './point-presenter.js';

import FormEditView from '../view/form-edit-view.js';
import NoPointsView from '../view/no-points-view.js';

import {render, RenderPosition} from '../utils/render.js';
import {SortType} from '../consts/sort-type.js';
import {sortPointTime, sortPointPrice} from '../utils/sorting-points.js';
import {FormType} from '../consts/form-type.js';
import {UserAction, UpdateType} from '../consts/common.js';
// import { lowerFirst } from 'lodash';

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
  #pointsModel = null;
  #pointCreateComponent = null;

  #tripComponent = new TripView();
  #sortingMenuComponent = new SortingMenuView();
  #pointsContainerComponent = new PointsContainerView();
  #noPointsComponent = new NoPointsView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor(tripContainer, pointsModel) { // в конструктор передается ТОЛЬКО жизненно необходимый элемент
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointPrice);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);
    render(this.#tripComponent, this.#pointsContainerComponent, RenderPosition.BEFORE_END);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  // #handlePointChange = (updatedPoint) => {
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint); // обновление модели
  // }

  #handleViewAction = (actionType, updateType, updatePoint) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // updatePoint - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updateTask(updateType, updatePoint);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addTask(updateType, updatePoint);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deleteTask(updateType, updatePoint);
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
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  }

  #renderSort = () => {
    render(this.#tripComponent, this.#sortingMenuComponent, RenderPosition.AFTER_BEGIN);
    this.#sortingMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  renderFormCreate = (point = BLANK_OFFER) => {
    render(this.#pointsContainerComponent, new FormEditView(point, FormType.NEW), RenderPosition.AFTER_BEGIN);
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

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#tripComponent, RenderPosition.AFTER_BEGIN);
    render(this.#tripComponent, this.#noPointsComponent, RenderPosition.BEFORE_END);
  }

  #renderBoard = () => {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPoints(this.points);
  }
}
