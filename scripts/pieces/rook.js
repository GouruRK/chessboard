'use strict';

class Rook extends Piece {
    constructor(color, pos, step, type, src) {
        super(color, pos, step, type, src);
    }

    canCastle() {
        return this.lastMoves.length == 0 ? true : false;
    }
}