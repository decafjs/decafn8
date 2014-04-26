/**
 * @module http
 * @main http
 */


/*global require, exports */

(function() {
    "use strict";

    var createServer = require('./lib/Server').createServer;

    decaf.extend(exports, {
        createServer: createServer,
        methods: require('./lib/Methods').methods,
        Child: require('./lib/Child'),
        Request: require('./lib/Request'),
        Response: require('./lib/Response'),
        WebSocket: require('./lib/WebSocket').WebSocket,
		Json: require('./lib/Json').Json,
        GZIP: require('./lib/GZIP').GZIP,
        Client: require('./lib/Client').Client
    });

}());
