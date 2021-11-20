import { makeObservable, observable, action } from 'mobx';
import {
  PRIME_NUMBER_END,
  PRIME_NUMBER_START,
  START_DELAY_MILLISECONDS,
  WRONG_DELAY_MILLISECONDS
} from '../Config';

export type TStep = 'first' | 'second';
export type TBoardStatus = 'start' |'open' | 'block';
export type TCardStatus = 'hide' | 'check' | 'open';

export type TCard = {
  id: number,
  label: number,
  status: TCardStatus;
};

class App {
  @observable
  boardStatus: TBoardStatus = 'start';
  @observable
  cards?: TCard[];
  @observable
  checkedCard?: TCard;
  @observable
  moves: number = 0;

  private _step: TStep = 'first';

  constructor() {
    makeObservable(this);
  }

  get step() { return this._step; }
  set step(v: TStep) { this._step = v; }

  @action
  initNewGame = () => {
    const primes = [...this.getPrimeNumbers(), ...this.getPrimeNumbers()];
    this.cards = primes.sort(() => Math.random() - 0.5)
      .map((number: number, id: number) => {
        return {
          id,
          label: number,
          status: 'check'
        };
      })
    this.moves = 0;
    this._step = 'first';
    this.boardStatus = 'start';
    setTimeout(
      () => {
        this.cards = this.cards?.map(c => ({ ...c, status: 'hide' }));
        this.boardStatus = 'open';
      },
      START_DELAY_MILLISECONDS
    )
  }

  @action
  cardClick = (card: TCard) => {
    if (
      this.boardStatus === 'block'        // Доска закрыта: старт игры когда показываются чиста или неудачный мув
      || card.status === 'open'           // Клик по открытой карте
      || card.id === this.checkedCard?.id // Клик по одной и той же карте
    ) return;
    if (this.step === 'first') {
      card.status = 'check';
      this.checkedCard = card;
      this.step = 'second';
      this.moves++;
    } else {
      if (!this.checkedCard) return;
      if (this.checkedCard.label === card.label) {
        card.status = this.checkedCard.status = 'open';
      } else {
        card.status = 'check';
        this.boardStatus = 'block';
        setTimeout(
          () => {
            if (!this.checkedCard) return;
            card.status = this.checkedCard.status = 'hide';
            this.boardStatus = 'open';
          },
          WRONG_DELAY_MILLISECONDS
        )
      }
      this.step = 'first';
    }
  }

  getPrimeNumbers = () => {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    }
    const numbers: number[] = [];
    let i = PRIME_NUMBER_START
    while (i < PRIME_NUMBER_END) {
      if (isPrime(i)) numbers.push(i);
      i++
    }
    return numbers;
  }
}

const app = new App();
export { app };
