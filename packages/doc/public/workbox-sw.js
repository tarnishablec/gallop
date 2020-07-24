importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
)

if (self.workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

const { workbox } = self

workbox.routing.registerRoute(
  /index.html/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache'
  })
)

workbox.routing.registerRoute(
  /\/md\/.*.md.js(\?\w*)?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'md-cache'
  })
)

workbox.routing.registerRoute(
  /\/js\/.*.js(\?\w*)?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'js-cache'
  })
)

workbox.routing.registerRoute(
  /\/css\/.*.css(\?\w*)?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-cache'
  })
)

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  new workbox.strategies.CacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // Cache only 20 images
        maxEntries: 30,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
)
