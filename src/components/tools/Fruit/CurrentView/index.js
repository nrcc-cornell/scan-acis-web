import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

//Components
import CurrentChart from './CurrentChart'
import CurrentTable from './CurrentTable'
import ViewBase from '../ViewBase';

@inject('store') @observer
class CurrentView extends Component {
    render() {
      return (
        <ViewBase
          options={this.props.options}
          chart={<CurrentChart horizontalLines={this.props.lines.filter(obj => obj.checked).toSorted((a,b) => b.gdds - a.gdds)} />}
          table={<CurrentTable />}
        />
      );
    }
}

export default CurrentView;