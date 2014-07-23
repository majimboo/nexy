var Nexy = require('../../'),
  app = Nexy.createServer();

// see details about message keys below
app.set('msg:key', 'type');

// connection pool
app.set('clients', {});

app.use(function(req, res, next) {
  req.params = req;
  next();
});

app.route('join', function(req, res) {
  var clients = app.get('clients');

  var nick = req.params.nick;

  console.log(nick + ' has joined');

  // add joining client to pool
  clients[res.remotePort] = {
    nickname: nick,
    socket: res
  };

  // tell all other connected clients that `nick` has joined
  for (var client in clients) {
    clients[client].socket.write(JSON.stringify({
      type: 'joined',
      nick: nick
    }));
  }
});

app.route('chat', function(req, res) {
  var clients = app.get('clients');

  var nick = req.params.nick;
  var msg = req.params.msg;

  console.log('from ' + nick + ': ' + msg);

  // broadcast msg
  for (var client in clients) {
    clients[client].socket.write(JSON.stringify({
      type: 'chat',
      nick: nick,
      msg: msg
    }));
  }
});

// handle any kind of disconnections
app.on('disconnect', function(res) {
  var clients = app.get('clients');

  // res.type
  //     - end
  //     - error
  //     - kicked
  delete clients[res.remotePort];
});

app.listen(2101);
