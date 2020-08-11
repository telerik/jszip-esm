import * as utils from '../utils';
import GenericWorker from './GenericWorker';

/* eslint-disable */

// the size of the generated chunks
// TODO expose this as a public variable
const DEFAULT_BLOCK_SIZE = 16 * 1024;

/**
 * A worker that reads a content and emits chunks.
 * @constructor
 * @param {Promise} dataP the promise of the data to split
 */
class DataWorker extends GenericWorker {
    constructor(dataP) {
        super("DataWorker");
        var self = this;
        this.dataIsReady = false;
        this.index = 0;
        this.max = 0;
        this.data = null;
        this.type = "";

        this._tickScheduled = false;

        dataP.then(function (data) {
            self.dataIsReady = true;
            self.data = data;
            self.max = data && data.length || 0;
            self.type = utils.getTypeOf(data);
            if(!self.isPaused) {
                self._tickAndRepeat();
            }
        }, function (e) {
            self.error(e);
        });
    }

    /**
     * @see GenericWorker.cleanUp
     */
    cleanUp() {
        super.cleanUp();
        this.data = null;
    }

    /**
     * @see GenericWorker.resume
     */
    resume() {
        if(!super.resume()) {
            return false;
        }

        if (!this._tickScheduled && this.dataIsReady) {
            this._tickScheduled = true;
            utils.delay(this._tickAndRepeat, [], this);
        }
        return true;
    }

    /**
     * Trigger a tick a schedule an other call to this function.
     */
    _tickAndRepeat() {
        this._tickScheduled = false;
        if(this.isPaused || this.isFinished) {
            return;
        }
        this._tick();
        if(!this.isFinished) {
            utils.delay(this._tickAndRepeat, [], this);
            this._tickScheduled = true;
        }
    };

    /**
     * Read and push a chunk.
     */
    _tick() {

        if(this.isPaused || this.isFinished) {
            return false;
        }

        var size = DEFAULT_BLOCK_SIZE;
        var data = null, nextIndex = Math.min(this.max, this.index + size);
        if (this.index >= this.max) {
            // EOF
            return this.end();
        } else {
            switch(this.type) {
                case "string":
                    data = this.data.substring(this.index, nextIndex);
                break;
                case "uint8array":
                    data = this.data.subarray(this.index, nextIndex);
                break;
                case "array":
                    data = this.data.slice(this.index, nextIndex);
                break;
            }
            this.index = nextIndex;
            return this.push({
                data : data,
                meta : {
                    percent : this.max ? this.index / this.max * 100 : 0
                }
            });
        }
    }
}

export default DataWorker;
