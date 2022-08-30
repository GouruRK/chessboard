'use strict';

class Bishop extends Piece {
    constructor(color, pos, step, lastMoves = undefined) {
        let src = color === 'white' ? 'wb': 'bb'; 
        let type = 'bishop';
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Bishop(this.color, this.pos, this.step, copyArray(this.lastMoves));
    }
}