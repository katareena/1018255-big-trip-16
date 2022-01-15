import dayjs from 'dayjs';
import {TYPES} from '../consts/types.js';

// Преобразуем типы согласно параметрам
export const typesUp = TYPES.map((x) => x.toUpperCase());

// Расчитаем финансовые затраты в разрезе точек маршрута
export const getMoneyData = (typesList, pointsList) => {
  function filtered (type) {
    return pointsList.filter((point) => point.type === type).reduce((sum, currentPoint) => sum + currentPoint.basePrice, 0);
  }

  const money = {};

  for(let i = 0; i < typesList.length; i++) {
    money[typesList[i]] = filtered(typesList[i]);
  }

  return Object.values(money);
};

// Расчитаем статистику по типам точек маршрута
export const getTypesData = (typesList, pointsList) => {
  function filtered (type) {
    return pointsList.filter((point) => point.type === type).length;
  }

  const count = {};

  for(let i = 0; i < typesList.length; i++) {
    count[typesList[i]] = filtered(typesList[i]);
  }

  return Object.values(count);
};

// Расчитаем сколько времени было затрачено на каждый тип точки маршрута
export const getTimesData = (typesList, pointsList) => {
  function getDiff (dateTo, dateFrom) {
    const diff = dayjs(dateTo).diff(dayjs(dateFrom));
    return diff;
  }

  function filtered (type) {
    const po = pointsList.filter((point) => point.type === type);

    return po.map((p) => getDiff(p.dateTo, p.dateFrom)).reduce((sum, el) => sum+el, 0);
  }

  const dur = {};

  for(let i = 0; i < typesList.length; i++) {
    dur[typesList[i]] = filtered(typesList[i]);
  }

  return Object.values(dur);
};
