import React from 'react';
import { withRouter } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  linkCard: {
    width: '200px',
    height: '290px',
    border: '2px solid #388e3c',
    borderRadius: '5px',
    transition: 'all 0.1s ease-out',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.01)',
      transform: 'scale(1.03)'
    }
  },
  cardActionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardMedia: {
    height: 140,
    width: '100%',
    borderTop: '2px solid rgb(200,200,200)',
    backgroundSize: 'contain'
  },
  cardTitle: {
    height: '2.6rem',
    lineHeight: '1.5rem',
  },
  cardDescription: {
    marginTop: '1.0rem'
  }
});

function ToolCard({ classes, title, description, url, thumbnail, history }) {
  return (
    <Card className={classes.linkCard}>
      <CardActionArea
        className={classes.cardActionArea}
        onClick={() => history.push(url)}
      >
        <CardContent className={classes.cardContent}>
          <Typography
            variant="h6"
            className={classes.cardTitle}
          >
            {title}
          </Typography>

          <Typography
            className={classes.cardDescription}
            variant="body2"
            align="left"
            color="textSecondary"
          >
            {description}
          </Typography>
        </CardContent>

        <CardMedia
          className={classes.cardMedia}
          image={require(`${thumbnail}`)}
          title="Sample output from SCAN/TSCAN decision support tools"
        />
      </CardActionArea>
    </Card>
  );
}

export default withRouter(withStyles(styles)(ToolCard));