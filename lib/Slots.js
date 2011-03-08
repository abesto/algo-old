/**
 * @package CountingSort
 * @file Slots.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Simple "Signals and Slots" implementation
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

function Signal(type, params)
{
    return {
        type: function() { return type; },
        allParams: function() { return params; },
        param: function(idx) { return params[idx]; }
    };
}

var SAS = (function() {
    var slots = [], loggers = [];

    function strictKey(type, senderId) {
        return type + '-' + senderId;
    }

    function _addSlot(key, slot) {
        if (typeof slots[key] == 'undefined') {
            slots[key] = [];
        }

        slots[key].push(slot);
    }

    return {
        addSlot: function(slot, senderId)
        {
            _addSlot(senderId, slot);
        },
        addStrictSlot: function(type, slot, senderId)
        {
            _addSlot(strictKey(type, senderId), slot);
        },
        emitFunction: function(that) {
            return function(type, params) { SAS.emit(type, that.UID, params); };
        },
        reEmitFunction: function(that) {
            return function(signal) { SAS.emitFunction(that)(signal.type(), signal.allParams());};
        },
        emit: function(type, senderId, params)
        {
            var i, xs;

            xs = slots[senderId];
            for (i in xs) {
                xs[i](new Signal(type, params));
            }

            xs = slots[strictKey(type, senderId)];
            for (i in xs) {
                xs[i].apply(null, params);
            }

            xs = loggers;
            for (i in xs) {
                xs[i](senderId, new Signal(type, params));
            }
        },
        log: function() {
            loggers.push(function(senderId, signal) {
                console.log(senderId + ' said: ' + signal.type() + ': ', signal.allParams());
            });
        }

    }
})();
