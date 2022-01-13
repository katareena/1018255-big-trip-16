import InfoRouteView from './view/info-route-view.js';
import SiteMenuView from './view/site-menu-view.js';
import NewEventBtnView from './view/new-event-btn-view.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import points from './mock/points.js';
import {render, RenderPosition} from './utils/render.js';
import {MenuItem} from './consts/common.js';

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView();

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');
const main = document.querySelector('.page-main');
const tripContainer = main.querySelector('.page-body__container');

const newPointBtnComponent = new NewEventBtnView();
const tripPresenter = new TripPresenter(tripContainer, pointsModel, filterModel, newPointBtnComponent);
const filterPresenter = new FilterPresenter(headerFiltersBox, filterModel, pointsModel);

const handleTaskNewFormClose = () => {
  newPointBtnComponent.element.disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      // Скрыть статистику
      filterPresenter.destroy();
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createPoint(handleTaskNewFormClose);
      newPointBtnComponent.element.disabled = true;
      break;
    case MenuItem.POINTS:
      filterPresenter.init();
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
newPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);

if (points.length !== 0) {
  render(headerInfoRouteBox, new InfoRouteView(points), RenderPosition.AFTER_BEGIN);
}

render(headerMenuBox, siteMenuComponent, RenderPosition.BEFORE_END);
render(headerInfoRouteBox, newPointBtnComponent, RenderPosition.BEFORE_END);

filterPresenter.init();
tripPresenter.init();

// newPointBtnComponent.setOpenClickHandler(tripPresenter.createPoint);
