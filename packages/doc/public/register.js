if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('workbox-sw.js').catch((err) => {
    console.error('Unable to register service worker.', err)
  })
}
