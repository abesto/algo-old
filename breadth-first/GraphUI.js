var GraphUI = (function()
{
    var NODE_RADIUS = 20, Constructor;

    function dragger(node) {
        node.animate({"fill-opacity": .2}, 100);
        if (this._tool === 'move') {
            node.ox = node.type == "rect" ? node.attr("x") : node.attr("cx");
            node.oy = node.type == "rect" ? node.attr("y") : node.attr("cy");
        } else if (this._tool === 'connect') {
            this._connectFrom = node;
            node.animate({'stroke': 'green', 'fill': 'green'}, 100);
        }
    }

    function move(node, dx, dy) {
        if (this._tool === 'move') {
            var att = node.type == "rect" ? {x: node.ox + dx, y: node.oy + dy} : {cx: node.ox + dx, cy: node.oy + dy},
                that = this;
            node.attr(att);
            node.text.attr({x: att.cx, y: att.cy});
            node.node.model.edges().each(function(e) {
                that._r.connection(e.ui);
            });
            this._r.safari();
        }
    }

    function up(node) {
        node.animate({"fill-opacity": .05, 'stroke': 'white', fill: 'white'}, 100);
        delete this._connectFrom;
    }

    Constructor = function(elem, width, height, graph)
    {
        $('#'+elem).css({'width': width, 'height': height});
        this._r = Raphael(elem, width, height);
        this._graph = graph;
        this._tool = '';

        this.connect = function(node1, node2) {
            var cui = this._r.connection(node1, node2, "#444", "white"),
                cmodel = this._graph.connect(node1.node.model, node2.model);
            cui.model = cmodel;
            cmodel.ui = cui;
        };

        this.initTools();
    };

    Constructor.prototype.addNode = function(event) {
        if (this._tool !== 'addNode') { return; }
        var     that = this,
                node = this._r.circle(event.offsetX, event.offsetY, NODE_RADIUS).drag(
                        function(dx, dy) { move.call(that, this, dx, dy); },
                        function() { dragger.call(that, this); },
                        function() { up.call(that, this); })
                        .attr({stroke: '#fff', 'fill-opacity': .05, fill: 'white', 'stroke-width': 2});
        node.text = that._r.text(event.offsetX, event.offsetY, '').toBack()
                    .attr({'font-size': 14, stroke: '#ccf'});

        $(node.node).click(function(event) {
            if (that._tool === 'search') {
                var b = new BreadthFirst(this.model);
                that._graph.nodes().each(function(n) { n.setLabel(''); });
                function next() {
                    if (b.step().length > 0) {
                        setTimeout(next, 500);
                    }
                }
                next();
            }
        });

        $(node.node).mouseup(function(event) {
            if (that._tool === 'connect' && that._connectFrom != event.currentTarget) {
                that.connect(that._connectFrom, event.currentTarget);
                delete that._connectFrom;
            }
        });

        node.node.model = this._graph.newNode();
        node.node.model.ui = node;
        SAS.addStrictSlot('label_set', function(signal) { node.text.attr({text: signal.param('label')}); }, node.node.model.UID);
    };

    Constructor.prototype.initTools = function()
    {
        var that = this;
        this._tools = [];

        function makeTool(elem, toolName, text) {
            var bbox = elem.getBBox(), left = bbox.x + bbox.width + 5,
                middle = bbox.y + (bbox.height/2), text, rect, st;

            text = that._r.text(left, middle, text).attr({'font-size': 15, 'text-anchor': 'start', 'fill': '#ccf'});
            rect = that._r.rect(bbox.x - 5, bbox.y - 5, left + text.getBBox().width + 5, bbox.height + 10)
                    .attr({'fill': 'white', 'fill-opacity': 0}).toBack();

            st = that._r.set();
            st.push(rect);
            st.push(text);
            st.push(elem);

            that._tools.push(rect);

            st.click(function(event)  {
                var i;
                for (i = 0; i < that._tools.length; i++) {
                    that._tools[i].attr({'fill-opacity': 0});
                }
                rect.attr({'fill-opacity': .3});
                that._tool = toolName;
                event.stopPropagation();
            });
        }

        makeTool(
                this._r.circle(30, 30, 15).attr({'fill': 'red'}),
                'addNode', 'Új csúcs felvétele'
                );
        makeTool(
                this._r.circle(30, 70, 15).attr({'fill': 'blue'}),
                'move', 'Csúcs mozgatása'
                );
        makeTool(
                this._r.circle(30, 110, 15).attr({'fill': 'green'}),
                'connect', 'Új él felvétele'
                );
        makeTool(
                this._r.circle(30, 150, 15).attr({'fill': 'silver'}),
                'search', 'Szélességi bejárás'
                );
        $(this._r.canvas).click({tool: this._tool}, function(e) { that.addNode(e); });
    };

    return Constructor;
})();

