import * as React from "react"
import * as moment from "moment"
import { extend } from "lodash"

export const createEventSortQuery = (datefilter) => {
  var dateFilterOn = datefilter ? true : false
  var now = Date.now()
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
      "order": "asc"
    }
  }
}
