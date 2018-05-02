import React from 'react';
import EditorControls from './EditorControls.jsx';
import EditorPlaceholder from './EditorPlaceholder.jsx';
import EditorContent from './EditorContent.jsx';

export default class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      text: this.props.data.text,
      characterStyles: this.props.data.characterStyles,
      selectionRange: [0, 0]
    }
  }

  shouldPlaceholderShow() {
    return this.state.text.length <= 0;
  }

  getRangeStart() {
    return this.state.selectionRange[0];
  }

  getRangeEnd() {
    return this.state.selectionRange[1];
  }

  getRangeLength() {
    return this.getRangeEnd() - this.getRangeStart();
  }

  handleUpdateCharacterStyles(newCharacterStyles) {
    this.setState({
      characterStyles: newCharacterStyles
    });
  }

  handleSelection(e) {
    if (window.getSelection) {
      const selectionRange = window.getSelection().getRangeAt(0);
      let selectionRangeStart = selectionRange.startOffset;
      let selectionRangeEnd = selectionRange.endOffset;

      if (selectionRange.startContainer.parentNode.nodeName === "SPAN") {
        // console.log(selectionRange.startContainer.parentNode.dataset.nodeIndex);
        selectionRangeStart += parseInt(selectionRange.startContainer.parentNode.dataset.nodeIndex);
        selectionRangeEnd += parseInt(selectionRange.endContainer.parentNode.dataset.nodeIndex);
      }
      this.setState({
        selectionRange: [selectionRangeStart, selectionRangeEnd]
      })
    }
  }

  handleInsertText(newText) {
    this.setState((prevState) => {

      // Store the pre and post text so we can rebuild the new text
      const preText = prevState.text.substring(0, this.getRangeStart());
      const postText = prevState.text.substring(this.getRangeEnd());

      // Insert a new character style by copying the style of the character before it
      const currentCharacterStyle = (this.getRangeStart() > 0) ? Object.assign({}, prevState.characterStyles[this.getRangeStart() - 1]) : {};
      prevState.characterStyles.splice(this.getRangeStart(), this.getRangeLength(), currentCharacterStyle);
      
      return {
        text: preText + newText + postText || "",
        characterStyles: prevState.characterStyles
      };

    });
  }

  handleDeleteContentBackward() {
    this.setState((prevState) => {

      let newText;
      let shouldUpdate = false;

      // Remove one character before range start
      if (this.getRangeStart() === this.getRangeEnd()) {
        if (this.getRangeStart() > 0) {
          const preText = prevState.text.substring(0, this.getRangeStart() - 1);
          const postText = prevState.text.substring(this.getRangeStart());
          newText = preText + postText;
          prevState.characterStyles.splice(this.getRangeStart() - 1);
          shouldUpdate = true;
        }
      }

      // Remove all characters within range
      else {
        const preText = prevState.text.substring(0, this.getRangeStart());
        const postText = prevState.text.substring(this.getRangeEnd());
        newText = preText + postText;
        prevState.characterStyles.splice(this.getRangeStart(), this.getRangeLength());
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        return {
          text: newText,
          characterStyles: prevState.characterStyles
        };
      }
    });
  }

  handleInsertLineBreak(e) {
    e.preventDefault();
  }

  handleInput(e) {
    const newText = e.nativeEvent.data;
    console.log(e.nativeEvent);

    if (e.nativeEvent.inputType === "insertText") {
      this.handleInsertText(newText);
    } else if (e.nativeEvent.inputType === "deleteContentBackward") {
      this.handleDeleteContentBackward();
    } else if (e.nativeEvent.inputType === "insertLineBreak") {
      this.handleInsertLineBreak(e);
    }
  }

  renderPlaceholder() {
    if (this.shouldPlaceholderShow()) {
      return <EditorPlaceholder />
    }
  }

  render() {
    return (
      <div className="editor">
        <EditorControls
          selectionRange={this.state.selectionRange}
          characterStyles={this.state.characterStyles}
          updateCharacterStyles={this.handleUpdateCharacterStyles.bind(this)}
        />
        <div className="editor-content-container">
          {this.renderPlaceholder()}
          <EditorContent
            text={this.state.text}
            handleSelection={this.handleSelection.bind(this)}
            handleInput={this.handleInput.bind(this)}
            characterStyles={this.state.characterStyles}
          />
        </div>
      </div>
    );
  }

}