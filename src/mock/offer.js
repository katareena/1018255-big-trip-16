import {nanoid} from 'nanoid';
import {LENGTH_OF_ID} from '../consts/common.js';
import getRandom from '../utils/get-random.js';

const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train', 'Choose the radio station', 'Upgrade to a business class'];

const generateOffer = () => ({
  'id': nanoid(LENGTH_OF_ID),
  'title': OFFERS[Math.floor(Math.random() * OFFERS.length)],
  'price': getRandom(50, 200),
});

export const offers = [
  {
    'type': 'taxi',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'bus',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'train',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'ship',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'drive',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'flight',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'check-in',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'sightseeing',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
  {
    'type': 'restaurant',
    'offers': Array.from({length: getRandom(0, 5)}, generateOffer),
  },
];
