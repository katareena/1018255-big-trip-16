import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import FormEditView from '../view/form-edit-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts/common.js';
import {TYPES} from '../consts/types.js';

const BLANK_OFFER = {
  //поля id не должно вообще быть чтобы nanoid мог присвоить id при submit
  'basePrice': 0,
  'dateFrom': dayjs().toDate(),
  'dateTo': dayjs().toDate(),
  'isFavorite': '',
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

  init = (formType, callback) => {
    this.#formType = formType;
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormEditView(BLANK_OFFER, formType);
    this.#pointEditComponent.setSubmitFormHandler(this.#handleSubmitForm);
    this.#pointEditComponent.setDeleteClickFormHandler(this.#handleDeleteForm);

    render(this.#pointListContainer, this.#pointEditComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleSubmitForm = (newPoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(5), ...newPoint},
    );
    this.destroy();
  }

  #handleDeleteForm = () => {
    this.destroy();
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
