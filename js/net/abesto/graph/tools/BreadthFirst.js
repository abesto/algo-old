/**
 * @package BreadthFirst
 * @file tools/BreadthFirst.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for starting a breadth-first search from an arbitrary node
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

Namespace.use('net.abesto.graph.algorithms.BreadthFirst');

Namespace('net.abesto.graph.tools', {

BreadthFirstTool: {
    timer: null,

    name: 'breadthFirst',
    label: 'Szélességi bejárás',
    hooks: {
        breadthFirst: {
            nodeClick: function(event) {
                    var b = new net.abesto.graph.algorithms.BreadthFirst(event.currentTarget.model);

                    if (this.timer != null) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }

                    this._graph.nodes().each(function(n) { n.setLabel(''); });
                    (function() {
                        if (b.step().length > 0) {
                            this.timer = setTimeout(arguments.callee, 800);
                        } else {
                            this.timer = null;
                        }
                    })();
            }
        }
    }
}

});
