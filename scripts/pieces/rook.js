'use strict';

class Rook extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let src = color === 'white' ? 'wr': 'br'; 
        super(color, pos, step, type, src, lastMoves);
    }

    canCastle() {
        return this.lastMoves.length === 0 ? true : false;
    }

    copy() {
        return new Rook(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}