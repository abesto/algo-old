/**
 * @package CountingSort
 * @file StateUI.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * State display UI for CountingSort, listens for signalrs from a CountingSort instance. Supports signals from a
 * History instance.
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

StateUI: (function()
{
    function created($state, params) {
        var elements = params.unsorted, i,
            $olUnsorted = $state.find('.unsorted'),
            $olSorted = $state.find('.sorted'),
            uid = 0, key = 0;

        for (i in elements) {
            uid = elements[i].uid;
            key = elements[i].key();
            $olUnsorted.append('<li uid="'+uid+'" key="'+key+'">'+elements[i]+'</li>');
            $olSorted.append('<li uid="'+uid+'" key="'+key+'">&nbsp;</li>');
        }
    }

    function minmax($state, params) {
        var min = params.minKey, max = params.maxKey, i,

            $tables = $state.find('.occurences, .bin-ends'),
            $trKeys = $tables.find('tr:first-child'),
            $trValues = $tables.find('tr:last-child');

        for (i = min; i <= max; i += 1) {
            $trKeys.append('<th key="'+i+'">'+i+'</th>');
            $trValues.append('<td key="'+i+'">0</td>');
        }

        minmaxHl($state, params);
    }

    function occurence($state, params) {
        var $table = $state.find('.occurences'), i = 0,
            $trKeys = $table.find('tr:first-child'),
            $trValues = $table.find('tr:last-child');

        while ($trKeys.children()[i].innerHTML != params.key) {
            i++;
        }

        if (params.value == undefined)
            $trValues.children()[i].innerHTML++;
        else
            $trValues.children()[i].innerHTML = params.value;

        occurenceHl($state, params);
    }

    function update_bin_end($state, params) {
        $state.find('.bin-ends tr:last-child')
        .find('[key='+params.key+']').html(params.end);
    }

    var bin_end = function($state, params) {
        update_bin_end($state, params);
        bin_endHl($state, params);
    };

    var bin_ends_done = removeHl;

    function sorted($state, params) {
        var idx = params.idx, element = params.element,
            $ol = $state.find('.sorted');

        $ol.find(':nth-child('+(1+parseInt(idx))+')').html(element.toString());

        sortedHl($state, params);
    }

    // Highlight functions //
    function removeHl($state) {
        $state.find('.hl1').removeClass('hl1');
        $state.find('.hl2').removeClass('hl2');
        $state.find('.hl3').removeClass('hl3');
    }

    function minmaxHl($state, params) {
        if (params.minKey != Number.MAX_VALUE) {
            $state.find('.unsorted li[key='+params.minKey+']').addClass('hl1');
            $state.find('.unsorted li[key='+params.maxKey+']').addClass('hl2');
        }
    }

    function occurenceHl($state, params) {
        if (params.element == undefined) { return; }
        $state.find('.unsorted li[uid='+params.element.uid+']').addClass('hl1');
        $state.find('.occurences [key='+params.element.key()+']').addClass('hl2');
    }

    function bin_endHl($state, params) {
        $state.find('.occurences [key='+params.key+']').addClass('hl2');
        $state.find('.bin-ends [key='+params.key+']').addClass('hl1');
        $state.find('.bin-ends [key='+(params.key-1)+']').addClass('hl3');
    }

    function sortedHl($state, params) {
        $state.find('.unsorted [uid='+params.element.uid+']').addClass('hl3');
        $state.find('.bin-ends [key='+params.element.key()+']').addClass('hl2');
        $state.find('.sorted :nth-child('+(1+parseInt(params.idx))+')').addClass('hl1');
    }

    return function(opts) {
        net.abesto.SAS.addSlot(function(signal) {
            try {
                if (signal.type() != 'update_bin_end') removeHl(opts.elem);
                eval(signal.type())(opts.elem, signal.allParams());
            } catch (E) {}
        }, opts.model.uid);

        // History support
        this.setHistory = function(history) {
            net.abesto.SAS.addSlot(function(signal) {
                var state = signal.param('state'), signal = signal.param('signal'), params = signal.allParams();

                // Clear
                opt.elem.find('.occurences').find('td, th').remove();
                opt.elem.find('.bin-ends').find('td, th').remove();
                opt.elem.find('.sorted li').html('');

                // Min-max
                if (state.minKey != undefined) {
                    if (signal.type() == 'minmax') removeHl(opts.elem);
                    minmax(opts.elem, state);
                }

                // Occurences
                if (state.occurences.length > 0) {
                    for (i in state.occurences) {
                        if (signal.type() == 'occurence') removeHl(opts.elem);
                        occurence(opts.elem, {
                            key: i,
                            value: state.occurences[i],
                            element: (params == undefined ? undefined : params['element'])
                        });
                    }
                }

                // Bin ends
                if (state.binEnds != undefined) {
                    for (i in state.binEnds) {
                        if (signal.type() == 'bin_end') removeHl(opts.elem);
                        bin_end(opts.elem, {key: i, end: state.binEnds[i]});
                    }
                }

                // Don't highlight if signal was bin_ends_done or occurences_filled
                if (signal.type() == 'bin_ends_done' || signal.type() == 'occurences_filled') {
                    removeHl(opts.elem);
                }

                // Sorted
                if (state.sorted != undefined && state.sorted.length > 0) {
                    for (i in state.sorted) {
                        removeHl(opts.elem);
                        sorted(opts.elem, {idx: i, element: state.sorted[i]});
                    }
                }
            }, history.uid);
        };
    }
})()

});

