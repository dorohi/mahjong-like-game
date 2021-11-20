import { app, ECardStatus, TCard } from '../../models/App';
import { observer } from 'mobx-react-lite';
import './index.scss';

type Props = {
  model: TCard;
}

const Card = observer((props: Props) => {
  const { model } = props;
  const opacity = model.status === 'hide' ? '0' : '1';
  const classNames = `card${model.status === ECardStatus.CHECK 
    ? ' check' 
    : model.status === ECardStatus.OPEN 
      ? ' open' 
      : ''
  }`;

  const handleClick = () => {
    app.cardClick(model);
  }

  return (
    <div className={classNames} onClick={handleClick}>
      <h3 className={'label'} style={{ opacity }}>{model.label}</h3>
    </div>
  );
});

export default Card;
