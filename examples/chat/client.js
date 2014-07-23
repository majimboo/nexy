var Nexy = require('../../'),
  app = Nexy.createClient();

// just for the chat interface
var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout);

// see details about message keys below
app.set('msg:key', 'type');

app.use(function(req, res, next) {
  req.params = req;
  next();
});

// first message to initialize communication
app.connect(2101, function(res) {
  rl.question('What is your name?\n', function(answer) {
    res.write(JSON.stringify({
      type: 'join',
      nick: answer
    }));

    rl.on('line', function(line) {
      line = line.trim();
      res.write(JSON.stringify({
        type: 'chat',
        nick: answer,
        msg: line
      }));

    }).on('close', function() {
      console.log('Have a great day!');
      process.exit(0);
    });
  });
});

app.route('joined', function(req, res) {
  console.log(req.params.nick + ' has joined the chatroom');
});

app.route('chat', function(req, res) {
  console.log(req.params.nick + ': ' + req.params.msg);
});
