'use strict';

/**
 * Rename this file to local.js for having local configuration variables that
 * will not get commited and pushed to remote repositories.
 * Use it for your API keys, passwords, etc.
 *
 * Load order:
 * - default.js
 * - {development|production|test}.js
 * - local.js
 */

module.exports = {

  // See https://github.com/andris9/Nodemailer#tldr-usage-example how to configure mailer
  // In production we're using Mandrill https://mandrillapp.com
  /*
  mailer: {
    from: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
      }
    }
  }
  */

  // Uncomment if you want to have Mapbox maps at development environment
  /*
  mapbox: {
    map: {
      default: 'k8mokch5',
      satellite: 'kil7hee6',
      hitchmap: 'ce8bb774'
    }
  }
  */
};
