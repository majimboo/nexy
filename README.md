Nexy [![Build Status](https://travis-ci.org/majimboo/nexy.svg?branch=master)](https://travis-ci.org/majimboo/nexy)
====

Nexy is a middleware based TCP framework for Node. Inspired by Sencha's connect. Written for Multiplayer Games.

Quickstart
----

**Installation**

    npm install nexy

**Simple Chat Server**

    var Nexy = require('nexy'),
        app = Nexy.createServer();

    // see details about message keys below
    app.set('msg:key', 'type');

    // connection pool
    app.set('clients', []);

    // param middleware here (see below)

    app.route('join', function(req, res) {
        var nick = req.params.nick;

        // add joining client to pool
        app.get('clients').push({ nickname: nick, socket: res });

        // tell all other connected clients that `nick` has joined
        app.get('clients').forEach(function(client, i, array) {
            client.socket.send({ type: 'joined', nick: nick });
        });
    });

    app.listen(2101);

**Simple Chat Client**

    var Nexy = require('nexy'),
        app = Nexy.createClient();

    // see details about message keys below
    app.set('msg:key', 'type');

    // param middleware here (see below)

    // first message to initialize communication
    app.connect(2101, function(res) {
        res.write(JSON.stringify({ type: 'join', nick: 'iAmMaj' }));
    });

    app.route('joined', function(req, res) {
        console.log(req.params.nick + ' has joined the chatroom');
    });

**Simple Middleware**

> Add this to the client and server so you can use `req.params.*`.

    // param middleware
    app.use(function(req, res, next) {
        req.params = req;
        next();
    });

Configuration
----

###Message Key

Unlike HTTP servers, TCP server doesn't know where to route your request unless you specify what type of data you are sending on the message itself.

By default Nexy will expect the following payload:

    {  method: 'roomchat', nick: 'iAmMaj', message: 'secret'  }

If you set the `msg:key` to:

    app.set('msg:key', 'type');

Then Nexy will expect the following payload:

    {  type: 'roomchat', nick: 'iAmMaj', message: 'secret'  }

If you set the `msg:key` to:

    app.set('msg:key', 'MyCustomType');

Then Nexy will expect the following payload:

    {  MyCustomType: 'roomchat', nick: 'iAmMaj', message: 'secret'  }

> Note: In binary this is the identity.

Binary
----

JSON is a very heavy format and is not efficient enough, so we can use binary structures instead.

**Format**

    < size > < id > < content >
    ----
    size     : uint16
    identity : uint16
    content  : mix
    order    : LittleEndian
    ----
    < Buffer 05 00 01 00 03 >
    size     : 5
    identity : 1
    content  : 3

###Example

**Binary Chat Server**

    var Nexy = require('nexy'),
        app = Nexy.createServer();

    // see details about message keys below
    app.set('msg:key', 'type');

    // connection pool
    app.set('clients', []);

    // param middleware here (see below)

    app.route('join', function(req, res) {
        var nick = req.params.nick;

        // add joining client to pool
        app.get('clients').push({ nickname: nick, socket: res });

        // tell all other connected clients that `nick` has joined
        app.get('clients').forEach(function(client, i, array) {
            client.socket.send({ type: 'joined', nick: nick });
            client.socket.write('\x05\x00\x01\x00\x03');
        });
    });

    app.listen(2101);

**Binary Chat Client**

    var Nexy = require('nexy'),
        app = Nexy.createClient();

    // see details about message keys below
    app.set('msg:key', 'type');

    // param middleware here (see below)

    // first message to initialize communication
    app.connect(2101, function(res) {
        res.write(JSON.stringify({ type: 'join', nick: 'iAmMaj' }));
        res.write('\x05\x00\x01\x00\x03');
    });

    app.route('joined', function(req, res) {
        console.log(req.params.nick + ' has joined the chatroom');
    });

**Param Parser Middleware**

    // param middleware
    app.use(function(req, res, next) {
        req.params = req;
        next();
    });

TODO
----

- improve overall API
- add more features
- add more examples
- update README
