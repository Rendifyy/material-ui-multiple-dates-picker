import React, {useCallback, useState} from 'react'
import {makeStyles} from '@material-ui/styles'
import {Button, Typography} from '@material-ui/core'
import MultipleDatePicker from './lib'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginBottom: theme.spacing(3)
  }
}))

const Demo = props => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [dates, setDates] = useState([])
  const [startTs, setStartTs] = useState(null)
  const [endTs, setEndTs] = useState(null)

  const [selectedStartTs, setSelectedStartTs] = useState(100)
  const [selectedEndTs, setSelectedEndTs] = useState(100)

  const toggleOpen = useCallback(() => setOpen(o => !o), [setOpen])
  const onCancel = useCallback(() => setOpen(false), [setOpen])
  const onSubmit = useCallback(
    ({selectedDates, outterChosenStartTs, outterChosenEndTs}) => {
      setDates(selectedDates)
      setStartTs(outterChosenStartTs)
      setSelectedEndTs(outterChosenEndTs)
      setSelectedStartTs(outterChosenStartTs)
      setEndTs(outterChosenEndTs)
      setOpen(false)
    },
    [setDates, setStartTs]
  )

  // -- 3 tüüpi kuupäevad
  // Ei saa päevi vahele jätta. <-- implement in rendify frontend

  const ms = 86400000;
  const later = new Date().getTime() + ms;
  const later2 = new Date().getTime() + ms + ms;
  const later3 = new Date().getTime() + ms + ms + ms;
  const earlier = new Date().getTime() + 82200000;
  const tomorrowLater = new Date(later);
  const tomorrowLater2 = new Date(later2);
  const tomorrowLater3 = new Date(later3);
  const tomorrowEarly = new Date(earlier);

  return (
    <div className={classes.root} style={{background: '#c1e8d780'}}>
      <Button variant='contained' color='primary' className={classes.button} onClick={toggleOpen}>
        Select Dates
      </Button>
      <MultipleDatePicker
        open={open}
        selectedDates={dates}
        bgColor={'#c1e8d780'}
        onCancel={onCancel}
        selectedDatesTitle={"Valitud rendipäevad"}
        disabledDatesTitle={"Broneeritud päevad"}
        onSubmit={onSubmit}
        chooseMulti={false}
        onChange={(days) => {
        }}
        selectedStartTs={selectedStartTs}
        disabledDates={[tomorrowLater3]}
        selectedEndTs={selectedEndTs}
        halfDisabledDates={[tomorrowEarly]}
        vacationDaysByIndex={[5,6]}
        times={[new Date(), new Date(new Date().getTime() + 26400000)]}
      />
      <Typography color='textSecondary'>
        <code>{JSON.stringify(dates)}</code>
        <code>{JSON.stringify(startTs)}</code>
        <code>{JSON.stringify(endTs)}</code>
      </Typography>
    </div>
  )
}

export default Demo
