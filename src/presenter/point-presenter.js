import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {Mode, UserAction, UpdateType} from '../consts/common.js';

export default class PointPresenter {
  #pointListContainer = null;

  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #formType = '';

  constructor(pointListContainer, changeData, changeMode) { //changeData = callback = #handlePointChange при создании point-presetner в trip-presetner на 54 строке
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, formType) => {
    this.#point = point;
    this.#formType = formType;

    const prevPointComponent = this.#pointComponent; // сохранение предыдущих обязательно ДО создания новых
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new FormEditView(point, formType);

    this.#pointComponent.setEditClickHandler(this.#handleOpenEditForm);
    this.#pointComponent.setFavoriteHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setCloseClickFormHandler(this.#handleCloseForm);
    this.#pointEditComponent.setDeleteClickFormHandler(this.#handleDeleteForm);

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
      this.#pointEditComponent.reset(this.#point);
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
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleOpenEditForm = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleSubmitForm = (updatePoint) => {
    const isPathUpdate = this.#point.type !== updatePoint.type;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isPathUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      updatePoint,
    );
    this.#closeEditForm();
  }

  #handleCloseForm = () => {
    this.#closeEditForm();
  }

  #handleDeleteForm = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }
}
