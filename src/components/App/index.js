import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { MuiThemeProvider, createTheme, withStyles, withTheme  } from "@material-ui/core/styles";
import green from '@material-ui/core/colors/green';

// import route Components here
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

// Components
import Header from '../../components/Header';
import HomeContents from '../../components/HomeContents';
import AboutContents from '../../components/AboutContents';
import StemMain from '../../components/stem/StemMain';
import ToolContents from '../../components/ToolContents';
import Footer from '../../components/Footer';
import GAListener from './GAListener';

// Styles
import '../../styles/App.css';

const theme = createTheme({
  shadows: Array(25).fill('none'),
  palette: {
    primary: green,
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

@inject('store') @observer
class App extends Component {
    render() {
        return (
          <Router basename={process.env.PUBLIC_URL}>
            <MuiThemeProvider theme={theme}>
              <div className="App">
                <Header />

                <GAListener>
                  <Switch>
                    <Route exact path="/" component={HomeContents} />
                    <Route path="/about" component={AboutContents} />
                    <Route exact path="/stem" render={(props) => <StemMain {...props} loc={'/stem/instrumentation'} />} />
                    <Route path="/stem/instrumentation" render={(props) => <StemMain {...props} loc={'/stem/instrumentation'} />} />
                    <Route path="/stem/soils_overview" render={(props) => <StemMain {...props} loc={'/stem/soils_overview'} />} />
                    <Route path="/stem/soils_reports" render={(props) => <StemMain {...props} loc={'/stem/soils_reports'} />} />
                    <Route path="/stem/soils_manuals" render={(props) => <StemMain {...props} loc={'/stem/soils_manuals'} />} />
                    <Route path="/stem/soils_examples" render={(props) => <StemMain {...props} loc={'/stem/soils_examples'} />} />
                    <Route path="/stem/resources" render={(props) => <StemMain {...props} loc={'/stem/resources'} />} />
                    <Route exact path="/tools" render={(props) => <ToolContents {...props} name={'gddtool'} />} />
                    <Route path="/tools/growing-degree-day" render={(props) => <ToolContents {...props} name={'gddtool'} />} />
                    <Route path="/tools/water-deficit-calculator" render={(props) => <ToolContents {...props} name={'waterdef'} />} />
                    <Route path="/tools/weather-grapher" render={(props) => <ToolContents {...props} name={'wxgrapher'} />} />
                    <Route path="/tools/livestock-heat-index" render={(props) => <ToolContents {...props} name={'livestock'} />} />
                    <Route path="/tools/wind-rose" render={(props) => <ToolContents {...props} name={'windrose'} />} />
                    <Route path="/tools/wind-chill-heat-index" render={(props) => <ToolContents {...props} name={'windheat'} />} />
                    <Route render={() => <Redirect to="/" />} />
                  </Switch>
                </GAListener>

                <Footer />
              </div>
            </MuiThemeProvider>
          </Router>
        );
    }
}

export default withStyles(styles)(withTheme(App));
