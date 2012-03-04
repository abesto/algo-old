/**
 * @package Graph
 * @file tools/Load.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for re-creating a graph from serialized JSON
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

Namespace('net.abesto.graph.tools', {

LoadTool: {
    name: 'load',
    label: 'Gráf importálása',
    hooks: {
        clicked: function() {
            var that = this, dialog = $(
                    '<div class="dialog"><h3 class="dialog-title">Gráf betöltése</h3><p class="description">' +
                    'Ide a "Gráf exportálása" menüpontból kapott gráf-definíciót kell beilleszteni. ' +
                    '<span style="color: #ff2222;"><strong>Figyelem</strong>: Az aktuális gráfot ez törli!</span>' +
                    '</p><textarea id="graph-input"></textarea></div>')
                    .append($('<input type="button" value="Vissza" style="width:50%">').click(
                    function() {
                        that._r.canvas.style.display = 'block';
                        dialog.remove();
                    }
                    ))
                    .append($('<input type="button" value="Betöltés" style="width:50%">').click(
                    function() {
                        that._graph.nodes().each(function(n) { that._graph.deleteNode(n); });

                        that._r.canvas.style.display = 'block';
                        var input = $.evalJSON($('#graph-input').val()), SIDtoUID = {}, i;
                        dialog.remove();

                        for (i in input.nodes) {
                            if (!input.nodes.hasOwnProperty(i)) return;
                            SIDtoUID[input.nodes[i].SID] = net.abesto.graph.tools.CreateNodeTool.hooks.createNode.canvasClick.call(that, {
                                pageX: $(that._r.canvas).offset().left + input.nodes[i].x,
                                pageY: $(that._r.canvas).offset().top + input.nodes[i].y
                            });
                        }

                        for (i in input.edges) {
                            if (!input.edges.hasOwnProperty(i)) return;
                            var n1 = that._graph.nodes().get(SIDtoUID[input.edges[i].n1]),
                                n2 = that._graph.nodes().get(SIDtoUID[input.edges[i].n2]);

                            net.abesto.graph.tools.CreateEdgeTool.hooks.createEdge.dragger.call(that, n1.ui);
                            net.abesto.graph.tools.CreateEdgeTool.hooks.createEdge.nodeMouseup.call(
                                    that,
                                    {currentTarget: n2.ui.node}
                            );
                            net.abesto.graph.tools.CreateEdgeTool.hooks.createEdge.up.call(that, n1.ui);
                            net.abesto.graph.tools.CreateEdgeTool.hooks.createEdge.up.call(that, n2.ui);
                        }
                    }));

            this._r.canvas.style.display = 'none';
            this._holder.append(dialog);           


            return true;
        }
    }
}

});  