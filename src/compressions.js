import GenericWorker from './stream/GenericWorker';
import DEFLATE from './flate';

const STORE = {
    magic: "\x00\x00",
    compressWorker: function() {
        return new GenericWorker("STORE compression");
    },
    uncompressWorker: function() {
        return new GenericWorker("STORE decompression");
    }
};

export default {
    STORE,
    DEFLATE
};
