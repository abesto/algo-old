var MoveNodeTool = {
    name: 'moveNode',
    label: 'Csúcs: Mozgatás',
    hooks: {
        moveNode: {
            dragger: function(node) {
                node.animate({'fill-opacity': 0.2}, 100);
                node.ox = node.type == "rect" ? node.attr("x") : node.attr("cx");
                node.oy = node.type == "rect" ? node.attr("y") : node.attr("cy");
            },
            move: function(node, dx, dy) {
                var     attr = {cx: node.ox + dx, cy: node.oy + dy},
                        that = this;
                node.attr(attr);
                node.text.attr({x: attr.cx, y: attr.cy});
                node.node.model.edges().each(function(e) {
                                                 that._r.connection(e.ui);
                                             });
                this._r.safari();
            },
            up: function(node) {
                node.animate({'fill-opacity': GraphUI.settings.nodeFillOpacity}, 100);
            }
        }
    }
};
