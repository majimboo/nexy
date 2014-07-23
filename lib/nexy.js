var Core = require('./core');

module.exports = createServer;

function createServer() {
    var app = new Core();

    return app;
}
