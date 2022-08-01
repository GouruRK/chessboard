'use strict';

class Queen extends Piece {
    constructor(color, pos, step, type, lastMoves = undefined) {
        let piece = color == 'white' ? 'wq' : 'bq';
        let src = `./assets/${piece}.png`;
        super(color, pos, step, type, src, lastMoves);
    }

    copy() {
        return new Queen(this.color, this.pos, this.step, this.type, copyArray(this.lastMoves));
    }
}