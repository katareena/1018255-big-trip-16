import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// -----------------------------------------------------------------------------------
import dayjs from 'dayjs';
import {TYPES} from '../consts/types.js';
import {Date} from '../consts/dates.js';
import points from '../mock/points.js';

// Преобразуем типы согласно параметрам
const types = TYPES.map((x) => x.toUpperCase());
console.log(types);

// Расчитаем финансовые затраты в разрезе точек маршрута
function getMoneyData () {
  function filtered (type) {
    return points.filter((point) => point.type === type).reduce((sum, currentPoint) => sum + currentPoint.basePrice, 0);
  }

  const money = {};

  for(let i = 0; i < TYPES.length; i++) {
    money[TYPES[i]] = filtered(TYPES[i]);
  }

  return Object.values(money);
}

const moneyArr = getMoneyData();
console.log(moneyArr);

// Расчитаем статистику по типам точек маршрута
function getCountData () {
  function filtered (type) {
    return points.filter((point) => point.type === type).length;
  }

  const count = {};

  for(let i = 0; i < TYPES.length; i++) {
    count[TYPES[i]] = filtered(TYPES[i]);
  }

  return Object.values(count);
}

const counts = getCountData();
console.log(counts);

// Расчитаем сколько времени было затрачено на каждый тип точки маршрута
function getDiffData () {
  function getDiff (dateTo, dateFrom) {
    const diff = dayjs(dateTo).diff(dayjs(dateFrom));
    return dayjs.duration(diff);
  }

  function filtered (type) {
    const po = points.filter((point) => point.type === type);

    return po.map((p) => getDiff(p.dateTo, p.dateFrom)).reduce((sum, el) => sum.add(el), dayjs.duration(0, 'd')).format(Date.duration);
  }

  const dur = {};

  for(let i = 0; i < TYPES.length; i++) {
    dur[TYPES[i]] = filtered(TYPES[i]);
  }

  return Object.values(dur);
}

const difff = getDiffData();
console.log(difff);
// -----------------------------------------------------------------------------------

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const moneyCtx = document.querySelector('#money');
const typeCtx = document.querySelector('#type');
const timeCtx = document.querySelector('#time');

const BAR_HEIGHT = 55;
const numberOfType = 9;
moneyCtx.height = BAR_HEIGHT * numberOfType;
typeCtx.height = BAR_HEIGHT * numberOfType;
timeCtx.height = BAR_HEIGHT * numberOfType;

const moneyChart = new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE'],
    datasets: [{
      data: [400, 300, 200, 160, 150, 100],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 44,
      minBarLength: 50,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (value) => `€ ${value}`,
      },
    },
    title: {
      display: true,
      text: 'MONEY',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const typeChart = new Chart(typeCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE'],
    datasets: [{
      data: [4, 3, 2, 1, 1, 1],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 44,
      minBarLength: 50,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (value) => `${value}x`,
      },
    },
    title: {
      display: true,
      text: 'TYPE',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});
