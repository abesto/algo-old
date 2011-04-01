Namespace('net.abesto.graph', {

StatusUI: (function() {
    var StatusUI = function($elem) {
        var $table = $('<table>');
        $elem.append($table);

        this._setHeaders = function(signal) {
            var headers = signal.param('headers'), i;

            $table.children().remove();
            var $tr = $('<tr>');
            for (i = 0; i < headers.length; i++) {
                $tr.append($('<th></th>').html(headers[i]));
            }
            $table.append($tr);
        };

        this._setData = function(signal) {
            var columns = signal.param('columns'), maxLength = 0, i;
            $table.find('tr:nth-child(n+2)').remove();

            for (i = 0; i < columns.length; i++) {
                maxLength = Math.max(maxLength, columns[i].length());
            }

            for (i = 0; i < maxLength; i++) {
                var $tr = $('<tr>'), j;
                for (j = 0; j < columns.length; j++) {
                    $tr.append($('<td>').html(
                            columns[j].length() > i
                            ? columns[j].getLinear(i).UID
                            : ''
                ));
                }
                $table.append($tr);
            }
        }
    };

    StatusUI.prototype.listenTo = function(sender) {
        net.abesto.SAS.addStrictSlot('set_status_headers', this._setHeaders, sender.UID);
        net.abesto.SAS.addStrictSlot('set_status_data', this._setData, sender.UID);
    };

    return StatusUI;
})()
});