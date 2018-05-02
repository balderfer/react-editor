import React from 'react';

export default class EditorButton extends React.Component {

  handleClick() {
    this.props.handleClick({
      style: this.props.style
    });
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>
        {this.props.contents}
      </button>
    );
  }

}