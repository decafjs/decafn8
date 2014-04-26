/**
 * @module http
 * @submodule Child
 * @private
 */

/*!
 * @private
 * @ignore
 */
/*global require, exports, log, sync, java, io */
(function() {
    "use strict";

    var Thread = require('threads').Thread,
        InputStream = require('net').InputStream,
        OutputStream = require('net').OutputStream,
        Request = require('./Request').Request,
        Response = require('./Response').Response,
        WebSocket = require('./WebSocket').WebSocket;

    function handleRequest(is, os, fn, webSockets) {
        var request = new Request(is),
            response = new Response(os, request.proto),
            keepAlive = true;

        this.req = request;
        this.res = response;
        request.threadId = this.threadId;
        request.scope = this;

        this.fire('startRequest', request, response);

        var connection = (request.headers['connection'] || '').toLowerCase(),
            headers = response.headers;
        if (connection === 'upgrade') {
            if (request.headers['upgrade'].toLowerCase() !== 'websocket') {
                return false;
            }
            if (webSockets[request.uri]) {
                var ws = new WebSocket(request, response);
                webSockets[request.uri](ws);    // socket connect
                ws.run();                       // handle the socket until close, etc.
            }
            return false;
        }
        else if (connection === 'keep-alive') {
            headers['Connection'] = 'Keep-Alive';
            headers['keep-alive'] = 'timeout: 5; max = 10000000';
        }
        else {
            headers['Connection'] = 'close';
            keepAlive = false;
        }
        if (fn.call(this, request, response) === false) {
            headers['Connection'] = 'close';
            keepAlive = false;
        }
        return keepAlive;
    }

    /**
     * Thread to handle HTTP requests.
     *
     * There are typically numChildren (see Server.listen) Child threads spawned at start.
     *
     * The Child logic is two nested loops.  The outer loop accepts connections.  The inner loop
     * processes requests on the accepted connection until the connection is closed or until
     * the HTTP protocol requires the connection to be closed (Connection: close).
     *
     * If a request is an upgrade to WebSocket, the thread becomes dedicated to servicing the
     * socket.
     *
     * A Request and Response object are created for each request handled.  See http/Request.js
     * and http/Response.js for details.
     *
     * @param {Socket} serverSocket the Socket to accept connections from
     * @param {object} server instance of the http Server that spawned this child
     * @constructor
     */
    function Child(serverSocket, server) {
        var me = this;      // current Thread

        me.on('exit', function() {
            new Thread(Child, serverSocket, server).start();
        });

        var accept = sync(function() {
            return serverSocket.accept();
        });

        var fn = server.fn,
            webSockets = server.webSockets;

        while (true) {
            var sock = serverSocket.accept();
//            var sock = accept();

            var is = new InputStream(sock),
                os = new OutputStream(sock);

            var keepAlive = true;
            while (keepAlive) {
                try {
//                    var start = new Date().getTime(); // java.lang.System.nanoTime();
                    keepAlive = keepAlive && handleRequest.call(this, is, os, fn, webSockets);
                    me.fire('endRequest');
//                    var elapsed = new Date().getTime() - start; // java.lang.System.nanoTime() - start;
//                    console.log(elapsed);
                }
                catch (e) {
                    if (e === 'THREAD.EXIT') {
                        throw e;
                    }
                    else if (e === 'EOF') {
                        break;
                    }
                    else if (e.dumpText) {
                        e.dumpText();
                    }
					else if (e === 'RES.STOP') {
						continue;
					}
                    else {
                        print('child exception');
//                        console.dir(e);
                        if (e.stack) {
                            console.log(e.stack);
                        }
                        else {
                            console.dir(e);
                        }
                    }
                    keepAlive = false;
                }
            }
            is.destroy();
            os.destroy();
            sock.destroy();
        }
    }

    decaf.extend(exports, {
        Child : Child
    });

}());
