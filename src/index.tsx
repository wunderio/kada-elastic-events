import * as React from "react";
import * as ReactDOM from "react-dom";
import { KadaSearch } from "./kadasearch/kadasearch";
import DrupalSettings from "./DrupalSettings";
import { BrowserRouter } from 'react-router-dom'
import { HitsScrollingPatch } from "./kadasearch/HitsScrollingPatch";

let rootElemId = "kada-event-search";

if (DrupalSettings.settings.noDrupal) {
  rootElemId = "root";
}

HitsScrollingPatch()

ReactDOM.render((
  <BrowserRouter>
    <KadaSearch />
  </BrowserRouter>
), document.getElementById(rootElemId));
