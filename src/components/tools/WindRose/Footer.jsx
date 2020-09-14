import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
//import green from '@material-ui/core/colors/green'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  footer: {
//    borderTop: "1pt solid " + green[800],
    padding: "0.5em",
    textAlign: "center",
  },
}

class Footer extends Component { 
  render() {
    const { classes } = this.props
    const today = new Date()
    return (
      <footer className={classes.footer}>
        <Typography color="primary" variant="caption">
          &copy;{today.getFullYear()} Northeast Regional Climate Center
        </Typography>
      </footer>
    )
  }
}

export default withStyles(styles)(Footer)