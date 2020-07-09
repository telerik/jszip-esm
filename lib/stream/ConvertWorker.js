import GenericWorker from './GenericWorker';
import * as utils from '../utils';

/**
 * A worker which convert chunks to a specified type.
 * @constructor
 * @param {String} destType the destination type.
 */
class ConvertWorker extends GenericWorker {
    constructor(destType) {
        super("ConvertWorker to " + destType);
        this.destType = destType;
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        this.push({
            data: utils.transformTo(this.destType, chunk.data),
            meta: chunk.meta
        });
    }
}

export default ConvertWorker;
