// importScripts(
//   'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js'
// )

// // self.addEventListener(
// //   'fetch',
// //   /** @param {FetchEvent} event */
// //   (event) => {
// //     const request = event.request

// //     // If we are requesting an HTML page.
// //     if (request.headers.get('Accept').includes('text/html')) {
// //       event.respondWith(
// //         // Check the cache first to see if the asset exists, and if it does, return the cached asset.
// //         caches.match(request).then((cached_result) => {
// //           if (cached_result) {
// //             return cached_result
// //           }
// //           // If the asset is not in the cache, fallback to a network request for the asset, and proceed to cache the result.
// //           return (
// //             fetch(request)
// //               .then((response) => {
// //                 const copy = response.clone()
// //                 // Wait until the response we received is added to the cache.
// //                 event.waitUntil(
// //                   caches.open('pages').then((cache) => {
// //                     return cache.put(request, copy)
// //                   })
// //                 )
// //                 return response
// //               })
// //               // If the network is unavailable to make a request, pull the offline page out of the cache.
// //               .catch(() => caches.match('/offline/'))
// //           )
// //         })
// //       ) // end respondWith
// //     } // end if HTML
// //   }
// // )

// if (self.workbox) {
//   console.log(`Yay! Workbox is loaded 🎉`)
// } else {
//   console.log(`Boo! Workbox didn't load 😬`)
// }

// self.workbox.routing.registerRoute(
//   /\/md\//,
//   new self.workbox.strategies.NetworkFirst({
//     cacheName: 'md-cache'
//   })
// )

// self.workbox.routing.registerRoute(
//   /\/js\/.*.js(\?\w*)?$/,
//   new self.workbox.strategies.NetworkFirst({
//     cacheName: 'js-cache'
//   })
// )

// self.workbox.routing.registerRoute(
//   /\/css\/.*.css(\?\w*)?$/,
//   new self.workbox.strategies.NetworkFirst({
//     cacheName: 'css-cache'
//   })
// )

// self.workbox.routing.registerRoute(
//   // Cache image files
//   /.*\.(png|jpg|jpeg|svg|gif|woff2)/,
//   // Use the cache if it's available
//   new self.workbox.strategies.CacheFirst({
//     // Use a custom cache name
//     cacheName: 'image-cache',
//     plugins: [
//       new self.workbox.expiration.ExpirationPlugin({
//         // Cache only 20 images
//         maxEntries: 30,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 7 * 24 * 60 * 60
//       })
//     ]
//   })
// )
