/**
 * @package Graph
 * @file tools/CreateNode.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for adding a node on click
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

CreateNodeTool: {
    name: 'createNode',
    label: 'Csúcs: Új',
    hooks: {
        createNode: {
            canvasClick: function(event) {
                // Position of the node
                var     that = this,
                        left = event.pageX - $(this._r.canvas).offset().left,
                        top = event.pageY - $(this._r.canvas).offset().top,
                        node;

                // The node object, drag on node object click
                node = this._r.circle(left, top, 20).drag(
                        function(dx, dy) { that.move(this, dx, dy); },
                        function() { that.dragger(this); },
                        function() { that.up(this); })
                        .attr(
                    {
                        stroke: GraphUI.settings.nodeColor,
                        'fill-opacity': GraphUI.settings.nodeFillOpacity,
                        fill: GraphUI.settings.nodeColor,
                        'stroke-width': 2
                    });

                // Node label
                node.text = that._r.text(left, top, '')
                        .toBack().attr({'font-size': 14, stroke: '#ccf'});

                // Set model
                node.node.model = this._graph.newNode();
                node.node.model.ui = node;

                // UID indicator, drag with it
                node.uid = that._r.text(left, top - net.abesto.graph.GraphUI.settings.nodeRadius,
                                        node.node.model.UID).attr({'font-size': 11, stroke: '#3c3'});
                node.uid.drag(
                        function(dx, dy) { that.move(node, dx, dy); },
                        function() { that.dragger(node); },
                        function() { that.up(node); });


                // Background for UID indicator, drag with it
                var bbox = node.uid.getBBox();
                node.uidBox = that._r.rect(bbox.x - 3, bbox.y - 3, bbox.width + 6, bbox.height + 6)
                        .attr({'stroke': 'white', 'fill': 'black'}).toFront().drag(
                        function(dx, dy) { that.move(node, dx, dy); },
                        function() { that.dragger(node); },
                        function() { that.up(node); });
                node.uid.toFront();

                // Send click events
                function click(e) { e.currentTarget = node.node; that.nodeClick(e); }
                function up(e) { e.currentTarget = node.node; that.nodeMouseup(e); }
                $(node.node).click(click);
                $(node.node).mouseup(up);
                $(node.uid.node).click(click);
                $(node.uid.node).mouseup(up);
                $(node.uidBox.node).click(click);
                $(node.uidBox.node).mouseup(up);

                // Watch label set event
                net.abesto.SAS.addStrictSlot('label_set',
                  function(signal) {
                      node.animate(
                      {'fill-opacity': .7}, 100,
                        function() {
                            node.animate({'fill-opacity': GraphUI.settings.nodeFillOpacity},100);
                        }
                      );
                      node.text.attr({text: signal.param('label')});
                  }, node.node.model.UID);

                // Watch delete event
                net.abesto.SAS.addStrictSlot('deleted', function(signal) {
                    node.text.remove();
                    node.uid.remove();
                    node.uidBox.remove();
                    node.remove();
                }, node.node.model.UID);

                return node.node.model.UID;
            }
        }
    }
}

});
