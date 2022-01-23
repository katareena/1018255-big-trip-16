import dayjs from 'dayjs';
import {TYPES} from '../consts/types.js';

// Преобразуем типы согласно параметрам
export const upCaseTypes = TYPES.map((x) => x.toUpperCase());

const getStatData = (types, filtered) => types.reduce((newArr, type) => {
  newArr.push(filtered(type));

  return newArr;
}, []);

// Расчитаем финансовые затраты в разрезе точек маршрута
export const getMoneyData = (types, points) => {
  const filtered = (type) => points.filter((point) => point.type === type).reduce((sum, currentPoint) => sum + currentPoint.basePrice, 0);

  const money = getStatData(types, filtered);

  return money;
};

// Расчитаем статистику по типам точек маршрута
export const getTypesData = (types, points) => {
  const filtered = (type) => points.filter((point) => point.type === type).length;

  const count = getStatData(types, filtered);

  return count;

};

// Расчитаем сколько времени было затрачено на каждый тип точки маршрута
export const getTimesData = (types, points) => {
  const getDifference = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom));

  const filtered = (type) => {
    const typedPoints = points.filter((point) => point.type === type);

    return typedPoints.map((point) => getDifference(point.dateTo, point.dateFrom)).reduce((sum, el) => sum + el, 0);
  };

  const durations = getStatData(types, filtered);

  return durations;
};
