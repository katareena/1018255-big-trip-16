import dayjs from 'dayjs';

export const NUMBER_OF_POINTS = 5;
export const LENGTH_OF_ID = 5;
export const MOCK_FOR_CREATE_FORM = 1;
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
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
