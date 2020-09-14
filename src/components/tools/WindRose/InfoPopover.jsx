import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'

const infoContent = {
  sid: "Enter the 3-letter airport identifer (network 'faa') or other network station id.",
  pctcnt: "The windrose plot and table can contain either percent of values in each category or count of hourly occurrences in each category.",
  directbincnt: "Aiport weather stations record their wind direction observations to the nearest 10 degrees, so selecting a 16-point compass for these stations can produce biased results.",
}

export default class InfoPopover extends Component { 
  render() {
    const popoverContent = infoContent[this.props.inputName]
    return (
      <Popover
        open={Boolean(this.props.anchorEl)}
        anchorEl={this.props.anchorEl}
        onClose={this.props.handleInfoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{
          maxWidth:"60%"
        }}
        PaperProps={{style:{padding:"1em"}}}
      >
        <Typography color="secondary">
          {popoverContent}
        </Typography>
      </Popover>
    )
  }
}