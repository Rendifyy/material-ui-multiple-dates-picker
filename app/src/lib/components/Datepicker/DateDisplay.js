import React, {Component} from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core'
import moment from 'moment'

const styles = theme => ({
  root: {
    width: theme.spacing(30),
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    margin: theme.spacing(2),
    // width: '100%',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  list: {
    flex: '1',
    overflowY: 'auto'
  }
})

const estonian = {
  0: 'P',
  1: 'E',
  2: 'T',
  3: 'K',
  4: 'N',
  5: 'R',
  6: 'L'
};

class DateDisplay extends Component {
  state = {
    selectedYear: false
  }

  componentDidMount() {
    if (!this.props.monthDaySelected) {
      this.setState({selectedYear: true})
    }
  }

  getFormatedDate = date => {
    // const dateTime = new dateTimeFormat('en-US', {
    //   year: 'numeric',
    //   month: 'short',
    //   day: '2-digit'
    // }).format(date)

    // return `${dateTime}`

    return moment(date).format('ll')
  }

  removeDateAtIndex = index => () => {
    this.props.onRemoveAtIndex(index)
  }

  render() {
    const {
      classes,
      readOnly,
      disabledDatesTitle,
      disabledDates,
      bgColor
    } = this.props

    if (disabledDates.length === 0) {
      return null;
    }

    return (
        <div className={classes.root} style={{background: bgColor}}>

          {disabledDatesTitle &&
              <>
                <div className={classes.header}>
                  <Typography
                      variant='subtitle1'>{this.props.disabledDatesTitle}</Typography>
                </div>
                <List dense className={classes.list}>
                  {disabledDates.map((date, index) => (
                      <ListItem
                          key={`${date.toString()}`}
                          button={readOnly}
                          disabled={readOnly}
                          onClick={this.removeDateAtIndex(index)}
                      >
                        <ListItemText primary={this.getFormatedDate(date)}/>
                      </ListItem>
                  ))}
                </List>
              </>
          }
        </div>
    )
  }
}

export default withStyles(styles)(DateDisplay)
