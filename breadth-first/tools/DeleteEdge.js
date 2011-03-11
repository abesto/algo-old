var DeleteEdgeTool = {
    name: 'deleteEdge',
    label: 'Él: Törlés',
    hooks: {
        deleteEdge: {
            edgeClick: function(event) {
                this._graph.deleteEdge(event.currentTarget.model);
            }
        }
    }
};
