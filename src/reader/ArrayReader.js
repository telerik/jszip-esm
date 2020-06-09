import DataReader from './DataReader';

/* eslint-disable */

class ArrayReader extends DataReader {
    constructor(data) {
        super(data);
        for(var i = 0; i < this.data.length; i++) {
            data[i] = data[i] & 0xFF;
        }
    }

    /**
     * @see DataReader.byteAt
     */
    byteAt(i) {
        return this.data[this.zero + i];
    }

    /**
     * @see DataReader.lastIndexOfSignature
     */
    lastIndexOfSignature(sig) {
        var sig0 = sig.charCodeAt(0),
            sig1 = sig.charCodeAt(1),
            sig2 = sig.charCodeAt(2),
            sig3 = sig.charCodeAt(3);
        for (var i = this.length - 4; i >= 0; --i) {
            if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
                return i - this.zero;
            }
        }

        return -1;
    }

    /**
     * @see DataReader.readAndCheckSignature
     */
    readAndCheckSignature(sig) {
        var sig0 = sig.charCodeAt(0),
            sig1 = sig.charCodeAt(1),
            sig2 = sig.charCodeAt(2),
            sig3 = sig.charCodeAt(3),
            data = this.readData(4);
        return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
    }

    /**
     * @see DataReader.readData
     */
    readData(size) {
        this.checkOffset(size);
        if(size === 0) {
            return [];
        }
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
    }
}

export default ArrayReader;
