import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Grid from '@material-ui/core/Grid';

// Components
import CurrentView from './CurrentView'
import HistoricalView from './HistoricalView'
import ToolTypeSelect from './ToolTypeSelect'
import NwsAlerts from './NwsAlerts';

import heatindex1 from '../../../assets/WindHeat/heatindex_chart_1.png'
import heatindex2 from '../../../assets/WindHeat/heatindex_chart_2.png'
import windchill1 from '../../../assets/WindHeat/windchill_chart.png'
import { Typography } from '@material-ui/core';

var app;

@inject('store') @observer
class WindHeat extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        app.setToolName('windheat')
        this.state = {
            tooltype: 'current'
        }
    }

    handleChangeTooltype = (e) => {
        this.setState({
          tooltype: e.target.value,
        })
    }

    handleNavigateToDocs = (e) => {
        // Prevent anchor from refreshing page
        e.preventDefault();

        // Navigate to docs
        const name = this.props.name;
        const docUrl = app.getToolInfo(name).url_doc;
        this.props.history.push(docUrl);
    }

    render() {
        return (
            <div>
                <Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                        <ToolTypeSelect
                            value={this.state.tooltype}
                            onchange={this.handleChangeTooltype}
                        />
                    </Grid>
                    <Grid item xs={12} >
                    {this.state.tooltype==='current' &&
                        <CurrentView
                            station={this.props.station}
                            stnname={this.props.stnname}
                            outputtype={this.props.outputtype}
                        >
                            <NwsAlerts
                                station={this.props.station}
                                stnname={this.props.stnname}
                                stncoords={this.props.stncoords}
                            />
                        </CurrentView>
                    }
                    {this.state.tooltype==='historical' &&
                        <HistoricalView
                            station={this.props.station}
                            stnname={this.props.stnname}
                            outputtype={this.props.outputtype}
                        >
                            <NwsAlerts
                                station={this.props.station}
                                stnname={this.props.stnname}
                                stncoords={this.props.stncoords}
                            />
                        </HistoricalView>
                    }
                    </Grid>

                    <Grid item xs={12} >
                        {app.windheat_getWindHeatType === 'windchill' ? (
                            <a href='https://www.weather.gov/bou/windchill' rel="noopener noreferrer" target='_blank'><img className="doc-image" style={{ width: '600px', margin: '0 auto' }} src={windchill1} alt="National Weather Service Wind Chill chart" /><br/></a>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                                <a href='https://www.weather.gov/ama/heatindex' rel="noopener noreferrer" target='_blank'><img className="doc-image" style={{ width: '600px', margin: '0 auto' }} src={heatindex1} alt="National Weather Service Heat Index chart" /></a>
                                <a href='https://www.weather.gov/ama/heatindex' rel="noopener noreferrer" target='_blank'><img className="doc-image" style={{ width: '500px', margin: '0 auto' }} src={heatindex2} alt="National Weather Service Heat Index category descriptions" /></a>
                            </div>
                        )}
                        
                        <Typography>Check out the <a href='#' onClick={this.handleNavigateToDocs}>documentation</a> for more information about these charts.</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default WindHeat;
