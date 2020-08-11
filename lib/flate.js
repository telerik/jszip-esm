import { Deflate, Inflate } from '@progress/pako-esm';
import * as utils from './utils';
import GenericWorker from './stream/GenericWorker';

let arrayType = function() {
    const useTypedArray = (typeof Uint8Array !== 'undefined') && (typeof Uint16Array !== 'undefined') && (typeof Uint32Array !== 'undefined');
    const resolved = useTypedArray ? "uint8array" : "array";

    arrayType = function() {
        return resolved;
    };
};

/**
 * Create a worker that uses pako to inflate/deflate.
 * @constructor
 * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
 * @param {Object} options the options to use when (de)compressing.
 */
class FlateWorker extends GenericWorker {
    constructor(action, options) {
        super("FlateWorker/" + action);

        this._pako = null;
        this._pakoAction = action;
        this._pakoOptions = options;
        // the `meta` object from the last chunk received
        // this allow this worker to pass around metadata
        this.meta = {};
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        this.meta = chunk.meta;
        if (this._pako === null) {
            this._createPako();
        }
        this._pako.push(utils.transformTo(arrayType(), chunk.data), false);
    }

    /**
     * @see GenericWorker.flush
     */
    flush() {
        super.flush();
        if (this._pako === null) {
            this._createPako();
        }
        this._pako.push([], true);
    }
    /**
     * @see GenericWorker.cleanUp
     */
    cleanUp() {
        super.cleanUp();
        this._pako = null;
    }

    /**
     * Create the _pako object.
     * TODO: lazy-loading this object isn't the best solution but it's the
     * quickest. The best solution is to lazy-load the worker list. See also the
     * issue #446.
     */
    _createPako() {
        const params = {
            raw: true,
            level: this._pakoOptions.level || -1 // default compression
        };
        this._pako = this._pakoAction === 'Deflate' ? new Deflate(params) : new Inflate(params);
        this._pako.onData = (data) => {
            this.push({
                data: data,
                meta: this.meta
            });
        };
    }
}

export default {
    magic: "\x08\x00",
    compressWorker: function(compressionOptions) {
        return new FlateWorker("Deflate", compressionOptions);
    },

    uncompressWorker: function() {
        return new FlateWorker("Inflate", {});
    }
};
