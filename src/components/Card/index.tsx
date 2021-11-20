import { app, TCard } from '../../models/App';
import { observer } from 'mobx-react-lite';
import './index.css';

type Props = {
  model: TCard;
}

const Card = observer((props: Props) => {
  const { model } = props;
  const visibility = model.status === 'hide' ? 'hidden' : 'visible';
  const classNames = `card ${model.status === 'check' ? 'check' : model.status === 'open' ? 'open' : undefined}`;

  const handleClick = () => {
    app.cardClick(model);
  }

  return (
    <div className={classNames} onClick={handleClick}>
      <h3 className={'label'} style={{ visibility }}>{model.label}</h3>
    </div>
  );
});

export default Card;
