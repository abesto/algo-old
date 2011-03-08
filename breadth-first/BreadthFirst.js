var BreadthFirst = function(node)
{
    var queue = [node], stepCount = 0, i = 0, emit = SAS.emitFunction(this);

    this.UID = UID();

    this.step = function() {
        var node = queue.shift();

        // Find first not-yet-searched node in the queue, if any
        while (typeof node != 'undefined' && node.getLabel() !== '') {
            node = queue.shift();
        }

        if (typeof node == 'undefined') {
            emit('done');
        } else {
            var neighbors = node.neighbors();

            if (node.getLabel() !== '') return;
            node.setLabel(stepCount++);

            for (i = 0; i < neighbors.length; i++) {
                if (neighbors[i].getLabel() === '') {
                    queue.push(neighbors[i]);
                }
            }
        }

        return queue;
    }
};
