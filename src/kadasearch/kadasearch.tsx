import * as React from "react";
import { EventListItem } from "./HitItems.tsx";
import Drupal from "../DrupalSettings.tsx";

declare var window;

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  ResetFilters,
  GroupedSelectedFilters,
  HierarchicalRefinementFilter,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  Pagination,
  RangeFilter,
  ItemHistogramList,
  Layout, LayoutBody, LayoutResults,
  SideBar,
  Panel,
  ActionBar, ActionBarRow
} from "searchkit";

import "./styles/theme.scss";

const CollapsablePanel = (<Panel collapsable={true} defaultCollapsed={false} />);
const CollapsedPanel = (<Panel collapsable={true} defaultCollapsed={true} />);

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

              <HierarchicalRefinementFilter
                id="field_event_date"
                title={window.Drupal.t("Event date")}
                field="field_event_date"
                orderKey="field_event_date.order"
              />

              <RefinementListFilter
                id="target_audience"
                title={window.Drupal.t("Target audience")}
                field="field_target_audience.original"
                operator="AND"
                size={10}
                containerComponent={CollapsablePanel}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="event_types"
                title={window.Drupal.t("Event types")}
                field="field_event_types.original"
                operator="AND"
                size={5}
                containerComponent={CollapsedPanel}
                listComponent={ItemHistogramList}
              />
            </SideBar>

            <LayoutResults>

              <ActionBar>
                <ActionBarRow>
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
                <ActionBarRow>
                  <HitsStats/>
                </ActionBarRow>
              </ActionBar>

              <Pagination showNumbers={true}/>

              <div className="clearfix">
                <Hits
                  itemComponent={EventListItem}
                  hitsPerPage={10}
                  highlightFields={["title_field.original"]}
                  scrollTo={false}
                />
              </div>

              <NoHits suggestionsField="title_field.original"/>

              <Pagination showNumbers={true}/>

            </LayoutResults>
          </LayoutBody>

        </Layout>
      </SearchkitProvider>
    );
  }
}
