import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    padding: '6px'
  },
  textField: {
    width: '75px'
  }
});

var app;

@inject('store') @observer
class CustomNumberInput extends Component {
  constructor(props) {
    super(props);
    app = this.props.store.app;
    this.state = {
      value: this.props.value,
    }
  };

  updateValue = (v) => {
    this.setState({
      value: v
    })
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          variant="outlined"
          type={'number'}
          value={this.state.value}
          onChange={(e) => this.updateValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.props.onChange(this.state.value);
              e.preventDefault();
            }
          }}
        />

        { this.state.value===this.props.value ? (
          <Check color="primary" />
        ) : (
          <React.Fragment>
            <Close color="error" onClick={() => this.updateValue(this.props.value)} />

            <Button
              aria-label={this.props.btnAriaLabel}
              color="secondary"
              variant="contained"
              onClick={() => this.props.onChange(this.state.value)}
            >
              Update
            </Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CustomNumberInput);
