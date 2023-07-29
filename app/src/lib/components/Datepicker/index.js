import React, {useCallback, useEffect, useReducer} from 'react'
import Calendar from './Calendar'

function initState(selectedDates) {
  return {
    selectedDates: selectedDates ? [...selectedDates] : [],
    minDate: null,
    maxDate: null
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'setSelectedDates':
      return {...state, selectedDates: action.payload}
    default:
      return new Error('wrong action type in multiple date picker reducer')
  }
}

function computeDatesInRange(startDate, endDate) {
  // Helper function to compute dates between two given dates (inclusive)
  const datesInRange = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    datesInRange.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return datesInRange;
}

const DatePicker = ({
  open,
  readOnly,
  onChange,
  selectedDates: outerSelectedDates,
  disabledDates,
  cancelButtonText,
  submitButtonText = 'Submit',
  selectedDatesTitle = 'Selected Dates',
  disabledDatesTitle,
  times,
  halfDisabledDates,
  chooseMulti,
  bgColor,
  selectedStartTs,
  selectedEndTs,
  vacationDaysByIndex,
}) => {
  // Tekitame aegadest topelt halduse - Komponenti antakse kasutaja puhke kellaajad
  // Kui aga valitud päev on halfDisabledDate - siis näitame algus kella hoopis selle järgi

  if (cancelButtonText == null) {
    cancelButtonText = readOnly ? 'Dismiss' : 'Cancel'
  }

  const [{selectedDates, minDate, maxDate}, dispatch] = useReducer(
      reducer,
      outerSelectedDates,
      initState
  )

  const onSelect = useCallback(
      day => {
        if (readOnly) {
          return
        }

        let selectedDatesPayload = []

        /* A) First date is chosen - choose the date */
        /* B) Second date is chosen - Compute all the dates from A - B (include in between) - This logic only applies when second date is bigger than first selected. */
        /* C) Second date is chosen - fallback TO (A) - reset dates , and choose it as only date */
        /* D) Third date is chosen - Fallback to (B) - compute dates in between */
        /* F) Third date is chosen - Is same as last date currently chosen - do nothing */

        const findLatestDay = (dates) => {
          // Find the maximum date in the array
          const latestDate = new Date(Math.max.apply(null, dates));
          return latestDate;
        }

        if (selectedDates.length === 0) {
          // A) First date is chosen - choose the date
          selectedDatesPayload = [day]; // start listing
        } else if (selectedDates.length >= 1 && day.getTime()
            > selectedDates[0].getTime()) {
          // B) Second date is chosen - Compute all dates from A to B (inclusive)
          const datesInRange = computeDatesInRange(selectedDates[0], day);
          selectedDatesPayload = datesInRange;
        } else if (day.getTime() < selectedDates[0].getTime()) {
          // C) Second date is chosen - fallback to A - reset dates and choose it as the only date
          selectedDatesPayload = [day]; // resets
        } else if (day.getTime() === findLatestDay(selectedDates).getTime()) {
          // same day is chosen;
          return;
        }

        dispatch({type: 'setSelectedDates', payload: selectedDatesPayload})
        onChange(
            [selectedDatesPayload[0], findLatestDay(selectedDatesPayload)]);
      },
      [selectedDates, dispatch, readOnly, halfDisabledDates, times]
  )

  const onRemoveAtIndex = useCallback(
      index => {
        if (readOnly) {
          return
        }
        const newDates = [...selectedDates]
        if (index > -1) {
          newDates.splice(index, 1)
        }

        dispatch({type: 'setSelectedDates', payload: newDates})
      },
      [selectedDates, dispatch, readOnly]
  )

  useEffect(
      () => {
        if (open) {
          dispatch({
            type: 'setSelectedDates',
            payload: outerSelectedDates != null ? outerSelectedDates : []
          })
        }
      },
      [open, outerSelectedDates]
  )

  return (
      <Calendar
          bgColor={bgColor}
          selectedDates={selectedDates}
          disabledDates={disabledDates}
          disabledDatesTitle={disabledDatesTitle}
          onSelect={onSelect}
          onRemoveAtIndex={onRemoveAtIndex}
          minDate={minDate}
          maxDate={maxDate}
          readOnly={readOnly}
          cancelButtonText={cancelButtonText}
          submitButtonText={submitButtonText}
          selectedDatesTitle={selectedDatesTitle}
          selectedStartTs={selectedStartTs}
          selectedEndTs={selectedEndTs}
          vacationDaysByIndex={vacationDaysByIndex}
      />
  )
}

export default DatePicker
