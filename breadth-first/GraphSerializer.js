var GraphSerializer = (function() {
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
})();
