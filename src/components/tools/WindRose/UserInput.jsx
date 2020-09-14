import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InfoIcon from '@material-ui/icons/Info'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import InfoPopover from './InfoPopover'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/core/styles'
//import StationSearch from './StationSearch'
import RenderDateField from './RenderDateField'

const styles = {
  container: {
    padding: "8px",
    marginBottom: "1em",
  },
  textfield: {
    marginRight: "1em",
  },
  smallTextfield: {
    width: "3em",
    marginLeft: "3px",
  },
  shortcutButton: {
    marginTop: "1em",
    marginRight: "0.75em", 
  },
  divider: {
    margin: "0.5em 0",
  },
  filterLabel: {
    display: "inline-block",
    lineHeight: "4.4em",
    verticalAlign: "bottom",
    marginRight: "0.5em",
  },
  rangeLabel: {
    display: "inline-block",
    lineHeight: "1em",
    verticalAlign: "middle",
    marginTop: "1em",
    padding: "0 1em 0 1em",
  },
  filterGroup: {
    display: "inline-block",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    paddingTop: "0",
    paddingBottom: "0",
    margin: "0.6em 0 0.6em 0",
  },
  filterGroupLegend: {
    fontFamily: "Roboto",
    fontSize: "75%",
    color: "rgba(0, 0, 0, 0.54)",
    lineHeight: "1",
  },
  goButton: {
    marginTop: "1em",
  },
}

const directionChoices = [
  {
    value: 36,
    label: '36-point compass',
  },
  {
    value: 16,
    label: '16-point compass',
  },
]
const pctcntChoices = [
  {
    value: 'percent',
    label: 'Percent'
  },
  {
    value: 'counts',
    label: 'Total Counts',
  },
]
const wsunitsChoices = [
  {
    value: 'miles/hr',
    label: 'Miles/hour'
  },
  {
    value: 'kts',
    label: 'Knots',
  },
  {
    value: 'm/s',
    label: 'Meters/second',
  },
]
const monthChoices = ['January','February','March','April','May','June','July','August','September','October','November','December']
const dayChoices = Array.from({length: 31}, (v, k) => k+1)
const hourChoices = Array.from({length: 24}, (v, k) => k+1)

class UserInput extends Component { 
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null,
      shortcutAnchorEl: null,
      inputName: null,
      fromDateError: false,
      toDateError: false,
      bothDatesError: false,
      speedbinsError: [false,false,false,false,false,false,false,false,false,false],
      showSearch: false,
      saveChangesIsDisabled: true,
    }
  }

  selectOptions = (choices) => {
    return (
      choices.map(option => {
        return (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )
      })
    )
  }

  serialSelectOptions = (choices) => {
    return (
      choices.map((option,i) => {
        return (
          <MenuItem key={i} value={i+1}>
            {option}
          </MenuItem>
        )
      })
    )
  }

  serialStringSelectOptions = (choices) => {
    return (
      choices.map((option,i) => {
        return (
          <MenuItem key={i} value={("0" + (i+1)).slice(-2)}>
            {option}
          </MenuItem>
        )
      })
    )
  }

  infoAdornment = (name) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={(event) => this.handleInfoClick(event,name)} tabIndex="-1" color="primary" style={{padding:"0"}}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    )
  }

  searchAdornment = (name) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={(event) => this.handleSearchClick(event,name)} tabIndex="-1" color="primary" style={{padding:"0"}}>
          <SearchIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    )
  }

  checkValidDateRange = (name, value) => {
    const from = name==="fromDate" ? value : this.state.fromDate
    const to = name==="toDate" ? value : this.state.toDate
    if (Boolean(from) && Boolean(to)) {
      this.setState({bothDatesError: from > to})
    } else {
      this.setState({bothDatesError: false})
    }
  }
  
  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleIntChange = (name) => event => {
    this.setState({
      [name]: parseInt(event.target.value, 10),
    })
  }

  handleSpeedChange = (index) => event => {
    let sbins = this.state.speedbins
    sbins[index] = event.target.value
    let sbinserror = []
    sbins.forEach((sb,i) => {
      const sbf = parseFloat(sb)
      const sbf_previous = i === 0 ? -999 : parseFloat(sbins[i-1])
      const sbf_next = i === sbins.length-1 ? 9999 : parseFloat(sbins[i+1])
      if (sbf <= sbf_previous || sbf >= sbf_next) {
        sbinserror.push(true)
      } else {
        sbinserror.push(false)
      }
    })
    this.setState({
      soeedbins: sbins,
      speedbinsError: sbinserror,
      saveChangesIsDisabled: (sbinserror.includes(true)) ? true : false
    })
  }

  handleDateChange = (name) => event => {
    this.checkValidDateRange(name, event.target.value)
    this.setState({
      [name]: event.target.value,
      [name+"Error"]: !Boolean(event.target.value)
    })
  }

  handleInfoClick = (event, name) => {
    this.setState({anchorEl: event.currentTarget, inputName: name})
  }

  handleInfoClose = () => {
    console.log('close button')
    this.setState({anchorEl: null})
  }

  handleSearchClick = (event) => {
    this.setState({showSearch: true})
  }


  handleShortcutClick = (event) => {
    this.setState({shortcutAnchorEl: event.currentTarget})
  }

  handleShortcutClose = (index) => {
    if (index === 0) {
      this.setState({
        speedbins: [0, 1.3, 4, 8, 13, 19, 25, 32, 39, 47], 
        wsunits:'miles/hr'
      })
    } else if (index) {
      let newspeedbins = []
      for (let i=0; i <= 9; i+=1) {
        newspeedbins.push(i*index)
      }
      this.setState({speedbins: newspeedbins})
    }
    this.setState({shortcutAnchorEl: null})
  }

  submitRequest = event => {
    this.setState({saveChangesIsDisabled: true})
    this.props.startRequest(this.state)
    this.props.handleClose()
  }

  componentWillMount = () => {
    if (this.props.userParams) {
      this.setState({
        sid: this.props.userParams.sid,
        selectedNetwork: this.props.userParams.selectedNetwork,
        directbincnt: this.props.userParams.directbincnt,
        pctcnt: this.props.userParams.pctcnt,
        wsunits: this.props.userParams.wsunits,
        speedbins: this.props.userParams.speedbins,
        fromDate: this.props.userParams.fromDate,
        toDate: this.props.userParams.toDate,
        fromFilterMonth: this.props.userParams.fromFilterMonth,
        fromFilterDay: this.props.userParams.fromFilterDay,
        toFilterMonth: this.props.userParams.toFilterMonth,
        toFilterDay: this.props.userParams.toFilterDay,
        fromFilterHour: this.props.userParams.fromFilterHour,
        toFilterHour: this.props.userParams.toFilterHour,
      })
    } else {
      const today = new Date()
      const dmonth = ('0' + (today.getMonth() + 1)).slice(-2)
      const ddate = ('0' + today.getDate()).slice(-2)
      this.setState({
        sid: '',
        selectedNetwork: '',
        directbincnt: 36,
        pctcnt: 'percent',
        wsunits: 'miles/hr',
        speedbins: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
        fromDate: [today.getFullYear(), dmonth, "01"].join("-"),
        toDate: [today.getFullYear(), dmonth, ddate].join("-"),
        fromFilterMonth: '01',
        fromFilterDay: '01',
        toFilterMonth: '12',
        toFilterDay: '31',
        fromFilterHour: 1,
        toFilterHour: 24,
     })
    }
  }

  componentDidUpdate(prevProps,prevState) {
    if (prevState.directbincnt!==this.state.directbincnt ||
        prevState.pctcnt!==this.state.pctcnt ||
        prevState.wsunits!==this.state.wsunits ||
        prevState.speedbins!==this.state.speedbins ||
        prevState.fromDate!==this.state.fromDate ||
        prevState.toDate!==this.state.toDate ||
        prevState.fromFilterMonth!==this.state.fromFilterMonth ||
        prevState.fromFilterDay!==this.state.fromFilterDay ||
        prevState.toFilterMonth!==this.state.toFilterMonth ||
        prevState.toFilterDay!==this.state.toFilterDay ||
        prevState.fromFilterHour!==this.state.fromFilterHour ||
        prevState.toFilterHour!==this.state.toFilterHour) {
      this.setState({
        saveChangesIsDisabled: false
      })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <TextField
          select
          id="pctcnt"
          label="Summary type"
          value={this.state.pctcnt}
          onChange={this.handleChange('pctcnt')}
          className={classes.textfield}
          margin="normal"
          variant="outlined"
          InputProps={{endAdornment: this.infoAdornment('pctcnt')}}
          SelectProps={{ native: false }}
        >
          {this.selectOptions(pctcntChoices)}
        </TextField>
        <TextField
          select
          id="directbincnt"
          label="Wind direction bins"
          value={this.state.directbincnt}
          onChange={this.handleIntChange('directbincnt')}
          className={classes.textfield}
          margin="normal"
          variant="outlined"
          SelectProps={{ native: false }}
        >
          {this.selectOptions(directionChoices)}
        </TextField>
        <TextField
          select
          id="wsunits"
          label="Wind speed units"
          value={this.state.wsunits}
          onChange={this.handleChange('wsunits')}
          className={classes.textfield}
          margin="normal"
          variant="outlined"
          SelectProps={{ native: false }}
        >
          {this.selectOptions(wsunitsChoices)}
        </TextField>

        <br />
        <fieldset className={classes.filterGroup}>
          <legend className={classes.filterGroupLegend}>Wind speed bins ({this.state.wsunits})</legend>
          <Button
            onClick={this.handleShortcutClick}
            variant="contained"
            size="small"
            color="primary"
            className={classes.shortcutButton}
          >
            Shortcuts
          </Button>
          <Menu 
            anchorEl={this.state.shortcutAnchorEl} 
            open={Boolean(this.state.shortcutAnchorEl)} 
            onClose={(event) => this.handleShortcutClose()}
          >
            <MenuItem onClick={(event) => this.handleShortcutClose(5)}>Even increments of 5</MenuItem>
            <MenuItem onClick={(event) => this.handleShortcutClose(4)}>Even increments of 4</MenuItem>
            <MenuItem onClick={(event) => this.handleShortcutClose(3)}>Even increments of 3</MenuItem>
            <MenuItem onClick={(event) => this.handleShortcutClose(2)}>Even increments of 2</MenuItem>
            <MenuItem onClick={(event) => this.handleShortcutClose(0)}>Beaufort scale (mph)</MenuItem>
          </Menu>
          {this.state.speedbins.map((ws,k) => 
            <TextField
              key={k}
              id={["speedbin",k].join("")}
              value={ws}
              onChange={this.handleSpeedChange(k)}
              className={classes.smallTextfield}
              margin="normal"
              variant="outlined"
              fullWidth={true}
              style={{display: k===0 ? "none" : "inline-block"}}
              error={this.state.speedbinsError[k]}
              inputProps={{style:{padding:"4px",border:"none",fontFamily:"Roboto"}}}
            />
          )}
        </fieldset>

        <br />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item>
          <RenderDateField
            field="fromDate"
            label="Start date"
            ovalue={this.state.fromDate}
            error={this.state.fromDateError || this.state.bothDatesError}
            handleOnChange={this.handleDateChange('fromDate')}
          />
          </Grid>
          <Grid item>
          <RenderDateField
            field="toDate"
            label="End date"
            ovalue={this.state.toDate}
            error={this.state.toDateError || this.state.bothDatesError}
            handleOnChange={this.handleDateChange('toDate')}
          />
          </Grid>
        </Grid>

        <Divider className={classes.divider}/>
        <Typography paragraph={false} variant="subtitle2">
          Data filtering options
        </Typography>
        <Typography className={classes.filterLabel}>
          For each year, use days:
        </Typography>
        <fieldset className={classes.filterGroup}>
          <legend className={classes.filterGroupLegend}>Interval start date</legend>
          <TextField
            select
            id="fromFilterMonth"
            value={this.state.fromFilterMonth}
            onChange={this.handleChange('fromFilterMonth')}
            className={classes.textfield}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialStringSelectOptions(monthChoices)}
          </TextField>
          <TextField
            select
            id="fromFilterDay"
            value={this.state.fromFilterDay}
            onChange={this.handleChange('fromFilterDay')}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialStringSelectOptions(dayChoices)}
          </TextField>
        </fieldset>
        <Typography className={classes.filterLabel} style={{marginLeft:"0.5em"}}>
          through
        </Typography>
        <fieldset className={classes.filterGroup}>
          <legend className={classes.filterGroupLegend}>Interval end date</legend>
          <TextField
            select
            id="toFilterMonth"
            value={this.state.toFilterMonth}
            onChange={this.handleChange('toFilterMonth')}
            className={classes.textfield}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialStringSelectOptions(monthChoices)}
          </TextField>
          <TextField
            select
            id="toFilterDay"
            value={this.state.toFilterDay}
            onChange={this.handleChange('toFilterDay')}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialStringSelectOptions(dayChoices)}
          </TextField>
        </fieldset>

        <br />
        <Typography className={classes.filterLabel}>
          For each day, use hours:
        </Typography>
        <fieldset className={classes.filterGroup}>
          <legend className={classes.filterGroupLegend}>Hour range (LST)</legend>
          <TextField
            select
            id="fromFilterHour"
            value={this.state.fromFilterHour}
            onChange={this.handleIntChange('fromFilterHour')}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialSelectOptions(hourChoices)}
          </TextField>
          <Typography className={classes.rangeLabel}>
            to
          </Typography>
          <TextField
            select
            id="toFilterHour"
            value={this.state.toFilterHour}
            onChange={this.handleIntChange('toFilterHour')}
            margin="dense"
            SelectProps={{ native: false }}
          >
            {this.serialSelectOptions(hourChoices)}
          </TextField>
        </fieldset>

        <br />
        {!this.state.fromDateError && !this.state.toDateError && !this.state.bothDatesError &&
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Button 
            className={classes.goButton} 
            onClick={this.submitRequest} 
            variant="contained"
            size="small"
            color="secondary"
            disabled={this.state.saveChangesIsDisabled}
          >
            Save Changes
          </Button>
        </Grid>
        }

        <InfoPopover 
          anchorEl={this.state.anchorEl}
          inputName={this.state.inputName}
          handleInfoClose={this.handleInfoClose}
        />
      </div>
    )
  }
}

export default withStyles(styles, withTheme)(UserInput)
