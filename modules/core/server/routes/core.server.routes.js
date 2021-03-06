'use strict';

module.exports = function(app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib|developers)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
