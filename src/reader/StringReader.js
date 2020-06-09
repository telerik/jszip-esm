import DataReader from './DataReader';

class StringReader extends DataReader {
    constructor(data) {
        super(data);
    }

    /**
     * @see DataReader.byteAt
     */
    byteAt(i) {
        return this.data.charCodeAt(this.zero + i);
    }

    /**
     * @see DataReader.lastIndexOfSignature
     */
    lastIndexOfSignature(sig) {
        return this.data.lastIndexOf(sig) - this.zero;
    }

    /**
     * @see DataReader.readAndCheckSignature
     */
    readAndCheckSignature(sig) {
        const data = this.readData(4);
        return sig === data;
    }

    /**
     * @see DataReader.readData
     */
    readData(size) {
        this.checkOffset(size);
        // this will work because the constructor applied the "& 0xff" mask.
        const result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
    }
}

export default StringReader;
