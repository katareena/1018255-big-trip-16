import dayjs from 'dayjs';

export const sortPointTime = (prevPoint, nextPoint) => (dayjs(nextPoint.dateTo).diff(dayjs(nextPoint.dateFrom))) - (dayjs(prevPoint.dateTo).diff(dayjs(prevPoint.dateFrom)));

export const sortPointPrice = (prevPoint, nextPoint) => nextPoint.basePrice - prevPoint.basePrice;
