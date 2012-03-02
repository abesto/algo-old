/**
 * @package Graph
 * @file tools/CreateEdge.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for adding an edge between two nodes
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

CreateEdgeTool: {
    name: 'createEdge',
    label: 'Él: Új',
    hooks: {
        createEdge: {
            dragger: function(node) {
                this._connectFrom = node;
                node.animate({stroke: 'green', fill: 'green', 'fill-opacity': .2}, 100);
            },
            nodeMouseup: function(event) {
                var edgeUi, that = this;
                if (this._connectFrom.node != event.currentTarget
                        && !this._connectFrom.node.model.neighbors().has(event.currentTarget.model))
                {
                    edgeUi = this.connect(this._connectFrom, event.currentTarget);

                    edgeUi.line.click(function(e) { that.edgeClick(e); });
                    edgeUi.bg.click(function(e) { that.edgeClick(e); });

                    // Listen to delete signal
                    net.abesto.SAS.addStrictSlot('deleted', function() {
                        edgeUi.line.remove();
                        edgeUi.bg.remove();
                    }, edgeUi.model.UID);
                }
                this._connectFrom.animate({
                                 'fill-opacity': GraphUI.settings.nodeFillOpacity,
                                 fill: GraphUI.settings.nodeColor,
                                 stroke: GraphUI.settings.nodeColor
                             }, 100);
                delete this._connectFrom;
            },
            up: function(node) {
                node.animate({
                                 'fill-opacity': GraphUI.settings.nodeFillOpacity,
                                 fill: GraphUI.settings.nodeColor,
                                 stroke: GraphUI.settings.nodeColor
                             }, 100);
            }
        }
    }
}

});
