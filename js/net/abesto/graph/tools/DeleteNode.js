/**
 * @package Graph
 * @file tools/DeleteNode.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool for removing a node and all connecting edges (edges
 * are handled by the model, Graph.js)
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

DeleteNodeTool: {
    name: 'removeNode',
    label: 'Csúcs: Törlés',
    hooks: {
        removeNode: {
            nodeClick: function(event) {
                this._graph.deleteNode(event.currentTarget.model);
            }
        }
    }
}

});