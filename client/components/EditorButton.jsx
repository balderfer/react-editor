import React from 'react';

export default class EditorButton extends React.Component {

  constructor(props) {
    super(props);

    this.onMouseDown = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.props.handleClick({
        style: this.props.style
      });
    };
  }

  componentDidMount() {
    this.elem.addEventListener("mousedown", this.onMouseDown);
  }

  componentWillUnmout() {
    this.elem.removeEventListener("mousedown", this.onMouseDown);
  }

  render() {
    return (
      <button
        className="editor-controls-button"
        ref={(elem) => { this.elem = elem }}
      >
        {this.props.contents}
      </button>
    );
  }

}