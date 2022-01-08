import AbstractObservable from '../utils/abstract-observable.js';

export default class PointsModel extends AbstractObservable {
  #points = [];

  set points(points) {
    this.#points = [...points];
  }

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, updatePoint) => {
    const updateIndex = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (updateIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points.splice(updateIndex, 1, updatePoint);

    this._notify(updateType, updatePoint);
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

    // this.#points = [
    //   ...this.#points.slice(0, updateIndex),
    //   ...this.#points.slice(updateIndex + 1),
    // ];

    this.#points.splice(updateIndex, 1); // удаляет 1 элемент по индексу updateIndex // splice() изменяет содержимое массива

    this._notify(updateType);
  }
}
