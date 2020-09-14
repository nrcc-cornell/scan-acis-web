import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import lime from '@material-ui/core/colors/lime'
import green from '@material-ui/core/colors/green'
import { withStyles, withTheme } from '@material-ui/core/styles'

const styles = {
  container: {
    margin: "1em 2%",
  },
  windroseTable: {
    marginTop: "0.5em",
  },
}

const darkStripe = green[100]
const normalStripe = lime[50]
const enspace = String.fromCharCode(8194)

class WindroseTable extends Component { 
  formatValue = (value,j) => {
    const res = this.props.userParams.pctcnt === 'percent' || j === this.props.windtableData.tableData['Vrb'].length - 1 ? 1 : 0
    return ((Math.round(value * 10) / 10.0).toFixed(res)).replace("-999.0","-")
  }

  fillWithDashes = () => {
    let children = []
    for (let i = 0; i < this.props.windtableData.tableData['Vrb'].length - 2; i+=1) {
      children.push(<TableCell key={i} component="td" >-</TableCell>)
    }
    return children
  }

  render() {
    const { classes } = this.props
    const sumObs = this.props.windtableData.sumObs.toLocaleString("en")
    const sumMiss= this.props.windtableData.sumMiss.toLocaleString("en")
    const dateRange = "Date range: " + this.props.userParams.fromDate + " through " + this.props.userParams.toDate + "."
    const dirUnits = this.props.userParams.directbincnt === 16 ? 'compass' : 'degrees'
    const winddata=this.props.windtableData.tableData
    const wdkeys = Object.keys(winddata)
    const tableCols = winddata['Vrb'].length + 1
    return (
      <div className={classes.container}>
        <Typography align="center" variant="subtitle2">{this.props.hcdata.title.text} Wind Frequency Table ({this.props.userParams.pctcnt})</Typography>
        <Typography align="center" variant="subtitle2">{dateRange.slice(0,-1)}</Typography>
        <Table className={classes.windroseTable}>
          <TableHead>
            <TableRow style={{background: darkStripe}}>
              <TableCell component="th" >
                Wind Direction ({dirUnits})
              </TableCell>
              {this.props.hcdata.series.map((row,i) => (
                <TableCell key={i}  component="th" style={{whiteSpace: "nowrap"}} >
                  {row.name}
                </TableCell>
              ))}
              <TableCell component="th" >
                All speeds
              </TableCell>
              <TableCell component="th" >
                Average speed
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wdkeys.map((wkey,i) => (
              <TableRow key={i} style={{background: i % 2 ? darkStripe : normalStripe}}>
                <TableCell component="th" >
                  {wkey}
                </TableCell>
                {winddata[wkey].map((wscnt,j) => (
                  <TableCell key={j} component="td" >
                    {this.formatValue(wscnt, j)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow style={{background: darkStripe}}>
              <TableCell component="th" >
                Calm
              </TableCell>
              {this.fillWithDashes()}
              <TableCell component="td" >
                {this.formatValue(this.props.windtableData.sumCalm, 0)}
              </TableCell>
              <TableCell component="td" >
                -
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow style={{background: normalStripe}}>
              <TableCell component="td" colSpan={tableCols}>
                Based on a total of {sumObs} hourly observations; {sumMiss} missing.
                <br />{dateRange}
                {this.props.windtableData.dayFilter &&
                  enspace + this.props.windtableData.dayFilter + "."
                }
                {this.props.windtableData.hourFilter &&
                  enspace + this.props.windtableData.hourFilter + "."
                }
                <br />Wind speed bins ({this.props.userParams.wsunits}) include values greater than the lower end of the interval range and less than or equal to the upper end.
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles, withTheme)(WindroseTable)
