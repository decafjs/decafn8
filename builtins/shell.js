/**
 * Created with WebStorm.
 * User: mschwartz
 * Date: 4/25/14
 * Time: 5:15 PM
 */

/*global global, Packages, include, require, builtin */
(function() {
    "use strict";
    var d = global.decaf;

    /*
     * The guts of the command line interpreter
     *
     * @param none
     * @function
     */
    function shellMain() {
        var input = new Packages.jline.console.ConsoleReader(),
            historyFile = new java.io.File(java.lang.System.getProperty('user.home') + '/.decafrc'),
            history = new Packages.jline.console.history.FileHistory(historyFile),
            TerminalFactory = Packages.jline.TerminalFactory,
            line;

        d.atExit(function() {
            history.flush();
            // jline2 supposedly installs its own JVM shutdown hook to restore the terminal
//            TerminalFactory.get().restore();
        });

        input.setHistory(history);
        while ( line = input.readLine('decaf> ') ) {
            if ( !line ) {
                console.log('line null')
            }
            try {
                var result = load({ script : line, name: 'anonymous' }); // rhino.runScript(line);
                if ( result !== undefined ) {
                    console.log('' + result);
                }
            }
            catch ( e ) {
                print(e.stack);
            }
        }
    }

    var argv = [],
//        args = Array.prototype.slice.call(global.arguments, 1),
        args = global.arguments,
        runShell = true;

//    console.dir(args);
    for ( var i = 0, len = args.length; i < len; i++ ) {
        var arg = args[i];
        if ( arg.endsWith('.js') ) {
            if ( runShell ) {
                load(arg);
                runShell = false;
            }
            else {
                argv.push(arg);
            }
        }
        else {
            argv.push(arg);
        }
    }

    d._main();
    if ( global.main ) {
        global.main.apply(global, argv);
    }
    else if ( runShell ) {
        shellMain();
    }

    if (!runShell) {
        while (d._idle()) {
            java.lang.Thread.sleep(1);
        }
    }
}());
