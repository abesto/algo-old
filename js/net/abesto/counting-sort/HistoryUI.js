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

Namespace('net.abesto.counting-sort', {

HistoryUI: (function() {
    return function(opts) {
        var     $list = opts.elem.find('.history');

        opts.elem.find('input.step').click(opts.history.step);
        opts.elem.find('input.back').click(opts.history.back);

        function li(step) {
            return $('<li>').click(function() {
                opts.history.jump(step);
            });
        }

        // Sort signal listener
        net.abesto.SAS.addSlot(function(signal) {
            var $li = li(opts.history.current());
            if (!opts.translation.bind($li, 'history.' + signal.type(), signal.allParams()))
            {
                opts.translation.unbind($li.data('translation'));
                return;
            }
            
            $list.append($li);
            $list.scrollTo($li);

            opts.elem.find('.history li.current').removeClass('current');
            opts.elem.find('.history li:last-child').addClass('current');

        }, opts.sort.uid);

        function isScrolledIntoView($container, $elem)
        {
            var containerViewTop = $container.scrollTop();
            var containerViewBottom = containerViewTop + $container.height();

            var elemTop = $elem.offset().top;
            var elemBottom = elemTop + $elem.height();

            return ((elemBottom >= containerViewTop) && (elemTop <= containerViewBottom));
        }

        // History signal listener
        net.abesto.SAS.addSlot(function(signal) {
            var $li = opts.elem.find('.history li:nth-child('+(signal.param('step')+1)+')');
            opts.elem.find('.history li.current').removeClass('current');
            if (!isScrolledIntoView(opts.elem, $li)) {
                $list.scrollTo($li);
            }
            $li.addClass('current')
        }, opts.history.uid);
    }
})()

});
