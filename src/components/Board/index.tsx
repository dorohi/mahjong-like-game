import { app, TCard } from '../../models/App';
import Card from '../Card';
import './index.css';

const Board = () => {
  return (
    <div className={'board'}>
      {app.cards?.map((card: TCard, inx: number) => <Card model={card} key={inx} />)}
    </div>
  );
};

export default Board;
