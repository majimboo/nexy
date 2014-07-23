Nexy [![Build Status](https://travis-ci.org/majimboo/nexy.svg?branch=master)](https://travis-ci.org/majimboo/nexy)
====

Nexy is a middleware based TCP framework for Node. Inspired by Sencha's connect. Written for Multiplayer Games.

Quickstart
----

**Simple Chat Server**

    Nexy = require('nexy'),
    app = Nexy.createServer();

    // see details about message keys below
    app.set('msg:key', 'type');

    // connection pool
    app.set('clients', []);

    app.route('join', function(req, res) {
        var nik = req.params.nick;

        // add joining client to pool
        app.get('clients').push({ nickname: nik, socket: res });

        // tell all other connected clients that `nik` has joined
        app.get('clients').forEach(function(client, i, array) {
            if (client.nickname !== nik) {
                client.socket.write({ type: 'joined', nick: nik });
            }
        });
    });

    app.listen(2101);

**Simple Chat Client**

    Nexy = require('nexy'),
    app = Nexy.createClient();

    // see details about message keys below
    app.set('msg:key', 'type');

    // first message to initialize communication
    app.connect('2101', function(res) {
        res.write({ type: 'join', nick: 'iAmMaj' });
    });

    app.route('joined', function(req, res) {
        console.log(req.params.nick + ' has joined the chatroom');
    });

Configuration
----

###Message Key

This will let Nexy know how to route your requests. Unlike HTTP servers, TCP server doesn't know where to route your request unless you specify what type of data you are sending on the message itself.

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



TODO
----

- add nexy as a client
- add more examples
- update README
