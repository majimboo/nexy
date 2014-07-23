var net = require('net');
var debug = require('debug')('core');

function Nexy() {
    this.routes = {};
    this.settings = {};
    this.middlewares = [];
}

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
        route = req.method || 'default';

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
};

Nexy.prototype.set = function(setting, value) {
    this.settings[setting] = value;
};

Nexy.prototype.get = function(setting) {
    return this.settings[setting];
};

Nexy.prototype.listen = function() {
    var server = net.createServer(this.connection_callback.bind(this));
    this.server = server;
    return server.listen.apply(server, arguments);
};

Nexy.prototype.close = function() {
    this.server.close();
};
