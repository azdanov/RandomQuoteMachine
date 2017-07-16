'use strict';

(function initialize() {
  //Options
  var animationTime = 600;

  // Remove focus from buttons on click
  var buttons = Array.from(document.getElementsByClassName('button'));
  buttons.forEach(function (button) {
    return button.addEventListener('click', function () {
      return event.currentTarget.blur();
    });
  });

  function randomUpTo(num) {
    return Math.floor(Math.random() * num);
  }

  // Add gradient to background class
  function changeBackground(gradients) {
    var gradient = gradients[randomUpTo(gradients.length)];
    var background = document.getElementsByClassName('modal-background')[0];
    background.style.opacity = 0;
    window.setTimeout(function () {
      background.style.background = '-webkit-gradient(linear, left top, left bottom, from(' + gradient.colors[0] + '), to(' + gradient.colors[1] + '))';
      background.style.background = 'linear-gradient(' + gradient.colors[0] + ', ' + gradient.colors[1] + ')';
      background.style.opacity = 0.8;
    }, animationTime);
  }

  // Get gradients
  fetch('https://raw.githubusercontent.com/ghosh/uiGradients/master/gradients.json').then(function (response) {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  })
  // Add eventListener
  .then(function (gradients) {
    // changeBackground(gradients);
    document.getElementById('quote-button').addEventListener('click', changeBackground.bind(null, gradients));
  });

  // Copy button
  function copyTextToClipboard(text) {
    var textArea = document.createElement('textarea');

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

    document.body.removeChild(textArea);
  }

  var copyButton = document.getElementById('copy');
  copyButton.addEventListener('mouseenter', function () {
    event.currentTarget.parentElement.classList.add('focus');
  });
  copyButton.addEventListener('mouseleave', function () {
    event.currentTarget.parentElement.classList.remove('focus');
  });
  copyButton.addEventListener('click', function () {
    var quoteContainer = event.currentTarget.parentElement.children;
    var quote = '"' + quoteContainer.quote.innerText.trim() + '"\n' + quoteContainer.author.innerText.trim();
    copyTextToClipboard(quote);

    var buttonText = event.currentTarget.textContent;
    event.currentTarget.textContent = 'Copied!';

    window.setTimeout(function (button, text) {
      button.textContent = text;
    }.bind(null, event.currentTarget, buttonText), 3000);
  });

  // Quotes
  function pickRandomSample(topics) {
    var index = Math.floor(Math.random() * topics.length);
    return topics[index];
  }

  var themes = {
    'self': 144,
    'best': 12,
    'emotions': 17,
    'life': 207,
    'justice': 41,
    'wealth': 154,
    'laughter': 31,
    'anger': 65,
    'art': 108,
    'executives': 16,
    'power': 78,
    'education': 146,
    'wisdom': 108,
    'greatness': 63
  };

  function getQuote() {
    var headers = new Headers();

    var theme = pickRandomSample(Object.getOwnPropertyNames(themes));
    //fetch(`https//www.forbes.com/forbesapi/thought/get.json?limit=1&start=${randomUpTo(themes[theme])}&themeuri=${theme}`)
    fetch('quote.json').then(function (response) {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then(function (quote) {
      var text = quote.thoughtList[0].quote;
      var author = quote.thoughtList[0].thoughtAuthor.name;
      var theme = quote.thoughtList[0].thoughtThemes[0].name;
      var quoteContainer = document.getElementById('quote');
      var authorContainer = document.getElementById('author');
      var themeContainer = document.getElementById('theme');

      quoteContainer.style.opacity = 0;
      authorContainer.style.opacity = 0;
      themeContainer.style.opacity = 0;

      window.setTimeout(function () {
        quoteContainer.innerHTML = '<span class="icon">\n            <i class="fa fa-quote-left"></i>\n          </span>' + text + '<span class="icon">\n            <i class="fa fa-quote-right"></i>\n          </span>';
        authorContainer.innerText = author;
        themeContainer.innerText = theme;

        quoteContainer.style.opacity = 1;
        authorContainer.style.opacity = 1;
        themeContainer.style.opacity = 1;
      }, animationTime);
    });
  }

  document.getElementById('quote-button').addEventListener('click', getQuote);
})();