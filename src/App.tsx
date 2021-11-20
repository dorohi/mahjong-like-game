import * as React from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';
import { app } from './models/App';
import Board from './components/Board';
import { configure } from 'mobx';
import Footer from './components/Footer';

configure({
  enforceActions: 'never',
});

const App = observer(() => {
  React.useEffect(
    () => {
      app.initNewGame();
    },
    []
  );

  return (
    <div className={'game'}>
      <h1 className={'header'}>Mahjong-like game</h1>
      {app.cards && <Board/> }
      <Footer />
    </div>
  );
})

export default App;
