export default class support {
    static get base64() {
        return true;
    }

    static get array() {
        return true;
    }

    static get string() {
        return true;
    }

    static get nodebuffer() {
        return false;
    }

    static get nodestream() {
        return false;
    }

    static get arraybuffer() {
        return typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    }

    // Returns true if JSZip can read/generate Uint8Array, false otherwise.
    static get uint8array() {
        return typeof Uint8Array !== "undefined";
    }

    static get blob() {
        return blob();
    }
}

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
