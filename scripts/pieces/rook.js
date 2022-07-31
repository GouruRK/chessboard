'use strict';

class Rook extends Piece {
    constructor(color, pos, step, type, src) {
        super(color, pos, step, type, src);
    }

    canCastle() {
        return this.lastMoves.length == 0 ? true : false;
    }

    copy() {
        return new Rook(this.color, this.pos, this.step, this.type, this.src)
    }
}