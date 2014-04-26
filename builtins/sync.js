/**
 * Created by mschwartz on 4/25/14.
 */


function sync (func, obj) {
    var Lock = Java.type('java.util.concurrent.locks.ReentrantLock');

    if (arguments.length < 1 || arguments.length > 2 ) {
        throw "sync(function [,object]) parameter count mismatch";
    }

    var syncObject = (arguments.length == 2 ? obj : this);

    if (!syncObject._syncLock) {
        syncObject._syncLock = new Lock();
    }

    return function() {
        syncObject._syncLock.lock();
        try {
            func.apply(null, arguments);
        } finally {
            syncObject._syncLock.unlock();
        }
    };
}
