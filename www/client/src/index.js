import React from 'react';
import ReactDOM from 'react-dom';
import Bets from './components/Bets';
import { Router, Route, browserHistory } from 'react-router';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={Bets}/>
        <Route path="/open" component={Bets}/>
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));