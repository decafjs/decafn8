/**
 * Created by mschwartz on 4/25/14.
 */

/*global load, toString */

var global = this;
global.__dirname = java.lang.System.getProperty('user.dir');

// Object.prototype.__lookupGetter__
Object.defineProperty(Object.prototype, "__lookupGetter__", {
    configurable : true, enumerable : false, writable : true,
    value        : function( name ) {
        var obj = this;
        while (obj) {
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc) return desc.get;
            obj = Object.getPrototypeOf(obj);
        }
        return undefined;
    }
});

// Object.prototype.__lookupSetter__
Object.defineProperty(Object.prototype, "__lookupSetter__", {
    configurable : true, enumerable : false, writable : true,
    value        : function( name ) {
        var obj = this;
        while (obj) {
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc) return desc.set;
            obj = Object.getPrototypeOf(obj);
        }
        return undefined;
    }
});


(function() {
    function isArray( a ) {
        return toString.apply(a) === '[object Array]';
    }

    function isObject( o ) {
        return !!o && Object.prototype.toString.call(o) === '[object Object]';
    }

    function isError( e ) {
        return !!e && Object.prototype.toString.call(e) === '[object Error]';
    }

    function isDate( date ) {
        return toString.apply(date) === '[object Date]';
    }

    function isFunction( f ) {
        return toString.apply(f) === '[object Function]';
    }

    function isJava( c ) {
        return toString.apply(c).indexOf('[object Java') !== -1;
    }

    function isString( s ) {
        return typeof s === 'string';
    }

    function isNumber( n ) {
        return typeof n === 'number' && isFinite(n);
    }

    function isBoolean( b ) {
        return typeof b === 'boolean';
    }

    function isGlobal( o ) {
        return !!o && Object.prototype.toString.call(o) === '[object global]';
    }

    var prefix = java.lang.System.getProperty('decafn8') || '.';
    prefix += '/';

    global.d = function( o, max, sep, l ) {
        print(d.print_r(o, max, sep, l));
    };
    d.each = function( o, fn ) {
        for (var key in o) {
            if (o.hasOwnProperty && o.hasOwnProperty(key)) {
                if (fn.call(o, o[key], key, o) === false) {
                    return;
                }
            }
        }
    };
    d.extend = function( me ) {
        var args = Array.prototype.slice.call(arguments, 1);
        d.each(args, function( o ) {
            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    if (!o.__lookupGetter__) {
                        print(o);
                    }
                    var g = o.__lookupGetter__(key), s = o.__lookupSetter__(key);
                    if (g || s) {
                        if (g) {
                            me.__defineGetter__(key, g);
                        }
                        if (s) {
                            me.__defineSetter__(key, s);
                        }
                    }
                    else {
                        me[key] = o[key];
                    }
                }
            }
        });
        return me;
    };
    d.extend(d, {
        decafn8    : prefix,
        isObject   : isObject,
        isGlobal   : isGlobal,
        isArray    : isArray,
        isError    : isError,
        isDate     : isDate,
        isFunction : isFunction,
        isJava     : isJava,
        isString   : isString,
        isNumber   : isNumber,
        isBoolean  : isBoolean,

        include    : function( file ) {
            load(d.decafn8 + 'builtins/' + file);
        },

        toJavaByteArray: function(thing, encoding) {
            if (typeof thing === 'string') {
                return encoding ? new java.lang.String(thing).getBytes(encoding) : new java.lang.String(thing).getBytes();
            }
            else {
                var len = thing.length,
                    ByteArray = Java.type('byte[]');

                var v = new ByteArray(len); // java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, len);
                try {
                    for (var i = 0; i < len; i++) {
                        v[i] = thing[i];
                    }
                }
                catch (e) {
                    throw new Error('d.toJavaByteArray - array contains invalid values');
                }
                return v;
            }
        }

    });

    d.include('print_r.js');
    d.include('sync.js');

    d(this);
}());

