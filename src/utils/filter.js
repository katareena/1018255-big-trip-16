import {TODAY_DATE, FilterType} from '../consts/common.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateFrom >= TODAY_DATE),
  [FilterType.PAST]: (points) => points.filter((point) => point.dateTo < TODAY_DATE),
};
