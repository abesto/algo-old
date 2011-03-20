/**
 * @package Graph
 * @file tools/MoveNode.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for moving nodes around (drag and drop)
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

var MoveNodeTool = {
    name: 'moveNode',
    label: 'Csúcs: Mozgatás',
    hooks: {
        moveNode: {
            dragger: function(node) {
                node.animate({'fill-opacity': 0.2}, 100);
                node.ox = node.type == "rect" ? node.attr("x") : node.attr("cx");
                node.oy = node.type == "rect" ? node.attr("y") : node.attr("cy");
            },
            move: function(node, dx, dy) {
                var     attr = {cx: node.ox + dx, cy: node.oy + dy},
                        that = this;
                node.attr(attr);
                node.text.attr({x: attr.cx, y: attr.cy});
                node.node.model.edges().each(function(e) {
                                                 that._r.connection(e.ui);
                                             });
                this._r.safari();
            },
            up: function(node) {
                node.animate({'fill-opacity': GraphUI.settings.nodeFillOpacity}, 100);
            }
        }
    }
};
