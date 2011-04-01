/**
 * @package CountingSort
 * @file UID.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Generic unique id generator and object store
 *
 * Copyright 2011 Nagy Zoltán
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var UID, UIDObjectStore;

UID = (function() {
    function Generator() {
        var next = 1;

        return function() {
            return next++;
        }
    }

    var global = new Generator();
    global.Generator = Generator;

    return global;
})();

UIDObjectStore = (function() {
    var Constructor = function() {
        this._uids = [];
        this._objects = {};
    };

    Constructor.prototype.add = function(object) {
        if (this.has(object)) return;
        this._uids.push(object.UID);
        this._objects[object.UID] = object;
    };

    Constructor.prototype.has = function(arg) {
        var uid = (typeof arg == 'object') ? arg.UID : arg;

        return (this._uids.indexOf(uid) != -1);
    };

    Constructor.prototype.get = function(uid) {
        return this.has(uid) ? this._objects[uid] : null;
    };

    Constructor.prototype.getLinear = function(idx) {
        return this.get(this._uids[idx]);
    };

    Constructor.prototype.remove = function(arg) {
        var uid = (typeof arg == 'object') ? arg.UID : arg;

        this._uids.splice(this._uids.indexOf(uid), 1);
        delete this._objects[uid];
    };

    Constructor.prototype.each = function(f) {
        var uids = this._uids.slice();
        for (var i = 0; i < uids.length; i++) {
            f(this._objects[uids[i]]);
        }
    };

    Constructor.prototype.length = function() { return this._uids.length; };

    Constructor.union = function(a, b) {
        var c = new UIDObjectStore();
        a.each(function(x) { c.add(x); });
        b.each(function(x) { c.add(x); });
        return c;
    };

    return Constructor;
})();
