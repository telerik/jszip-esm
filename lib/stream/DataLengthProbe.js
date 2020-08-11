import GenericWorker from './GenericWorker';

/**
 * A worker which calculate the total length of the data flowing through.
 * @constructor
 * @param {String} propName the name used to expose the length
 */
class DataLengthProbe extends GenericWorker {
    constructor(propName) {
        super("DataLengthProbe for " + propName);
        this.propName = propName;
        this.withStreamInfo(propName, 0);
    }

    /**
     * @see GenericWorker.processChunk
     */
    processChunk(chunk) {
        if (chunk) {
            const length = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = length + chunk.data.length;
        }
        super.processChunk(chunk);
    }
}

export default DataLengthProbe;
