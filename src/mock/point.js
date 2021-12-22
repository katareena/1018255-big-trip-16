import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import toCamelCase from '../utils/to-camel-case.js';
import getRandom from '../utils/get-random.js';
import {NUMBER_OF_POINTS, LENGTH_OF_ID} from '../consts/common.js';

import {generateDestination} from './destination.js';
import {generateOffer} from './offer.js';

const BOOLEANS = [true, false];
const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const generateDate = () => dayjs().add((getRandom(1, 10)), 'day');

const generatePoint = () => {
  const offers = Array.from({length: getRandom(0, 5)}, generateOffer);

  return {
    'base_price': getRandom(50, 200),
    'date_from': getRandom(50, 200),
    'date_to': generateDate().add((getRandom(10, 30)), 'day').add((getRandom(20, 59)), 'minutes').toDate(),
    'id': nanoid(LENGTH_OF_ID),
    'is_favorite': BOOLEANS[Math.floor(Math.random() * BOOLEANS.length)],
    'type': POINT_TYPE[Math.floor(Math.random() * POINT_TYPE.length)],
    'destination': generateDestination(),
    offers,
  };
};

let points = new Array(NUMBER_OF_POINTS).fill(undefined).map(() => generatePoint());
points = toCamelCase(points);

export default points;
