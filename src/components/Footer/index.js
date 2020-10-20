///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
//import Link from 'next/link'
import React, { Component } from 'react'
//import InvertedButton from './InvertedButton'
import Button from '@material-ui/core/Button';

import acislogo from '../../assets/acis-transparent.png'
import nrcslogo from '../../assets/NRCS-Logo.png'
import usdalogo from '../../assets/USDA-Logo.jpg'
import hublogo from '../../assets/climate-hub-logo.png'

class Footer extends Component {
  render () {
    const { classes } = this.props
    const currentYear = new Date().getFullYear()
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          className={classNames(classes.footerText, classes.footerSections)}
        >
          <Grid item xs={12} sm={3}>
                        <Typography className={classes.white} gutterBottom variant="body2">
                            This site provides decision tools and resources using data from weather stations in the SCAN and Tribal SCAN Networks. This project is a collaboration between the following partners.
                        </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
                        <a href="https://www.usda.gov" target="_blank" rel="noopener noreferrer"><img src={usdalogo} alt="Logo for USDA" /></a>
                        {' '}
                        <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/site/national/home/" target="_blank" rel="noopener noreferrer"><img src={nrcslogo} alt="Logo for NRCS" /></a>
                        {' '}
                        <a href="http://www.rcc-acis.org" target="_blank" rel="noopener noreferrer"><img src={acislogo} alt="Logo for the Applied Climate Information System (ACIS)" /></a>
                        {' '}
                        <a href="https://www.climatehubs.usda.gov" target="_blank" rel="noopener noreferrer"><img width="60%" src={hublogo} alt="Logo for USDA Climate Hubs" /></a>
          </Grid>
          <Grid container item direction="column" spacing={1} xs={12} sm={4}>
              <Grid item>
                    <Button variant="contained" size="small" href="https://www.wcc.nrcs.usda.gov/about/mon_scan.html">
                      {"About SCAN"}
                    </Button>
              </Grid>
              <Grid item>
                    <Button variant="contained" size="small" href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf">
                      {"SCAN Brochure"}
                    </Button>
              </Grid>
              <Grid item>
                    <Button variant="contained" size="small" href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf">
                      {"Tribal SCAN Brochure"}
                    </Button>
              </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.subFooter} item xs={12}>
          <Typography
            className={classes.white}
            variant="subtitle1"
            component={'span'}
          >
            © {currentYear} Cornell University
          </Typography>
        </Grid>
      </div>
    )
  }
}

//let boxShadow = '0 50vh 0 50vh'
//let backgroundColor = `${theme.palette.primary[700]}`
//let boxShadowWithColor = boxShadow+' '+backgroundColor

const styles = theme => ({
  root: {
    //boxShadow: '0 50vh 0 50vh '+`${theme.palette.primary[700]}`,
    boxShadow: '0 50vh 0 50vh '+theme.palette.primary[700],
    //display: 'flex',
    marginTop: 30,
    //width: '100%',
    //backgroundColor: `${theme.palette.primary[500]}`,
    backgroundColor: `${theme.palette.primary[700]}`,
    borderTop: 'solid 3px #999999',
    paddingTop: '16px',
    overflowX: 'hidden'
  },
  footerSections: {
    margin: '0 16px'
  },
  subFooter: {
    //backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '8px 16px 8px 16px',
    marginTop: '8px'
  },
  footerText: {
    color: '#fff',
    fontSize: '18px',
    lineHeight: 1.5
  },
  invertedBtnDark: {
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px #fff solid',
    boxShadow: 'none',
    margin: '8px'
  },
  white: {
    color: '#ffffff'
  },
  flexContainer: {
    display: 'flex'
  }
})

export default withStyles(styles)(Footer)
