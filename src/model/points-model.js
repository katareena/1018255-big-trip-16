import AbstractObservable from '../utils/abstract-observable.js';
import {toCamelCase} from '../utils/to-camel-snake-case.js';
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

    try {
      const response = await this.#apiService.updatePoint(updatePoint);
      const updatedPoint = this.#adaptToClient(response);
      this.#points.splice(updateIndex, 1, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint = async (updateType, updatePoint) => {
    try {
      const response = await this.#apiService.addPoint(updatePoint);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  deletePoint = async (updateType, updatePoint) => {
    const updateIndex = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (updateIndex === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      // метод удаления задачи на сервере не возвращает response (в отличии от метода редактирования точки маршрута)
      await this.#apiService.deletePoint(updatePoint);
      this.#points.splice(updateIndex, 1);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => toCamelCase(point);
}
