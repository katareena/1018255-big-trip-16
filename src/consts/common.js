import dayjs from 'dayjs';

export const AUTHORIZATION = 'Basic afj465JKD45jk56h';
export const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

export const TODAY_DATE = dayjs().toDate();

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  ADD_NEW_POINT: 'new-event-btn',
  POINTS: 'Table',
  STATISTICS: 'Stats',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const SHAKE_ANIMATION_TIMEOUT = 600;
