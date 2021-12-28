import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {Mode} from '../consts/common.js';
import {FormType} from '../consts/form-type.js';

export default class PointPresenter {
  #pointListContainer = null;

  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) { //changeData = callback = #handlePointChange при создании point-presetner в trip-presetner на 54 строке
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent; // сохранение предыдущих обязательно ДО создания новых
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new FormEditView(point, FormType.EDIT);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setCloseClickFormHandler(this.#handleCloseForm);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointListContainer, this.#pointComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeEditForm();
    }
  }

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };

  #closeEditForm = () => {
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  }

  #handleSubmitForm = (point) => {
    this.#changeData(point);
    this.#closeEditForm();
  }

  #handleCloseForm = () => {
    this.#closeEditForm();
  }
}
