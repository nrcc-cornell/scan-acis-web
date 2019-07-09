import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
//import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    //padding: theme.spacing.unit * 2,
    margin: 'auto',
    //maxWidth: 600,
    height: 300,
    width: 200,
    background: '#F5F5F5',
  },
  image: {
    width: 180,
    height: 90,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  cardTitle: {
    height: 70,
  },
  cardImage: {
    height: 100,
  },
  cardDescription: {
    height: 70,
  },
  cardButtons: {
    height: 60,
  },
});

function ComplexGrid(props) {
  const { classes,name,title,description,thumbnail,url,onclick} = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.cardTitle}>
            <Typography gutterBottom variant="h6">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.cardImage}>
            <ButtonBase className={classes.image} onClick={() => {props.history.push(url)}}>
              <img className={classes.img} alt="complex" src={require(`${thumbnail}`)} />
            </ButtonBase>
          </Grid>
          <Grid item xs={10} className={classes.cardDescription}>
            <Typography variant="body2" align="left" color="textSecondary">
              {description}
            </Typography>
          </Grid>
          <Grid item container justify="space-evenly" className={classes.cardButtons}>
              <Grid item>
                <Button variant="contained" color="primary" className={classes.button} onClick={() => {props.history.push(url)}}>
                  Go
                </Button>
              </Grid>
              <Grid item>
                <IconButton className={classes.button} aria-label="Info">
                  <InfoIcon />
                </IconButton>
              </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
  url: PropTypes.string,
  onclick: PropTypes.func,
};

export default withRouter(withStyles(styles)(ComplexGrid));
