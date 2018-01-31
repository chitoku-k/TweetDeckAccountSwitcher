const script = document.createElement("script");
script.src = chrome.extension.getURL("js/inject.js");
script.onload = () => script.remove();
document.body.appendChild(script);
