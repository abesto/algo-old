/**
 * @package Graph
 * @file GraphUI.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * Simple Graph UI using raphael.js. Supports adding tools via a hook system.
 *
 * Copyright 2011 Nagy Zoltán
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

net.abesto.includeQueue.require({'3rd-party.raphael': ['raphael-min']},function(){

Namespace('net.abesto.graph', {

GraphUI: (function()
{
    var Constructor;

    Constructor = function(elem, width, height, graph)
    {
        $('#' + elem).css({'width': width, 'height': height});
        this._r = Raphael(elem, width, height);
        this._holder = $('#' + elem);
        this._graph = graph;
        this._tool = '';
        this._tools = [];
        this._hooks = {
            'dragger': {},
            'move': {},
            'up': {},
            'nodeClick': {},
            'nodeMouseup': {},
            'edgeClick' : {},
            'canvasClick': {}
        };

        for (var i in this._hooks) {
            this._hooks[i].any = [];
            this[i] = this._hookRunner(i);
        }

        var that = this;
        $(this._r.canvas).click(function(e) { that.canvasClick(e); });
    };

    Constructor.prototype.connect = function(node1, node2)
    {
        var     edgeUI = this._r.connection(node1, node2, GraphUI.settings.edgeFill, GraphUI.settings.edgeColor),
                edgeModel = this._graph.connect(node1.node.model, node2.model);
        edgeUI.model = edgeModel;
        edgeUI.line.node.model = edgeModel;
        edgeUI.bg.node.model = edgeModel;
        edgeModel.ui = edgeUI;
        return edgeUI;
    };

    Constructor.prototype._hookRunner = function(name) {
        return function() {
            var params = arguments;
            function run(functions) {
                for (var i in functions) {
                    if (!functions.hasOwnProperty(i)) continue;
                    functions[i].apply(this, params);
                }
            }

            run.call(this, this._hooks[name].any);
            run.call(this, this._hooks[name][this._tool]);
        }
    };

    Constructor.prototype.resetEdges = function()
    {
        this._graph.edges().each(function(e) {
            e.ui.line.attr('stroke', GraphUI.settings.edgeFill);
            e.ui.bg.attr('stroke', GraphUI.settings.edgeColor);
        });
    };


    Constructor.prototype.resetNodes = function()
    {
        this._graph.nodes().each(function(n) {
            n.ui.attr('stroke', GraphUI.settings.nodeColor);
            n.setLabel('');
        });
    };

    Constructor.prototype.addTool = function(tool)
    {
        var     that = this, text, rect, st, bbox, hookTool, hookName;

        text = this._r.text(10, 20, tool.label).attr({'font-size': 15, 'text-anchor': 'start', 'fill': '#ccf'});
        bbox = text.getBBox();
        rect = this._r.rect(bbox.x - 5, bbox.y - 5, bbox.width + 10, bbox.height + 10)
                .attr({'fill': 'white', 'fill-opacity': 0}).toBack();

        st = this._r.set();
        st.push(rect);
        st.push(text);

        if (this._tools.length > 0) {
            bbox = this._tools[this._tools.length-1].getBBox();
            rect.attr({y: bbox.y + bbox.height});
            text.attr({y: bbox.y + bbox.height * 1.5});
        }

        this._tools.push(rect);

        st.click(function(event)
                 {
                     event.stopPropagation();
                     if (typeof tool.hooks['clicked'] === 'function') {
                         if (tool.hooks['clicked'].call(that) === true) return;
                     }

                     var i;
                     for (i = 0; i < that._tools.length; i++) {
                         that._tools[i].attr({'fill-opacity': 0});
                     }
                     rect.attr({'fill-opacity': .3});
                     that._tool = tool.name;
                 });

        for (hookTool in tool.hooks) {
            if (!tool.hooks.hasOwnProperty(hookTool)) continue;
            for (hookName in tool.hooks[hookTool]) {
                if (!tool.hooks[hookTool].hasOwnProperty(hookName)) continue;
                if (typeof this._hooks[hookName][hookTool] === 'undefined') {
                    this._hooks[hookName][hookTool] = [];
                }
                this._hooks[hookName][hookTool].push(tool.hooks[hookTool][hookName]);
            }
        }
    };

    Constructor.settings = {
        nodeRadius: 20,
        nodeColor: 'white',
        nodeFillOpacity: .08,

        edgeFill: '#444',
        edgeColor: 'white'
    };

    return Constructor;
})()

});
});