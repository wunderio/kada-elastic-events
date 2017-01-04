import * as React from "react";
import * as _ from "lodash";
import {MovieHitsGridItem} from "./HitItems.tsx";

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
  SideBar, TopBar,
  ActionBar, ActionBarRow
} from "searchkit";

import "searchkit/theming/theme.scss";
// Hackish config loading, we need a module or something.
var Config = require('../../kada-config.js');
var SearchServer = Config.elasticSearchServer;
export class KadaSearch extends React.Component<any, any> {
  searchkit:SearchkitManager

  constructor() {
    super()
    // new searchkit Manager connecting to ES server
    const host = SearchServer;
    this.searchkit = new SearchkitManager(host)
  }


  render(){

    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout size="l">

          <TopBar>
          <div className="my-logo">Kada Event calendar</div>
          
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              queryFields={["title_field.original", "field_lead_paragraph_et.original"]}
              />
          </TopBar>

          <LayoutBody>

            <SideBar>
              <RangeFilter
                min={0}
                max={100}
                field="metaScore"
                id="metascore"
                title="Metascore"
              />

              <RefinementListFilter
                id="target_audience"
                title="Target Audience"
                field="field_target_audience"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="writers"
                title="Writers"
                field="writers.raw"
                operator="OR"
                size={10}
              />

              <HierarchicalMenuFilter
                fields={["type.raw", "genres.raw"]}
                title="Categories"
                id="categories"/>



            </SideBar>

      			<LayoutResults>

              <ActionBar>
                <ActionBarRow>

          				<HitsStats/>
          			</ActionBarRow>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>

              <Hits

                itemComponent={MovieHitsGridItem}
                mod="sk-hits-grid"
                hitsPerPage={15}
                highlightFields={["title_field.original"]}/>
              <NoHits suggestionsField="title_field.original"/>
      			</LayoutResults>
          </LayoutBody>

    		</Layout>
      </SearchkitProvider>
	)}

}
