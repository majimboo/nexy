var should = require('chai').should(),
    Nexy = require('../'),
    net = require('net');


/**
 * Nexy
 */

describe('#Nexy', function() {
    it('should be an exported function', function(done) {
        Nexy.should.be.an('Function');

        done();
    });
});


/**
 * App
 */

describe('#App', function() {
    var app, client, server;

    beforeEach(function() {
        app = Nexy();
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

        client.write('haller');
    });

    it('should accept data with handler', function(done) {
        app.route('default', function(req, res) {
            done();
        });

        client.write('haller');

    });

    it('should destroy anonymous request', function(done) {
        client.write('haller');
        client.on('close', function() {
            done();
        });
    });
});
