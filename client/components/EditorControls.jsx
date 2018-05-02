import React from 'react';
import EditorButton from './EditorButton.jsx';

export default class EditorControls extends React.Component {

  handleStyleChange(style) {
    this.props.updateCharacterStyles(this.props.characterStyles.map((styles, index) => {
      if (index >= this.props.selectionRange[0] && index < this.props.selectionRange[1]) styles[style] = true;
      return styles;
    }));
  }

  handleClick(options) {
    if (options.style) {
      this.handleStyleChange(options.style);
    }
  }

  render() {
    return (
      <div className="editor-controls">
        <EditorButton contents="Bold" style="bold" handleClick={this.handleClick.bind(this)}/>
        <EditorButton contents="Italic" style="italic" handleClick={this.handleClick.bind(this)}/>
        <EditorButton contents="Link" style="link" handleClick={this.handleClick.bind(this)}/>
      </div>
    );
  }

}