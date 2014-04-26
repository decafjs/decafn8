/**
 * @module process
 * @fileoverview process module
 */

/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/8/13
 * Time: 6:06 PM
 */

/*global builtin, java, Iterator */
"use strict";
var Runtime = java.lang.Runtime,
    System = java.lang.System,
    Thread = java.lang.Thread,
    UnixSystem = Packages.com.sun.security.auth.module.UnixSystem,
    BufferedReader = java.io.BufferedReader,
    IputStreamReader = java.io.InputStreamReader;

var unixSystem = new UnixSystem(),
    _env = System.getenv(),
    _properties = System.getProperties(),
    env = {},
    properties = {},
    i;

for  (i in _env) {
    env[i] = String(_env.get(i));
}

for  (i in _properties) {
    properties[i] = String(_properties.get(i));
}

env.OS = properties['os.name'].toUpperCase();

decaf.extend(exports, {
    /**
     * Environment
     */
    env: env,

    /**
     * System/JVM properties
     */
    properties: properties,

    /**
     * Get UID of current user.
     *
     * @returns {int} UID user id of current user.
     */
    getuid: function () {
        return unixSystem.getUid();
    },

    /**
     * Put current thread (or program) to sleep for a number of seconds.
     *
     * @param {int} secs number of seconds to sleep
     */
    sleep: function (secs) {
        Thread.sleep(secs * 1000);
    },

    /**
     * Put current thread (or program) to sleep for a number of microseconds.
     *
     * @param {int} usecs number of microseconds to sleep
     */
    usleep: function (usecs) {
        Thread.sleep(usecs);
    },

    /**
     * Exit the application.  Note that atExit() methods will be called before
     * the application truly exits.
     *
     * @param {int} code process exit code
     */
    exit: function (code) {
        System.exit(code || 0);
    },

    /**
     * Returns the amount of free memory in the Java Virtual Machine. Calling the gc method may result in increasing the value returned by freeMemory.
     *
     * @return {int} an approximation to the total amount of memory currently available for future allocated objects, measured in bytes.
     */
    getFreeMemory: function () {
        return Runtime.getRuntime().freeMemory();
    },

    /**
     * Returns the maximum amount of memory that the Java virtual machine will attempt to use. If there is no inherent limit then the value Long.MAX_VALUE will be returned.
     *
     * @return {int} the maximum amount of memory that the virtual machine will attempt to use, measured in bytes
     */
    getMaxMemory: function () {
        return Runtime.getRuntime().maxMemory();
    },

    /**
     * Returns the total amount of memory in the Java virtual machine. The value returned by this method may vary over time, depending on the host environment.
     *
     * Note that the amount of memory required to hold an object of any given type may be implementation-dependent.
     *
     * @return {int} the total amount of memory currently available for current and future objects, measured in bytes.
     */
    getTotalMemory: function () {
        return Runtime.getRuntime().totalMemory();
    },

    /**
     * Returns the number of processors available to the Java virtual machine.
     *
     * This value may change during a particular invocation of the virtual machine. Applications that are sensitive to the number of available processors should therefore occasionally poll this property and adjust their resource usage appropriately.
     *
     * @return {int} the maximum number of processors available to the virtual machine; never smaller than one
     */
    getAvailableProcessors: function () {
        return Runtime.getRuntime().availableProcessors();
    },

    /**
     * Synchronously execute an external program in a separate process
     *
     * This method may be called with a single string with the entire command line or
     * with a command name and array of arguments.
     *
     * @param {string} command command name or command line
     * @param {array} args optional array of arguments
     * @return {Object} Object containing { command: string, status: exitStatus, stdout: string, stderr: string }
     */
    exec: function (command, args) {
        if (decaf.isArray(args)) {
            command = [command].concat(args).join(' ');
        }

        try {
            var p = Runtime.getRuntime().exec(command),
                is = new BufferedReader(new InputStreamReader(p.getInputStream())),
                es = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            p.waitFor();
            var line,
                stdout = '',
                stderr = '';

            while ((line = is.readLine()) !== null) {
                stdout += line + '\n';
            }
            while ((line = es.readLine()) !== null) {
                stderr += line + '\n';
            }
            return {
                command: command,
                status: p.exitValue(),
                stdout: stdout,
                stderr: stderr
            };
        }
        catch (e) {
            throw e;
        }
    }
});
