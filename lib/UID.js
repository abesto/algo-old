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

UID = (function(){
    var next = 1;

    return function() {
        return next++;
    }
})();

UIDObjectStore = (function() {
    var Constructor = function() {
        this._uids = [];
        this._objects = {};
    };

    Constructor.prototype.add = function(object) {
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

    Constructor.prototype.remove = function(arg) {
        var uid = (typeof arg == 'object') ? arg.UID : arg;

        this._uids.splice(this._uids.indexOf(uid), 1);
        delete this._objects[uid];
    };

    Constructor.prototype.each = function(f) {
        for (var i = 0; i < this._uids.length; i++) {
            f(this._objects[this._uids[i]]);
        }
    };

    return Constructor;
})();