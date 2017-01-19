import * as React from "react";
import * as _ from "lodash";
import { EventListItem } from "./HitItems.tsx";
import Drupal from "../DrupalSettings.tsx";

declare var window;

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

    // Attach translations to Drupal
    this.searchkit.translateFunction = (key) => {
      let translations = {
        "searchbox.placeholder": window.Drupal.t("Search"),
        "pagination.previous": window.Drupal.t("Previous"),
        "pagination.next": window.Drupal.t("Next"),
        "reset.clear_all": window.Drupal.t("Clear all filters"),
        "facets.view_more": window.Drupal.t("View more"),
        "facets.view_less": window.Drupal.t("View less"),
        "facets.view_all": window.Drupal.t("View all"),
        "NoHits.NoResultsFound": window.Drupal.t("No results found for {query}"),
        "NoHits.DidYouMean": window.Drupal.t("Search for {suggestion}."),
        "NoHits.SearchWithoutFilters": window.Drupal.t("Search for {query} without filters"),
        "NoHits.NoResultsFoundDidYouMean": window.Drupal.t("No results found for {query}. Did you mean {suggestion}?"),
        "hitstats.results_found": window.Drupal.t("{hitCount} results found in {timeTaken} ms"),
      };
      return translations[key];
    };
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
                title={window.Drupal.t("Target audience")}
                field="field_target_audience.original"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="title"
                title={window.Drupal.t("Title")}
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
