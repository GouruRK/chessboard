'use strict';

class Bishop extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let src = color === 'white' ? 'wb': 'bb'; 
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Bishop(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}