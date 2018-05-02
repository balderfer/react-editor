import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/Editor.jsx';

require('./styles/index.scss');

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const defaultText = "";
    return {
      data: {
        text: defaultText,
        characterStyles: []
      }
    }
  }

  render() {
    return (
      <div className="content">
        <Editor data={this.state.data}/>
      </div>
    );
  }
}

ReactDOM.render((
  <Index />
), document.getElementById('root'));