import React from 'react';
import { renderFormattedText } from '../utils/renderUtils.js';

export default class EditorContent extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyDown = null
  }

  componentDidMount() {
    if (this.props.shouldFocus) this.elem.focus();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.elem["innerText"] || nextProps.characterStyles != this.props.characterStyles;
  }

  handleInput(e) {
    this.props.handleInput(e);
  }

  handleFocus(e) {
    this.onKeyDown = (e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.props.handleLineBreak();
      }
    };
    this.elem.addEventListener("keydown", this.onKeyDown);
  }

  handleBlur(e) {
    this.elem.removeEventListener("keydown", this.onKeyDown);
  }

  render() {
    return (
      <div
        className="editor-content"
        contentEditable={true}
        suppressContentEditableWarning
        ref={(elem) => { this.elem = elem }}
        onSelect={this.props.handleSelection}
        onInput={this.handleInput.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        dangerouslySetInnerHTML={{ __html: renderFormattedText(this.props.text, this.props.characterStyles) }}
      >
      </div>
    );
  }

}