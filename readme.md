# react-contentscript-redux


Intended to be used in tandem with [react-chrome-redux](https://github.com/tshaddix/react-chrome-redux),
this package provides a set of utilities to extend the Redux store bridge into
user injected scripts from contentscripts.

## Install

    npm install react-contentscript-redux

## Usage

### 1. In the content scripts, wrap your Redux ProxyStore from react-chrome-redux with `wrapStore()`

```js
import { Store } from 'react-chrome-redux';
import { wrapStore } from 'react-contentscript-redux';

// Create a script element to inject in the page
var script = document.createElement('script');
script.src = chrome.extension.getURL('script.js');

// Wait for the script to load before creating the store and wrapping it with wrapStore()
script.onload = function() {
  const proxyStore = new Store({ portName: 'futbudd' });
  wrapStore(proxyStore);
};

(document.head || document.documentElement).appendChild(script);
```

### 2. In the injected script, use the proxy store from react-contentscript-redux

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from 'react-contentscript-redux';
import App from './components/App';

const anchor = document.createElement('div');
anchor.id = 'app-anchor';
document.body.insertBefore(anchor, document.body.childNodes[0]);

const store = new Store();
store.ready().then(() => {
  render(<Provider store={store}><App/></Provider>, document.getElementById('app-anchor'));
});
```

---

\o/
