import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {Mode, UserAction, UpdateType, State} from '../consts/common.js';

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

  init = (point, formType, offers, destinations) => {
    this.#point = point;
    this.#formType = formType;

    const prevPointComponent = this.#pointComponent; // сохранение предыдущих обязательно ДО создания новых
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new FormEditView(point, formType, offers, destinations);

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
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
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

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointComponent.shake(resetFormState);
        this.#pointEditComponent.shake(resetFormState);
        break;
    }
  }

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
  };

  #closeEditForm = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleOpenEditForm = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleSubmitForm = (updatePoint) => {
    const isPathUpdate = this.#point.type !== updatePoint.type; // изменение типа маршрута - UpdateType.PATCH

    this.#changeData(
      UserAction.UPDATE_POINT,
      isPathUpdate ? UpdateType.PATCH : UpdateType.MINOR, // если поменялся не тип путешествия, то UpdateType.MINOR
      updatePoint,
    );
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

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };
}
