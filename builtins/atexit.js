/**
 * Created with WebStorm.
 * User: mschwartz
 * Date: 4/25/14
 * Time: 5:19 PM
 */

(function() {
    var d = global.decaf,
        exitFuncs = [],
        startFuncs = [],
        idleFuncs = [];

    d.extend(exports, {
        /**
         * Register function to be run at exit
         *
         * @memberOf builtin
         * @param func
         */
        atExit : function( func ) {
            exitFuncs.push(func);
        },

        /**
         * Register function to be run at exit
         *
         * @memberOf builtin
         * @param func
         */
        atexit : function( func ) {
            exitFuncs.push(func);
        },

        /**
         * Register function to be run at startup
         *
         * @memberOf builtin
         * @param func
         */
        atStart : function( func ) {
            startFuncs.push(func);
        },

        /**
         * Register function to be run at startup
         *
         * @memberOf builtin
         * @param func
         */
        atstart : function( func ) {
            startFuncs.push(func);
        },

        onIdle : function( func ) {
            idleFuncs.push(func);
        },

        /**
         * Execute all the startup functions
         *
         * @memberOf builtin
         * @private
         */
        _main : function() {
            d.each(startFuncs, function( fn ) {
                fn();
            });
        },

        _idle : function() {
            var ret = false;
            d.each(idleFuncs, function(fn) {
                ret = fn();
                if (!ret) {
                    return;
                }
            });
            return ret;
        }
    });

    java.lang.Runtime.getRuntime().addShutdownHook(new java.lang.Thread(function() {
        print('\nexiting');
        try {
            d.each(exitFuncs, function( fn ) {
                try {
                    fn();
                }
                catch ( e ) {
                }
            });
        }
        catch ( e ) {

        }
    }));

}());
