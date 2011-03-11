var CreateNodeTool = {
    name: 'createNode',
    label: 'Csúcs: Új',
    hooks: {
        createNode: {
            canvasClick: function(event) {
                var     that = this,
                        left = event.pageX - $(this._r.canvas).offset().left,
                        top = event.pageY - $(this._r.canvas).offset().top,
                        node;

                node = this._r.circle(left, top, 20).drag(
                        function(dx, dy) { that.move(this, dx, dy); },
                        function() { that.dragger(this); },
                        function() { that.up(this); })
                        .attr(
                    {
                        stroke: GraphUI.settings.nodeColor,
                        'fill-opacity': GraphUI.settings.nodeFillOpacity,
                        fill: GraphUI.settings.nodeColor,
                        'stroke-width': 2
                    });
                node.text = that._r.text(left, top, '')
                        .toBack().attr({'font-size': 14, stroke: '#ccf'});

                $(node.node).click(function(e) { that.nodeClick(e); });
                $(node.node).mouseup(function(e) { that.nodeMouseup(e); });

                node.node.model = this._graph.newNode();
                node.node.model.ui = node;

                SAS.addStrictSlot('label_set',
                                  function(signal) {
                                      node.text.attr({text: signal.param('label')});
                                  }, node.node.model.UID);

                SAS.addStrictSlot('deleted', function(signal) {
                                      node.text.remove();
                                      node.remove();
                                  }, node.node.model.UID);
            }
        }
    }
};
