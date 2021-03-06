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
  app: {
    title: 'Trustroots',
    description: 'Travellers community for sharing, hosting and getting people together. Built with hitchhikers in mind. A world that encourages trust and adventure.',
    tagline: 'Hospitality exchange community for hitchhikers and other travellers.'
  },
  maxUploadSize: process.env.MAX_UPLOAD_SIZE || 10000000, // 10MB. Remember to change this to Nginx configs as well
  port: process.env.PORT || 3000,
  https: process.env.HTTPS || false,
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  domain: process.env.DOMAIN || 'localhost:3000',
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  mapbox: {
    // Mapbox is publicly exposed to the frontend
    user: process.env.MAPBOX_USERNAME || 'trustroots',
    map: {
      default: process.env.MAPBOX_MAP_DEFAULT || 'k8mokch5',
      satellite: process.env.MAPBOX_MAP_SATELLITE || 'kil7hee6',
      hitchmap: process.env.MAPBOX_MAP_HITCHMAP || 'ce8bb774'
    },
    publicKey: process.env.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidHJ1c3Ryb290cyIsImEiOiJVWFFGa19BIn0.4e59q4-7e8yvgvcd1jzF4g'
  },
  facebook: {
    page: process.env.FACEBOOK_PAGE || 'PAGE',
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    username: process.env.TWITTER_USERNAME || 'USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    page: process.env.GOOGLE_PAGE || 'PAGE',
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  googleAnalytics: {
    enabled: process.env.GA_ENABLED || false,
    code: process.env.GA_CODE || ''
  },
  piwik: {
    enabled: process.env.PIWIK_ENABLED || false,
    url: process.env.PIWIK_URL || 'PIWIK_URL',
    siteId: process.env.PIWIK_ID || 'PIWIK_ID'
  }
};
