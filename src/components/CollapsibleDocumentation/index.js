import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'

import { Button } from '@material-ui/core';

class CollapsibleDocumentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocs: false
    }
  }

  handleToggleDocs = () => {
    this.setState({
      showDocs: !this.state.showDocs
    })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <Button variant={this.state.showDocs ? "outlined" : "contained"} color="primary" onClick={this.handleToggleDocs} style={{ color: this.state.showDocs ? 'rgb(76, 175, 80)' : "white" }}>
            {this.state.showDocs ? 'Hide' : 'Show'} Documentation and Tutorial
          </Button>
        </div>
        {this.state.showDocs ? this.props.docsProp : ''}
      </div>
    )
  }
}

const styles = theme => ({
  root: {
  }
})

export default withStyles(styles)(CollapsibleDocumentation)
