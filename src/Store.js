
export default class Store {
  constructor(state = {}) {
    this.state = state;
    this.listeners = [];
    this.readyResolved = false;
    this.readyPromise = new Promise(resolve => this.readyResolve = resolve);

    console.log('set listener');
    window.addEventListener('message', (event) => {
      const { data } = event;
      // We only accept messages from ourselves
      if (event.source !== window) return;

      console.log('got message', data);
      if (data.type == 'REPLACE_STATE') {
        this.replaceState(data.state);

        if (!this.readyResolved) {
          this.readyResolved = true;
          this.readyResolve();
        }
      } else if (data.type === 'PATCH_STATE') {
        this.patchState(data.state);
      }
    }, false);
  }

  ready(cb) {
    if (cb) {
      return this.readyPromise.then(cb);
    }

    return this.readyPromise;
  }

  replaceState(state) {
    this.state = state;
    this.listeners.forEach(l => l());
  }

  patchState(state) {
    this.state = state;
    this.listeners.forEach(l => l());
  }

  subscribe(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    window.postMessage({ type: 'PAGE_DISPATCH', action }, '*');
  }
}
