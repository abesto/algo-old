/**
 * @package CountingSort
 * @file DetailsUI.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Details UI for CountingSort
 * Listens to signals from a CountingSort and a History instance (and handles them in the same way).
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

Namespace('net.abesto.counting-sort', {

DetailsUI: (function() {
    function setText($details, signal) {
        $details.data('translation')._key = 'details.' + signal.type();
        $details.data('translation').update(null, signal.allParams());
    }

    return function(opts) {
        opts.translation.bind(opts.elem, '');
        net.abesto.SAS.addSlot(function(signal) {
            setText(opts.elem, signal)
        }, opts.sort.uid);


        net.abesto.SAS.addSlot(function(signal) {
            setText(opts.elem, signal.param('signal'));
        }, opts.history.uid);
    }
})()

});
