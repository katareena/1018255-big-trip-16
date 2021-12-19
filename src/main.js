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
import {render, RenderPosition, replace, remove} from './utils/render.js';

const ROUT_POINT_COUNT = 5;

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');
const main = document.querySelector('.page-main');
const routePointBox = main.querySelector('.trip-events__list');

if (points.length === 0) {

  render(headerFiltersBox, new FiltersView(), RenderPosition.BEFOREEND);
  const filters = document.querySelectorAll('.trip-filters__filter-input');

  let noPointsComponent = null;

  filters.forEach((elem) => {

    if(elem.checked) {
      noPointsComponent = new NoPointsView(elem.id);
      render(routePointBox, noPointsComponent, RenderPosition.AFTEREND);
    }

    elem.addEventListener('click', () => {
      remove(noPointsComponent);
      noPointsComponent = new NoPointsView(elem.id);
      render(routePointBox, noPointsComponent, RenderPosition.AFTEREND);
    });

  });

} else {

  render(headerInfoRouteBox, new InfoRouteView(points), RenderPosition.AFTERBEGIN);

  render(headerMenuBox, new SiteMenuView(), RenderPosition.BEFOREEND);

  render(headerFiltersBox, new FiltersView(), RenderPosition.BEFOREEND);

  render(routePointBox, new SortingMenuView(), RenderPosition.BEFOREBEGIN);

  render(routePointBox, new FormCreateView(points[0]), RenderPosition.AFTERBEGIN);

  const renderPoint = (conteiner, point) => {
    const pointComponent = new PointView(point);
    const pointEdinComponent = new FormEditView(point);

    const replacePointToEditForm = () => {
      replace(pointEdinComponent, pointComponent);
    };

    const replaceEditFormToPoint = () => {
      replace(pointComponent, pointEdinComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEdinComponent.setFormSubmitHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEdinComponent.setCloseClickHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(conteiner, pointComponent, RenderPosition.BEFOREEND);
  };

  for (let i = 1; i <= ROUT_POINT_COUNT; i++) {
    const pointItemComponent = new PointItemView();
    render(routePointBox, pointItemComponent, RenderPosition.BEFOREEND);
    renderPoint(pointItemComponent.element, points[i]);
  }
}
