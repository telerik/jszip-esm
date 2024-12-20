/* global QUnit,JSZip,JSZipTestUtils,Promise */
'use strict';

QUnit.module("utils");

function resolve(path) {
    var parts = path.split("/");
    var result = [];
    for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        // Allow the first and last component to be empty for trailing slashes.
        if (part === "." || (part === "" && index !== 0 && index !== parts.length - 1)) {
            continue;
        } else if (part === "..") {
            result.pop();
        } else {
            result.push(part);
        }
    }
    return result.join("/");
};

QUnit.test("Paths are resolved correctly", function (assert) {
    // Backslashes can be part of filenames
    assert.strictEqual(resolve("root\\a\\b"), "root\\a\\b");
    assert.strictEqual(resolve("root/a/b"), "root/a/b");
    assert.strictEqual(resolve("root/a/.."), "root");
    assert.strictEqual(resolve("root/a/../b"), "root/b");
    assert.strictEqual(resolve("root/a/./b"), "root/a/b");
    assert.strictEqual(resolve("root/../../../"), "");
    assert.strictEqual(resolve("////"), "/");
    assert.strictEqual(resolve("/a/b/c"), "/a/b/c");
    assert.strictEqual(resolve("a/b/c/"), "a/b/c/");
    assert.strictEqual(resolve("../../../../../a"), "a");
    assert.strictEqual(resolve("../app.js"), "app.js");
});
