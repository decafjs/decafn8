/**
 * @fileoverview JavaScript Threads
 */

/*global builtin */
"use strict";
var process = require('process');

var threads = {},
    threadCount = 0,
//    javaThreads = {},
    nextThreadId = 0;

//var allocThreadId = sync(function () {
//    while (true) {
//        ++nextThreadId;
//        nextThreadId %= 65536;
//        if (!threads[nextThreadId]) {
//            return nextThreadId;
//        }
//    }
//}, threads);

var addThread = sync(function(threadId, thread) {
    threads[threadId] = thread;
    threadCount++;
}, threads);

var removeThread = sync(function(threadId) {
    if (threads[threadId]) {
        delete threads[threadId];
        threadCount--;
    }
}, threads);

/** @module Thread */
/**
 * Create a new Thread
 *
 * Note: the thread isn't started, it is only created
 *
 * @param {Function} fn - function to run as thread
 * @constructor
 */
function Thread(fn) {
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }
    decaf.extend(this, {
        fn        : fn,
        args      : args,
        lockCount : 0,
        listeners : {},
        data      : {}
    });
}

/**
 * Exit the currently running thread
 */
Thread.exit = function() {
    // console.log('THREAD.EXIT');
    throw 'THREAD.EXIT';
};

/**
 * Get current Thread
 */
var mainThread = {
    on: function() {
        
    }
};

Thread.currentThread = sync(function() {
    var t = java.lang.Thread.currentThread();
    return threads[t] || mainThread;
//    return javaThreads[t.getId()] || mainThread;
}, threads);

Thread.threadCount = function() {
    return threadCount;
};

/**
 *
 * @memberOf Thread
 * @param secs
 */
Thread.sleep = function(secs) {
    process.sleep(secs);
};

/**
 *
 * @memberOf Thread
 * @param usecs
 */
Thread.usleep = function(usecs) {
    process.usleep(usecs);
};

decaf.extend(Thread.prototype, {
    /**
     *
     * @memberOf Thread
     * @param event
     * @param fn
     */
    on          : function(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    },

    /**
     *
     * @memberOf Thread
     * @param event
     */
    fire        : function(event) {
        var me = this;
        if (me.listeners[event]) {
            var args = [];
            for (var i = 1, len = arguments.length; i < len; i++) {
                args.push(arguments[i]);
            }
            decaf.each(me.listeners[event], function(fn) {
                fn.apply(me, args);
            });
        }
    },

    /**
     * Start the thread running
     * @memberOf Thread
     */
    start       : function() {
        var me = this;
        new java.lang.Thread(new java.lang.Runnable({ run : me.runHandler, scope : me})).start();
    },

    /**
     * @private
     * @memberOf Thread
     */
    runHandler  : function() {
        var me = this.scope,
            t = java.lang.Thread.currentThread();

        addThread(t, me);
//        me.javaThreadId = t.getId();
//        javaThreads[me.javaThreadId] = me;
        try {
            me.fn.apply(me, me.args);
        }
        catch (e) {
            if (e !== 'THREAD.EXIT') {
                console.log(e);
            }
        }
        finally {
            me.exitHandler(me);
        }
    },

    /**
     *
     * @memberOf Thread
     * @param me
     * @private
     */
    exitHandler : function(me) {
        me.fire('exit');
        if (me.lockCount) {
            // unlock any mutexes
        }
        removeThread(me);
//        delete javaThreads[me.javaThreadId];
//        delete threads[me.threadId];
//        threadCount--;
    }
});

decaf.onIdle(function() {
    return threadCount != 0;
});

exports.Thread = Thread;
