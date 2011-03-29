/**
 * @package Graph
 * @file tools/Save.js
 * @author Nagy Zoltán (NAZRAAI.ELTE) <abesto0@gmail.com>
 * @license Apache License, Version 2.0
 *
 * GraphUI tool showing serialized JSON of the graph
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

Namespace.include('net.abesto.graph.Serializer');

Namespace('net.abesto.graph.tools', {

SaveTool: {
    name: 'save',
    label: 'Gráf exportálása',
    hooks: {
        clicked: function() {
            var that = this, dialog = $(
                    '<div class="dialog"><h3 class="dialog-title">Gráf-definíció</h3><p class="description">' +
                    'Az alábbi kódrészlet a gráf jelenlegi állapotának sorosított leírása. Ha ezt ' +
                    'töltjük vissza a "Gráf importálása" menüpontban, akkor pontosan ezt a gráfot ' +
                    'fogjuk visszakapni (a csúcsok feliratától eltekintve). Így mindenki a szervertől ' +
                    'függetlenül rendszerezheti (és akár módosíthatja) a saját gráfjait.' +
                    '</p><code>' + net.abesto.graph.Serializer.serialize(this._graph) + '</code></div>')
                    .append($('<input type="button" value="Vissza" style="width:100%">').click(
                    function() {
                        that._r.canvas.style.display = 'block';
                        dialog.remove();
                    }
                    ));


            this._r.canvas.style.display = 'none';
            this._holder.append(dialog);

            return true;
        }
    }
}

});