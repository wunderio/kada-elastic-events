import * as _ from "lodash";
import * as React from "react";
import Drupal from "../DrupalSettings.tsx";

declare var window;

const EventGridItem = (props) => {
  const {bemBlocks, result} = props;
  let url = "http://www.imdb.com/title/" + result._source.imdbId;
  const source: any = _.extend({}, result._source, result.highlight);
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.field_content_image_et_url} width="170" height="240"/>
        <div data-qa="title_field.original" className={bemBlocks.item("title_field.original")} dangerouslySetInnerHTML={{__html:source.title_field.original}}>
        </div>
      </a>
    </div>
  );
};

const EventListItem = (props) => {
  const {bemBlocks, result} = props;
  const source: any = _.extend({}, result._source, result.highlight);
  let image = (source.field_content_image_et_url) ? (
    <div className="event__image__wrapper">
      <img src={source.field_content_image_et_url} width="231" height="231" alt="" />
    </div>
  ) : null;
  let title = (source.title_field) ? source.title_field.original : null;
  let leading = (source.field_lead_paragraph_et) ? source.field_lead_paragraph_et.original : null;
  let isRenderable = (title !== null);
  return (isRenderable) ? (
    <div className="event event--list">
      {image}
      <div className="event__content__wrapper">
        <h2 className="event__title">
          <a href="/#" dangerouslySetInnerHTML={{__html:title}}></a>
        </h2>
        <div className="event__leading" dangerouslySetInnerHTML={{__html:leading}}></div>
      </div>
    </div>
  )
  :
  (
    <div className="event event--list">
      <i>{ window.Drupal.t("We were unable to display event id @id. Sorry!", { "@id": result._id }) }</i>
    </div>
  );
};

export { EventGridItem, EventListItem }
