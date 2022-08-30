'use strict';

class Queen extends Piece {
    constructor(color, pos, step, lastMoves = undefined) {
        let src = color === 'white' ? 'wq': 'bq';
        let type = 'queen'
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Queen(this.color, this.pos, this.step, copyArray(this.lastMoves));
    }
}