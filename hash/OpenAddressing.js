var State, OpenAddressing;

State = function() {
    return {
        nextFun: function() {},
        uid: UID(),
        h1: function() {},

        elements: [],
        n: 0,
        elementsIndex: 0,
        table: [],
        tableIndex: 0
    };
};

OpenAddressing = (function() {
    function h() {
        var string = this.elements[this.elementsIndex], n = this.n;

        this.tableIndex = this.h1.hash(string);
        this.nextFun = insertIfEmpty;
        SAS.emit('mapped_to', this.uid, {what: string, where: this.tableIndex});
    }

    function insertIfEmpty() {
        var string = this.elements[this.elementsIndex];

        if (typeof this.table[this.tableIndex] == 'undefined') {
            SAS.emit('inserted', this.uid, {what: string, where: this.tableIndex});
            this.table[this.tableIndex] = string;
            this.elementsIndex += 1;

            if (this.elementsIndex == this.elements.length) {
                return function() { SAS.emit('done', this.uid); return function(){}; };
            } else {
                this.h1.reset()
            }
        } else {
            SAS.emit('taken', this.uid);
        }

        return h;
    }

    return function(_h1, elements) {
        var state = new State();
        state.elements = elements;
        state.h1 = new _h1(elements.length);
        state.h1.reset(elements[0]);
        state.nextFun = h;

        return {
            step: function() {
                var ret = state.nextFun.call(state);
                if (ret != state.nextFun && typeof ret == 'function') {
                    state.nextFun = ret;
                }
                return state;
            },
            uid: state.uid
        };
    }
})();

String.prototype.sum = function() {
    var i, sum = 0;
    for (i = 0; i < this.length; i++) {
        sum += this.charCodeAt(i);
    }
    return sum;
}
