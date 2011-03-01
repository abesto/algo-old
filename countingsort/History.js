/**
 * @package CountingSort
 * @file History.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * History implementation for CountingSort
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

 function HistoryState(state, signal) {
    return {
        state: function() { return state; },
        signal: function() { return signal; }
    };
}

var History = (function() {
    return function(sort) {
        var     states = [],
                current = -1,
                uid = UID();

        SAS.addSlot(function(signal) {
            if (signal.type() == 'update_bin_end') { return; }
            states.push(new HistoryState(sort.getState(), signal));
            current++;
        }, sort.uid);

        this.uid = uid;

        this.step = function() {
            var state;

            if (current+1 == states.length) {
                sort.step();
            } else {
                state = states[++current];
                console.log(current);
                SAS.emit('history', uid, {state: state.state(), signal: state.signal(), step: current});
            }
        };

        this.back = function() {
            var state;
            if (current < 1) { return; }
            state = states[--current];
            SAS.emit('history', uid, {state: state.state(), signal: state.signal(), step: current});
        };

        this.jump = function(step) {
            var state;
            current = step;
            state =  states[current];
            console.log(state.state());
            SAS.emit('history', uid, {state: state.state(), signal: state.signal(), step: current});
        };

        this.current = function() { return current; };
    };
})();
