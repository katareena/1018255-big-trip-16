import dayjs from 'dayjs';
// import flatpickr from 'flatpickr';
import { nanoid } from 'nanoid';
import toCamelCase from './to-camel-case.js';
import getRandom from './get-random.js';

import generateDestination from './destination.js';

const BOOLEANS = [true, false];
const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const NUMBER_OF_POINTS = 20;

const generateDate = () => dayjs().add((getRandom(1, 30)), 'day');

const generateOffers = (type) => {
  if (type === 'train' || type === 'ship' || type === 'flight' || type === 'check-in') {
    return [
      {
        'title': 'Choose meal',
        'price': getRandom(50, 200)
      }, {
        'title': 'Upgrade to comfort class',
        'price': getRandom(50, 200)
      }
    ];
  } else if (type === 'sightseeing') {
    return [
      {
        'title': 'Choose meal',
        'price': getRandom(50, 200)
      }
    ];
  } else {
    return '';
  }
};

const generatePoint = () => {
  const type = POINT_TYPE[Math.floor(Math.random() * POINT_TYPE.length)];

  const offers = generateOffers(type);

  return {
    type,
    'base_price': getRandom(50, 200),
    'date_from': dayjs().toDate(),
    'date_to': generateDate().add((getRandom(1, 30)), 'day').toDate(),
    'destination': generateDestination(),
    'id': nanoid(5),
    'is_favorite': BOOLEANS[Math.floor(Math.random() * BOOLEANS.length)],
    offers // Набор дополнительных опций, которые может выбрать пользователь при создании точки маршрута, зависит от типа точки маршрута
  };
};

const points = new Array(NUMBER_OF_POINTS).fill(undefined).map(() => toCamelCase(generatePoint()));
// метод .from сразу заполняет созданный массив значением undefined, а так же вторым аргументом принимает колбек, но в этом случае не могу применить toCamelCase() к колбеку
// const points = Array.from({length: NUMBER_OF_POINTS}, generatePoint);

// console.log(points);
// console.log(generateDate().toDate());

export default points;
