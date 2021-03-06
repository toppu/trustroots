'use strict';

/*
 * Please don't make your own config changes to this file!
 * Copy local.sample.js to local.js and make your changes there. Thanks.
 *
 * Load order:
 * - default.js
 * - {development|production|test}.js
 * - local.js
 */

module.exports = {
  db: {
    uri: 'mongodb://localhost/trust-roots-test',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  port: 3001,
  app: {
    title: 'Trustroots test environment.',
    description: 'Trustroots test environment.',
    tagline: 'Trustroots test environment.'
  },
  mapbox: {
    // Mapbox is publicly exposed to the frontend
    user: process.env.MAPBOX_USERNAME || 'trustroots',
    map: {
      default: process.env.MAPBOX_MAP_DEFAULT || false,
      satellite: process.env.MAPBOX_MAP_SATELLITE || false,
      hitchmap: process.env.MAPBOX_MAP_HITCHMAP || false
    },
    publicKey: process.env.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidHJ1c3Ryb290cyIsImEiOiJVWFFGa19BIn0.4e59q4-7e8yvgvcd1jzF4g'
  }
};
