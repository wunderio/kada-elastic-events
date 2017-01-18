import * as React from "react";
import * as _ from "lodash";
import { EventListItem } from "./HitItems.tsx";
import Drupal from "../DrupalSettings.tsx";

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  ResetFilters,
  SelectedFilters,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  RangeFilter,
  ItemHistogramList,
  TagCloud,
  Layout, LayoutBody, LayoutResults,
  SideBar,
  ActionBar, ActionBarRow
} from "searchkit";

import "./styles/theme.scss";

let SearchServer = Drupal.settings.elasticServer;

export class KadaSearch extends React.Component<any, any> {
  searchkit: SearchkitManager;

  constructor() {
    super();
    // new searchkit Manager connecting to ES server
    const host = SearchServer;
    this.searchkit = new SearchkitManager(host);
  }

  render() {
    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout size="l">
          <LayoutBody>
            <SideBar>
              <SearchBox
                autofocus={false}
                searchOnChange={true}
                queryFields={["title_field.original", "field_lead_paragraph_et.original"]}
              />

              <RefinementListFilter
                id="target_audience"
                title="Target Audience"
                field="field_target_audience.original"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="title"
                title="Title"
                field="title_field.original"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <HierarchicalMenuFilter
                fields={["type.raw", "genres.raw"]}
                title="Categories"
                id="categories"/>

            </SideBar>

            <LayoutResults>

              <ActionBar>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
                <ActionBarRow>
                  <HitsStats/>
                </ActionBarRow>
              </ActionBar>

              <Hits
                itemComponent={EventListItem}
                mod="sk-hits-grid"
                hitsPerPage={15}
                highlightFields={["title_field.original"]}/>

              <NoHits suggestionsField="title_field.original"/>

            </LayoutResults>
          </LayoutBody>

        </Layout>
      </SearchkitProvider>
    );
  }
}
