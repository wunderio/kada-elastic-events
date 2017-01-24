import * as React from "react";
let DatePicker = require('react-datepicker');
import * as moment from 'moment'

import {
  SearchkitComponent,
  SearchkitComponentProps,
  RenderComponentType,
  RangeAccessor,
  RangeProps,
  FieldOptions,
  renderComponent
} from 'searchkit';

import 'react-datepicker/dist/react-datepicker.css'

export interface DateRangeFilterProps extends SearchkitComponentProps {
  field:string
  min:number
  max:number
  id:string
  title:string
  interval?:number
  showHistogram?:boolean
  containerComponent?: RenderComponentType<any>
  rangeComponent?: RenderComponentType<RangeProps>
  rangeFormatter?:(count:number)=> number | string
  marks?:Object
  fieldOptions?:FieldOptions
  onFinished?:(range:{min: number, max: number}) => void
}

class DateRangeFilter extends SearchkitComponent<any, any> {
  accessor: RangeAccessor

  constructor (props) {
    super(props)
    this.state = {
      startDate: null,
      endDate: null
    }
  }

  defineAccessor() {
    const {field, id, title, orderKey, orderDirection, startLevel} = this.props
    return new RangeAccessor(id, {
      field, id, title
    })
  }

  addFilter(level, option) {
    this.accessor.state = this.accessor.state
    this.searchkit.performSearch()
  }

  handleChangeStart = (event) => {
    this.accessor.state = _.extend(this.accessor.state, {
      startDate: event
    });
    this.updateSearch();
  }

  handleChangeEnd = (event) => {
    this.setState({
      endDate: event && event.endOf('day')
    }, this.updateSearch)
  }

  updateSearch = () => {
    const { startDate, endDate } = this.state
    const { onFinished } = this.props

    if (!startDate || !endDate) {
      return
    }

    onFinished({
      min: startDate.format('x'),
      max: endDate.format('x')
    })
  }

  isBeforeStartDate = (date) => {
    if (!this.state.startDate) {
      return true
    }

    return this.state.startDate <= date
  }

  isAfterEndDate = (date) => {
    if (!this.state.endDate) {
      return true
    }

    return date <= this.state.endDate
  }

  remove () {
    this.setState({
      startDate: null,
      endDate: null
    }, this.updateSearch)
  }

  render () {
    const { id, title, containerComponent } = this.props

    return renderComponent((<div />), {
      title,
      className: id ? `filter--${id}` : undefined
    }, (
      <div className="date-filter">
        <DatePicker
          className="sk-input-filter"
          placeholderText="Select start date"
          isClearable={true}
          filterDate={this.isAfterEndDate}
          selectsStart
          selected={this.state.startDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeStart} />
        <DatePicker
          className="sk-input-filter"
          placeholderText="Select end date"
          isClearable={true}
          filterDate={this.isBeforeStartDate}
          selectsEnd
          selected={this.state.endDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd} />
      </div>
    ))
  }
}

export default DateRangeFilter