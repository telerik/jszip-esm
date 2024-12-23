import external from './external';
import DataWorker from './stream/DataWorker';
import DataLengthProbe from './stream/DataLengthProbe';
import Crc32Probe from './stream/Crc32Probe';

/**
 * Represent a compressed object, with everything needed to decompress it.
 * @constructor
 * @param {number} compressedSize the size of the data compressed.
 * @param {number} uncompressedSize the size of the data after decompression.
 * @param {number} crc32 the crc32 of the decompressed file.
 * @param {object} compression the type of compression, see lib/compressions.js.
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
 */
class CompressedObject {
    constructor(compressedSize, uncompressedSize, crc32, compression, data) {
        this.compressedSize = compressedSize;
        this.uncompressedSize = uncompressedSize;
        this.crc32 = crc32;
        this.compression = compression;
        this.compressedContent = data;
    }

    /**
     * Create a worker to get the uncompressed content.
     * @return {GenericWorker} the worker.
     */
    getContentWorker() {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent))
        .pipe(this.compression.uncompressWorker())
        .pipe(new DataLengthProbe("data_length"));

        var that = this;
        worker.on("end", function () {
            if(this.streamInfo['data_length'] !== that.uncompressedSize) {
                throw new Error("Bug : uncompressed data size mismatch");
            }
        });
        return worker;
    }

    /**
     * Create a worker to get the compressed content.
     * @return {GenericWorker} the worker.
     */
    getCompressedWorker() {
        return new DataWorker(external.Promise.resolve(this.compressedContent))
        .withStreamInfo("compressedSize", this.compressedSize)
        .withStreamInfo("uncompressedSize", this.uncompressedSize)
        .withStreamInfo("crc32", this.crc32)
        .withStreamInfo("compression", this.compression)
        ;
    }

    /**
     * Chain the given worker with other workers to compress the content with the
     * given compression.
     * @param {GenericWorker} uncompressedWorker the worker to pipe.
     * @param {Object} compression the compression object.
     * @param {Object} compressionOptions the options to use when compressing.
     * @return {GenericWorker} the new worker compressing the content.
     */
    static createWorkerFrom(uncompressedWorker, compression, compressionOptions) {
        return uncompressedWorker
        .pipe(new Crc32Probe())
        .pipe(new DataLengthProbe("uncompressedSize"))
        .pipe(compression.compressWorker(compressionOptions))
        .pipe(new DataLengthProbe("compressedSize"))
        .withStreamInfo("compression", compression);
    }
};

export default CompressedObject;
