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
        selectionRangeStart += parseInt(selectionRange.startContainer.parentNode.dataset.nodeIndex);
        selectionRangeEnd += parseInt(selectionRange.endContainer.parentNode.dataset.nodeIndex);
      }
      this.setState({
        selectionRange: [selectionRangeStart, selectionRangeEnd],
        range: selectionRange,
        shouldShowControls: selectionRangeStart !== selectionRangeEnd
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
    if (this.getRangeStart() === this.getRangeEnd()) {
      if (this.getRangeStart() > 0) {
        this.handleSingleCharacterDelete();
      }
    } else {
      this.handleSelectionDelete();
    }
  }

  handleSelectionDelete() {
    this.setState((prevState) => {
      const preText = prevState.text.substring(0, this.getRangeStart());
      const postText = prevState.text.substring(this.getRangeEnd());
      const newText = preText + postText;
      prevState.characterStyles.splice(this.getRangeStart(), this.getRangeLength());

      return {
        text: newText,
        characterStyles: prevState.characterStyles
      };
    });
  }

  handleSingleCharacterDelete(prevState) {
    this.setState((prevState) => {
      const preText = prevState.text.substring(0, this.getRangeStart() - 1);
      const postText = prevState.text.substring(this.getRangeStart());
      const newText = preText + postText;
      prevState.characterStyles.splice(this.getRangeStart() - 1);

      return {
        text: newText,
        characterStyles: prevState.characterStyles
      };
    });
  }

  handleInput(e) {
    if (e.nativeEvent.inputType === "insertText") {
      this.handleInsertText(e.nativeEvent.data);
    } else if (e.nativeEvent.inputType === "deleteContentBackward") {
      this.handleDeleteContentBackward();
    }
  }

  handleLineBreak(e) {
    // Add a new editor block with contents after the cursor
    this.props.addBlock(this.props.index + 1, this.state.text.substring(this.getRangeEnd()), this.state.characterStyles.slice(this.getRangeEnd()));

    // Remove trailing content from this block
    this.setState((prevState) => {
      return {
        text: prevState.text.substring(0, this.getRangeStart()),
        characterStyles: prevState.characterStyles.slice(0, this.getRangeStart())
      };
    });
  }

  handleBlur() {
    this.setState({
      shouldShowControls: false
    });
  }

  handleFocus() {
    this.props.handleFocusIndex(this.props.index);
  }

  handleNavigateUp() {
    this.props.handleFocusIndex(this.props.index - 1);
  }

  handleNavigateDown() {
    this.props.handleFocusIndex(this.props.index + 1);
  }

  handleReinstateRange() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) selection.removeAllRanges();
    console.log(this.state.range);
    selection.addRange(this.state.range);
  }

  renderPlaceholder() {
    if (this.shouldPlaceholderShow() && this.props.shouldFocus) {
      return <EditorPlaceholder />
    }
  }

  renderControls() {
    if (this.state.shouldShowControls) {
      return (
        <EditorControls
          selectionRange={this.state.selectionRange}
          range={this.state.range}
          reinstateRange={this.handleReinstateRange.bind(this)}
          characterStyles={this.state.characterStyles}
          updateCharacterStyles={this.handleUpdateCharacterStyles.bind(this)}
        />
      );
    }
  }

  render() {
    return (
      <div className="editor">
        {this.renderControls()}
        <div className="editor-content-container">
          {this.renderPlaceholder()}
          <EditorContent
            text={this.state.text}
            handleSelection={this.handleSelection.bind(this)}
            handleInput={this.handleInput.bind(this)}
            handleLineBreak={this.handleLineBreak.bind(this)}
            handleFocus={this.handleFocus.bind(this)}
            handleBlur={this.handleBlur.bind(this)}
            handleNavigateUp={this.handleNavigateUp.bind(this)}
            handleNavigateDown={this.handleNavigateDown.bind(this)}
            shouldFocus={this.props.shouldFocus}
            characterStyles={this.state.characterStyles}
          />
        </div>
      </div>
    );
  }

}