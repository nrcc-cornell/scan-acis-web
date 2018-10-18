///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Components
import Header from '../../components/Header';
import HomeContents from '../../components/HomeContents';
import AboutContents from '../../components/AboutContents';
import StemContents from '../../components/StemContents';
import ToolContents from '../../components/ToolContents';
import Footer from '../../components/Footer';

// Styles
//import 'react-tabs/style/react-tabs.css';
// modified tab css version for this app
import '../../styles/react-tabs.css';
import '../../styles/App.css';

var app;

@inject('store') @observer
class App extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="App">
                <Header />

                <Tabs selectedIndex={this.props.store.app.getActiveTabIndex} onSelect={index => this.props.store.app.setActivePage(index)}>
                  <TabList>
                    <Tab>Home</Tab>
                    <Tab>About</Tab>
                    <Tab>SCAN 4 STEM</Tab>
                  </TabList>
                  <TabPanel>
                    <HomeContents />
                  </TabPanel>
                  <TabPanel>
                    <AboutContents />
                  </TabPanel>
                  <TabPanel>
                    <StemContents />
                  </TabPanel>
                  <TabPanel>
                    <ToolContents name={app.getToolName}/>
                  </TabPanel>
                </Tabs>

                <Footer />
            </div>
        );
    }
}

export default App;
