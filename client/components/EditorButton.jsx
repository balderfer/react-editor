import React from 'react';

export default class EditorButton extends React.Component {

  constructor(props) {
    super(props);

    this.onMouseDown = (e) => {
      e.preventDefault();
      this.props.handleClick({
        style: this.props.style
      });
    };
  }

  render() {
    return (
      <button
        onMouseDown={this.onMouseDown}
        className="editor-controls-button"
        ref={(elem) => { this.elem = elem }}
      >
        {this.props.contents}
      </button>
    );
  }

}