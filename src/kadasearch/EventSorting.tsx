import * as React from "react"
import * as moment from "moment"
import { extend } from "lodash"

export const createEventSortQuery = (datefilter:moment.Moment = moment()) => {
  var formattedQueryDate = datefilter.format('x')
  var dateFilterOn = datefilter ? true : false
  var now = dateFilterOn ? parseInt(formattedQueryDate) : Date.now()
  return {
    "_script": {
      "script": {
        "lang": "groovy",
        "file": "weightedEventSort",
        "params": {
          "queryNow": now,
          "dateFilterOn": dateFilterOn
        },
      },
      "type": "number",
      "order": "desc"
    }
  }
}
