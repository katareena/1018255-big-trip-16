import getRandom from './get-random.js';
const OFFER_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const offer = {
  'type': OFFER_TYPE[Math.floor(Math.random() * OFFER_TYPE.length)],
  'offers': [
    {
      'title': 'Upgrade to a business class',
      'price': getRandom(50, 200)
    }, {
      'title': 'Choose the radio station',
      'price': getRandom(50, 200)
    }
  ]
};
