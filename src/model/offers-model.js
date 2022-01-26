import AbstractObservable from '../utils/abstract-observable.js';
import {toCamelCase} from '../utils/to-camel-case.js';
import {UpdateType} from '../consts/common.js';

export default class OffersModel extends AbstractObservable {
  #apiService = null;
  #offers = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const offers = await this.#apiService.offers;
      this.#offers = offers.map(this.#adaptToClient);
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (offers) => toCamelCase(offers);
}
