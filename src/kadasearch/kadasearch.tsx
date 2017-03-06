import * as React from "react";
import { EventListItem } from "./HitItems";
import Drupal from "../DrupalSettings";
var MultiSelect = require('searchkit-multiselect');

declare var window;

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  ResetFilters,
  GroupedSelectedFilters,
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
  ActionBar, ActionBarRow,
  FilteredQuery,
  TermQuery
} from "searchkit";

import HierarchicalRefinementFilter from './HierarchicalRefinementFilter'
import RefinementWithText from './RefinementWithText'

import "./styles/theme.scss";

const CollapsablePanel = (<Panel collapsable={true} defaultCollapsed={false} />);
const CollapsedPanel = (<Panel collapsable={true} defaultCollapsed={true} />);

let SearchServer = Drupal.settings.elasticServer;
let SearchCalendar = Drupal.settings.currentCalendar;
let SearchLanguage = Drupal.settings.language;
let SearchIndex = SearchCalendar + '_' + SearchLanguage;
let SearchServerURL = SearchServer.replace(/\/$/, '') + '/' + SearchIndex;

export class KadaSearch extends React.Component<any, any> {
  searchkit: SearchkitManager;

  constructor() {
    super();
    // new searchkit Manager connecting to ES server
    const host = SearchServerURL;
    this.searchkit = new SearchkitManager(host, {
      // Disable history for now so text searches don't mess up Drupal with
      // the q parameter in the query string.
      useHistory: false,
    });

    this.searchkit.addDefaultQuery((query)=> {
      return query.addQuery(FilteredQuery({
      }))
    });

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
    if (SearchCalendar == 'hobbies') {
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <Layout size="l">
            <LayoutBody>
              <SideBar>
                <SearchBox
                  autofocus={false}
                  searchOnChange={true}
                  queryFields={[
                    "title_field^8",
                    "field_lead_paragraph_et^5",
                    "field_district^10",
                    "field_address^13"
                  ]}
                  prefixQueryFields={[
                    "title_field^8",
                    "field_lead_paragraph_et^5",
                    "field_district^10",
                    "field_address^13"
                  ]}
                />

                <HierarchicalRefinementFilter
                  id="hobby_types"
                  title={window.Drupal.t("What")}
                  field="field_hobby_category"
                  orderKey="field_hobby_category.level"
                />

                <RefinementListFilter
                  id="district"
                  title={window.Drupal.t("Where")}
                  field="field_district"
                  operator="OR"
                  //containerComponent={CollapsedPanel}
                  listComponent={MultiSelect}
                  size={100}
                />

                <RefinementWithText
                  id="target_audience"
                  title={window.Drupal.t("For whom")}
                  field="field_target_audience"
                  operator="OR"
                  listComponent={ItemHistogramList}
                  description={window.Drupal.t("Select one or many")}
                />

                <HierarchicalRefinementFilter
                  id="field_event_date_hierarchy"
                  title={window.Drupal.t("When")}
                  field="field_event_date_hierarchy"
                  orderKey="field_event_date_hierarchy.order"
                />

                <RefinementListFilter
                  id="hobby_details"
                  title={window.Drupal.t("Fine down search")}
                  field="hobby_details"
                  operator="AND"
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

                <Pagination
                  showNumbers={true}
                  pageScope={2}
                />

                <div className="clearfix">
                  <Hits
                    itemComponent={EventListItem}
                    hitsPerPage={10}
                    highlightFields={[
                      "title_field",
                      "field_lead_paragraph_et",
                    ]}
                    scrollTo={false}
                  />
                </div>

                <NoHits
                  suggestionsField="title_field"
                />

                <Pagination />

              </LayoutResults>
            </LayoutBody>

          </Layout>
        </SearchkitProvider>
      );
    }
    else {
      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <Layout size="l">
            <LayoutBody>
              <SideBar>
                <SearchBox
                  autofocus={false}
                  searchOnChange={true}
                  queryFields={[
                    "title_field^8",
                    "field_lead_paragraph_et^5",
                    "field_address^13"
                  ]}
                  prefixQueryFields={[
                    "title_field^8",
                    "field_lead_paragraph_et^5",
                    "field_address^13"
                  ]}
                />

                <RefinementListFilter
                  id="event_types"
                  title={window.Drupal.t("What")}
                  field="field_event_types"
                  operator="AND"
                  size={5}
                  containerComponent={CollapsedPanel}
                  listComponent={ItemHistogramList}
                />

                <RefinementListFilter
                  id="target_audience"
                  title={window.Drupal.t("For whom")}
                  field="field_target_audience"
                  operator="AND"
                  size={10}
                  containerComponent={CollapsedPanel}
                  listComponent={ItemHistogramList}
                />

                <RefinementListFilter
                  id="district"
                  title={window.Drupal.t("Where")}
                  field="field_district"
                  operator="AND"
                  size={10}
                  containerComponent={CollapsedPanel}
                  listComponent={ItemHistogramList}
                />

                <RefinementListFilter
                  id="field_keywords_et"
                  title={window.Drupal.t("Keywords")}
                  field="field_keywords_et"
                  operator="AND"
                  size={10}
                  containerComponent={CollapsedPanel}
                  listComponent={ItemHistogramList}
                />

                <HierarchicalRefinementFilter
                  id="field_event_date_hierarchy"
                  title={window.Drupal.t("When")}
                  field="field_event_date_hierarchy"
                  orderKey="field_event_date_hierarchy.order"
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

                <Pagination
                  showNumbers={true}
                  pageScope={2}
                />

                <div className="clearfix">
                  <Hits
                    itemComponent={EventListItem}
                    hitsPerPage={10}
                    highlightFields={[
                      "title_field",
                      "field_lead_paragraph_et",
                    ]}
                    scrollTo={false}
                  />
                </div>

                <NoHits
                  suggestionsField="title_field"
                />

                <Pagination />

              </LayoutResults>
            </LayoutBody>

          </Layout>
        </SearchkitProvider>
      );
    }
  }
}
