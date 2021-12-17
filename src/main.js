import FiltersView from './view/filters-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortingMenuView from './view/sorting-view.js';
import InfoRouteView from './view/info-route-view.js';
import FormCreateView from './view/form-create-view.js';
import PointItemView from './view/point-item-view.js';
import PointView from './view/point-view.js';
import FormEditView from './view/form-edit-view.js';
import NoPointsView from './view/no-points-view.js';

import points from './mock/point.js';
import {render, RenderPosition} from './render.js';

const ROUT_POINT_COUNT = 5;

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');
const main = document.querySelector('.page-main');
const routePointBox = main.querySelector('.trip-events__list');

if (points.length === 0) {

  render(headerFiltersBox, new FiltersView().element, RenderPosition.BEFOREEND);
  const filters = document.querySelectorAll('.trip-filters__filter-input');

  let noPointsComponent = null;

  filters.forEach((elem) => {

    if(elem.checked) {
      noPointsComponent = new NoPointsView(elem.id);
      render(routePointBox, noPointsComponent.element, RenderPosition.AFTEREND);
    }

    elem.addEventListener('click', () => {
      noPointsComponent.element.remove();

      noPointsComponent = new NoPointsView(elem.id);
      render(routePointBox, noPointsComponent.element, RenderPosition.AFTEREND);

    });

  });

} else {

  render(headerInfoRouteBox, new InfoRouteView(points).element, RenderPosition.AFTERBEGIN);

  render(headerMenuBox, new SiteMenuView().element, RenderPosition.BEFOREEND);

  render(headerFiltersBox, new FiltersView().element, RenderPosition.BEFOREEND);

  render(routePointBox, new SortingMenuView().element, RenderPosition.BEFOREBEGIN);

  render(routePointBox, new FormCreateView(points[0]).element, RenderPosition.AFTERBEGIN);

  const renderPoint = (conteiner, point) => {
    const pointComponent = new PointView(point);
    const pointEdinComponent = new FormEditView(point);

    const replacePointToEditForm = () => {
      conteiner.replaceChild(pointEdinComponent.element, pointComponent.element);
    };

    const replaceEditFormToPoint = () => {
      conteiner.replaceChild(pointComponent.element, pointEdinComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEdinComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEdinComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(conteiner, pointComponent.element, RenderPosition.BEFOREEND);
  };

  for (let i = 1; i <= ROUT_POINT_COUNT; i++) {
    const pointItemComponent = new PointItemView();
    render(routePointBox, pointItemComponent.element, RenderPosition.BEFOREEND);
    renderPoint(pointItemComponent.element, points[i]);
  }
}
