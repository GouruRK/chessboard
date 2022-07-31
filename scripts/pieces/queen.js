'use strict';

class Queen extends Piece {
    constructor(color, pos, step, type, src) {
        super(color, pos, step, type, src);
    }

    copy() {
        return new Queen(this.color, this.pos, this.step, this.type, this.src)
    }
}