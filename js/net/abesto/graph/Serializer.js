/**
 * @package Graph
 * @file GraphSerializer.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Serialize a graph (model and coordinates from the UI) into JSON
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

Namespace('net.abesto.graph', {

Serializer: (function() {
    var SID, UIDtoSID = {};

    function node(node) {
        var bbox = node.ui.getBBox();

        UIDtoSID[node.UID] = SID();

        return {
            SID: UIDtoSID[node.UID],
            x: parseFloat(bbox.x) + parseFloat((bbox.width / 2).toFixed(1)),
            y: parseFloat(bbox.y) + parseFloat((bbox.height / 2).toFixed(1))
        };
    }

    function edge(edge) {
        return {
            n1: UIDtoSID[edge.node1().UID],
            n2: UIDtoSID[edge.node2().UID]
        };
    }

    function graph(graph) {
        var nodes = [], edges = [];
        SID = new UID.Generator();

        graph.nodes().each(function(n) { nodes.push(node(n)); });
        graph.edges().each(function(e) { edges.push(edge(e)); });

        return $.toJSON({nodes: nodes, edges: edges});
    }

    return {
        serialize: graph
    };
})()

});
