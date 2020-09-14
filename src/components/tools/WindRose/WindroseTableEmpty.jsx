import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
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

class WindroseTableEmpty extends Component { 

  fillWithDashes = () => {
    let children = []
    for (let i = 0; i < 10; i+=1) {
      children.push(<TableCell key={i} component="td" >-</TableCell>)
    }
    return children
  }

  render() {
    const { classes } = this.props
    let wdkeys = [0,10,20,30,40,50,60,70,80,90,100,110,120,
      130,140,150,160,170,180,190,200,210,220,230,240,
      250,260,270,280,290,300,310,320,330,340,350,360]
    return (
      <div className={classes.container}>
        <Typography align="center" variant="subtitle2">Wind Frequency Table</Typography>
        <Table className={classes.windroseTable}>
          <TableBody>
            {wdkeys.map((wkey,i) => (
              <TableRow key={i} style={{background: i % 2 ? darkStripe : normalStripe}}>
                <TableCell component="th" >
                  {wkey}
                </TableCell>
                {this.fillWithDashes()}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles, withTheme)(WindroseTableEmpty)
