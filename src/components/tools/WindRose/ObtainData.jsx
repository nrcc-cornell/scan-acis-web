import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
//import moment from 'moment'
import WindroseTableEmpty from './WindroseTableEmpty'

const styles = {
  container: {
    margin:"1em",
    textAlign:"center",
  },
  progressIcon: {
    marginRight: "1em",
  }
}

let speedbins = []
let stnName = null

class ObtainData extends Component { 
  constructor(props) {
    super(props) 
    this.state = {
      gotData: null,
      error: null
    }
  }

  hcSeries = (databins, speedSums, speedCnts, sumObs, sumMiss) => {
    // format binned data for HighCharts (hcData) and the table (tableData)
    const compass = ['---', 'NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N','Vrb']
    const emspace = String.fromCharCode(8195)
    const gtsymbol = String.fromCharCode(62)
    const lesymbol = String.fromCharCode(8804)
    const wdirint = 360.0 / this.props.userParams.directbincnt
    let hcData = []
    let tableData = {}
    let avgSpeeds = {}
    const sb = speedbins
    const calmcnt = databins[0][0]
    const sumCalm = this.props.userParams.pctcnt === 'percent' ? ((calmcnt / sumObs) * 100) : calmcnt
    databins.shift()  //don't pass calm winds to wind rose
    for (let i = 1; i <= this.props.userParams.directbincnt + 1; i += 1) {
      let wkey = null
      let wd = this.props.userParams.directbincnt === 16 ? compass[i] : i * wdirint
      if (wd === 360) {
        wkey = "0"
      } else if (i === this.props.userParams.directbincnt + 1) {
        wkey = "Vrb"
      } else {
        wkey = wd.toString()
      }
      tableData[wkey] = Array(speedbins.length - 1)
      avgSpeeds[wkey] = speedCnts[i] > 0 ? speedSums[i]/speedCnts[i] : -999
    }
    databins.forEach((ws, i) => {
      let spdinf = {}
      if (sb[i+1] === 9999) {
        spdinf.name = emspace + gtsymbol + sb[i] + emspace
      } else if (sb[i] === 0) {
        spdinf.name = emspace + lesymbol + sb[i+1] + emspace
      } else {
        spdinf.name = sb[i] + " to " + sb[i+1]
      }
      spdinf._colorIndex = i
      spdinf.data = []
      ws.forEach((cnt, j) => {
        let wkey = null
        if (j === 0) {
          if (cnt !== 0) {
            console.warning('Unexpected non-zero direction for calm wind speed')
          }
        } else {
          let wd = this.props.userParams.directbincnt === 16 ? compass[j] : j * wdirint
          const ws = this.props.userParams.pctcnt === 'percent' ? (cnt/sumObs)*100 : cnt
          const roundws = this.props.userParams.pctcnt === 'percent' ? Math.round(ws*10)/10 : ws
          if (wd === 360) {
            wkey = "0"
            spdinf.data.unshift([wkey,roundws])
          } else if (wd === 'N') {
            wkey = "N"
            spdinf.data.unshift([wkey,roundws])
          } else if (j === this.props.userParams.directbincnt + 1) {
            wkey = "Vrb"
          } else {
            wkey = wd.toString()
            spdinf.data.push([wkey,roundws])
          }
          tableData[wkey][i] = ws
        }
      })
      hcData.push(spdinf)
    })
    Object.keys(tableData).forEach((wdrow) => {
      const rowSum = tableData[wdrow].reduce((a,c) => a + c, 0)
      tableData[wdrow].push(rowSum)
      tableData[wdrow].push(avgSpeeds[wdrow])
    })
    this.setState({gotData: true})
    const windtableData = {
      tableData: tableData,
      sumCalm: sumCalm,
      sumObs: sumObs,
      sumMiss: sumMiss,
    }
    this.props.loadWindRoseData(hcData, windtableData, stnName)
  }

  getBin = (ws, wd) => {
    const wdirint = 360.0 / this.props.userParams.directbincnt
    const wdirinc = 0.5 * wdirint
    const wspd = parseFloat(ws)
    const wdir = parseFloat(wd)
    let wspdbin = "M"
    let wdirbin = "M"
    if (wspd <= speedbins[0] || wdir === 0) {   // Calm winds determined by speed or direction
      wspdbin = 0
    } else {
      for (let i = 0; i < speedbins.length-1; i += 1) {
        if (wspd > speedbins[i] && wspd <= speedbins[i+1]) {
          wspdbin = i + 1
          break
        }
      }
    }
    if (wspd <= speedbins[0] || wdir === 0) {   // Calm winds determined by speed or direction
      wdirbin = 0
    } else if (wdir === -1) {
      wdirbin = this.props.userParams.directbincnt + 1
    } else if (wdir >= 360 - wdirinc || wdir < 0 + wdirinc) {
      wdirbin = this.props.userParams.directbincnt
    } else {
      for (let i = 1; i < this.props.userParams.directbincnt; i += 1) {
        const b = i * wdirint
        if (wdir >= b - wdirinc && wdir < b + wdirinc) {
          wdirbin = i
          break
        }
      }
    }
    return {wspdbin, wdirbin}
  }

  setupFilters = () => {
    //day filter dates
    const sd = [this.props.userParams.fromFilterMonth, this.props.userParams.fromFilterDay].join("-")
    const ed = [this.props.userParams.toFilterMonth, this.props.userParams.toFilterDay].join("-")
    //build hour filter
    const sh = this.props.userParams.fromFilterHour
    const eh = this.props.userParams.toFilterHour
    let useHours = []
    for (let k = 1; k <= 24; k += 1) {
      if ((sh <= eh && k >= sh && k <= eh) || (sh > eh && (k >= sh || k <= eh))) {
        useHours.push(k)
      }
    }
    return {sd, ed, useHours}
  }

  processData = (res) => {
    if (res.data.error) {
      //this.setState({error: "ERROR - " + res.data.error})
      this.setState({error: 'Insufficient wind data available for current station and selections.'})
    } else {
      stnName = res.data.meta.name + ", " + res.data.meta.state
      let sumObs = 0
      let sumMiss = 0
      let databins = []
      let speedSums = Array(this.props.userParams.directbincnt+2).fill(0)
      let speedCnts = Array(this.props.userParams.directbincnt+2).fill(0)
      for (let k = 0; k < speedbins.length; k += 1) {
        databins.push(Array(this.props.userParams.directbincnt + 2).fill(0))  //extra bins for calm and variable
      }
      let {sd, ed, useHours} = this.setupFilters()
      res.data.data.forEach((results, i) => {
        const mmdd = results[0].slice(5)
        if ((sd <= ed && mmdd >= sd && mmdd <= ed) || (sd > ed && (mmdd >= sd || mmdd <= ed))) {
          const wspd = results[1]
          const wdir = results[2]
          useHours.forEach(k => {
            let {wspdbin, wdirbin} = this.getBin(wspd[k-1], wdir[k-1])
            if (wspdbin !== "M" && wdirbin !== "M") {
              speedSums[wdirbin] += parseFloat(wspd[k-1])
              speedCnts[wdirbin] += 1
              databins[wspdbin][wdirbin] += 1
              sumObs += 1
            } else {
              sumMiss += 1
            }
          })
        }
      })
      this.hcSeries(databins, speedSums, speedCnts, sumObs, sumMiss)
    }
  }

  componentDidMount = () => {
    this.processData(this.props.acisWindResults)
  }

  componentDidUpdate(prevProps) {
    if (this.props.acisWindResults !== prevProps.acisWindResults || prevProps.userParams !== this.props.userParams) {
      this.processData(this.props.acisWindResults)
    }
  }

  render() {
    const { classes } = this.props 
    speedbins = [...this.props.userParams.speedbins.filter(e => e !== ""), 9999]  // remove empty speed bins and add an ending 9999
    return (
      <div className={classes.container}>
        {this.state.error && 
          <div>
          <Typography color="error" variant="h6">
            {this.state.error}
          </Typography>
          <WindroseTableEmpty />
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(ObtainData)
