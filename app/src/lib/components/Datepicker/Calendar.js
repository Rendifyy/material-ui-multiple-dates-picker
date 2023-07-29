import React, {useCallback, useEffect, useRef, useState} from 'react'
import WeekHeader from './WeekHeader'
import Month from './Month'
import {defaultUtils as utils} from './dateUtils'
import CalendarToolbar from './CalendarToolbar'
import CalendarButtons from './CalendarButtons'
import DateDisplay from './DateDisplay'
import {makeStyles} from '@material-ui/core'
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import moment from "moment";
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1',
    display: 'flex',
    maxHeight: '100%',
  },
  selectorContainer: {
    // marginTop: theme.spacing(2)
    // boxShadow: 'inset 0 0 10px #000000'
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  calendarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: `0 ${theme.spacing(2)}px`
  },
  infoContainer: {
    background: 'rgb(232, 244, 253)',
    padding: '5px',
    margin: '5px',
    color: 'rgb(13, 60, 97)',
    borderRadius: '4px',
    border: '1px solid rgb(194 226 239)'
  },
  infoIcon: {
    color: '#2196f3',
    fontSize: '14px'
  },
  infoTxt: {
    fontSize: '16px'
  }
}))

const Calendar = ({
                    initialDate,
                    maxDate,
                    minDate,
                    selectedDates,
                    disabledDates,
                    onSelect,
  bgColor,
  vacationDaysByIndex,
                    readOnly,
                    onRemoveAtIndex,
                    selectedDatesTitle,
                    disabledDatesTitle,
                    times,
                    setOuterStartEndTs,
                    selectedStartTs,
                    selectedEndTs
                  }) => {
  const [chosenStartTs, setChosenStartTs] = React.useState(selectedStartTs);
  const [chosenEndTs, setChosenEndTs] = React.useState(selectedEndTs);

  useEffect(() => {
    if(times.indexOf(selectedEndTs) !== -1) {
      setChosenEndTs(times.indexOf(selectedEndTs))
    }

    if(times.indexOf(selectedStartTs) !== -1) {
      setChosenStartTs(times.indexOf(selectedStartTs))
    }
  }, []);

  const calendar = useRef(null)
  const classes = useStyles();

  const [displayDate, setDisplayDate] = useState(() =>
    utils.getFirstDayOfMonth(initialDate || new Date())
  )

  const handleMonthChange = useCallback(
    months => {
      setDisplayDate(displayDate => utils.addMonths(displayDate, months))
    },
    [setDisplayDate]
  )

  useEffect(
    () => {
      setDisplayDate(utils.getFirstDayOfMonth(initialDate || new Date()))
    },
    [initialDate]
  )

  useEffect(() => {
    setOuterStartEndTs(times[chosenStartTs], times[chosenEndTs]);
  }, [chosenEndTs, chosenStartTs, setOuterStartEndTs, times])

  maxDate = maxDate || utils.addYears(new Date(), 100)
  minDate = minDate || utils.addYears(new Date(), -100)

  const toolbarInteractions = {
    prevMonth: utils.monthDiff(displayDate, minDate) > 0,
    nextMonth: utils.monthDiff(displayDate, maxDate) < 0
  }

  return (
    <div className={classes.root}>
      <div className={classes.selectorContainer}>
        <div className={classes.calendarContainer}>
          <CalendarToolbar
            displayDate={displayDate}
            onMonthChange={handleMonthChange}
            prevMonth={toolbarInteractions.prevMonth}
            nextMonth={toolbarInteractions.nextMonth}
          />
          <WeekHeader/>
          <Month
            displayDate={displayDate}
            key={displayDate.toDateString()}
            vacationDaysByIndex={vacationDaysByIndex}
            selectedDates={selectedDates}
            disabledDates={disabledDates}
            minDate={minDate}
            maxDate={maxDate}
            onSelect={onSelect}
            readOnly={readOnly}
            ref={calendar}
          />
        </div>
      </div>
      <DateDisplay
        bgColor={bgColor}
        vacationDaysByIndex={vacationDaysByIndex}
        selectedDatesTitle={selectedDatesTitle}
        disabledDatesTitle={disabledDatesTitle}
        selectedDates={selectedDates}
        readOnly={readOnly}
        disabledDates={disabledDates || []}
        onRemoveAtIndex={onRemoveAtIndex}
      />
    </div>
  )
}

export default Calendar
