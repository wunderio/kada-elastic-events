import * as ReactDOM from "react-dom";
import * as React from "react";
import {App} from "./app/src/App.tsx";
import {TaxonomyApp} from "./app/src/TaxonomyApp.tsx";
import {CrimeApp} from "./app/src/crime/CrimeApp.tsx";
import {KadaSearch} from "./kadasearch/kadasearch.tsx";
import {ListApp} from "./app/src/list-app/ListApp.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={KadaSearch} path="/"/>
    <Route component={KadaSearch} path="kadasearch"/>
    <Route component={App} path="imdb"/>
  </Router>
), document.getElementById('root'));
