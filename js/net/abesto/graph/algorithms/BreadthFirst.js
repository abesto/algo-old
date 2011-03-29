/**
 * @package BreadthFirst
 * @file BreadthFirst.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Simple breadth-first search on a graph, one step at a time.
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

Namespace('net.abesto.graph.algorithms', {

BreadthFirst: function(node)
{
    var queue = [node], stepCount = 0, i = 0, emit = net.abesto.SAS.emitFunction(this);

    this.UID = UID();

    this.step = function() {
        var node = queue.shift();

        // Find first not-yet-searched node in the queue, if any
        while (typeof node != 'undefined' && node.getLabel() !== '') {
            node = queue.shift();
        }

        if (typeof node == 'undefined') {
            emit('done');
        } else {
            if (node.getLabel() !== '') return;
            node.setLabel(stepCount++);

            node.neighbors().each(function(n) {
                if (n.getLabel() === '') {
                    queue.push(n);
                }
            });
        }

        return queue;
    }
}

});
