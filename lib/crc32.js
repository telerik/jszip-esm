import * as utils from './utils';

/**
 * The following functions come from pako, from pako/lib/zlib/crc32.js
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

let makeTable = function() {
    // Use ordinary array, since untyped makes no boost here
    const table = [];

    for (let n =0; n < 256; n++){
        let c = n;
        for(let k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
    }

    // Memoize table on first call.
    makeTable = function() {
        return table;
    };

    return table;
};

function crc32(crc, buf, len, pos) {
    const t = makeTable();
    let end = pos + len;

    crc = crc ^ (-1);

    for (let i = pos; i < end; i++ ) {
        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
}

// That's all for the pako functions.

/**
 * Compute the crc32 of a string.
 * This is almost the same as the function crc32, but for strings. Using the
 * same function for the two use cases leads to horrible performances.
 * @param {Number} crc the starting value of the crc.
 * @param {String} str the string to use.
 * @param {Number} len the length of the string.
 * @param {Number} pos the starting position for the crc32 computation.
 * @return {Number} the computed crc32.
 */
function crc32str(crc, str, len, pos) {
    const t = makeTable();
    let end = pos + len;

    crc = crc ^ (-1);

    for (let i = pos; i < end; i++ ) {
        crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
}

export default function crc32wrapper(input, crc) {
    if (typeof input === "undefined" || !input.length) {
        return 0;
    }

    const isArray = utils.getTypeOf(input) !== "string";

    if (isArray) {
        return crc32(crc | 0, input, input.length, 0);
    } else {
        return crc32str(crc | 0, input, input.length, 0);
    }
}
