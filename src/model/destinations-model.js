import AbstractObservable from '../utils/abstract-observable.js';
import {toCamelCase} from '../utils/to-camel-case.js';
import {UpdateType} from '../consts/common.js';

export default class DestinationsModel extends AbstractObservable {
  #apiService = null;
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const destinations = await this.#apiService.destinations;
      this.#destinations = destinations.map(this.#adaptToClient);
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (destinations) => toCamelCase(destinations);
}
