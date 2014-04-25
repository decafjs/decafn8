/**
 * Created by mschwartz on 4/25/14.
 */

/*global toString */

(function() {
    /**
     * @memberOf d
     * @param o
     * @param max
     * @param sep
     * @param l
     * @returns {string}
     */
    function print_r( o, max, sep, l ) {
        max = max || 10;
        sep = sep || ' ';
        if (l === undefined) {
            l = 0;
        }
        var indent = '',
            r = [];

        for (var n = 0; n < l; n++) {
            indent += sep;
        }

        if (o === null) {
            return 'null';
        }
        if (o === undefined) {
            return 'undefined';
        }
        if (l > max) {
            return '*** ' + l;
        }
        if (d.isString(o)) {
            return '(string) ' + (o.length ? o : '(empty)');
        }
        if (isNaN(o) && typeof o === 'number') {
            return '(NaN)';
        }
        if (d.isNumber(o)) {
            return '(number) ' + o;
        }
        if (d.isDate(o)) {
            return '(date) ' + o;
        }
        if (d.isBoolean(o)) {
            return '(boolean) ' + o;
        }
        if (d.isJava(o)) {
            r.push('(' + toString.apply(o).replace(/\[object /, '').replace(/\]/, '') + ')');
            for (key in o) {
                var value = o[key];
                r.push(sep + indent + '[' + key + '] ');
            }
            return r.join('\n');
        }
        if (d.isFunction(o)) {
            var body = o.toString();
            body = body.replace(/\n/gm, ' ').replace(/\s+/g, ' ');
            if (body.length > 64) {
                body = body.replace(/\{.*\}/igm, '{ ... }');
            }
            r.push(body);
            d.each(o, function( value, key ) {
                r.push(sep + indent + '[' + key + '] ' + print_r(value, max, sep, l + 1));
            });
            return r.join('\n');
        }
        if (d.isArray(o)) {
            r.push('(array)');
            d.each(o, function( value, index ) {
                r.push(sep + indent + '[' + index + '] ' + print_r(value, max, sep, l + 1));
            });
            return r.join('\n');
        }
        if (d.isError(o)) {
            r.push('(error)');
            d.each(o, function( value, index ) {
                r.push(sep + indent + '[' + index + '] ' + print_r(value, max, sep, l + 1));
            });
            return r.join('\n');
        }
        if (d.isObject(o)) {
            r.push('(object)');
            d.each(o, function( value, index ) {
                r.push(sep + indent + '[' + index + '] ' + print_r(value, max, sep, l + 1));
            });
            return r.join('\n');
        }
        if (d.isGlobal(o)) {
            r.push('(global)');
            for (var i in o) {
                if (!d.isGlobal(o[i])) {
                    r.push(sep + indent + '[' + i + '] ' + print_r(o[i], max, sep, l + 1));
                }
            }
            return r.join('\n');
        }
        print(o.toString()); // toString.apply(o));
        return '-' + (typeof o) + ' ' + o;
    }

    d.print_r = print_r;
}());