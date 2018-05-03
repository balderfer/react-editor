import React from 'react';
import { renderFormattedText } from '../utils/renderUtils.js';

export default class EditorContent extends React.Component {

  constructor(props) {
    super(props);

    this.onKeyDown = null
  }

  componentDidMount() {
    this.onKeyDown = (e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.props.handleLineBreak();
      } else if (e.which === 38) {
        e.preventDefault();
        this.props.handleNavigateUp();
      } else if (e.which === 40) {
        e.preventDefault();
        this.props.handleNavigateDown();
      }
    };
    this.elem.addEventListener("keydown", this.onKeyDown);
    if (this.props.shouldFocus) this.elem.focus();
  }

  componentDidUpdate() {
    if (this.props.shouldFocus) this.elem.focus();
  }

  componentWillUnmount() {
    this.elem.removeEventListener("keydown", this.onKeyDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.elem["innerText"] || nextProps.characterStyles != this.props.characterStyles || this.props.shouldFocus !== nextProps.shouldFocus;
  }

  handleInput(e) {
    this.props.handleInput(e);
  }

  handleBlur(e) {
    this.props.handleBlur();
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
        onFocus={this.props.handleFocus}
        onBlur={this.handleBlur.bind(this)}
        dangerouslySetInnerHTML={{ __html: renderFormattedText(this.props.text, this.props.characterStyles) }}
      >
      </div>
    );
  }

}