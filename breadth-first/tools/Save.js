var SaveTool = {
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
                    '</p><code>' + GraphSerializer.serialize(this._graph) + '</code></div>')
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
};