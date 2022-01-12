import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (update, justDataUpdating) => { //добавляем параметр justDataUpdating чтобы ориентироваться что нужно просто обновить состояние, но не перерисовывать
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) { // добавляем проверку ПОСЛЕ обновления состояния = что ввел пользователь сохранится в состоянии
      return;
    }

    this.updateElement();
  }

  updateElement = () => { // обновление елемента НЕ компонента
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
