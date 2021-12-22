import FiltersView from './view/filters-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortingMenuView from './view/sorting-view.js';
import InfoRouteView from './view/info-route-view.js';
import FormCreateView from './view/form-create-view.js';
import PointView from './view/point-view.js';
import FormEditView from './view/form-edit-view.js';
import NoPointsView from './view/no-points-view.js';

import points from './mock/point.js';
import {render, RenderPosition, replace} from './utils/render.js';
import {MOCK_FOR_CREATE_FORM} from './consts/common.js';

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');
const main = document.querySelector('.page-main');
const routePointBox = main.querySelector('.trip-events__list');

let noPointsComponent = null;

const changeInfoMessage = (filter) => {
  if(filter.checked) {
    noPointsComponent = new NoPointsView(filter.value);
    render(routePointBox, noPointsComponent, RenderPosition.AFTER_END);
  }
};

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
      closeEditForm();
    }
  };

  function closeEditForm () {
    replaceEditFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  }

  pointComponent.setEditClickHandler(() => {
    replacePointToEditForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEdinComponent.setFormSubmitHandler(() => {
    closeEditForm();
  });

  pointEdinComponent.setCloseClickHandler(() => {
    closeEditForm();
  });

  render(conteiner, pointComponent, RenderPosition.BEFORE_END);
};

if (points.length === 0) {
  render(headerFiltersBox, new FiltersView(), RenderPosition.BEFORE_END);
  const filters = document.querySelectorAll('.trip-filters__filter-input');
  filters.forEach(changeInfoMessage);
  render(routePointBox, noPointsComponent, RenderPosition.AFTER_END);
} else {
  render(headerInfoRouteBox, new InfoRouteView(points), RenderPosition.AFTER_BEGIN);
  render(headerMenuBox, new SiteMenuView(), RenderPosition.BEFORE_END);
  render(headerFiltersBox, new FiltersView(), RenderPosition.BEFORE_END);
  render(routePointBox, new SortingMenuView(), RenderPosition.BEFORE_BEGIN);
  render(routePointBox, new FormCreateView(points[points.length - MOCK_FOR_CREATE_FORM]), RenderPosition.AFTER_BEGIN);

  for (let i = 0; i < points.length - MOCK_FOR_CREATE_FORM; i++) {
    renderPoint(routePointBox, points[i]);
  }
}
