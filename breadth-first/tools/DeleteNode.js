var DeleteNodeTool = {
    name: 'removeNode',
    label: 'Csúcs: Törlés',
    hooks: {
        removeNode: {
            nodeClick: function(event) {
                this._graph.deleteNode(event.currentTarget.model);
            }
        }
    }
};
