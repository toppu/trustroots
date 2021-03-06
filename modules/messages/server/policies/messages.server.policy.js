'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Messages Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/messages',
      permissions: []
    }, {
      resources: '/api/messages/:messageUserId',
      permissions: []
    }, {
      resources: '/api/messages-read',
      permissions: []
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/messages',
      permissions: ['get', 'post']
    }, {
      resources: '/api/messages/:messageUserId',
      permissions: ['get']
    }, {
      resources: '/api/messages-read',
      permissions: ['post']
    }]
  }]);
};


/**
 * Check If Messages Policy Allows
 */
exports.isAllowed = function(req, res, next) {

  // No messages feature for un-published users
  if(req.user && req.user.public !== true) {
    return res.status(403).json({
      message: errorHandler.getErrorMessageByKey('forbidden')
    });
  }

  // Check for user roles
  var roles = (req.user && req.user.roles) ? req.user.roles : ['guest'];
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).json({
        message: 'Unexpected authorization error'
      });
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: errorHandler.getErrorMessageByKey('forbidden')
        });
      }
    }
  });

};
