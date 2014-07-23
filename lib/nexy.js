var Core = require('./core');

module.exports = Nexy = {};

Nexy.createServer = function(port, host) {
  var app = new Core();

  if (port) {
    app.listen(port, host);
  }

  return app;
};

Nexy.createClient = function() {
  var app = new Core();

  // cannot listen
  app.listen = function() {
    throw new Error('not implemented');
  };

  return app;
};
