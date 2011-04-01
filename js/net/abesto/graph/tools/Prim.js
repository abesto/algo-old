/**
 * @package Graph
 * @file tools/Dijkstra.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for starting Dijkstra's algorithm from a node
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

Namespace.use('net.abesto.graph.algorithms.Prim');

Namespace('net.abesto.graph.tools', {

PrimTool: {
    timer: null,
    statusUI: null,

    name: 'prim',
    label: 'Prim algoritmusa',
    hooks: {
        prim: {
            nodeClick: function(event) {
                    var p = new Prim(event.currentTarget.model);
                    net.abesto.graph.tools.PrimTool.statusUI.listenTo(p);

                    this.resetEdges();

                    net.abesto.SAS.addStrictSlot('highlight_edge', function(signal) {
                        var n1 = signal.param('n1'), n2 = signal.param('n2');

                        signal.param('edge').ui.line.attr('stroke', '#040');
                        signal.param('edge').ui.bg.attr('stroke', '#0f0');
                    }, p.UID);

                    var timer;

                    (function() {
                        setTimeout(function() {
                        if (p.step() > 0) {
                            timer = setTimeout(arguments.callee, 1300);
                        } else {
                            timer = null;
                        }
                    }, 1500);})();
            }
        }
    }
}

});
