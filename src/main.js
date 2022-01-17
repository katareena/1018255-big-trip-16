import SiteMenuView from './view/site-menu-view.js';
import NewEventBtnView from './view/new-event-btn-view.js';
import StatisticsView from './view/statistics-view.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import InfoRoutePresenter from './presenter/info-route-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import points from './mock/points.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem} from './consts/common.js';
import {TYPES} from './consts/types.js';

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

const infoRoutePresenter = new InfoRoutePresenter(headerInfoRouteBox, pointsModel);
const newPointBtnComponent = new NewEventBtnView();
const tripPresenter = new TripPresenter(tripContainer, pointsModel, filterModel, newPointBtnComponent);
const filterPresenter = new FilterPresenter(headerFiltersBox, filterModel, pointsModel);

const handleTaskNewFormClose = () => {
  newPointBtnComponent.element.disabled = false;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      filterPresenter.destroy();
      filterPresenter.init();
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createPoint(handleTaskNewFormClose);
      newPointBtnComponent.element.disabled = true;
      break;
    case MenuItem.POINTS: // когда возвращаемся на страницу с точками из статистики
      filterPresenter.init();
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.points, TYPES);
      render(tripContainer, statisticsComponent, RenderPosition.BEFORE_END);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
newPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);

if (points.length !== 0) {
  infoRoutePresenter.init();
}

render(headerMenuBox, siteMenuComponent, RenderPosition.BEFORE_END);
render(headerInfoRouteBox, newPointBtnComponent, RenderPosition.BEFORE_END);

filterPresenter.init();
tripPresenter.init();
