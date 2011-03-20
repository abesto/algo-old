var CreateEdgeTool = {
    name: 'createEdge',
    label: 'Él: Új',
    hooks: {
        createEdge: {
            dragger: function(node) {
                this._connectFrom = node;
                node.animate({stroke: 'green', fill: 'green', 'fill-opacity': .2}, 100);
            },
            nodeMouseup: function(event) {
                var edgeUi, that = this;
                if (this._connectFrom != event.currentTarget
                        && this._connectFrom.node.model.neighbors().indexOf(event.currentTarget.model) == -1)
                {
                    edgeUi = this.connect(this._connectFrom, event.currentTarget);

                    edgeUi.line.click(function(e) { that.edgeClick(e); });
                    edgeUi.bg.click(function(e) { that.edgeClick(e); });

                    // Listen to delete signal
                    SAS.addStrictSlot('deleted', function() {
                        edgeUi.line.remove();
                        edgeUi.bg.remove();
                    }, edgeUi.model.UID);
                }
                this._connectFrom.animate({
                                 'fill-opacity': GraphUI.settings.nodeFillOpacity,
                                 fill: GraphUI.settings.nodeColor,
                                 stroke: GraphUI.settings.nodeColor
                             }, 100);
                delete this._connectFrom;
            },
            up: function(node) {
                node.animate({
                                 'fill-opacity': GraphUI.settings.nodeFillOpacity,
                                 fill: GraphUI.settings.nodeColor,
                                 stroke: GraphUI.settings.nodeColor
                             }, 100);
            }
        }
    }
};
