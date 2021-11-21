import { makeObservable, observable, action } from 'mobx';
import {
  PRIME_NUMBER_END,
  PRIME_NUMBER_START,
  PRIME_NUMBER_MAX_COUNT,
  START_DELAY_MILLISECONDS,
  WRONG_DELAY_MILLISECONDS
} from '../Config';

export enum EStep {
  FIRST = 'first' ,
  SECOND ='second',
}

export enum EBoardStatus {
  START = 'start',
  OPEN = 'open',
  BLOCK = 'block',
}
export enum ECardStatus {
  HIDE = 'hide',
  CHECK = 'check',
  OPEN = 'open',

}

export type TCard = {
  id: number,
  label: number,
  status: ECardStatus;
};

class App {
  @observable
  boardStatus: EBoardStatus = EBoardStatus.START;
  @observable
  cards?: TCard[];
  @observable
  checkedCard?: TCard;
  @observable
  moves: number = 0;

  private _step: EStep = EStep.FIRST;

  constructor() {
    makeObservable(this);
  }

  get step() { return this._step; }
  set step(v: EStep) { this._step = v; }

  @action
  initNewGame = () => {
    this.cards = this.makePrimeNumbersPairs();
    this.moves = 0;
    this._step = EStep.FIRST;
    this.boardStatus = EBoardStatus.START;
    setTimeout(
      () => {
        this.cards = this.cards?.map(c => ({ ...c, status: ECardStatus.HIDE }));
        this.boardStatus = EBoardStatus.OPEN;
      },
      START_DELAY_MILLISECONDS
    )
  }

  @action
  cardClick = (card: TCard) => {
    if (
      this.boardStatus !== EBoardStatus.OPEN  // Доска закрыта: старт игры когда показываются чиста или неудачный мув
      || card.status === ECardStatus.OPEN      // Клик по открытой карте
      || card.id === this.checkedCard?.id      // Клик по одной и той же карте
    ) return;
    if (this.step === EStep.FIRST) {
      card.status = ECardStatus.CHECK;
      this.checkedCard = card;
      this.step = EStep.SECOND;
      this.moves++;
    } else {
      if (!this.checkedCard) return;
      if (this.checkedCard.label === card.label) {
        card.status = this.checkedCard.status = ECardStatus.OPEN;
      } else {
        card.status = ECardStatus.CHECK;
        this.boardStatus = EBoardStatus.BLOCK;
        setTimeout(
          () => {
            if (!this.checkedCard) return;
            card.status = this.checkedCard.status = ECardStatus.HIDE;
            this.boardStatus = EBoardStatus.OPEN;
          },
          WRONG_DELAY_MILLISECONDS
        )
      }
      this.step = EStep.FIRST;
    }
  }

  makePrimeNumbersPairs = () => {
    const primes = this.getPrimeNumbers();
    const primesPare = [...primes, ...primes];

    return primesPare.sort(() => Math.random() - 0.5)
      .map((number: number, id: number) => {
        return {
          id,
          label: number,
          status: ECardStatus.CHECK
        };
      });
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
      if (numbers.length >= PRIME_NUMBER_MAX_COUNT) break;
      i++
    }
    return numbers;
  }
}

const app = new App();
export { app };
