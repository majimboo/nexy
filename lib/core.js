var net = require('net');
var debug = require('debug')('core');
var util = require('util');
var events = require('events');

function Nexy() {
  this.routes = {};
  this.settings = {};
  this.middlewares = [];
}

util.inherits(Nexy, events.EventEmitter);
module.exports = Nexy;

Nexy.prototype.use = function(fn) {
  this.middlewares.push(fn);
};

Nexy.prototype.route = function(route, fn) {
  this.routes[route] = fn;
};

Nexy.prototype.go = function(req, res) {
  var routes = this.routes,
    middlewares = this.middlewares,
    index = 0,
    method = this.get('msg:key') || 'method'; // req.method

  // proxy write to send
  res.send = function(msg) {
    // auto stringify object
    try {
      res.write(msg);
    } catch (err) {
      res.write(JSON.stringify(msg));
    }
  };

  // try to parse json
  try {
    req = JSON.parse(req);
  } catch (err) {
    // assume packet id is after packet length
    req[method] = req.readUInt16LE(2);
  }

  // get the route
  var route = req[method] || 'default';

  // check if request has a handler
  var handler = routes[route];

  // destroy request with no handlers
  if (!handler)
    return res.destroy();

  function out(err, req, res) {
    if (err) {

      return;
    }

    // routing
    return routes[route](req, res);
  }

  function next(err) {
    var layer;

    // if an error is detected emit an error event
    if (err)
      return out(err);

    // next callback
    layer = middlewares[index++];

    debug('callback layer % s', index);

    // all out
    if (!layer)
      return out(err, req, res);

    // handle callback
    layer(req, res, next);
  }

  next();
};

Nexy.prototype.connection_callback = function(res) {
  res.on('data', function(req) {
    this.go(req, res);
  }.bind(this));

  // should also handle lost clients
  res.on('end', this.emit.bind(this, 'disconnect', res));
  res.on('close', this.emit.bind(this, 'disconnect', res));
  res.on('error', this.emit.bind(this, 'disconnect', res));
};

Nexy.prototype.set = function(setting, value) {
  this.settings[setting] = value;
  return this.settings[setting];
};

Nexy.prototype.get = function(setting) {
  return this.settings[setting];
};

Nexy.prototype.listen = function() {
  var server = net.createServer(this.connection_callback.bind(this));
  this.server = server;
  return server.listen.apply(server, arguments);
};

Nexy.prototype.connect = function(port, host, callback) {
  if (typeof host !== 'string') {
    callback = host;
    host = 'localhost';
  }

  var client = new net.Socket();
  this.client = client;
  client.connect(port, host, function() {
    this.connection_callback(client);
    callback(client);
  }.bind(this));
};

Nexy.prototype.close = function() {
  if (this.server) {
    this.server.close();
  } else {
    this.client.destroy();
  }
};
