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
    if (this.props.shouldFocus) {
      if (document.activeElement !== this.elem) {
        this.elem.focus();
      } else if (this.props.shouldReinstateRange) {
        this.reinstateRange();
      }
    }
  }

  componentWillUnmount() {
    this.elem.removeEventListener("keydown", this.onKeyDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.elem["innerText"] || nextProps.characterStyles != this.props.characterStyles || this.props.shouldFocus !== nextProps.shouldFocus;
  }

  isWithinRange(index, start, length, isEnd) {
    // console.log(`index: ${index}`);
    // console.log(`start: ${start}`);
    // console.log(`length: ${length}`);
    // console.log(`index >= start: ${index >= start}`);
    // console.log(`index <= (start + length): ${index <= (start + length)}`);
    index = parseInt(index);
    start = parseInt(start);
    length = parseInt(length);

    if (isEnd) {
      return (index > start) && (index <= (start + length));
    } else {
      return (index >= start) && (index < (start + length));
    }
  }

  reinstateRange() {
    let newRange = new Range();

    for (let i = 0; i < this.elem.children.length; i++) {
      const child = this.elem.children[i];

      if (this.isWithinRange(this.props.selectionRange[0], child.dataset.nodeIndex, child.dataset.nodeLength, false)) {
        newRange.setStart(child.firstChild, this.props.selectionRange[0] - child.dataset.nodeIndex);
      }

      if (this.isWithinRange(this.props.selectionRange[1], child.dataset.nodeIndex, child.dataset.nodeLength, true)) {
        newRange.setEnd(child.firstChild, this.props.selectionRange[1] - child.dataset.nodeIndex);
      }
    }
    const selection = window.getSelection();
    if (selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(newRange.cloneRange());
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
        onClick={this.props.handleFocus}
        onBlur={this.handleBlur.bind(this)}
        dangerouslySetInnerHTML={{ __html: renderFormattedText(this.props.text, this.props.characterStyles) }}
      >
      </div>
    );
  }

}