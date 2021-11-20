import './index.css';
import { app, EBoardStatus } from '../../models/App';
import { observer } from 'mobx-react-lite';

const Footer = observer(() => {
  return (
    <div className={'footer flexbox'}>
      {app.boardStatus !== EBoardStatus.START &&
        <button className={'restart'} onClick={app.initNewGame}>
          Restart
        </button>
      }
      <span>Moves: {app.moves}</span>
    </div>
  );
});

export default Footer;
