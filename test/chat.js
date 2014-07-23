var should = require('chai').should(),
  Nexy = require('../'),
  net = require('net');

describe('#Chat', function() {
  var client, client2, server;

  before(function() {
    server = Nexy.createServer(2101);
    client = Nexy.createClient();
    client2 = Nexy.createClient();
  });

  after(function() {
    server.close();
    client.close();
    client2.close();
  });

  it('README example should work as expected', function(done) {
    // server side
    server.set('msg:key', 'type');
    server.set('clients', []);

    // body-parser middleware
    server.use(function(req, res, next) {
      req.params = req;
      next();
    });

    server.route('join', function(req, res) {
      var nick = req.params.nick;

      // add client to pool
      server.get('clients').push({
        nickname: nick,
        socket: res
      });

      // inform other clients of new joined
      server.get('clients').forEach(function(client, i, array) {
        if (client.nickname !== nick)
          client.socket.send({
            type: 'joined',
            nick: nick
          });
      });
    });

    // client side
    client.set('msg:key', 'type');

    // body-parser middleware
    client.use(function(req, res, next) {
      req.params = req;
      next();
    });

    // the client that should be notified
    client.connect(2101, function(res) {
      res.write(JSON.stringify({
        type: 'join',
        nick: 'iAmMaj'
      }));
    });

    // a second connecting client
    client2.connect(2101, function(res) {
      res.write(JSON.stringify({
        type: 'join',
        nick: 'iAmMaj2'
      }));
    });

    client.route('joined', function(req, res) {
      req.params.nick.should.be.equal('iAmMaj2');
      done();
    });
  });
});
