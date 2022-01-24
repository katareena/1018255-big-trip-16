import InfoRouteView from '../view/info-route-view';
import {render, RenderPosition, remove} from '../utils/render.js';

export default class InfoRoutePresenter {
  #infoRouteContainer = null;
  #infoRouteComponent = null;
  #pointsModel = null;

  constructor(infoRouteContainer, pointsModel) {
    this.#infoRouteContainer = infoRouteContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    if (this.#infoRouteComponent !== null) {
      remove(this.#infoRouteComponent);
    }

    this.#infoRouteComponent = new InfoRouteView(this.#pointsModel.points);

    this.#renderInfoRoute();
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  destroy = () => {
    remove(this.#infoRouteComponent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #renderInfoRoute = () => {
    render(this.#infoRouteContainer, this.#infoRouteComponent, RenderPosition.AFTER_BEGIN);
  }
}
