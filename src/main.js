import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFiltersTemplate} from './view/filters-view.js';
import {createSortingMenuTemplate} from './view/sorting-view.js';
import {createFormCreateTemplate} from './view/form-create-view.js';
import {createInfoRouteTemplate} from './view/info-route-view.js';
import {createFormEditTemplate} from './view/form-edit-view.js';
import {createRoutePointTemplate} from './view/route-point-view.js';

import {renderTemplate, RenderPosition} from './render.js';

const  ROUT_POINT_COUNT = 3;

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoRouteBox = siteHeaderElement.querySelector('.trip-main');
const headerMenuBox = siteHeaderElement.querySelector('.trip-controls__navigation');
const headerFiltersBox = siteHeaderElement.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const routePointBox = main.querySelector('.trip-events__list');

renderTemplate(headerInfoRouteBox, createInfoRouteTemplate(), RenderPosition.AFTERBEGIN);

renderTemplate(headerMenuBox, createSiteMenuTemplate(), RenderPosition.BEFOREEND);

renderTemplate(headerFiltersBox, createFiltersTemplate(), RenderPosition.BEFOREEND);

renderTemplate(routePointBox, createSortingMenuTemplate(), RenderPosition.BEFOREBEGIN);

renderTemplate(routePointBox, createFormCreateTemplate(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < ROUT_POINT_COUNT; i++) {
  renderTemplate(routePointBox, createRoutePointTemplate(), RenderPosition.BEFOREEND);
  renderTemplate(routePointBox, createFormEditTemplate(), RenderPosition.BEFOREEND);
}
