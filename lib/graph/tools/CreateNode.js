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

var CreateNodeTool = {
    name: 'createNode',
    label: 'Csúcs: Új',
    hooks: {
        createNode: {
            canvasClick: function(event) {
                var     that = this,
                        left = event.pageX - $(this._r.canvas).offset().left,
                        top = event.pageY - $(this._r.canvas).offset().top,
                        node;

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
                node.text = that._r.text(left, top, '')
                        .toBack().attr({'font-size': 14, stroke: '#ccf'});

                $(node.node).click(function(e) { that.nodeClick(e); });
                $(node.node).mouseup(function(e) { that.nodeMouseup(e); });

                node.node.model = this._graph.newNode();
                node.node.model.ui = node;

                SAS.addStrictSlot('label_set',
                  function(signal) {
                      node.animate(
                      {'fill-opacity': .7}, 100,
                        function() {
                            node.animate({'fill-opacity': GraphUI.settings.nodeFillOpacity},100);
                        }
                      );
                      node.text.attr({text: signal.param('label')});
                  }, node.node.model.UID);

                SAS.addStrictSlot('deleted', function(signal) {
                                      node.text.remove();
                                      node.remove();
                                  }, node.node.model.UID);

                return node.node.model.UID;
            }
        }
    }
};
