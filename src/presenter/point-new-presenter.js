import dayjs from 'dayjs';
import FormEditView from '../view/form-edit-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts/common.js';
import {TYPES} from '../consts/types.js';

const BLANK_POINT = {
  //поля id не должно быть, id приходит с сервера
  'basePrice': 0,
  'dateFrom': dayjs().toDate(),
  'dateTo': dayjs().toDate(),
  'isFavorite': false,
  'type': TYPES[0],
  'destination': {
    'description': '',
    'name': '',
    'pictures': [],
  },
  'offers': [],
};

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #point = null;
  #formType = '';
  #destroyCallback = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (formType, callback, offers, destinations) => {
    this.#formType = formType;
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormEditView(BLANK_POINT, formType, offers, destinations);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setDeleteClickFormHandler(this.#handleDeleteForm);

    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#handleEscKeyDown);
  }

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleSubmitForm = (newPoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...newPoint},
    );
  }

  #handleDeleteForm = () => {
    this.destroy();
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
