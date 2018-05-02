import React from 'react';
import { renderFormattedText } from '../utils/renderUtils.js';

export default class EditorContent extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.elem["innerText"] || nextProps.characterStyles != this.props.characterStyles;
  }

  render() {
    return (
      <div
        className="editor-content"
        contentEditable={true}
        suppressContentEditableWarning
        ref={(elem) => { this.elem = elem }}
        onSelect={this.props.handleSelection}
        onInput={this.props.handleInput}
        dangerouslySetInnerHTML={{ __html: renderFormattedText(this.props.text, this.props.characterStyles) }}
      >
      </div>
    );
  }

}