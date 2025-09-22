///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Components
import Instrumentation from '../Instrumentation'
import SoilsOverview from '../SoilsOverview'
import SoilsReports from '../SoilsReports'
import SoilsManuals from '../SoilsManuals'
import SoilsExamples from '../SoilsExamples'
import Resources from '../Resources'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
});

var app;

@inject('store') @observer
class StemMain extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        // set page
        app.setActivePage(2);
    }

    components = {
        instrumentation: Instrumentation,
        soils_overview: SoilsOverview,
        soils_reports: SoilsReports,
        soils_manuals: SoilsManuals,
        soils_examples: SoilsExamples,
        resources: Resources,
    };

    render() {

        //const { classes } = this.props;

        const TagName = this.components[this.props.loc.slice(6)]

        return (
            <div className="about-contents">
                    <Typography align="justify" paragraph variant="body1">
                        <TagName />
                    </Typography>
            </div>
        );
    }
}

StemMain.propTypes = {
  loc: PropTypes.string,
};

export default withStyles(styles)(StemMain);
