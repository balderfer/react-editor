import _ from 'underscore';
import classNames from 'classnames';

export function renderFormattedText(text, characterStyles) {
  if (characterStyles.length === 0) return `<span data-node-index=0></span>`;

  let formattedText = [];
  let textQueue = "";
  let currentStyle = characterStyles[0];
  let nodeIndex = 0;
  let i = 0;
  let linkLock = false;

  for (i; i < characterStyles.length; i++) {
    // Style changes here, create a new node and clear textQueue and update currentStyle
    if (!_.isEqual(currentStyle, characterStyles[i])) {
      
      //insert beginning of <a href...> if we're inserting link
      // if (currentStyle.link && !linkLock) {
      //   formattedText.push(`<a href="#">`);
      //   linkLock = true;
      // }

      formattedText.push(
        `<span data-node-index=${nodeIndex} data-node-length=${textQueue.length} class="${classNames(currentStyle)}">${textQueue}</span>`
      );

      // if (currentStyle.link && !characterStyles[i].link) {
      //   formattedText.push(`</a>`);
      //   linkLock = false;
      // }

      textQueue = "";
      currentStyle = characterStyles[i];
      nodeIndex = i;
    }

    textQueue += text[i];
  }

  // if (currentStyle.link && !linkLock) {
  //   formattedText.push(`<a href="#">`);
  //   linkLock = true;
  // }

  formattedText.push(
    `<span data-node-index=${nodeIndex} data-node-length=${textQueue.length} class="${classNames(currentStyle)}">${textQueue}</span>`
  );

  // if (currentStyle.link) {
  //   formattedText.push(`</a>`);
  //   linkLock = false;
  // }

  return formattedText.join("");
}
