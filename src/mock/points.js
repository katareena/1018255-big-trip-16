import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import toCamelCase from '../utils/to-camel-case.js';
import getRandom from '../utils/get-random.js';
import {NUMBER_OF_POINTS, LENGTH_OF_ID} from '../consts/common.js';

import {generateDestination} from './destination.js';
import {generateOffer} from './offer.js';

const BOOLEANS = [true, false];
const POINT_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const generatePoint = () => {
  const offers = Array.from({length: getRandom(0, 5)}, generateOffer);

  return {
    'base_price': getRandom(50, 200),
    'date_from': dayjs().toDate(),
    'date_to': dayjs().add((getRandom(1, 5)), 'day').add((getRandom(1, 10)), 'hour').add((getRandom(5, 59)), 'minutes').toDate(),
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
