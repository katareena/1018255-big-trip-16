import {nanoid} from 'nanoid';
import {LENGTH_OF_ID} from '../consts/common.js';
import getRandom from './get-random.js';

const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train', 'Choose the radio station', 'Upgrade to a business class'];

export const generateOffer = () => ({
  'id': nanoid(LENGTH_OF_ID),
  'title': OFFERS[Math.floor(Math.random() * OFFERS.length)],
  'price': getRandom(50, 200),
});
