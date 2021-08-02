if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('workbox-sw.js').catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Unable to register service worker.', err)
  })
}
