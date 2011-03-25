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

var DijkstraTool = {
    timer: null,

    name: 'dijkstra',
    label: 'Dijkstra algoritmusa',
    hooks: {
        dijkstra: {
            nodeClick: function(event) {
                    var d = new Dijkstra(this._graph, event.currentTarget.model);
                    if (DijkstraTool.timer != null) {
                        clearTimeout(DijkstraTool.timer);
                        DijkstraTool.timer = null;
                    }

                    this._graph.edges().each(function(e) {
                        e.ui.line.attr('stroke', GraphUI.settings.edgeFill);
                        e.ui.bg.attr('stroke', GraphUI.settings.edgeColor);
                    });

                    SAS.addStrictSlot('highlight_edge', function(signal) {
                        var n1 = signal.param('n1'), n2 = signal.param('n2');
                        n2.edges().each(function(e) {
                            var color, fill;
                            if (e.otherNode(n2) == n1) {
                                color = '#0f0';
                                fill = '#040';
                            } else {
                                color = GraphUI.settings.edgeColor;
                                fill = GraphUI.settings.edgeFill;
                            }
                            e.ui.line.attr('stroke', fill);
                            e.ui.bg.attr('stroke', color);
                        });
                    }, d.UID);

                    (function() {
                        setTimeout(function() {
                        if (d.step().length > 0) {
                            DijkstraTool.timer = setTimeout(arguments.callee, 1300);
                        } else {
                            DijkstraTool.timer = null;
                        }
                    }, 1500);})();
            }
        }
    }
};
