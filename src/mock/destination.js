import getRandom from '../utils/get-random.js';

export const CITIES = ['London', 'Amsterdame', 'Rome', 'Barselona', 'Berlin', 'Hamburg', 'Dusseldorf', 'Lisbon', 'Madrid'];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const generateDescription = () => {
  const array = DESCRIPTION.split('.').filter((i) => i !== '').map((i) => i.replace(/^ +/,'')).map((i) => `${i}.`);

  const clone = array.slice();
  const output = [];
  const count = getRandom(0, 5);

  for (let i = 0; i < count; i++) {
    output.push(clone.splice(Math.floor(Math.random() * clone.length), 1));
  }

  return output.join('');
};

const generatePhotos = () =>  new Array(getRandom(0, 6)).fill(undefined).map(() => ({
  'src': `http://picsum.photos/300/200?r=${getRandom(1, 1000)}`,
  'description': generateDescription(),
}));

export const destination = [
  {
    'description': generateDescription(),
    'name': 'Chamonix',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Geneva',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Paris',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'London',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Amsterdame',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Rome',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Barselona',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Berlin',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Hamburg',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Dusseldorf',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Lisbon',
    'pictures': generatePhotos(),
  },
  {
    'description': generateDescription(),
    'name': 'Madrid',
    'pictures': generatePhotos(),
  },
];
