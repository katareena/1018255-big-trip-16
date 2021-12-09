import dayjs from 'dayjs';

export const createInfoRouteTemplate = (points) => {

  const destinations = points.map((obj) => obj.destination.name);
  const timesFrom = points.map((obj) => obj.dateFrom);
  const timesTo = points.map((obj) => obj.dateTo);

  const dateStart = dayjs(timesFrom[0]).format('MMM D');
  const dateEnd = dayjs(timesTo.length - 1).format('MMM D');

  const cost = points.map((obj) => obj.basePrice).reduce((a, b) => a + b);

  const createDestinationsChain = () => `<h1 class="trip-info__title">${destinations.join(' - ')}</h1>`;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    ${createDestinationsChain()}

      <p class="trip-info__dates">${dateStart}&mdash;${dateEnd}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
};
