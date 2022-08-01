'use strict';

class Bishop extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let piece = color === 'white' ? 'wb' : 'bb';
        let src = `./assets/${piece}.png`;
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Bishop(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}