'use strict';

class Queen extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let src = color === 'white' ? 'wq': 'bq'; 
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Queen(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}