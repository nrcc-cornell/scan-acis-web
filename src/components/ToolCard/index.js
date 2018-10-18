///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { string } from 'prop-types'

// Components

// Styles
import '../../styles/ToolCard.css';

var app;

@inject('store') @observer
class ToolCard extends Component {

    static propTypes = {
      name: string,
      title: string,
      tagline: string,
      thumbnail: string,
    }

    static defaultProps = {
      name: "",
      title: "",
      tagline: "",
      thumbnail: "",
    }

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="tool-card" onClick={ () => {app.setActivePage(3); app.setToolName(this.props.name)} }>
                <div id="tool-card-info">{this.props.tagline}</div>
                <img className="tool-image" src={require(`${this.props.thumbnail}`)} alt="Tool Thumbnail"></img>
                <div className="tool-name">
                        <span>{this.props.title}</span>
                </div>
            </div>
        );
    }
}

export default ToolCard;
