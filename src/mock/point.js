import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import toCamelCase from './to-camel-case.js';
import getRandom from './get-random.js';

import {generateDestination} from './destination.js';

const BOOLEANS = [true, false];
const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const NUMBER_OF_POINTS = 6;

const generateDate = () => dayjs().add((getRandom(1, 10)), 'day');

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
    return [];
  }
};

const generatePoint = () => {
  const type = POINT_TYPE[Math.floor(Math.random() * POINT_TYPE.length)];

  const offers = generateOffers(type);

  return {
    type,
    'base_price': getRandom(50, 200),
    'date_from': generateDate().toDate(),
    'date_to': generateDate().add((getRandom(10, 30)), 'day').add((getRandom(20, 59)), 'minutes').toDate(),
    'destination': generateDestination(),
    'id': nanoid(5),
    'is_favorite': BOOLEANS[Math.floor(Math.random() * BOOLEANS.length)],
    offers // Набор дополнительных опций, которые может выбрать пользователь при создании точки маршрута, зависит от типа точки маршрута
  };
};

let points = new Array(NUMBER_OF_POINTS).fill(undefined).map(() => generatePoint());
points = toCamelCase(points);
// const points = new Array(NUMBER_OF_POINTS).fill(undefined).map(() => generatePoint());
// метод .from сразу заполняет созданный массив значением undefined, а так же вторым аргументом принимает колбек, но в этом случае не могу применить toCamelCase() к колбеку
// const points = Array.from({length: NUMBER_OF_POINTS}, generatePoint);

export default points;
