import _ from 'underscore';
import classNames from 'classnames';

export function renderFormattedText(text, characterStyles) {
  if (characterStyles.length === 0) return "";

  let formattedText = [];
  let textQueue = "";
  let currentStyle = characterStyles[0];
  let nodeIndex = 0;
  let i = 0;

  for (i; i < characterStyles.length; i++) {
    // Style changes here, create a new node and clear textQueue and update currentStyle
    if (!_.isEqual(currentStyle, characterStyles[i])) {
      formattedText.push(
        `<span data-node-index=${nodeIndex} class=${classNames(currentStyle)}>${textQueue}</span>`
      );
      textQueue = "";
      currentStyle = characterStyles[i];
      nodeIndex = i;
    }

    textQueue += text[i];
  }

  formattedText.push(
    `<span data-node-index=${nodeIndex} class=${classNames(currentStyle)}>${textQueue}</span>`
  );

  return formattedText.join("");
}
