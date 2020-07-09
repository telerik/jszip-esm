const support = {
    base64: true,
    array: true,
    string: true,
    nodebuffer: false,
    nodestream: false,

    get arraybuffer() {
        return typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    },

    // Returns true if JSZip can read/generate Uint8Array, false otherwise.
    get uint8array() {
        return typeof Uint8Array !== "undefined";
    },

    get blob() {
        return blob();
    }
};

let blob = function() {
    let supported;

    if (typeof ArrayBuffer === "undefined") {
        supported = false;
    } else {
        const buffer = new ArrayBuffer(0);
        try {
            supported = new Blob([ buffer ], {
                type: "application/zip"
            }).size === 0;
        } catch (e) {
            supported = false;
        }
    }

    blob = () => supported;
    return supported;
};

export default support;
