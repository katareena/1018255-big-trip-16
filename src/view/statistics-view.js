import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart-view.js';

import chartjs from 'chart.js';
import chartjsDatalabels from 'chartjs-plugin-datalabels';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createStatisticsTemplate = () => {
  const x = hj;

  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <!-- Пример диаграмм -->
    <img src="img/big-trip-stats-markup.png" alt="Пример диаграмм">

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class StatisticsView extends SmartView {
  #datepicker = null;

  constructor(tasks) {
    super();

    this._data = {
      tasks,
      // По условиям техзадания по умолчанию интервал - неделя от текущей даты
      dateFrom: dayjs().subtract(6, 'day').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#setCharts();
    this.#setDatepicker();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }


  restoreHandlers = () => {
    this.#setCharts();
    this.#setDatepicker();
  }

  #dateChangeHandler = ([dateFrom, dateTo]) => {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  #setDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.statistic__period-input'),
      {
        mode: 'range',
        dateFormat: 'j F',
        defaultDate: [this._data.dateFrom, this._data.dateTo],
        onChange: this.#dateChangeHandler,
      },
    );
  }

  #setCharts = () => {
    // Нужно отрисовать 3 графика
  }
}
