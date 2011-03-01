/**
 * @package CountingSort
 * @file CountingSort.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Counting sort implemented as a state machine with one transition action (step) and support for History.js.
 * Emits Slots.js signals after each step.
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

function Element(key, value)
{
    return {
        key: function() { return key; },
        value: function() { return value; },
        toString: function() { return key + '(' + value + ')'; },
        uid: UID()
    }
}

// Sort implementation
var CountingSort = (function()
{
    function stepCreate() {
        this.emit('created', {'unsorted': this.unsorted});
        this.sortedIdx = this.unsorted.length - 1;
        return stepMinMax;
    }

    function stepMinMax() {
        var i;

        for (i = 0; i < this.unsorted.length; i += 1) {
            this.minKey = Math.min(this.unsorted[i].key(), this.minKey);
            this.maxKey = Math.max(this.unsorted[i].key(), this.maxKey);
        }

        for (i = this.minKey; i <= this.maxKey; i += 1) {
            this.occurences[i] = 0;
        }

        this.emit('minmax', {minKey: this.minKey, maxKey: this.maxKey});
        return stepOccurences;
    }

    /**
     * Count occurences of each key
     */
    function stepOccurences() {
        var element, key;

        if (this.unsortedIdx == this.unsorted.length) {
            this.emit('occurences_filled');
            return stepBinStarts;
        }

        element = this.unsorted[this.unsortedIdx];
        key = element.key();

        this.occurences[key] += 1;
        this.unsortedIdx += 1;

        this.emit('occurence', {key: key, element: element});
        return stepOccurences;
    }

    function stepBinStarts() {
        this.binEnds[this.minKey] = this.occurences[this.minKey];
        this.occurencesKey = this.minKey + 1;
        this.emit('bin_end', {'key': this.minKey, 'end': (this.binEnds[this.minKey])});
        
        return function() {
            if (this.occurencesKey == this.occurences.length) {
                this.emit('bin_ends_done');
                return stepSort;
            }

            this.binEnds[this.occurencesKey] =
                this.binEnds[this.occurencesKey-1] + this.occurences[this.occurencesKey];

            this.occurencesKey += 1;

            this.emit('bin_end', {
                'key': this.occurencesKey-1,
                'end': this.binEnds[this.occurencesKey-1]
            });

        };
    }

    function stepSort() {
        if (this.sortedIdx == -1) {
            this.emit('done', this.sorted);
            return function() {};
        }

        var     element = this.unsorted[this.sortedIdx],
                key = element.key();

        this.binEnds[key] -= 1;   // Could be prefix `--` in line below
        this.sorted[this.binEnds[key]] = element;

        this.sortedIdx -= 1;
        
        this.emit('sorted', {'idx': this.binEnds[key], 'idx1': this.binEnds[key]+1, 'element': element, 'key': element.key(), 'value': element.value()});
        this.emit('update_bin_end', {'key': key, 'end': this.binEnds[key]});
        return stepSort;
    }

    return function() {
        var state = {
            unsorted: [],
            occurences: [],
            binEnds: [],
            sorted: [],

            unsortedIdx: 0,   // Used by stepOccurences to index into unsorted
            minKey: Number.MAX_VALUE,
            maxKey: Number.MIN_VALUE,  // Set by stepOccurences, read by stepFillWithZeroes
            occurencesKey: 0,  // Used by stepBinStarts
            sortedIdx: 0,      // Used by stepSort, first set by stepFillWithZeroes. Goes downwards to preserve order

            uid: UID(),

            emit: function(type, params) { SAS.emit(type, state.uid, params); }
        }, nextFun = stepCreate;

        state.unsorted = null;
        state.nextFun = stepCreate;

        return {
            'step': function() {
                var ret = nextFun.call(state);
                if (ret != nextFun && typeof ret == 'function') {
                    nextFun = ret;
                }
                return state;
            },
            'setUnsorted': function(unsorted) {
                if (unsorted.length == 0) {
                    state.emit('error', {'msg': 'Empty input sequence'});
                    return;
                }


                state.unsorted = unsorted;
            },

            uid: state.uid,

            // History support
            setHistory: function(history) {
                SAS.addSlot(function(signal)
                            {
                                 state = jQuery.extend(true, {}, signal.param('state'));
                            }, history.uid);
            },
            getState: function() { return jQuery.extend(true, {}, state); }  // Deep copy
        };
    }
})();

