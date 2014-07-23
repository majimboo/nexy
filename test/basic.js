var should = require('chai').should(),
  Nexy = require('../'),
  net = require('net');


/**
 * Nexy
 */

describe('#Nexy', function() {
  it('should be an exported Object', function(done) {
    Nexy.should.be.an('Object');

    done();
  });
});


/**
 * App
 */

describe('#App', function() {
  var app, client, server;

  beforeEach(function() {
    app = Nexy.createServer();
    server = app.listen(2101);
    client = net.connect(2101);
  });

  afterEach(function() {
    app.close();
  });

  it('should be an object', function(done) {
    app.should.be.an('Object');

    done();
  });

  it('should listen', function(done) {
    server.on('listening', function() {
      done();
    });
  });

  it('should accept connections', function(done) {
    client.on('connect', function() {
      done();
    });
  });

  it('should load middlewares', function(done) {
    app.use(function(req, res, next) {
      next();
    });

    app.route('default', function(req, res) {
      done();
    });

    client.write(JSON.stringify({
      method: 'default',
      data: 'haller'
    }));
  });

  it('should accept data with handler', function(done) {
    app.route('default', function(req, res) {
      done();
    });

    client.write(JSON.stringify({
      method: 'default',
      data: 'haller'
    }));
  });

  it('should destroy anonymous request', function(done) {
    client.write(JSON.stringify({
      method: 'default',
      data: 'haller'
    }));
    client.on('close', function() {
      done();
    });
  });

  it('should accept json request with custom method', function(done) {
    app.set('msg:key', 'custom');

    app.route('customRoute', function(req, res) {
      done();
    });

    client.write(JSON.stringify({
      custom: 'customRoute',
      data: 'haller'
    }));
  });

  it('should auto detect if binary', function(done) {
    app.route(0x01, function(req, res) {
      done();
    });

    client.write('\x05\x00\x01\x00\x00');
  });
});
