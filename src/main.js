import InfoRouteView from './view/info-route-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FiltersView from './view/filters-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import NewEventBtnView from './view/new-event-btn-view.js';

import points from './mock/points.js';
import {render, RenderPosition} from './utils/render.js';

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');
const main = document.querySelector('.page-main');
const tripContainer = main.querySelector('.page-body__container');

const newPointBtnComponent = new NewEventBtnView();
const tripPresenter = new TripPresenter(tripContainer, newPointBtnComponent);

if (points.length !== 0) {
  render(headerInfoRouteBox, new InfoRouteView(points), RenderPosition.AFTER_BEGIN);
}

render(headerMenuBox, new SiteMenuView(), RenderPosition.BEFORE_END);
render(headerFiltersBox, new FiltersView(), RenderPosition.BEFORE_END);
render(headerInfoRouteBox, newPointBtnComponent, RenderPosition.BEFORE_END);

tripPresenter.init(points);
