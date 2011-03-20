var LoadTool = {
    name: 'load',
    label: 'Gráf importálása',
    hooks: {
        clicked: function() {
            var that = this, dialog = $(
                    '<div class="dialog"><h3 class="dialog-title">Gráf betöltése</h3><p class="description">' +
                    'Ide a "Gráf exportálása" menüpontból kapott gráf-definíciót kell beilleszteni. ' +
                    '<span style="color: #ff2222;"><strong>Figyelem</strong>: Az aktuális gráfot ez törli!</span>' +
                    '</p><textarea id="graph-input"></textarea></div>')
                    .append($('<input type="button" value="Vissza" style="width:50%">').click(
                    function() {
                        that._r.canvas.style.display = 'block';
                        dialog.remove();
                    }
                    ))
                    .append($('<input type="button" value="Betöltés" style="width:50%">').click(
                    function() {
                        that._graph.nodes().each(function(n) { that._graph.deleteNode(n); });

                        that._r.canvas.style.display = 'block';
                        var input = $.evalJSON($('#graph-input').val()), SIDtoUID = {}, i;
                        dialog.remove();

                        for (i in input.nodes) {
                            if (!input.nodes.hasOwnProperty(i)) return;
                            SIDtoUID[input.nodes[i].SID] = CreateNodeTool.hooks.createNode.canvasClick.call(that, {
                                pageX: $(that._r.canvas).offset().left + input.nodes[i].x,
                                pageY: $(that._r.canvas).offset().top + input.nodes[i].y
                            });
                        }

                        for (i in input.edges) {
                            if (!input.edges.hasOwnProperty(i)) return;
                            var n1 = that._graph.nodes().get(SIDtoUID[input.edges[i].n1]),
                                n2 = that._graph.nodes().get(SIDtoUID[input.edges[i].n2]);

                            CreateEdgeTool.hooks.createEdge.dragger.call(that, n1.ui);
                            CreateEdgeTool.hooks.createEdge.nodeMouseup.call(
                                    that,
                                    {currentTarget: n2.ui.node}
                            );
                            CreateEdgeTool.hooks.createEdge.up.call(that, n1.ui);
                            CreateEdgeTool.hooks.createEdge.up.call(that, n2.ui);
                        }
                    }));

            this._r.canvas.style.display = 'none';
            this._holder.append(dialog);           


            return true;
        }
    }
};