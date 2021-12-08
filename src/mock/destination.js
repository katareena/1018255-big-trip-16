import getRandom from './get-random.js';

export const CITY = ['Chamonix', 'Geneva', 'Paris', 'London', 'Amsterdame', 'Rome', 'Barselona', 'Berlin', 'Hamburg', 'Dusseldorf', 'Lisbon', 'Madrid'];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const generateDescription = () => {
  // 1 .split('.') разделит строку на массив по точке
  // 2 .filter((i) => i !== '') удаляет пустые строки из массива
  // 3 .map((i) => i.replace(/^ +/,'')) удаляем пробелы вначале строки
  // 4 .map((i) => `${i}.`) расставляем точки вконце строк
  const array = DESCRIPTION.split('.').filter((i) => i !== '').map((i) => i.replace(/^ +/,'')).map((i) => `${i}.`);

  const clone = array.slice();
  const output = [];
  const count = getRandom(1, 5);

  for (let i = 0; i < count; i++) {
    output.push(clone.splice(Math.floor(Math.random() * clone.length), 1));
  }

  return output.join('');
};

const photos = new Array(6).fill(undefined).map(() => `http://picsum.photos/300/200?r=${getRandom(1, 1000)}`);

// если назначение пусто
export const generateDestination = () => ({
  'description': generateDescription(),
  'name': CITY[Math.floor(Math.random() * CITY.length)],
  'pictures': [
    {
      'src': photos,
      'description': generateDescription()
    }
  ]
});

