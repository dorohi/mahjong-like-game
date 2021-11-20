import { app, TCard } from '../../models/App';
import Card from '../Card';
import './index.css';
import { observer } from 'mobx-react-lite';

const Board = observer(() => (
  <div className={'board'}>
    {app.cards?.map((card: TCard, inx: number) => <Card model={card} key={inx} />)}
  </div>
));

export default Board;
