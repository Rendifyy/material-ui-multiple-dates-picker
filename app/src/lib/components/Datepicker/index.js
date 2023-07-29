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
  disableClock,
  times,
  halfDisabledDates,
  chooseMulti,
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

        if (DateUtilities.dateIn(selectedDates, day)) {
          selectedDatesPayload = selectedDates.filter(
              date => !DateUtilities.isSameDay(date, day));

          dispatch({
            type: 'setSelectedDates',
            payload: selectedDatesPayload
          })
        } else {
          selectedDatesPayload = [...selectedDates, day];

          dispatch({type: 'setSelectedDates', payload: selectedDatesPayload})
        }

        /*// RENDIFY LOGIC BEGIN
        // On toote kella ajad ning on ka renditud päevad
        if (times && halfDisabledDates) {
          const anyHalfRentDay = halfDisabledDates.find(
              half => selectedDatesPayload.find(
                  (sel => DateUtilities.isSameDay(sel, half))));
          if (anyHalfRentDay) {
            let startTs, endTs;
            // for Date.prototype And Moment jS
            try {
              //startTs = moment().set('hours', anyHalfRentDay.getHours() + 1).set('minutes', 0)
              startTs = anyHalfRentDay // + 1 on ajabuhver peale renditagastust.
            } catch (e) {
              //startTs = moment().set('hours', anyHalfRentDay.hour() + 1).set('minutes', 0)
              startTs = anyHalfRentDay // + 1 on ajabuhver peale renditagastust.
            }

            try {
              endTs = times[times.length - 1];
            } catch (e) {
              endTs = times[times.length - 1];
            }

            // Arvutame uue alguse kuupäev rendi päeva pealt.
            setTimesInternal(getListForStartAndEndTs(startTs, endTs));
          } else {
            setTimesInternal(times)
          }
        } else {
          return; // Pole bronnitud päevi ja kuupäevad on juba on init paika pandud.
        }*/

        onChange(selectedDatesPayload);
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
            selectedDates={selectedDates}
            disabledDates={disabledDates}
            disabledDatesTitle={disabledDatesTitle}
            onSelect={onSelect}
            onRemoveAtIndex={onRemoveAtIndex}
            minDate={minDate}
            maxDate={maxDate}
            readOnly={readOnly}
            disableClock={disableClock}
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
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedDates: PropTypes.array,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  selectedDatesTitle: PropTypes.string,
  disabledDatesTitle: PropTypes.string,
  disableClock: PropTypes.bool,
  halfDisabledDates: PropTypes.array,
  times: PropTypes.array,
  chooseMulti: PropTypes.bool,
  selectedStartTs: PropTypes.string,
  selectedEndTs: PropTypes.string
}

export default DatePicker
