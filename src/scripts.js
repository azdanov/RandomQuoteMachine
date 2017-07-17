import './styles.scss';

require('babel-polyfill');
require('custom-event-polyfill');
require('promise-polyfill');
require('whatwg-fetch');

const animationTime = 600;
const changeBackgroundEvent = new CustomEvent('changeBackground');
const copyButton = document.getElementById('copy');
const quoteButton = document.getElementById('quote-button');
const buttons = Array.from(document.getElementsByClassName('button'));
const quoteThemes = {
  self: 144,
  best: 12,
  emotions: 17,
  life: 207,
  justice: 41,
  wealth: 154,
  laughter: 31,
  anger: 65,
  art: 108,
  executives: 16,
  power: 78,
  education: 146,
  wisdom: 108,
  greatness: 63,
};

function randomUpTo(num) {
  return Math.floor(Math.random() * num);
}

function pickRandomSample(topics) {
  const index = Math.floor(Math.random() * (topics.length));
  return topics[index];
}

function extractQuote() {
  const quoteContainer = document.getElementById('copy').parentElement.children;
  return `"${quoteContainer.quote.innerText.trim()}"\n${quoteContainer.author.innerText.trim()}`;
}

function changeBackground(gradients) {
  const gradient = gradients[randomUpTo(gradients.length)];
  const background = document.getElementsByClassName('modal-background')[0];
  background.style.opacity = 0;
  window.setTimeout(() => {
    background.style.background = `-webkit-gradient(linear, left top, left bottom, from(${gradient.colors[0]}), to(${gradient.colors[1]}))`;
    background.style.background = `linear-gradient(${gradient.colors[0]}, ${gradient.colors[1]})`;
    background.style.opacity = 0.8;
  }, animationTime);
}

function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    throw new Error('Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function keyIsNotEnter() {
  return event && event.type === 'keydown' && (event.which !== 13 || event.keyCode !== 13);
}

function copyQuote() {
  if (keyIsNotEnter()) {
    return;
  }

  copyTextToClipboard(extractQuote());

  const currentTarget = event.currentTarget;

  const buttonText = currentTarget.textContent;
  currentTarget.textContent = 'Copied!';

  window.setTimeout(() => {
    currentTarget.textContent = buttonText;
  }, 3000);
}

function getQuote() {
  if (keyIsNotEnter()) {
    return;
  }
  quoteButton.classList.add('is-loading');
  const theme = pickRandomSample(Object.getOwnPropertyNames(quoteThemes));
  fetch(`https://cors-anywhere.herokuapp.com/https://www.forbes.com/forbesapi/thought/get.json?limit=1&start=${randomUpTo(quoteThemes[theme])}&themeuri=${theme}`)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    })
    .then((quote) => {
      const text = quote.thoughtList[0].quote;
      const author = quote.thoughtList[0].thoughtAuthor.name;
      const quoteTheme = quote.thoughtList[0].thoughtThemes[0].name;

      const quoteContainer = document.getElementById('quote');
      const authorContainer = document.getElementById('author');
      const themeContainer = document.getElementById('quote-theme');

      quoteContainer.classList.remove('show');
      authorContainer.classList.remove('show');
      themeContainer.classList.remove('show');
      copyButton.classList.remove('show');

      quoteButton.dispatchEvent(changeBackgroundEvent);
      window.setTimeout(() => {
        quoteContainer.innerHTML = `<span class="icon"><i class="fa fa-quote-left"></i></span>${text}`;
        authorContainer.innerText = author;
        themeContainer.innerText = quoteTheme;

        quoteContainer.classList.add('show');
        themeContainer.classList.add('show');
        authorContainer.classList.add('show');
        copyButton.classList.add('show');

        quoteButton.classList.remove('is-loading');
      }, animationTime);
    })
  ;
}

// Event Listeners
fetch('https://cdn.rawgit.com/ghosh/uiGradients/master/gradients.json')
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  })
  .then((gradients) => {
    quoteButton.addEventListener('changeBackground', changeBackground.bind(null, gradients));
  })
;

function sendToFacebook() {
  if (keyIsNotEnter()) {
    return;
  }
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&picture=${encodeURIComponent('https://image.freepik.com/free-icon/conversation-mark-interface-symbol-of-circular-speech-bubble-with-quotes-signs-inside_318-56572.jpg')}&title=Daily+quotes&quote=Get+your+daily+quote&description=${encodeURIComponent(extractQuote())}`);
}

function sendToTweeter() {
  if (keyIsNotEnter()) {
    return;
  }
  const quote = extractQuote();
  let url = 'https://twitter.com/intent/tweet?text=';
  if (quote.length <= 140) {
    url += quote;
  } else {
    url += `Awesome quotes at ${window.location.href}`;
  }
  window.open(url);
  window.open(`https://twitter.com/intent/tweet?text=Binge on popular quotes at ${window.location.href}`);
}

function sendToEmail() {
  if (keyIsNotEnter()) {
    return;
  }
  window.open(`mailto:?subject=Quote&body=${encodeURI(extractQuote())}`);
}

buttons.forEach(button => button.addEventListener('click', () => event.currentTarget.blur()));

buttons.forEach((button) => {
  switch (button.id) {
    case 'facebook':
      button.addEventListener('click', sendToFacebook);
      button.addEventListener('keydown', sendToFacebook);
      break;
    case 'twitter':
      button.addEventListener('click', sendToTweeter);
      button.addEventListener('keydown', sendToTweeter);
      break;
    case 'email':
      button.addEventListener('click', sendToEmail);
      button.addEventListener('keydown', sendToEmail);
      break;
    default:
      break;
  }
});

copyButton.addEventListener('mouseenter', () => {
  event.currentTarget.parentElement.classList.add('focus');
});
copyButton.addEventListener('mouseleave', () => {
  event.currentTarget.parentElement.classList.remove('focus');
});
copyButton.addEventListener('click', copyQuote);
copyButton.addEventListener('keydown', copyQuote);

quoteButton.addEventListener('click', getQuote);
quoteButton.addEventListener('keydown', getQuote);

getQuote();

