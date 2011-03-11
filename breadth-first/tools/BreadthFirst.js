var BreadthFirstTool = {
    name: 'breadthFirst',
    label: 'Szélességi bejárás',
    hooks: {
        breadthFirst: {
            nodeClick: function(event) {
                    var b = new BreadthFirst(event.currentTarget.model);
                    this._graph.nodes().each(function(n) { n.setLabel(''); });
                    (function() {
                        if (b.step().length > 0) {
                            setTimeout(arguments.callee, 500);
                        }
                    })();
            }
        }
    }
}
