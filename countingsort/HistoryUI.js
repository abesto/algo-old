/**
 * @package CountingSort
 * @file HistoryUI.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * History UI for CountingSort, Hungarian version
 * Listens to signals from a CountingSort and a History instance.
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

function isScrolledIntoView($container, $elem)
{
    var containerViewTop = $container.scrollTop();
    var containerViewBottom = containerViewTop + $container.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom >= containerViewTop) && (elemTop <= containerViewBottom));
}

var HistoryUI = (function() {
    var messages = {
        'created': 'Rendezetlen lista betöltve',
        'minmax': 'Minimális kulcs: {minKey}. Maximális kulcs: {maxKey}',
        'occurence': 'Előfordulás: {key}',
        'occurences_filled': 'Előfordulások megszámolva',
        "bin_end": 'A {key} edény a {end} helyen végződik',
        "bin_ends_done": 'Edény-végek kiszámolva',
        'sorted': 'A {{key}:{value}} elem a {idx1}. helyre került',
        'done': 'Kész.'
    };

    return function($element, sort, history) {
        var     $list = $element.find('.history');

        $element.find('input.step').click(history.step);
        $element.find('input.back').click(history.back);

        function li(txt, step) {
            return $('<li>'+txt+'</li>').click(function() {
                history.jump(step);
            });
        }

        // Sort signal listener
        SAS.addSlot(function(signal) {
                        var txt = messages[signal.type()],  prop,
                            params = signal.allParams(), $li;

                        if (txt == undefined) {
                            return;
                        }

                        for (prop in params) {
                            txt = txt.replace('{' + prop + '}', params[prop]);
                        }
                        var $newLi = li(txt, history.current());
                        $list.append($newLi);
                        $list.scrollTo($newLi);

                        $element.find('.history li.current').removeClass('current');
                        $element.find('.history li:last-child').addClass('current');

                    }, sort.uid);

        // History signal listener
        SAS.addSlot(function(signal) {
            var $li = $element.find('.history li:nth-child('+(signal.param('step')+1)+')');
            $element.find('.history li.current').removeClass('current');
            if (!isScrolledIntoView($list, $li)) {
                $list.scrollTo($li);
            }
            $li.addClass('current')
        }, history.uid);
    }
})();
