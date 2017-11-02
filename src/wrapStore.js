
export default (store) => {
  window.addEventListener('message', (event) => {
    // We only accept messages from ourselves
    if (event.source != window) return;

    const { data } = event;
    if (data.type == 'PAGE_DISPATCH') {
      store.dispatch(data.action);
    }
  }, false);

  store.subscribe(() => {
    const state = store.getState();
    window.postMessage({ type: 'PATCH_STATE', state }, '*');
  });

  store.ready().then(() => {
    window.postMessage({ type: 'REPLACE_STATE', state: store.getState() }, '*');
  });
};
