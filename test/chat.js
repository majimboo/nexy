var should = require('chai').should(),
  Nexy = require('../'),
  net = require('net');

describe('#Chat', function() {
  var app, client, server;

  before(function() {
    app = Nexy();
    server = app.listen(2101);
    client = net.connect(2101);
  });

  after(function() {
    app.close();
  });

  it('should accept connections', function(done) {
    done();
  });
});
