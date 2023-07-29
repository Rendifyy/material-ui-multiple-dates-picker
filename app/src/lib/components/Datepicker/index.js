import React, {useCallback, useEffect, useReducer, useState} from 'react'
import PropTypes from 'prop-types'
import DateUtilities from './utils'
import Calendar from './Calendar'
import {Dialog} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {getListForStartAndEndTs, sortDate} from "./rendifyHelper";
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: 660,
    maxHeight: 660,
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1)}px`,
    }
  }
}))

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
  onCancel,
  onSubmit,
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
  const [timesInternal, setTimesInternal] = useState(times || [])

  const [outterChosenStartTs, setChosenOuterStartTs] = React.useState(null);
  const [outterChosenEndTs, setChosenOuterEndTs] = React.useState(null);

  if (cancelButtonText == null) {
    cancelButtonText = readOnly ? 'Dismiss' : 'Cancel'
  }

  const [{selectedDates, minDate, maxDate}, dispatch] = useReducer(
      reducer,
      outerSelectedDates,
      initState
  )

  const classes = useStyles();

  // When triggered internally in Calendar
  const setOuterStartEndTs = (start, end) => {
    setChosenOuterStartTs(start);
    setChosenOuterEndTs(end);
  };


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

        const isDateInArray = (targetDate, dateArray) => {
          // Convert the targetDate to ISO date format (YYYY-MM-DD) for consistency
          const formattedTargetDate = new Date(targetDate).toISOString().split('T')[0];

          // Loop through the dateArray and check if the formattedTargetDate is present
          for (const date of dateArray) {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            if (formattedDate === formattedTargetDate) {
              return true;
            }
          }

          // If the loop completes without finding the date, return false
          return false;
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

  /*const dismiss = useCallback(
      () => {
        dispatch({type: 'setSelectedDates', payload: []})
        onCancel()
      },
      [dispatch, onCancel]
  )*/

  /*const handleCancel = useCallback(
      e => {
        e.preventDefault()
        dismiss()
      },
      [dismiss]
  )*/

  /*const handleOk = useCallback(
      e => {
        e.preventDefault()
        if (readOnly) {
          return
        }

        const reset = () => {
          setTimeout(() => {
            setNoticeTxt('');
          }, 3000);
        }

        if (selectedDates.length) {
          const lastDayChosen = selectedDates[selectedDates.length - 1].getDay();
          if(vacationDaysByIndex.includes(lastDayChosen)) {
            setNoticeTxt("Lõpp päev on puhkepäeval.");
            return reset();
          }
        }

        if (!disableClock && (!outterChosenStartTs || !outterChosenEndTs)) {
          setNoticeTxt("Kellaajad valimata.");
          return reset();
        }


        // valitud kuupäevadel on kellaeg muidu 00:00. Panen kõigile algusajaks selectedStartTs.
        // ja võrdleme praeguse hetkega. Kui praegune hetk on pärast algusaega, siis on järelikult minevik.
        const withFormattedTime = selectedDates.map((e) => {
          const formattedHours = moment(e).set({
            hour: moment(outterChosenStartTs).get('hour'),
            minute: moment(outterChosenStartTs).get('minute'),
          })
          return formattedHours;
        });

        if (withFormattedTime.find(e => moment().isAfter(moment(e)))) {
          setNoticeTxt("Kuupäev on minevikus.");
          return reset();
        }

        /!* validation 1 *!/
        if (chooseMulti && (selectedDates.length === 0 || selectedDates.length
            === 1)) {
          setNoticeTxt("Rentija minimaalne rendi aeg on 1 ööpäev.");
          return reset();
        }

        /!* validation 2 *!/
        if (!disableClock && (!outterChosenStartTs || !outterChosenEndTs)) {
          setNoticeTxt("Vali ka rendi algus ja lõpp kellaajad.");
          return reset();
        }

        /!* validation 3 *!/
        if (chooseMulti === false) {
          if (selectedDates.length > 1) {
            setNoticeTxt("Vali ainult üks päev");
            return reset();
          }

          if (moment(outterChosenEndTs).isBefore(outterChosenStartTs)) {
            setNoticeTxt("Alguse kellaaeg on hiljem kui lõpu.");
            return reset();
          }
        }

        if (!disableClock) {
          /!* validation 4 *!/
          const sortedDates = sortDate(selectedDates); // järjekorda ja vaatame et päevade vahel ei oleks tühjust.
          let triggered = false;

          sortedDates.forEach((sd, i) => {
            if (triggered) {
              return;
            }

            const chosen = sd;
            const nextChosen = sortedDates[i + 1];
            const duration = moment.duration(
                moment(nextChosen).diff(moment(chosen)));

            if (nextChosen && duration.asDays() > 1) {
              triggered = true;
              setNoticeTxt("Päevade vahel ei tohi olla tühja päeva.");
              return reset();
            }
          });

          if (triggered) {
            return;
          }
        }

        onSubmit({selectedDates, outterChosenStartTs, outterChosenEndTs})
      },
      [onSubmit, selectedDates, readOnly, outterChosenEndTs,
        outterChosenStartTs, chooseMulti, chooseMulti]
  )*/

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
          times={timesInternal}
          selectedStartTs={selectedStartTs}
          selectedEndTs={selectedEndTs}
          vacationDaysByIndex={vacationDaysByIndex}
          setOuterStartEndTs={setOuterStartEndTs}
      />
  )
}

DatePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  selectedDates: PropTypes.array,
  selectedDatesTitle: PropTypes.string,
  disabledDatesTitle: PropTypes.string,
  halfDisabledDates: PropTypes.array,
  chooseMulti: PropTypes.bool,
  selectedStartTs: PropTypes.string,
  selectedEndTs: PropTypes.string,
  bgColor: PropTypes.string
}

export default DatePicker
