import * as React from "react";
import * as moment from "moment";
import { EventListItem } from "./HitItems";
import Drupal from "../DrupalSettings";

import "./styles.css";

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
  ItemHistogramList,
  Layout, LayoutBody, LayoutResults,
  SideBar,
  Panel,
  ActionBar, ActionBarRow,
  QueryString,
  TermQuery,
  FilteredQuery,
  BoolShould
} from "searchkit";

import HierarchicalRefinementFilter from './HierarchicalRefinementFilter'
import RefinementWithText from './RefinementWithText'
import { DateRangeFilter } from './DateRangeFilter'
import { DateRangeCalendar } from './DateRangeCalendar'
import { DateRangeQuery } from "./query/DateRangeQuery";

// import "./styles/theme.scss";

const CollapsablePanel = (<Panel collapsable={true} defaultCollapsed={false} />);
const CollapsedPanel = (<Panel collapsable={true} defaultCollapsed={true} />);

// @todo: some of the fields containing searcheable data are deactivated for
// now, so the client can test what works best for them. When this is
// considered stable, it will make sense to remove the fields entirely from the
// search options.
const hobbiesQueryFields = [
  "field_keywords_et.raw^13",
  "field_keywords_et.stemmed^11",
  "field_keywords_et.autocomplete",
  "title_field^10",
  "title_field.autocomplete^2",
  // "field_district^8",
  // "field_lead_paragraph_et^3",
  // "field_address.raw^4",
  // "field_address.standard^3",
  // "field_address.autocomplete",
]
const eventsQueryFields = [
  "field_keywords_et.raw^13",
  "field_keywords_et.stemmed^11",
  "field_keywords_et.autocomplete",
  "title_field^10",
  "title_field.autocomplete^2",
  // "field_district^8",
  // "field_event_types.raw^6",
  // "field_event_types.stemmed^5",
  // "field_lead_paragraph_et^3",
  // "field_address.raw^4",
  // "field_address.standard^3",
  // "field_address.autocomplete",
]

// Available query options:
// https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-query-string-query.html

const queryOptions = {
  fuzziness: 0,
  phrase_slop: 2,
  default_operator: 'AND',
}

let SearchServer = Drupal.settings.elasticServer;
let SearchCalendar = 'hobbies';
let SearchLanguage = Drupal.settings.language;
let SearchIndex = SearchCalendar + '_' + SearchLanguage;
let SearchServerURL = SearchServer.replace(/\/$/, '') + '/' + SearchIndex;



export class KadaSearch extends React.Component<any, any> {
  searchkit: SearchkitManager;

  constructor(props) {
    super(props);
    // new searchkit Manager connecting to ES server
    this.searchkit = new SearchkitManager(SearchServerURL, {
      useHistory: true,
    });
    
    // Attach translations to Drupal
    this.searchkit.translateFunction = (key) => {
      const translations = {
        "searchbox.placeholder": "Search",
        "pagination.previous": "Previous",
        "pagination.next": "Next",
        "reset.clear_all": "Clear all filters",
        "facets.view_more": "View more",
        "facets.view_less": "View less",
        "facets.view_all": "View all",
        "NoHits.NoResultsFound": "No results found for {query}",
        "NoHits.DidYouMean": "Search for {suggestion}.",
        "NoHits.SearchWithoutFilters": "Search for {query} without filters",
        "NoHits.NoResultsFoundDidYouMean": "No results found for {query}. Did you mean {suggestion}?",
        "hitstats.results_found": "{hitCount} results found in {timeTaken} ms",
      };
      return translations[key];
    };
      
  }

  render() {
    if (SearchCalendar == 'hobbies') {

      // collapse multi events
      this.searchkit.setQueryProcessor((plainQueryObject)=>{
        plainQueryObject.collapse = {
          "field" : "super_id",
          "inner_hits": {
            "name": "latest", 
            "size": 1,
            "sort": [{ "field_event_date_from_millis": "asc" }] 
          } 
        };

        // count hits after collapsing
        plainQueryObject.aggs["total_hits"] = {
          "cardinality" : {
            "field" : "super_id",
          }
        };

        // exclude unneccasary fields
        plainQueryObject["_source"] = {
          "includes": [
            "title_field",
          ]
        }
     
        return plainQueryObject;
      });

      return (
        <SearchkitProvider searchkit={this.searchkit}>
          <Layout size="l">
            <LayoutBody>
              <SideBar>
                <SearchBox
                  autofocus={false}
                  searchOnChange={true}
                  queryFields={hobbiesQueryFields}
                  prefixQueryFields={hobbiesQueryFields}
                  queryBuilder={QueryString}
                  queryOptions={queryOptions}
                  id='keyword'
                />

                <RefinementWithText
                  id="target_audience"
                  title={window.Drupal.t("For whom")}
                  field="field_target_audience"
                  operator="OR"
                  listComponent={ItemHistogramList}
                  description={window.Drupal.t("Select one or many")}
                />

                <Panel
                  collapsable={true}
                  defaultCollapsed={true}
                  title={window.Drupal.t("When")}>

                  <HierarchicalRefinementFilter
                    id="weekday"
                    title={window.Drupal.t("Weekday")}
                    field="field_event_date_weekday"
                    orderKey="field_event_date_weekday.order"
                  />

                  <HierarchicalRefinementFilter
                    id="timeofday"
                    title={window.Drupal.t("Time of day")}
                    field="field_event_date_timeofday"
                    orderKey="field_event_date_timeofday.order"
                  />

                  <DateRangeFilter
                    id="field_event_date"
                    title={window.Drupal.t("Dates")}
                    fromDateField="field_event_date.from"
                    toDateField="field_event_date.to"
                    calendarComponent={DateRangeCalendar}
                    fieldOptions={{
                      type: 'nested',
                      options: {
                        path: 'field_event_date'
                      }
                    }}
                    rangeFormatter={(v) => moment(parseInt(""+v)).format('D.M.YYYY')}
                  />
                </Panel>

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
                    scrollTo=".sk-layout"
                  />
                </div>

                <NoHits
                  suggestionsField="title_field"
                />

                <Pagination
                  showNumbers={true}
                  pageScope={2}
                />

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
                  queryFields={eventsQueryFields}
                  prefixQueryFields={eventsQueryFields}
                  queryBuilder={QueryString}
                  id='keyword'
                  queryOptions={queryOptions}             
                />

                <DateRangeFilter
                  id="field_event_date"
                  title={window.Drupal.t("When")}
                  fromDateField="field_event_date.from"
                  toDateField="field_event_date.to"
                  calendarComponent={DateRangeCalendar}
                  containerComponent={CollapsedPanel}
                  fieldOptions={{
                    type: 'nested',
                    options: {
                      path: 'field_event_date'
                    }
                  }}
                  rangeFormatter={(v) => moment(parseInt(""+v)).format('D.M.YYYY')}
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

                <RefinementWithText
                  id="target_audience"
                  title={window.Drupal.t("For whom")}
                  field="field_target_audience"
                  operator="OR"
                  listComponent={ItemHistogramList}
                  description={window.Drupal.t("Select one or many")}
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
                    scrollTo=".sk-layout"
                  />
                </div>

                <NoHits
                  suggestionsField="title_field"
                />

                <Pagination
                  showNumbers={true}
                  pageScope={2}
                />

              </LayoutResults>
            </LayoutBody>

          </Layout>
        </SearchkitProvider>
      );
    }
  }
}

export default KadaSearch