'use strict';

var support = require('./../lib/support')
  , path = require('path')
  , lodash = require('lodash')
  , Sequelize = require('sequelize')
  , CONFIG = require('../config')
  , config = require(CONFIG.MODELS_CONFIG)
  , eventsLog = require('./../lib/log/events')
  , db = {}

  , options = lodash.extend({
      logging: eventsLog.debug
    }, config.options || {})

  , conn = config.connection
  , sequelize = new Sequelize(conn.database, conn.user, conn.password, options);


function isModel(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (/\.js/i.test(file));
}

function importModel(file) {
  try {
    /* jshint -W024 */
    var model = sequelize.import(path.resolve(CONFIG.MODELS_DIR, file));
    /* jshint +W024 */
    db[model.name] = model;
    eventsLog.debug('model registered', model.name);
  }
  catch (error) {
    eventsLog.error('Cannot load model', file);
  }
}

support
  .loadFiles(CONFIG.MODELS_DIR)
  .filter(isModel)
  .forEach(importModel);

for (var modelName in db) {
  if ('associate' in db[modelName]) {
    db[modelName].associate.call(db[modelName], db);
    eventsLog.debug('model associated', modelName);
  }
}

Object.defineProperties(module.exports, {
  sequelize: {
    value: sequelize
  },
  Sequelize: {
    value: Sequelize
  }
});

module.exports = lodash.extend(module.exports, db);

