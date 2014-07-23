Nexy
====

Nexy is a middleware based TCP framework for Node. Inspired by Sencha's connect. Written for Multiplayer Games.

Quickstart
----

**Simple Chat Server**

    Nexy = require('nexy'),
    app = Nexy();

    // see details about messages types below
    app.set('message type', 'json');
    // see details about method key below
    app.set('method key', 'type')

    app.use('roomchat', function(req, res) {
        var nik = req.params.nick;
        var msg = req.params.message;

        // do stuff
    });

    app.listen(2101);

Configuration
----

###Method Key

Status: `Not Yet Implemented` | Default: `type`

This will let Nexy know how to route your requests. Unlike HTTP servers, TCP server doesn't know where to route your request unless you specify what type of data you are sending on the message itself.

    app.set('message type', 'json');
    app.set('method key', 'type');

Will assume that the messages sent from the client is a similar format:

    {  type: 'roomchat', nick: 'iamNick', message: 'secret'  }

The **method key** is `type: roomchat`.

###Message Type

Status: `Not Yet Implemented` | Default: `json` Options: `json | binary`

This will let Nexy what kind of data you are sending. You can choose between `json` and `binary`.

    app.set('message type', 'binary');

Will assume that the data you sent from the client are in binary format:

    < Buffer 0A 00 01 00 00 00 00 00 00 00 >

Let us break down the example above:


TODO
----

- add nexy as a client
- add message type support
- add method key support
- update README
