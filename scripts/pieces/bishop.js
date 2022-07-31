'use strict';

class Bishop extends Piece {
    constructor(color, pos, step, type, src) {
        super(color, pos, step, type, src);
    }

    copy() {
        return new Bishop(this.color, this.pos, this.step, this.type, this.src)
    }
}