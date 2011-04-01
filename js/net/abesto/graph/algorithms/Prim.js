net.abesto.includeQueue.enqueue('net.abesto.graph.algorithms', ['ConnectedSubgraph']);

Namespace('net.abesto.graph.algorithms', {
Prim: (function() {

    var Constructor = function(node)
    {
        var v = net.abesto.graph.algorithms.ConnectedSubgraph.find(node),
            vn = new UIDObjectStore(), en = new UIDObjectStore(), e = new UIDObjectStore(),
            emit = net.abesto.SAS.emitFunction(this);

        v.each(function(n){
            n.setLabel('V');
            e = UIDObjectStore.union(e, n.edges());
        });
        vn.add(node); node.setLabel('P');

        this.UID = UID();
        this.step = function() {
            if (v.length() < vn.length()) return;
            var minimal = null;
            e.each(function(e) {
                var n1 = e.node1(), n2 = e.node2(),
                    hasn1 = vn.has(n1), hasn2 = vn.has(n2);

                // x ? !y : y   <==> x XOR y
                e.weight = n1.distanceFrom(n2);
                if ((hasn1 ? !hasn2 : hasn2) && (minimal === null || e.weight < minimal.weight)) {
                    minimal = e;
                }
            });

            var n1 = minimal.node1(), n2 = minimal.node2(),
                hasn1 = vn.has(n1);

            en.add(minimal);
            emit('highlight_edge', {edge: minimal});

            var newNode = hasn1 ? n2 : n1;
            newNode.setLabel('P');
            vn.add(newNode);

            return (v.length() - vn.length());
        };
    };

    return Constructor;
})()
});