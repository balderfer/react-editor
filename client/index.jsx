import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/Editor.jsx';
import uuid from 'uuid/v1';

require('./styles/index.scss');

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const defaultText = "";
    return {
      content: [
        {
          id: uuid(),
          text: defaultText,
          characterStyles: []
        }
      ],
      focusedIndex: null
    }
  }

  addBlock(insertIndex, initialText, initialCharacterStyles) {
    this.setState((prevState) => {
      prevState.content.splice(insertIndex, 0, {
        id: uuid(),
        text: initialText,
        characterStyles: initialCharacterStyles
      });

      return {
        content: prevState.content,
        shouldFocusIndex: insertIndex
      };
    });
  }

  render() {
    return (
      <div className="content">
        {this.state.content.map((data, index) => {
          return (
            <Editor
              key={data.id}
              index={index}
              data={data}
              shouldFocus={this.state.shouldFocusIndex === index}
              addBlock={this.addBlock.bind(this)}
            />
          );
        })}
      </div>
    );
  }
}

ReactDOM.render((
  <Index />
), document.getElementById('root'));