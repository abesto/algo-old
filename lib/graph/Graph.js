/**
 * @package Graph
 * @file Graph.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Graph implementation using SAS
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

var Node, Edge, Graph;

Node = (function() {
    var Constructor = function()
    {
        var edges = new UIDObjectStore(), label = '';

        this.UID = UID();
        this.edges = function() { return edges; };
        this.getLabel = function() { return label; };
        this.setLabel = function(_label) {
            label = _label;
            this._emit('label_set', { label: label });
        };
        this._emit = SAS.emitFunction(this);
    };

    Constructor.prototype.addEdge = function(edge) {
        this.edges().add(edge);
        this._emit('edge_added', {edge: edge});
    };

    Constructor.prototype.removeEdge = function(edge) {
        this.edges().remove(edge);
        this._emit('edge_removed', {edge: edge});
    };

    Constructor.prototype.neighbors = function() {
        var ns = [], that = this;
        this.edges().each(function(e) {
            ns.push(e.otherNode(that));
        });
        return ns;
    };

    Constructor.prototype.deleted = function() {
        this._emit('deleted');
    }

    Constructor.prototype.toString = function() {
        var neighbors = this.neighbors(), neighborNames = [], str = 'node-' + this.UID, i;
        for (i = 0; i < neighbors.length; i++) {
            neighborNames.push('node-'+neighbors[i].UID);
        }

        str += ' (label: ' + this.getLabel();
        str += ', neighbors: ' + neighborNames.join(', ') + ')';
        return str;
    };

    return Constructor;
})();

Edge = (function() {
    var Constructor = function(_n1, _n2)
    {
        var n1 = _n1, n2 = _n2;

        this.UID = UID();
        this.node1 = function() { return n1; };
        this.node2 = function() { return n2; };
    };

    Constructor.prototype.otherNode = function(n) {
        var n1 = this.node1(), n2 = this.node2();
        if (n == n1) return n2;
        else if (n == n2) return n1;
        else return null;
    };

    Constructor.prototype.toString = function() {
        return 'edge-' + this.UID + ' (node-' + this.node1().UID + ', node-' + this.node2().UID + ')';
    };

    Constructor.prototype.deleted = function() {
        SAS.emit('deleted', this.UID);
    }

    return Constructor;
})();

Graph = (function() {
    var Constructor = function() {
        var nodes = new UIDObjectStore(), edges = new UIDObjectStore();

        this.UID = UID();
        this.nodes = function() { return nodes; };
        this.edges = function() { return edges; };
        this._emit = SAS.emitFunction(this);
        this._reEmit = SAS.reEmitFunction(this);
    };

    Constructor.prototype.newNode = function() {
        var n = new Node();
        this.nodes().add(n);
        SAS.addSlot(this._reEmit, n.UID);
        this._emit('new_node', {node: n});
        return n;
    };

    Constructor.prototype.connect = function(n1, n2) {
        var e = new Edge(n1, n2);
        this.edges().add(e);
        SAS.addSlot(this._reEmit, e.UID);
        n1.addEdge(e); n2.addEdge(e);
        this._emit('new_edge', {edge: e});
        return e;
    };

    Constructor.prototype.deleteNode = function(n) {
        var that = this;
        n.edges().each(function(n) {that.deleteEdge(n);});
        n.deleted();
        this.nodes().remove(n);
        this._emit('node_deleted', {node: n});
    };

    Constructor.prototype.deleteEdge = function(e) {
        e.node1().removeEdge(e);
        e.node2().removeEdge(e);
        this.edges().remove(e);
        e.deleted();
        this._emit('edge_deleted', {edge: e});
    };

    Constructor.prototype.toString = function() {
        var str = 'graph-' + this.UID + ':\n  nodes:\n';
        this.nodes().each(function(n) {str += '    ' + n.toString() + '\n';});
        str += '  edges:\n';
        this.edges().each(function(e) {str += '    ' + e.toString() + '\n';});
        return str;
    };

    return Constructor;
})();


