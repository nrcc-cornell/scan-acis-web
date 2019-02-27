///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { MuiThemeProvider, createMuiTheme, withStyles, withTheme  } from "@material-ui/core/styles";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import green from '@material-ui/core/colors/green';

// import route Components here
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

// Components
import Header from '../../components/Header';
import HomeContents from '../../components/HomeContents';
import AboutContents from '../../components/AboutContents';
import StemMain from '../../components/stem/StemMain';
import LocationSelect from '../../components/LocationSelect';
import ToolContents from '../../components/ToolContents';
import Footer from '../../components/Footer';

// Styles
//import 'react-tabs/style/react-tabs.css';
// modified tab css version for this app
import '../../styles/react-tabs.css';
import '../../styles/App.css';

const theme = createMuiTheme({
  shadows: ["none"],
  palette: {
    primary: green,
    //secondary:
  },
  overrides: {
    MUIDataTableBodyRow: {
      root: {
        '&:nth-child(odd)': {
          backgroundColor: '#D3D3D3'
        }
      }
    },
  },
});

const styles = theme => ({
  root: {}
});

var app;

@inject('store') @observer
class App extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
          <Router>
            <MuiThemeProvider theme={theme}>
              <div className="App">
                <Header />

                <Switch>
                  <Route exact path="/" component={HomeContents} />
                  <Route path="/about" component={AboutContents} />
                  <Route exact path="/stem" render={(props) => <StemMain {...props} loc={'/stem/instrumentation'} />} />
                  <Route path="/stem/instrumentation" render={(props) => <StemMain {...props} loc={'/stem/instrumentation'} />} />
                  <Route path="/stem/gddtool_doc" render={(props) => <StemMain {...props} loc={'/stem/gddtool_doc'} />} />
                  <Route path="/stem/waterdef_doc" render={(props) => <StemMain {...props} loc={'/stem/waterdef_doc'} />} />
                  <Route path="/stem/wxgraph_doc" render={(props) => <StemMain {...props} loc={'/stem/wxgraph_doc'} />} />
                  <Route path="/stem/heatidx_doc" render={(props) => <StemMain {...props} loc={'/stem/heatidx_doc'} />} />
                  <Route path="/stem/resources" render={(props) => <StemMain {...props} loc={'/stem/resources'} />} />
                  <Route exact path="/tools" render={(props) => <ToolContents {...props} name={'gddtool'} />} />
                  <Route path="/tools/growing-degree-day" render={(props) => <ToolContents {...props} name={'gddtool'} />} />
                  <Route path="/tools/water-deficit-calculator" render={(props) => <ToolContents {...props} name={'waterdef'} />} />
                  <Route path="/tools/weather-grapher" render={(props) => <ToolContents {...props} name={'wxgrapher'} />} />
                  <Route path="/tools/livestock-heat-index" render={(props) => <ToolContents {...props} name={'livestock'} />} />
                </Switch>

                <Footer />
              </div>
            </MuiThemeProvider>
          </Router>
        );
    }
}

export default withStyles(styles)(withTheme()(App));
