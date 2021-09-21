import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/GlobalOverride.scss';

import HomePage from 'views/HomePage';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/:filterCode" component={HomePage} />
      <Route exact path="/" component={HomePage} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default App;
