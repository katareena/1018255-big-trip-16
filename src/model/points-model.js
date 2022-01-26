import AbstractObservable from '../utils/abstract-observable.js';
import {toCamelCase} from '../utils/to-camel-case.js';
import {UpdateType} from '../consts/common.js';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint = async (updateType, updatePoint) => {
    const updateIndex = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (updateIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    // this.#points.splice(updateIndex, 1, updatePoint);

    // this._notify(updateType, updatePoint);

    try {
      const response = await this.#apiService.updatePoint(updatePoint);
      const updatedPoint = this.#adaptToClient(response);
      // this.#points.splice(updateIndex, 1, updatedPoint);

      this.#points = [
        ...this.#points.slice(0, updateIndex),
        updatedPoint,
        ...this.#points.slice(updateIndex + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint = (updateType, updatePoint) => {
    this.#points = [
      updatePoint,
      ...this.#points,
    ];

    this._notify(updateType, updatePoint);
  }

  deletePoint = (updateType, updatePoint) => {
    const updateIndex = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (updateIndex === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points.splice(updateIndex, 1); // удаляет 1 элемент по индексу updateIndex // splice() изменяет содержимое исходного  массива; возвращает удаленный элемент, если происходит удаление и [], если ничего не удалено

    this._notify(updateType);
  }

  #adaptToClient = (point) => toCamelCase(point);
}
