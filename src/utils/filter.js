import {TODAY_DATE, FilterType} from '../consts/common.js';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom) >= TODAY_DATE),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo) < TODAY_DATE),
};
