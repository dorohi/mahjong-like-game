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
  moves: number = 0;

  private checkedCard?: TCard;
  private _step: EStep = EStep.FIRST;

  constructor() {
    makeObservable(this);
  }

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

  private makePrimeNumbersPairs = () => {
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

  private getPrimeNumbers = () => {
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

  @action
  cardClick = (card: TCard) => {
    if (
      this.boardStatus !== EBoardStatus.OPEN   // ?????????? ??????????????: ?????????? ???????? ?????????? ???????????????????????? ?????????? ?????? ?????????????????? ??????
      || card.status === ECardStatus.OPEN      // ???????? ???? ???????????????? ??????????
      || card.id === this.checkedCard?.id      // ???????? ???? ?????????? ?? ?????? ???? ??????????
    ) return;
    if (this._step === EStep.FIRST) {
      card.status = ECardStatus.CHECK;
      this.checkedCard = card;
      this._step = EStep.SECOND;
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
      this._step = EStep.FIRST;
    }
  }
}

const app = new App();
export { app };
