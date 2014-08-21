var Core = require('./core');

module.exports = Nexy = {};

Nexy.createServer = function(port, host, callback) {
  var app = new Core();

  if (port) {
    app.listen(port, host);
  }

  if (callback) {
    callback();
  }

  return app;
};

Nexy.createClient = function(callback) {
  var app = new Core();

  // cannot listen
  app.listen = function() {
    throw new Error('not implemented');
  };

  if (callback) {
    callback();
  }

  return app;
};
