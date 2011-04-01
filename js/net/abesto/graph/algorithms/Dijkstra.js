/**
 * @package Graph
 * @file Dijkstra.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Dijkstra's algorighmt, one step at a time.
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

net.abesto.includeQueue.enqueue('net.abesto.graph.algorithms', ['ConnectedSubgraph']);

Namespace('net.abesto.graph.algorithms', {

Dijkstra: function(node)
{
    var q = [], i = 0, emit = net.abesto.SAS.emitFunction(this),
        nodes = net.abesto.graph.algorithms.ConnectedSubgraph.find(node);

    this.UID = UID();

    this.init = function() {
        nodes.each(function(n) {
            n.setLabel(infinity);
            q.push(n);
        });
        node.setLabel(0);
    };

    this.step = function() {
        var u = {}, max = 0;

        if (q.length == 0) return;
        u = q[max];
        for (i = 1; i < q.length; i++) {
            if (q[i].getLabel() != infinity &&
                ( u.getLabel() == infinity
                  || parseFloat(q[i].getLabel()) < parseFloat(u.getLabel())
                )
            ) {
                u = q[i];
                max = i;
            }
        }
        q.splice(max, 1);

        u.neighbors().each(function(v) {
            if (q.indexOf(v) == -1) return;
            
            var alt = 0, d = Node.distance(u, v);

            if (d == infinity) alt = d;
            else alt = parseFloat(u.getLabel()) + d;

            if (v.getLabel() == infinity || alt < parseFloat(v.getLabel())) {
                v.setLabel(alt);
                emit('highlight_edge', {n1: u, n2: v});
            }
        });

        return q;
    };
}

});
